"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { collection, query, where, onSnapshot, orderBy, limit, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import {
    Clock, PackageCheck, Send, CheckCircle2,
    ShoppingBag, ArrowLeft, Search, HelpCircle,
    AlertCircle, ChevronRight, X, MessageSquare, SendHorizonal,
    ExternalLink, GraduationCap, ArrowRight
} from "lucide-react";
import Link from "next/link";

// --- Tipos ---
interface LineaPedido {
    id_producto?: string;
    nombre_producto: string;
    cantidad: number;
    precio_unitario: number;
}

interface Orden {
    id: string;
    id_transaccion: string;
    estado: string;
    items: LineaPedido[];
    createdAt: any;
    reportado?: boolean;
}

const statusConfig: any = {
    pendiente: { label: "Pendiente", color: "text-amber-500", bg: "bg-amber-50", icon: Clock },
    en_preparacion: { label: "Preparando", color: "text-blue-500", bg: "bg-blue-50", icon: PackageCheck },
    en_camino: { label: "En Camino", color: "text-purple-500", bg: "bg-purple-50", icon: Send },
    entregado: { label: "Entregado", color: "text-emerald-500", bg: "bg-emerald-50", icon: CheckCircle2 },
    cancelado: { label: "Cancelado", color: "text-red-500", bg: "bg-red-50", icon: X },
};

