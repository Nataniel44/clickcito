"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { collection, query, where, onSnapshot, orderBy, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { auth } from "@/app/firebase/config";
import { signOut } from "firebase/auth";
import { updateEstadoTransaccion, getProductosByNegocio, deleteProducto, updateNegocio } from "@/app/firebase/db";
import toast from "react-hot-toast";
import {
    Clock, PackageCheck, Send, CheckCircle2, TrendingUp, Users,
    ShoppingBag, DollarSign, Search, Calendar, RefreshCcw,
    LayoutDashboard, Plus, Settings, BarChart3, Menu, X,
    Bell, LogOut, Store, ArrowUpRight, Trash2, Edit, Eye,
    MapPin, Truck, Phone, FileText, Tag, Package, ChevronRight, AlertTriangle, MessageCircle,
    Printer, Share2, Download
} from "lucide-react";

// ═══════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════
const SIDEBAR_ITEMS = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "ordenes", icon: ShoppingBag, label: "Órdenes" },
    { id: "productos", icon: Package, label: "Mis Productos" },
    { id: "clientes", icon: Users, label: "Clientes" },
    { id: "estadisticas", icon: BarChart3, label: "Estadísticas" },
    { id: "configuracion", icon: Settings, label: "Configuración" },
];

const STATUS_CONFIG: Record<string, { color: string; icon: any; label: string }> = {
    pendiente: { color: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300", icon: Clock, label: "Pendiente" },
    en_preparacion: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300", icon: PackageCheck, label: "Preparando" },
    en_camino: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300", icon: Send, label: "En camino" },
    entregado: { color: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300", icon: CheckCircle2, label: "Entregado" },
};

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [ordenes, setOrdenes] = useState<any[]>([]);
    const [productos, setProductos] = useState<any[]>([]);
    const [loadingOrdenes, setLoadingOrdenes] = useState(true);
    const [loadingProductos, setLoadingProductos] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("todas");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [showNotifications, setShowNotifications] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

    // ═══════ AUTH GUARD ═══════
    useEffect(() => {
        if (!loading) {
            if (!user) { router.push("/login"); }
            else if (user.rol === "cliente_final") { router.push("/"); }
            else if (user.rol !== "dueño_negocio" && user.rol !== "admin_clickcito") { router.push("/"); }
        }
    }, [user, loading, router]);

    // ═══════ LIVE ORDERS ═══════
    useEffect(() => {
        if (!user || (!user.id_negocio && user.rol !== "admin_clickcito")) { setLoadingOrdenes(false); return; }
        const q = (user.rol === "dueño_negocio" && user.id_negocio)
            ? query(collection(db, "transacciones"), where("id_negocio", "==", user.id_negocio), orderBy("createdAt", "desc"))
            : query(collection(db, "transacciones"), orderBy("createdAt", "desc"));

        const unsub = onSnapshot(q, (snap) => {
            setOrdenes(snap.docs.map(d => ({ id_transaccion: d.id, ...d.data() })));
            setLoadingOrdenes(false);
        }, () => { setLoadingOrdenes(false); });
        return () => unsub();
    }, [user]);

    // ═══════ PRODUCTS ═══════
    useEffect(() => {
        if (!user?.id_negocio) { setLoadingProductos(false); return; }
        getProductosByNegocio(user.id_negocio).then(p => { setProductos(p); setLoadingProductos(false); }).catch(() => setLoadingProductos(false));
    }, [user]);

    // ═══════ METRICS ═══════
    const metrics = useMemo(() => ({
        totalVentas: ordenes.filter(o => o.estado === "entregado").reduce((a, o) => a + (o.items?.reduce((ia: number, i: any) => ia + (i.precio_unitario * i.cantidad), 0) || 0), 0),
        cantidadOrdenes: ordenes.length,
        pendientes: ordenes.filter(o => o.estado === "pendiente" || o.estado === "en_preparacion").length,
        entregados: ordenes.filter(o => o.estado === "entregado").length,
    }), [ordenes]);

    const ordenesFiltradas = useMemo(() => ordenes.filter(o => {
        const s = o.id_transaccion.toLowerCase().includes(searchTerm.toLowerCase()) || (o.datos_logistica?.telefono_contacto || "").includes(searchTerm);
        const f = activeFilter === "todas" || o.estado === activeFilter;
        return s && f;
    }), [ordenes, searchTerm, activeFilter]);

    // Unique clients
    const clientesUnicos = useMemo(() => {
        const map = new Map();
        ordenes.forEach(o => {
            const uid = o.id_usuario;
            if (!map.has(uid)) {
                map.set(uid, { uid, tel: o.datos_logistica?.telefono_contacto || "—", dir: o.datos_logistica?.direccion_envio || "—", ordenes: 0, total: 0 });
            }
            const c = map.get(uid);
            c.ordenes++;
            c.total += o.items?.reduce((a: number, i: any) => a + i.precio_unitario * i.cantidad, 0) || 0;
        });
        return Array.from(map.values()).sort((a, b) => b.ordenes - a.ordenes);
    }, [ordenes]);

    const handleCambiarEstado = async (id: string, estado: string) => {
        try { await updateEstadoTransaccion(id, estado); toast.success(`Orden → ${estado.replace("_", " ")}`); } catch { toast.error("Error"); }
    };

    const handleDeleteProducto = async (id: string) => {
        if (!confirm("¿Eliminar este producto?")) return;
        try { await deleteProducto(id); setProductos(prev => prev.filter(p => p.id_producto !== id)); toast.success("Producto eliminado"); } catch { toast.error("Error"); }
    };

    const handleLogout = async () => { await signOut(auth); router.push("/"); };

    const handlePrint = (o: any) => {
        const total = o.items?.reduce((a: number, i: any) => a + i.precio_unitario * i.cantidad, 0) || 0;
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const html = `
            <html>
                <head>
                    <title>Comanda - ${o.id_transaccion.slice(0, 8)}</title>
                    <style>
                        body { font-family: 'Courier New', Courier, monospace; padding: 10px; width: 60mm; color: black; background: white; }
                        .header { text-align: center; border-bottom: 1px dashed black; margin-bottom: 8px; padding-bottom: 8px; }
                        .item { display: flex; justify-content: space-between; margin-bottom: 3px; font-size: 13px; }
                        .total { border-top: 1px dashed black; padding-top: 8px; margin-top: 8px; font-weight: bold; text-align: right; font-size: 16px; }
                        .footer { margin-top: 15px; font-size: 10px; text-align: center; }
                        .info { margin-bottom: 8px; font-size: 12px; }
                        h2 { margin: 0; font-size: 18px; }
                        p { margin: 2px 0; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h2>CLICKCITO</h2>
                        <p>Ticket #${o.id_transaccion.slice(0, 8).toUpperCase()}</p>
                        <p>${new Date(o.createdAt?.seconds * 1000).toLocaleString('es-AR')}</p>
                    </div>
                    <div class="info">
                        <p><strong>CLIENTE:</strong> ${o.datos_logistica?.telefono_contacto || 'S/D'}</p>
                        <p><strong>DIR:</strong> ${o.datos_logistica?.direccion_envio || 'Retira local'}</p>
                        ${o.datos_logistica?.notas_cliente ? `<p><strong>NOTA:</strong> ${o.datos_logistica.notas_cliente}</p>` : ''}
                    </div>
                    <div class="items">
                        ${o.items?.map((i: any) => `
                            <div class="item">
                                <span>${i.cantidad}x ${i.nombre_producto}</span>
                                <span>$${(i.precio_unitario * i.cantidad).toLocaleString()}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="total">
                        TOTAL: $${total.toLocaleString()}
                    </div>
                    <div class="footer">
                        *** Gracias por elegirnos ***<br>
                        Digitalizado por Clickcito
                    </div>
                    <script>
                        setTimeout(() => {
                            window.print();
                            window.close();
                        }, 500);
                    </script>
                </body>
            </html>
        `;
        printWindow.document.write(html);
        printWindow.document.close();
    };

    const handleShareWhatsApp = (o: any) => {
        const total = o.items?.reduce((a: number, i: any) => a + i.precio_unitario * i.cantidad, 0) || 0;
        const itemsStr = o.items?.map((i: any) => `- ${i.cantidad}x ${i.nombre_producto}`).join('%0A') || '';
        const msg = `*CLICKCITO - TICKET #${o.id_transaccion.slice(0, 6).toUpperCase()}*%0A%0A*Detalle del pedido:*%0A${itemsStr}%0A%0A*Total:* $${total.toLocaleString()}%0A*Dirección:* ${o.datos_logistica?.direccion_envio || 'Retiro en local'}%0A*Contacto:* ${o.datos_logistica?.telefono_contacto}%0A%0A_Gracias por su compra!_`;
        window.open(`https://wa.me/?text=${msg}`, '_blank');
    };

    const exportToCSV = () => {
        if (ordenesFiltradas.length === 0) {
            toast.error("No hay órdenes para exportar");
            return;
        }
        // Usamos punto y coma (;) como separador para mejor compatibilidad con Excel en Latinoamérica
        const headers = ["ID", "Fecha", "Cliente", "Total", "Estado", "Pago", "Direccion", "Items"];
        const rows = ordenesFiltradas.map(o => [
            o.id_transaccion,
            new Date(o.createdAt?.seconds * 1000).toLocaleString('es-AR'),
            o.datos_logistica?.telefono_contacto || "S/D",
            o.items?.reduce((a: number, i: any) => a + i.precio_unitario * i.cantidad, 0) || 0,
            o.estado,
            o.pagado ? "PAGADO" : "PENDIENTE",
            (o.datos_logistica?.direccion_envio || "Retiro").replace(/;/g, ","),
            o.items?.map((i: any) => `${i.cantidad}x ${i.nombre_producto}`).join(' | ')
        ]);
        const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(";")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", `clickcito_reporte_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Excel generado correctamente 📊");
    };

    const handleTogglePago = async (o: any) => {
        try {
            const transRef = doc(db, "transacciones", o.id_transaccion);
            await updateDoc(transRef, { pagado: !o.pagado });
            toast.success(o.pagado ? "Marcado como No Pagado" : "Pago Confirmado ✅");
        } catch {
            toast.error("Error al actualizar pago");
        }
    };

    const handleCierreCaja = () => {
        const hoy = new Date().toLocaleDateString();
        const ordenesHoy = ordenes.filter(o =>
            new Date(o.createdAt?.seconds * 1000).toLocaleDateString() === hoy &&
            o.estado === "entregado"
        );
        const total = ordenesHoy.reduce((a, o) => a + (o.items?.reduce((ia: number, i: any) => ia + i.precio_unitario * i.cantidad, 0) || 0), 0);

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;
        printWindow.document.write(`
            <html><body style="font-family:monospace; width: 60mm; padding: 10px;">
                <center><h2>CIERRE DE CAJA</h2><p>${hoy}</p></center>
                <hr>
                <p>Ventas Finalizadas: ${ordenesHoy.length}</p>
                <p>Total Recaudado: $${total.toLocaleString()}</p>
                <hr>
                <p>Detalle:</p>
                ${ordenesHoy.map(o => `<p>${o.id_transaccion.slice(0, 4)}: $${(o.items?.reduce((a: number, i: any) => a + i.precio_unitario * i.cantidad, 0)).toLocaleString()}</p>`).join('')}
                <hr>
                <center><p>Clickcito Business</p></center>
                <script>window.print(); window.close();</script>
            </body></html>
        `);
        printWindow.document.close();
    };

    if (loading || loadingOrdenes) {
        return (<div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] dark:bg-[#0A0A0A]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" /></div>);
    }

    // ═══════════════════════════════════════════
    // RENDER PANELS
    // ═══════════════════════════════════════════

    function renderDashboard() {
        return (
            <>
                {/* Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10">
                    {[
                        { label: "Ventas", value: `$${metrics.totalVentas.toLocaleString()}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
                        { label: "Órdenes", value: metrics.cantidadOrdenes, icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
                        { label: "Activas", value: metrics.pendientes, icon: Clock, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10" },
                        { label: "Finalizadas", value: metrics.entregados, icon: CheckCircle2, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
                    ].map((m, i) => (
                        <div key={i} className="bg-white dark:bg-zinc-900 p-5 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-zinc-800">
                            <div className={`p-2.5 rounded-xl ${m.bg} ${m.color} w-fit mb-3`}><m.icon size={20} /></div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{m.label}</p>
                            <p className="text-2xl md:text-3xl font-black mt-0.5">{m.value}</p>
                        </div>
                    ))}
                </div>

                {/* Quick actions box */}
                <div className="bg-orange-600 rounded-[2rem] p-8 mb-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-orange-600/20">
                    <div>
                        <h3 className="text-xl font-black mb-1">Cierre de Jornada</h3>
                        <p className="text-orange-100 text-sm font-medium">Generá un resumen de caja de las ventas entregadas hoy.</p>
                    </div>
                    <button
                        onClick={handleCierreCaja}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-black rounded-xl hover:scale-105 transition-all shadow-lg active:scale-95 whitespace-nowrap"
                    >
                        <Printer size={18} /> Realizar Cierre de Caja
                    </button>
                </div>

                {/* Recent orders preview */}
                <h3 className="text-lg font-black mb-4">Últimas Órdenes</h3>
                <div className="space-y-3">
                    {ordenes.slice(0, 5).map(o => renderOrderRow(o))}
                    {ordenes.length === 0 && <EmptyState icon={ShoppingBag} text="Aún no hay órdenes" />}
                </div>
                {ordenes.length > 5 && (
                    <button onClick={() => setActiveTab("ordenes")} className="mt-4 text-orange-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                        Ver todas las órdenes <ChevronRight size={16} />
                    </button>
                )}
            </>
        );
    }

    function renderOrderRow(orden: any) {
        const sc = STATUS_CONFIG[orden.estado] || STATUS_CONFIG.pendiente;
        const StatusIcon = sc.icon;
        const total = orden.items?.reduce((a: number, i: any) => a + i.precio_unitario * i.cantidad, 0) || 0;
        return (
            <div key={orden.id_transaccion} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">#{orden.id_transaccion.slice(0, 6)}</span>
                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${sc.color}`}>
                            <StatusIcon size={12} />{sc.label}
                        </span>
                    </div>
                    <p className="font-bold text-sm truncate">{orden.datos_logistica?.telefono_contacto || `Cliente ${orden.id_usuario.slice(0, 5)}`}</p>
                    <p className="text-xs text-gray-400 font-medium">{orden.items?.length || 0} items • {orden.datos_logistica?.direccion_envio?.slice(0, 30) || "Sin dirección"}</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-lg font-black">${total.toLocaleString()}</span>
                    <button
                        onClick={() => handleTogglePago(orden)}
                        className={`p-2 rounded-xl transition-all border ${orden.pagado
                            ? "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-600/10 dark:border-emerald-600/20"
                            : "bg-gray-50 border-gray-100 text-gray-400 dark:bg-zinc-800 dark:border-zinc-700"}`}
                        title={orden.pagado ? "Pagado" : "Pendiente de pago"}
                    >
                        <DollarSign size={18} />
                    </button>
                    <button
                        onClick={() => setSelectedOrder(orden)}
                        className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-600/10 rounded-xl transition-all"
                    >
                        <FileText size={18} />
                    </button>
                    {orden.estado === "pendiente" && (
                        <button onClick={() => handleCambiarEstado(orden.id_transaccion, "en_preparacion")} className="px-4 py-2 bg-orange-600 text-white text-xs font-black rounded-xl hover:bg-orange-700 transition-colors">Aceptar</button>
                    )}
                    {orden.estado === "en_preparacion" && (
                        <button onClick={() => handleCambiarEstado(orden.id_transaccion, "en_camino")} className="px-4 py-2 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-700 transition-colors">Despachar</button>
                    )}
                    {orden.estado === "en_camino" && (
                        <button onClick={() => handleCambiarEstado(orden.id_transaccion, "entregado")} className="px-4 py-2 bg-emerald-600 text-white text-xs font-black rounded-xl hover:bg-emerald-700 transition-colors">Entregado</button>
                    )}
                    {orden.estado === "entregado" && (
                        <span className="text-xs font-bold text-gray-400"><CheckCircle2 size={16} /></span>
                    )}
                </div>
            </div>
        );
    }

    function renderOrdenes() {
        return (
            <>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" placeholder="Buscar por ID o teléfono..." className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="flex gap-1 p-1 bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 overflow-x-auto no-scrollbar flex-1">
                        {["todas", "pendiente", "en_preparacion", "en_camino", "entregado"].map(f => (
                            <button key={f} onClick={() => setActiveFilter(f)} className={`px-4 py-2 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-all ${activeFilter === f ? "bg-orange-500 text-white shadow" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800"}`}>{f.replace("_", " ")}</button>
                        ))}
                    </div>
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 dark:bg-emerald-600/10 dark:text-emerald-500 rounded-xl font-black text-xs hover:scale-105 transition-all shrink-0"
                    >
                        <Download size={14} /> Exportar
                    </button>
                </div>

                {/* List */}
                <div className="space-y-3">
                    {ordenesFiltradas.map(o => renderOrderRow(o))}
                    {ordenesFiltradas.length === 0 && <EmptyState icon={ShoppingBag} text="No hay órdenes con este filtro" />}
                </div>
            </>
        );
    }

    function renderProductos() {
        return (
            <>
                <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-gray-500 font-bold">{productos.length} productos en tu catálogo</p>
                    <button onClick={() => router.push(`/negocio/${user?.id_negocio}`)} className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black text-xs font-black rounded-xl hover:scale-105 transition-transform">
                        <Eye size={14} /> Ver Catálogo Público
                    </button>
                </div>

                {loadingProductos ? (
                    <div className="text-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto" /></div>
                ) : productos.length === 0 ? (
                    <EmptyState icon={Package} text="No tenés productos aún" sub="Próximamente podrás agregarlos desde acá." />
                ) : (
                    <div className="space-y-3">
                        {productos.map(p => (
                            <div key={p.id_producto} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-4 md:p-5 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
                                    <Tag size={20} className="text-orange-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-sm truncate">{p.nombre_producto}</h4>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-xs font-black text-orange-600">${Number(p.precio_base).toLocaleString()}</span>
                                        {p.detalles_especificos?.unidad_medida && (
                                            <span className="text-[10px] font-bold text-gray-400">/{p.detalles_especificos.unidad_medida}</span>
                                        )}
                                        {p.detalles_especificos?.tipo && (
                                            <span className="text-[10px] font-bold bg-gray-100 dark:bg-zinc-800 text-gray-500 px-2 py-0.5 rounded">{p.detalles_especificos.tipo}</span>
                                        )}
                                    </div>
                                </div>
                                <button onClick={() => handleDeleteProducto(p.id_producto)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </>
        );
    }

    function renderClientes() {
        return (
            <>
                <p className="text-sm text-gray-500 font-bold mb-6">{clientesUnicos.length} clientes registrados en tus órdenes</p>
                {clientesUnicos.length === 0 ? (
                    <EmptyState icon={Users} text="Aún no tenés clientes" sub="Cuando recibas tu primer pedido, aparecerán acá." />
                ) : (
                    <div className="space-y-3">
                        {clientesUnicos.map((c, i) => (
                            <div key={c.uid} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-4 md:p-5 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 font-black text-sm shrink-0">
                                    #{i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <Phone size={12} className="text-gray-400" />
                                        <span className="font-bold text-sm">{c.tel}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <MapPin size={12} className="text-gray-400" />
                                        <span className="text-xs text-gray-500 truncate">{c.dir}</span>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="font-black text-sm">${c.total.toLocaleString()}</p>
                                    <p className="text-[10px] font-bold text-gray-400">{c.ordenes} {c.ordenes === 1 ? "orden" : "órdenes"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </>
        );
    }

    function renderEstadisticas() {
        const byStatus = Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
            ...cfg, key, count: ordenes.filter(o => o.estado === key).length
        }));
        const totalIngresos = ordenes.reduce((a, o) => a + (o.items?.reduce((ia: number, i: any) => ia + i.precio_unitario * i.cantidad, 0) || 0), 0);
        const totalPagado = ordenes.filter(o => o.pagado).reduce((a, o) => a + (o.items?.reduce((ia: number, i: any) => ia + i.precio_unitario * i.cantidad, 0) || 0), 0);
        const pendienteCobro = totalIngresos - totalPagado;
        const ticketPromedio = ordenes.length > 0 ? Math.round(totalIngresos / ordenes.length) : 0;

        return (
            <>
                {/* Financial stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-5">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Ventas Brutas</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white">${totalIngresos.toLocaleString()}</p>
                        <p className="text-[10px] text-gray-500 font-bold mt-1">Total acumulado proyectado</p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-600/5 rounded-2xl border border-emerald-100 dark:border-emerald-600/20 p-5">
                        <p className="text-xs font-bold text-emerald-600/60 uppercase mb-1">Cobrado Efec.</p>
                        <p className="text-2xl font-black text-emerald-600">${totalPagado.toLocaleString()}</p>
                        <p className="text-[10px] text-emerald-500 font-bold mt-1">Dinero real en mano/cuenta</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-600/5 rounded-2xl border border-red-100 dark:border-red-600/20 p-5">
                        <p className="text-xs font-bold text-red-600/60 uppercase mb-1">Pendiente de Pago</p>
                        <p className="text-2xl font-black text-red-600">${pendienteCobro.toLocaleString()}</p>
                        <p className="text-[10px] text-red-500 font-bold mt-1">Órdenes sin marcar como pagadas</p>
                    </div>
                </div>

                {/* Status breakdown */}
                <h3 className="text-lg font-black mb-4">Desglose por Estado</h3>
                <div className="space-y-3 mb-8">
                    {byStatus.map(s => {
                        const StatusIcon = s.icon;
                        const pct = ordenes.length > 0 ? Math.round((s.count / ordenes.length) * 100) : 0;
                        return (
                            <div key={s.key} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-4 flex items-center gap-4">
                                <div className={`p-2.5 rounded-xl ${s.color}`}><StatusIcon size={18} /></div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="font-bold text-sm capitalize">{s.label}</span>
                                        <span className="text-xs font-black text-gray-400">{s.count} ({pct}%)</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Top products */}
                <h3 className="text-lg font-black mb-4">Productos Más Vendidos</h3>
                {(() => {
                    const prodMap = new Map<string, { name: string; qty: number; revenue: number }>();
                    ordenes.forEach(o => o.items?.forEach((i: any) => {
                        const key = i.nombre_producto || "Desconocido";
                        const existing = prodMap.get(key) || { name: key, qty: 0, revenue: 0 };
                        existing.qty += i.cantidad;
                        existing.revenue += i.precio_unitario * i.cantidad;
                        prodMap.set(key, existing);
                    }));
                    const sorted = Array.from(prodMap.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
                    if (sorted.length === 0) return <EmptyState icon={BarChart3} text="Sin datos aún" />;
                    return (
                        <div className="space-y-3">
                            {sorted.map((p, i) => (
                                <div key={p.name} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-4 flex items-center gap-4">
                                    <span className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 font-black text-sm">{i + 1}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm truncate">{p.name}</p>
                                        <p className="text-xs text-gray-400">{p.qty} vendidos</p>
                                    </div>
                                    <span className="font-black text-sm">${p.revenue.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    );
                })()}
            </>
        );
    }

    function renderConfiguracion() {
        return (
            <>
                <div className="space-y-4">
                    {/* Info del negocio */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-6">
                        <h3 className="font-black text-lg mb-4 flex items-center gap-2"><Store size={20} className="text-orange-600" /> Mi Negocio</h3>
                        <div className="space-y-3">
                            <InfoRow label="ID" value={user?.id_negocio || "—"} />
                            <InfoRow label="Rol" value={user?.rol || "—"} />
                            <InfoRow label="Email" value={user?.email || "—"} />
                            <InfoRow label="Nombre" value={user?.nombre || "—"} />
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-6">
                        <h3 className="font-black text-lg mb-4 flex items-center gap-2"><Settings size={20} className="text-gray-500" /> Acciones</h3>
                        <div className="space-y-3">
                            <button onClick={() => router.push(`/negocio/${user?.id_negocio}`)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 hover:bg-orange-50 dark:hover:bg-orange-600/10 font-bold text-sm transition-colors">
                                <Eye size={18} className="text-gray-400" /> Ver mi Catálogo Público
                            </button>
                            <button onClick={() => router.push("/explorar")} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-600/10 font-bold text-sm transition-colors">
                                <Search size={18} className="text-gray-400" /> Explorar Negocios
                            </button>
                            <button onClick={() => router.push("/")} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 font-bold text-sm transition-colors">
                                <LayoutDashboard size={18} className="text-gray-400" /> Ir al Inicio
                            </button>
                        </div>
                    </div>

                    {/* Danger zone */}
                    <div className="bg-red-50/50 dark:bg-red-900/5 rounded-2xl border border-red-100 dark:border-red-900/20 p-6">
                        <h3 className="font-black text-lg mb-4 flex items-center gap-2 text-red-600"><AlertTriangle size={20} /> Zona Peligrosa</h3>
                        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black text-sm transition-colors">
                            <LogOut size={18} /> Cerrar Sesión
                        </button>
                    </div>
                </div>
            </>
        );
    }

    function renderOrderModal() {
        if (!selectedOrder) return null;
        const o = selectedOrder;
        const sc = STATUS_CONFIG[o.estado] || STATUS_CONFIG.pendiente;
        const total = o.items?.reduce((a: number, i: any) => a + i.precio_unitario * i.cantidad, 0) || 0;

        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
                <div className="relative bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in duration-300">
                    <div className="p-8 pb-32 max-h-[90vh] overflow-y-auto no-scrollbar">
                        {/* Header Modal */}
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID: {o.id_transaccion}</span>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${sc.color}`}>
                                        {sc.label}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${o.pagado ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-600/20 dark:text-emerald-400" : "bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-500"}`}>
                                        {o.pagado ? "PAGADO" : "IMPAGO"}
                                    </span>
                                </div>
                                <h2 className="text-3xl font-black tracking-tighter">Detalle del Pedido</h2>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-2xl text-gray-400 hover:text-gray-900 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Customer Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-orange-50 dark:bg-orange-600/10 rounded-2xl text-orange-600"><Phone size={20} /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Teléfono / Contacto</p>
                                        <p className="font-bold">{o.datos_logistica?.telefono_contacto || "No especificado"}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-600/10 rounded-2xl text-blue-600"><MapPin size={20} /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Dirección de Envío</p>
                                        <p className="font-bold text-sm">{o.datos_logistica?.direccion_envio || "Retira por local"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase mb-3 flex items-center gap-2"><MessageCircle size={14} /> Notas del Cliente</h4>
                                <p className="text-sm font-medium italic text-gray-600 dark:text-zinc-400 leading-relaxed">
                                    {o.datos_logistica?.notas_cliente ? `"${o.datos_logistica.notas_cliente}"` : "El cliente no dejó notas adicionales."}
                                </p>
                            </div>
                        </div>

                        {/* Items List */}
                        <div className="space-y-4 mb-8">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Resumen de Productos</h4>
                            <div className="bg-white dark:bg-zinc-800/50 rounded-3xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
                                {o.items?.map((item: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center p-4 border-b border-gray-50 dark:border-zinc-800/50 last:border-0 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-600/20 text-orange-600 rounded-xl flex items-center justify-center font-black">{item.cantidad}</div>
                                            <div>
                                                <p className="font-bold text-sm">{item.nombre_producto}</p>
                                                <p className="text-[10px] font-black text-gray-400">${item.precio_unitario.toLocaleString()} c/u</p>
                                            </div>
                                        </div>
                                        <p className="font-black">${(item.precio_unitario * item.cantidad).toLocaleString()}</p>
                                    </div>
                                ))}
                                <div className="p-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex justify-between items-center">
                                    <span className="text-lg font-black uppercase tracking-tighter">Total del Pedido</span>
                                    <span className="text-3xl font-black">${total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="flex items-center gap-4 px-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                <Calendar size={14} /> Creado: {new Date(o.createdAt?.seconds * 1000).toLocaleString('es-AR')}
                            </div>
                        </div>
                    </div>

                    {/* Footer Modal - Acciones */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 flex flex-wrap gap-2 md:gap-4">
                        <button
                            onClick={() => handlePrint(o)}
                            className="flex items-center justify-center gap-2 p-4 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 rounded-2xl hover:bg-gray-200 transition-colors shrink-0"
                            title="Imprimir Comanda"
                        >
                            <Printer size={20} />
                        </button>
                        <button
                            onClick={() => handleShareWhatsApp(o)}
                            className="flex items-center justify-center gap-2 p-4 bg-green-50 text-green-600 dark:bg-green-600/10 dark:text-green-500 rounded-2xl hover:bg-green-100 transition-colors shrink-0"
                            title="Compartir por WhatsApp"
                        >
                            <Share2 size={20} />
                        </button>
                        <button
                            onClick={() => { handleTogglePago(o); setSelectedOrder(null); }}
                            className={`flex items-center justify-center gap-2 p-4 rounded-2xl transition-all border shrink-0 ${o.pagado
                                ? "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-600/10 dark:border-emerald-600/20"
                                : "bg-orange-50 border-orange-100 text-orange-600 dark:bg-orange-600/10 dark:border-orange-600/20 font-bold text-xs"}`}
                            title={o.pagado ? "Marcar como Impago" : "Confirmar Pago"}
                        >
                            <DollarSign size={20} />
                            {!o.pagado && <span className="hidden md:inline">Confirmar Pago</span>}
                        </button>

                        {o.estado === "pendiente" && (
                            <button onClick={() => { handleCambiarEstado(o.id_transaccion, "en_preparacion"); setSelectedOrder(null); }} className="flex-1 py-4 bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-600/20 hover:scale-[1.02] transition-all">Aceptar y Preparar</button>
                        )}
                        {o.estado === "en_preparacion" && (
                            <button onClick={() => { handleCambiarEstado(o.id_transaccion, "en_camino"); setSelectedOrder(null); }} className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:scale-[1.02] transition-all">Despachar Pedido</button>
                        )}
                        {o.estado === "en_camino" && (
                            <button onClick={() => { handleCambiarEstado(o.id_transaccion, "entregado"); setSelectedOrder(null); }} className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/20 hover:scale-[1.02] transition-all">Confirmar Entrega</button>
                        )}
                        {o.estado === "entregado" && (
                            <div className="flex-1 py-4 bg-gray-100 dark:bg-zinc-800 text-gray-500 text-center font-black rounded-2xl">Pedido Finalizado</div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ═══════ HELPERS ═══════
    function EmptyState({ icon: Icon, text, sub }: { icon: any; text: string; sub?: string }) {
        return (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-800 p-12 text-center">
                <Icon size={40} className="mx-auto text-gray-300 dark:text-zinc-700 mb-3" />
                <p className="font-black text-gray-400 dark:text-zinc-500">{text}</p>
                {sub && <p className="text-sm text-gray-400 mt-1">{sub}</p>}
            </div>
        );
    }

    function InfoRow({ label, value }: { label: string; value: string }) {
        return (
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-zinc-800 last:border-0">
                <span className="text-sm font-bold text-gray-400">{label}</span>
                <span className="text-sm font-black font-mono">{value}</span>
            </div>
        );
    }

    const PANEL_MAP: Record<string, () => JSX.Element> = {
        dashboard: renderDashboard,
        ordenes: renderOrdenes,
        productos: renderProductos,
        clientes: renderClientes,
        estadisticas: renderEstadisticas,
        configuracion: renderConfiguracion,
    };

    const tabLabel = SIDEBAR_ITEMS.find(i => i.id === activeTab)?.label || "Dashboard";

    return (
        <div className="flex min-h-screen bg-[#F8F8F8] dark:bg-[#0A0A0A] text-gray-900 dark:text-zinc-100">
            {/* ═══════ SIDEBAR ═══════ */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-zinc-800 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex flex-col h-full p-5">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="bg-orange-600 p-2.5 rounded-xl shadow-lg shadow-orange-600/20"><ShoppingBag className="text-white" size={22} /></div>
                        <span className="text-xl font-black tracking-tighter">CLICK<span className="text-orange-600">CITO</span></span>
                        <button onClick={() => setIsSidebarOpen(false)} className="ml-auto lg:hidden p-1.5 bg-gray-100 dark:bg-zinc-800 rounded-lg"><X size={18} /></button>
                    </div>

                    <nav className="flex-1 space-y-1">
                        {SIDEBAR_ITEMS.map(item => (
                            <button key={item.id} onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === item.id
                                    ? "bg-orange-50 text-orange-600 dark:bg-orange-600/10 dark:text-orange-500"
                                    : "text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-zinc-200"
                                    }`}>
                                <item.icon size={20} strokeWidth={2.5} />{item.label}
                                {item.id === "ordenes" && metrics.pendientes > 0 && (
                                    <span className="ml-auto bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full">{metrics.pendientes}</span>
                                )}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-zinc-800">
                        <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-zinc-800/50 rounded-xl mb-3">
                            <div className="w-9 h-9 rounded-lg bg-orange-100 dark:bg-orange-600/20 flex items-center justify-center text-orange-600 font-black text-sm">{user?.nombre?.charAt(0) || "U"}</div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold truncate">{user?.nombre || "Mi Cuenta"}</p>
                                <p className="text-[10px] text-gray-400 truncate">{user?.id_negocio || "Sin Negocio"}</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                            <LogOut size={16} /> Cerrar Sesión
                        </button>
                    </div>
                </div>
            </aside>

            {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />}

            {/* ═══════ MAIN ═══════ */}
            <main className="flex-1 lg:ml-72 min-h-screen">
                <div className="max-w-[1200px] mx-auto p-4 md:p-8">
                    {/* Top bar */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-white dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-800"><Menu size={22} /></button>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{user?.id_negocio || "Panel"}</p>
                                <h1 className="text-2xl md:text-3xl font-black tracking-tight">{tabLabel}</h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-2 bg-white dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-800 hover:border-orange-500 transition-all active:scale-95"
                            >
                                <Bell size={18} className={showNotifications ? "text-orange-500" : "text-gray-500"} />
                                {metrics.pendientes > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <>
                                    <div className="fixed inset-0 z-[60]" onClick={() => setShowNotifications(false)} />
                                    <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-2xl z-[70] overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                                        <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-800/50">
                                            <h3 className="font-black text-sm">Notificaciones</h3>
                                            <span className="text-[10px] font-black bg-orange-100 dark:bg-orange-600/20 text-orange-600 px-2 py-0.5 rounded-full">
                                                {metrics.pendientes} Pendientes
                                            </span>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto no-scrollbar">
                                            {ordenes.filter(o => o.estado === "pendiente" || o.estado === "en_preparacion").length === 0 ? (
                                                <div className="p-8 text-center">
                                                    <Bell size={32} className="mx-auto text-gray-200 dark:text-zinc-800 mb-2" />
                                                    <p className="text-xs font-bold text-gray-400">No hay pedidos pendientes</p>
                                                </div>
                                            ) : (
                                                ordenes.filter(o => o.estado === "pendiente" || o.estado === "en_preparacion").map(o => (
                                                    <div key={o.id_transaccion} className="p-4 border-b border-gray-50 dark:border-zinc-800/50 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors group">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <p className="text-xs font-black truncate max-w-[120px]">
                                                                {o.datos_logistica?.telefono_contacto || "Cliente"}
                                                            </p>
                                                            <span className="text-[10px] font-bold text-gray-400">
                                                                {o.estado === "pendiente" ? "Pendiente" : "Preparando"}
                                                            </span>
                                                        </div>
                                                        <p className="text-[10px] text-gray-500 line-clamp-1 mb-2">
                                                            {o.items?.map((i: any) => i.nombre_producto).join(", ")}
                                                        </p>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleCambiarEstado(o.id_transaccion, o.estado === "pendiente" ? "en_preparacion" : "en_camino");
                                                                }}
                                                                className="flex-1 py-1.5 bg-orange-600 text-white text-[10px] font-black rounded-lg hover:bg-orange-700 transition-colors"
                                                            >
                                                                {o.estado === "pendiente" ? "Aceptar" : "Despachar"}
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedOrder(o);
                                                                    setShowNotifications(false);
                                                                }}
                                                                className="px-2 py-1.5 bg-gray-100 dark:bg-zinc-800 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors"
                                                            >
                                                                <Eye size={12} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        <button
                                            onClick={() => { setActiveTab("ordenes"); setShowNotifications(false); }}
                                            className="w-full py-3 text-[10px] font-black text-gray-400 hover:text-orange-600 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all border-t border-gray-100 dark:border-zinc-800"
                                        >
                                            Ver todas las órdenes
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Active panel */}
                    {PANEL_MAP[activeTab]?.() || renderDashboard()}

                    {/* Global Order Detail Modal */}
                    {renderOrderModal()}
                </div>
            </main>
        </div>
    );
}