export default function MisPedidosPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    // Estados
    const [ordenes, setOrdenes] = useState<Orden[]>([]);
    const [loadingOrdenes, setLoadingOrdenes] = useState(true);
    const [activeFilter, setActiveFilter] = useState("todas");
    const [searchTerm, setSearchTerm] = useState("");
    const [pageSize, setPageSize] = useState(5); // Paginación simple (Limite inicial)

    // Estado para Reporte
    const [reportModal, setReportModal] = useState<{ open: boolean, order: any }>({ open: false, order: null });
    const [reportReason, setReportReason] = useState("");
    const [sendingReport, setSendingReport] = useState(false);

    useEffect(() => {
        if (!loading && !user) router.push("/login");
    }, [user, loading, router]);

    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    useEffect(() => {
        if (!user?.uid) return;

        // Consultamos con un límite inicial para no tener una lista infinita pesada
        const q = query(
            collection(db, "transacciones"),
            where("id_usuario", "==", user.uid),
            orderBy("createdAt", "desc"),
            limit(20) // Límite razonable para "no infinita"
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setOrdenes(snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Orden)));
            setLoadingOrdenes(false);
        });
        return () => unsubscribe();
    }, [user]);

    const filtered = useMemo(() => {
        let items = ordenes.filter(o => {
            const matchesFilter = activeFilter === "todas" || o.estado === activeFilter;
            const matchesSearch = (o.id_transaccion || o.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
                (o.items && o.items.some(i => i.nombre_producto?.toLowerCase().includes(searchTerm.toLowerCase())));
            return matchesFilter && matchesSearch;
        });
        return items.slice(0, pageSize); // Aplicamos el recorte de UX (paginación visual)
    }, [ordenes, activeFilter, searchTerm, pageSize]);


    // --- Toasts Personalizados de Actualización ---
    const prevOrdenesRef = useRef<Orden[]>([]);
    const [toasts, setToasts] = useState<{ id: number, orderIdCorto: string, newStatus: string, sc: any }[]>([]);

    useEffect(() => {
        if (ordenes.length === 0) return;
        if (prevOrdenesRef.current.length > 0) {
            ordenes.forEach(o => {
                const prev = prevOrdenesRef.current.find(po => po.id === o.id);
                // Si el estado cambió a uno progresivo o nuevo
                if (prev && prev.estado !== o.estado) {
                    const sc = statusConfig[o.estado] || statusConfig.pendiente;
                    const idCorto = o.id_transaccion?.slice(-6) || o.id.slice(-6);
                    const toastId = Date.now() + Math.random();

                    setToasts(prevToasts => [...prevToasts, {
                        id: toastId,
                        orderIdCorto: idCorto,
                        newStatus: sc.label,
                        sc: sc
                    }]);

                    // Auto-borrar después de 6 segundos
                    setTimeout(() => {
                        setToasts(prevToasts => prevToasts.filter(t => t.id !== toastId));
                    }, 6000);
                }
            });
        }
        prevOrdenesRef.current = ordenes;
    }, [ordenes]);

    const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

    const handleSendReport = async () => {
        if (!reportReason.trim() || !reportModal.order) return;
        setSendingReport(true);
        try {
            // Guardar reporte formal en Firebase
            await addDoc(collection(db, "reportes_pedidos"), {
                orderId: reportModal.order.id,
                id_transaccion: reportModal.order.id_transaccion || reportModal.order.id,
                userId: user?.uid,
                userEmail: user?.email,
                razon: reportReason,
                timestamp: serverTimestamp(),
                estado: "abierto"
            });

            // Marcar pedido como reportado para feedback visual
            await updateDoc(doc(db, "transacciones", reportModal.order.id), {
                reportado: true
            });

            setReportModal({ open: false, order: null });
            setReportReason("");
            alert("Reporte enviado con éxito. Nos pondremos en contacto pronto.");
        } catch (error) {
            console.error(error);
            alert("Error al enviar el reporte.");
        } finally {
            setSendingReport(false);
        }
    };

    if (loading || loadingOrdenes) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] dark:bg-[#0A0A0A]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Recuperando historial...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0A0A0A] pt-28 pb-20 px-4">
            <div className="max-w-3xl mx-auto">

                {/* Header Compacto */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2.5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl hover:scale-105 transition-all shadow-sm">
                            <ArrowLeft size={18} className="text-gray-900 dark:text-white" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Mis <span className="text-orange-500">Pedidos.</span></h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">{ordenes.length} Transacciones totales</p>
                        </div>
                    </div>

                    {/* Botón de Mis Cursos */}
                    <button
                        onClick={() => router.push('/cursos')}
                        className="px-4 py-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-sm"
                    >
                        <GraduationCap size={16} strokeWidth={2.5} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Mis Cursos</span>
                    </button>
                </div>

                {/* Controles: Filtros + Búsqueda */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-8">
                    <div className="md:col-span-8 flex bg-white dark:bg-zinc-900 p-1 border border-gray-100 dark:border-zinc-800 rounded-xl overflow-x-auto no-scrollbar shadow-sm">
                        {["todas", "pendiente", "en_preparacion", "en_camino", "entregado"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`flex-1 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeFilter === f
                                    ? "bg-gray-900 dark:bg-white text-white dark:text-black shadow-md"
                                    : "text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                            >
                                {f === "todas" ? "Todos" : f.replace("_", " ")}
                            </button>
                        ))}
                    </div>
                    <div className="md:col-span-4 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl outline-none focus:border-orange-500/50 font-bold text-xs transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Lista de Pedidos */}
                {filtered.length === 0 ? (
                    <div className="text-center py-24 bg-white dark:bg-zinc-900 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
                        <ShoppingBag size={48} className="mx-auto text-gray-100 dark:text-zinc-800 mb-6" />
                        <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">No hay pedidos encontrados</p>
                        <p className="text-[10px] text-gray-400 font-bold mt-2">Ajustá los filtros o intentá otra búsqueda.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((o) => {
                            const status = statusConfig[o.estado] || statusConfig.pendiente;
                            const total = o.items?.reduce((acc: number, i: any) => acc + (i.precio_unitario * i.cantidad), 0) || 0;
                            const fecha = o.createdAt?.seconds ? new Date(o.createdAt.seconds * 1000) : null;

                            return (
                                <div key={o.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-5 hover:border-gray-200 dark:hover:border-zinc-700 transition-all shadow-sm group">
                                    <div className="flex justify-between items-start mb-5">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 ${status.bg} dark:bg-opacity-10 ${status.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                                                <status.icon size={22} strokeWidth={2.5} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <p className="text-xs font-black text-gray-900 dark:text-white tracking-widest uppercase">#{o.id_transaccion?.slice(-6) || o.id.slice(-6)}</p>
                                                    {o.reportado && <span className="text-[9px] font-black bg-red-100 text-red-600 px-1.5 py-0.5 rounded-md uppercase">En Revisión</span>}
                                                </div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                                    {fecha ? fecha.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Recién'}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-xl border border-transparent shadow-sm ${status.bg} dark:bg-opacity-20 ${status.color}`}>
                                            {status.label}
                                        </span>
                                    </div>

                                    {/* Items Preview */}
                                    <div className="bg-gray-50/50 dark:bg-zinc-800/20 rounded-xl p-4 mb-5 space-y-2.5">
                                        {o.items?.map((item: LineaPedido, i: number) => (
                                            <div key={i} className="flex flex-col gap-2">
                                                <div className="flex justify-between items-center text-[11px]">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-5 h-5 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-md font-black text-gray-400 border border-gray-100 dark:border-zinc-800 text-[9px]">{item.cantidad}</span>
                                                        <span className="text-gray-700 dark:text-gray-300 font-bold tracking-tight">{item.nombre_producto}</span>
                                                    </div>
                                                    <span className="font-black text-gray-900 dark:text-white">${(item.precio_unitario * (item.cantidad || 1)).toLocaleString()}</span>
                                                </div>
                                                {/* Botón de acceso al curso sólo si NO está pendiente ni cancelado */}
                                                {(o.estado !== 'pendiente' && o.estado !== 'cancelado') && (
                                                    <Link
                                                        href={`/cursos/${(item as any).id_producto || ''}`}
                                                        className="flex items-center justify-center gap-2 py-2 bg-indigo-600 dark:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-indigo-500/20"
                                                    >
                                                        <ArrowRight size={12} strokeWidth={3} />
                                                        Ir al Curso / Aula
                                                    </Link>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Total a pagar</p>
                                            <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">${total.toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setReportModal({ open: true, order: o })}
                                                className="flex items-center gap-2 p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"
                                                title="Reportar problema"
                                            >
                                                <AlertCircle size={18} />
                                            </button>
                                            <button onClick={() => setSelectedOrder(o)} className="flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transform transition-all active:scale-95 shadow-md hover:bg-orange-600 dark:hover:bg-orange-500">
                                                Ver Detalle
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Pagination UX - Ver Más */}
                        {ordenes.length > pageSize && (
                            <button
                                onClick={() => setPageSize(prev => prev + 5)}
                                className="w-full py-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm flex items-center justify-center gap-2 group"
                            >
                                Cargar más pedidos <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        )}
                    </div>
                )}

                {/* Footer simple de soporte */}
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 rounded-full">
                        <HelpCircle size={12} className="text-gray-400" />
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">¿Necesitás ayuda profesional?</span>
                        <button onClick={() => window.open('https://wa.me/543755223344')} className="text-[9px] font-black text-orange-600 uppercase tracking-widest hover:underline ml-2">Contactar soporte</button>
                    </div>
                </div>
            </div>

            {/* Modal de Reporte Profesional */}
            {reportModal.open && (
                <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setReportModal({ open: false, order: null })} />
                    <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-zinc-800 animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={() => setReportModal({ open: false, order: null })}
                            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="w-16 h-16 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-3xl flex items-center justify-center mb-4">
                                <MessageSquare size={32} />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Reportar Pedido</h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Transacción #{reportModal.order?.id_transaccion?.slice(-6) || reportModal.order?.id.slice(-6)}</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block ml-1">Especifíca el problema</label>
                                <textarea
                                    className="w-full h-32 p-5 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-2xl outline-none focus:border-red-500/50 font-bold text-xs resize-none transition-all"
                                    placeholder="Ej: El pedido llegó incompleto, tardó demasiado, etc..."
                                    value={reportReason}
                                    onChange={(e) => setReportReason(e.target.value)}
                                />
                            </div>

                            <button
                                onClick={handleSendReport}
                                disabled={sendingReport || !reportReason.trim()}
                                className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl shadow-xl active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3"
                            >
                                {sendingReport ? (
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>Enviar Reporte Formal <SendHorizonal size={16} /></>
                                )}
                            </button>
                            <p className="text-center text-[9px] text-gray-400 font-medium">Un representante de soporte revisará tu caso en breve.</p>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal de Detalle de Pedido (Solo lectura para usuario final) */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
                    <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-zinc-800 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto no-scrollbar">
                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-6">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Detalle de Pedido</h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Transacción #{selectedOrder.id_transaccion?.slice(-6) || selectedOrder.id.slice(-6)}</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase mt-3 ${(statusConfig[selectedOrder.estado] || statusConfig.pendiente).color} ${(statusConfig[selectedOrder.estado] || statusConfig.pendiente).bg} dark:bg-opacity-20`}>
                                {(statusConfig[selectedOrder.estado] || statusConfig.pendiente).label}
                            </span>
                        </div>

                        <div className="space-y-4 mb-6">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Resumen de Items</h4>
                            <div className="bg-gray-50/50 dark:bg-zinc-800/20 rounded-2xl p-4 space-y-3">
                                {selectedOrder.items?.map((item: any, i: number) => (
                                    <div key={i} className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-3">
                                                <span className="w-6 h-6 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-lg font-black text-gray-400 border border-gray-100 dark:border-zinc-800 text-[10px]">{item.cantidad || 1}</span>
                                                <span className="text-gray-900 dark:text-gray-100 font-bold">{item.nombre_producto}</span>
                                            </div>
                                            <span className="font-black text-gray-900 dark:text-white">${((item.precio_unitario || 0) * (item.cantidad || 1)).toLocaleString()}</span>
                                        </div>
                                        {/* Link de acceso en detalle */}
                                        {(selectedOrder.estado !== 'pendiente' && selectedOrder.estado !== 'cancelado') && (
                                            <Link
                                                href={`/cursos/${item.id_producto || ''}`}
                                                className="w-full py-3 bg-indigo-600 dark:bg-indigo-500 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 mt-1 shadow-lg shadow-indigo-500/10"
                                            >
                                                <ArrowRight size={14} strokeWidth={3} />
                                                Acceder al Curso ahora
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center px-2">
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Total</span>
                                <span className="text-xl font-black text-gray-900 dark:text-white">${(selectedOrder.items?.reduce((a: number, i: any) => a + (i.precio_unitario || 0) * (i.cantidad || 1), 0) || 0).toLocaleString()}</span>
                            </div>
                        </div>

                        {Object.keys(selectedOrder.datos_logistica || {}).length > 0 && (
                            <div className="space-y-4 mb-6">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Información Adicional</h4>
                                <div className="bg-orange-50/50 dark:bg-orange-900/10 rounded-2xl p-4 grid grid-cols-2 gap-4">
                                    {Object.entries(selectedOrder.datos_logistica || {}).map(([k, v]) => (
                                        <div key={k}>
                                            <p className="text-[9px] font-black text-gray-400 uppercase">{k.replace(/_/g, " ")}</p>
                                            <p className="font-bold text-xs text-gray-900 dark:text-white line-clamp-2">{String(v)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* Contenedor de Toasts Flotantes */}
            <div className="fixed top-24 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
                {toasts.map(t => {
                    const Icon = t.sc.icon;
                    return (
                        <div key={t.id} className="pointer-events-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-black/50 border border-gray-100 dark:border-zinc-800 p-4 w-72 sm:w-80 animate-in slide-in-from-right-8 fade-in duration-300">
                            <div className="flex gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${t.sc.bg} dark:bg-opacity-20 ${t.sc.color}`}>
                                    <Icon size={20} strokeWidth={2.5} />
                                </div>
                                <div className="flex-1">
                                    <h5 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-0.5">Pedido #{t.orderIdCorto}</h5>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">Estado actualizado a <span className={t.sc.color}>{t.newStatus}</span></p>
                                </div>
                                <button onClick={() => removeToast(t.id)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors self-start"><X size={16} /></button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
