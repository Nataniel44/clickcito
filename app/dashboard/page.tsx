"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/app/firebase/config";
import { signOut } from "firebase/auth";
import { createProducto, updateProducto, deleteProducto, createNegocio, updateNegocio, getAllUsuariosByRol, getAllNegocios, updateUsuario, updateEstadoTransaccion, createActivityLog, deleteTransaccion, deleteTransaccionesBatch } from "@/app/firebase/db";
import toast from "react-hot-toast";
import { Menu, Bell, Eye } from "lucide-react";

// Components
import { Sidebar } from "./components/Sidebar";
import { DashboardOverview } from "./components/DashboardOverview";
import { OrdersPanel } from "./components/OrdersPanel";
import { ProductsPanel } from "./components/ProductsPanel";
import { ClientsPanel } from "./components/ClientsPanel";
import { MarketingPanel } from "./components/MarketingPanel";
import { StatsPanel } from "./components/StatsPanel";
import { ConfigPanel } from "./components/ConfigPanel";
import { AdminUsersPanel } from "./components/AdminUsersPanel";
import { ActivityLogPanel } from "./components/ActivityLogPanel";
import { OrderModal } from "./components/OrderModal";
import { OrderRow } from "./components/OrderRow";
import { EducationPanel } from "./components/EducationPanel";
import { BASE_SIDEBAR_ITEMS, ADMIN_SIDEBAR_ITEMS } from "./components/constants";

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [ordenes, setOrdenes] = useState<any[]>([]);
    const [productos, setProductos] = useState<any[]>([]);
    const [loadingOrdenes, setLoadingOrdenes] = useState(true);
    const [loadingProductos, setLoadingProductos] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("todas");
    const [timeFilter, setTimeFilter] = useState("todas");
    const [customDate, setCustomDate] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [showNotifications, setShowNotifications] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [negocioData, setNegocioData] = useState<any | null>(null);
    const [bannerText, setBannerText] = useState("");
    const [isUpdatingBanner, setIsUpdatingBanner] = useState(false);
    const [statsPeriod, setStatsPeriod] = useState("7d");
    const [isConfigEditing, setIsConfigEditing] = useState(false);
    const [configEditData, setConfigEditData] = useState({ nombre: "", nombre_negocio: "" });
    const [isSavingConfig, setIsSavingConfig] = useState(false);
    const [adminDueños, setAdminDueños] = useState<any[]>([]);
    const [adminNegocios, setAdminNegocios] = useState<any[]>([]);
    const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);
    const [managedBusinessId, setManagedBusinessId] = useState<string | null>(null);
    const [managedBusinessData, setManagedBusinessData] = useState<any | null>(null);
    const isInitialLoad = useRef(true);

    // ═══════ AUTH GUARD ═══════
    useEffect(() => {
        if (!loading) {
            if (!user) { router.push("/login"); }
            else if (user.rol === "cliente_final") { router.push("/"); }
            else if (user.rol !== "dueño_negocio" && user.rol !== "admin_clickcito" && user.rol !== "admin") { router.push("/"); }
        }
    }, [user, loading, router]);

    // ═══════ AUTO-CLEAR MANAGED BUSINESS ═══════
    useEffect(() => {
        if (activeTab !== "productos" && activeTab !== "academy" && managedBusinessId) {
            setManagedBusinessId(null);
            setManagedBusinessData(null);
        }
    }, [activeTab, managedBusinessId]);

    // ═══════ LIVE ORDERS ═══════
    useEffect(() => {
        if (!user) { setLoadingOrdenes(false); return; }

        const isAdmin = user.rol === "admin_clickcito" || user.rol === "admin";

        const idToUse = managedBusinessId || user?.id_negocio;

        const q = (user.rol === "dueño_negocio" || managedBusinessId) && idToUse
            ? query(collection(db, "transacciones"), where("id_negocio", "==", idToUse), orderBy("createdAt", "desc"))
            : query(collection(db, "transacciones"), orderBy("createdAt", "desc"));

        const unsub = onSnapshot(q, (snap) => {
            if (!isInitialLoad.current) {
                const newOrders = snap.docChanges().filter(change => change.type === "added");

                if (newOrders.length > 0) {
                    const tenMinutesAgo = Date.now() - (10 * 60 * 1000);
                    const reallyNewOrders = newOrders.filter(change => {
                        const createdAt = change.doc.data().createdAt?.seconds * 1000;
                        return createdAt && createdAt > tenMinutesAgo;
                    });

                    if (reallyNewOrders.length > 0) {
                        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3");
                        audio.play().catch(e => console.log("Audio play blocked", e));

                        toast.success(`¡Recibiste ${reallyNewOrders.length > 1 ? reallyNewOrders.length + ' pedidos nuevos' : 'un pedido nuevo'}! 🔔`, {
                            icon: "📦",
                            duration: reallyNewOrders.length > 1 ? 6000 : 5000,
                            style: { borderRadius: '1rem', background: '#333', color: '#fff', fontWeight: 'bold' }
                        });
                    }
                }
            }

            setOrdenes(snap.docs.map(d => ({ id_transaccion: d.id, ...d.data() })));
            setLoadingOrdenes(false);
            isInitialLoad.current = false;
        }, () => { setLoadingOrdenes(false); });
        return () => unsub();
    }, [user, managedBusinessId]);

    // ═══════ PRODUCTS LIVE ═══════
    useEffect(() => {
        const idToUse = managedBusinessId || user?.id_negocio;
        if (!idToUse) {
            setProductos([]);
            setLoadingProductos(false);
            return;
        }

        setLoadingProductos(true);
        const q = query(collection(db, "productos_catalogo"), where("id_negocio", "==", idToUse));
        const unsub = onSnapshot(q, (snap) => {
            setProductos(snap.docs.map(d => ({ id_producto: d.id, ...d.data() })));
            setLoadingProductos(false);
        }, () => setLoadingProductos(false));

        return () => unsub();
    }, [user, managedBusinessId]);

    // ═══════ BUSINESS DATA LIVE (BANNER/CONFIG) ═══════
    useEffect(() => {
        const idToUse = managedBusinessId || user?.id_negocio;
        if (!idToUse) return;
        setNegocioData(null); // Reset when changing

        const docRef = doc(db, "negocios", idToUse);
        const unsub = onSnapshot(docRef, (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                setNegocioData({ id: snap.id, ...data }); // Always include the document ID (slug)
                if (data.anuncio_banner !== undefined) setBannerText(data.anuncio_banner || "");
            }
        });

        return () => unsub();
    }, [user, managedBusinessId]);

    // ═══════ ADMIN DATA FETCHING ═══════
    useEffect(() => {
        const isAdmin = user?.rol === "admin_clickcito" || user?.rol === "admin";
        if (!user || !isAdmin) return;

        const fetchAdminData = async () => {
            setIsLoadingAdmin(true);
            try {
                const [dueños, negocios] = await Promise.all([
                    getAllUsuariosByRol("dueño_negocio"),
                    getAllNegocios()
                ]);
                setAdminDueños(dueños);
                setAdminNegocios(negocios);
            } catch (error) {
                console.error("Error fetching admin data:", error);
                toast.error("Error al cargar datos de admin");
            } finally {
                setIsLoadingAdmin(false);
            }
        };

        fetchAdminData();
    }, [user]);

    // ═══════ METRICS ═══════
    const metrics = useMemo(() => {
        const now = new Date().toLocaleDateString('es-AR');
        const ordenesHoy = ordenes.filter(o =>
            o.createdAt && new Date(o.createdAt.seconds * 1000).toLocaleDateString('es-AR') === now
        );

        return {
            totalVentas: ordenes.filter(o => o.estado === "entregado").reduce((a, o) => a + (o.items?.reduce((ia: number, i: any) => ia + (i.precio_unitario * i.cantidad), 0) || 0), 0),
            cantidadOrdenes: ordenes.length,
            pendientes: ordenes.filter(o => o.estado === "pendiente" || o.estado === "en_preparacion").length,
            entregados: ordenes.filter(o => o.estado === "entregado").length,
            ventasHoy: ordenesHoy.filter(o => o.estado === "entregado").reduce((a, o) => a + (o.items?.reduce((ia: number, i: any) => ia + (i.precio_unitario * i.cantidad), 0) || 0), 0),
            ordenesHoy: ordenesHoy.length,
            pendientesHoy: ordenesHoy.filter(o => o.estado === "pendiente" || o.estado === "en_preparacion").length,
        };
    }, [ordenes]);

    const ordenesFiltradas = useMemo(() => {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        return ordenes.filter(o => {
            const s = o.id_transaccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (o.datos_logistica?.telefono_contacto || "").includes(searchTerm);
            const f = statusFilter === "todas" || o.estado === statusFilter;
            let t = true;
            if (o.createdAt) {
                const orderDate = new Date(o.createdAt.seconds * 1000);
                if (timeFilter === "hoy") t = orderDate >= startOfToday;
                else if (timeFilter === "semana") t = orderDate >= startOfWeek;
                else if (timeFilter === "mes") t = orderDate >= startOfMonth;
                else if (timeFilter === "año") t = orderDate >= startOfYear;
                else if (timeFilter === "personalizado" && customDate) {
                    const [y, m, d] = customDate.split("-").map(Number);
                    const selected = new Date(y, m - 1, d);
                    t = orderDate.toDateString() === selected.toDateString();
                }
            } else if (timeFilter !== "todas") {
                t = false;
            }
            return s && f && t;
        });
    }, [ordenes, searchTerm, statusFilter, timeFilter, customDate]);

    const filteredTotal = useMemo(() => {
        return ordenesFiltradas.reduce((acc, o) => acc + (o.items?.reduce((ia: number, i: any) => ia + i.precio_unitario * i.cantidad, 0) || 0), 0);
    }, [ordenesFiltradas]);

    // Unique clients grouped by Phone Number
    const clientesUnicos = useMemo(() => {
        const map = new Map();
        ordenes.forEach(o => {
            const clientKey = o.datos_logistica?.telefono_contacto || o.id_usuario || "anonimo";
            if (!map.has(clientKey)) {
                map.set(clientKey, {
                    uid: o.id_usuario,
                    tel: o.datos_logistica?.telefono_contacto || "S/D",
                    dir: o.datos_logistica?.direccion_envio || "—",
                    ordenes: 0,
                    total: 0
                });
            }
            const c = map.get(clientKey);
            c.ordenes++;
            c.total += o.items?.reduce((a: number, i: any) => a + i.precio_unitario * i.cantidad, 0) || 0;
            if (o.datos_logistica?.direccion_envio && c.dir === "—") {
                c.dir = o.datos_logistica.direccion_envio;
            }
        });
        return Array.from(map.values()).sort((a, b) => b.ordenes - a.ordenes);
    }, [ordenes]);

    // ═══════ ACTIONS ═══════
    const handleCambiarEstado = async (id: string, estado: string) => {
        try {
            await updateEstadoTransaccion(id, estado);
            toast.success(`Orden → ${estado.replace("_", " ")}`);
            if (user?.id_negocio) {
                await createActivityLog(user.id_negocio, {
                    usuario_email: user.email || user.nombre || 'Desconocido',
                    accion: "Cambio de Estado",
                    detalles: `Ticket #${id.slice(0, 6)} movido a ${estado.replace("_", " ")}`
                });
            }
        } catch { toast.error("Error"); }
    };

    const handleDeleteProducto = async (id: string, productName?: string) => {
        if (!confirm("¿Eliminar este producto?")) return;
        try {
            await deleteProducto(id);
            setProductos(prev => prev.filter(p => p.id_producto !== id));
            toast.success("Producto eliminado");
            if (user?.id_negocio) {
                await createActivityLog(user.id_negocio, {
                    usuario_email: user.email || user.nombre || 'Desconocido',
                    accion: "Eliminación de Producto",
                    detalles: `Producto eliminado del catálogo`
                });
            }
        } catch { toast.error("Error"); }
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
                    <div class="total">TOTAL: $${total.toLocaleString()}</div>
                    <div class="footer">*** Gracias por elegirnos ***<br>Digitalizado por Clickcito</div>
                    <script>setTimeout(() => { window.print(); window.close(); }, 500);</script>
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

    const handleTogglePago = async (o: any) => {
        try {
            const transRef = doc(db, "transacciones", o.id_transaccion);
            const isNowPaid = !o.pagado;
            const updates: any = { pagado: isNowPaid };

            if (isNowPaid && o.estado !== "entregado") {
                updates.estado = "entregado";
            }

            await updateDoc(transRef, updates);
            toast.success(isNowPaid ? "Pago Confirmado y Orden Entregada ✅" : "Marcado como No Pagado");

            if (user?.id_negocio) {
                await createActivityLog(user.id_negocio, {
                    usuario_email: user.email || user.nombre || 'Desconocido',
                    accion: isNowPaid ? "Pago Confirmado" : "Pago Revertido",
                    detalles: `Ticket #${o.id_transaccion.slice(0, 6)} marcado como ${isNowPaid ? 'PAGADO' : 'IMPAGO'}`
                });
            }
        } catch {
            toast.error("Error al actualizar pago");
        }
    };

    const handleCierreCaja = () => {
        const deliveredOrders = ordenes.filter(o => {
            const isToday = o.createdAt && new Date(o.createdAt.seconds * 1000).toLocaleDateString('es-AR') === new Date().toLocaleDateString('es-AR');
            return isToday && o.estado === "entregado";
        });

        if (deliveredOrders.length === 0) {
            toast.error("No hay ventas entregadas hoy para cerrar caja.");
            return;
        }

        const stats = {
            count: deliveredOrders.length,
            total: deliveredOrders.reduce((acc, o) => acc + (o.items?.reduce((ia: number, i: any) => ia + i.precio_unitario * i.cantidad, 0) || 0), 0),
            efectivo: deliveredOrders.filter(o => o.pagado).reduce((acc, o) => acc + (o.items?.reduce((ia: number, i: any) => ia + i.precio_unitario * i.cantidad, 0) || 0), 0),
            pendiente: deliveredOrders.filter(o => !o.pagado).reduce((acc, o) => acc + (o.items?.reduce((ia: number, i: any) => ia + i.precio_unitario * i.cantidad, 0) || 0), 0),
        };

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const html = `
            <html>
                <head><title>Cierre de Caja - ${new Date().toLocaleDateString()}</title><style>body { font-family: 'Courier New'; width: 60mm; padding: 10px; font-size: 14px; } .header { text-align: center; border-bottom: 1px dashed black; padding-bottom: 10px; margin-bottom: 10px; } .row { display: flex; justify-content: space-between; margin: 5px 0; } .total { font-weight: bold; border-top: 1px dashed black; padding-top: 10px; margin-top: 10px; font-size: 18px; }</style></head>
                <body>
                    <div class="header"><h2>CIERRE DE CAJA</h2><p>${user?.nombre_negocio || 'Local'}</p><p>${new Date().toLocaleString('es-AR')}</p></div>
                    <div class="row"><span>Órdenes Entregadas:</span><span>${stats.count}</span></div>
                    <div class="row"><span>Total Ventas:</span><span>$${stats.total.toLocaleString()}</span></div>
                    <div class="row"><span>Cobrado:</span><span>$${stats.efectivo.toLocaleString()}</span></div>
                    <div class="row"><span>A Cobrar:</span><span>$${stats.pendiente.toLocaleString()}</span></div>
                    <div class="total"><div class="row"><span>SALDO FINAL:</span><span>$${stats.efectivo.toLocaleString()}</span></div></div>
                    <div style="text-align: center; margin-top: 20px;"><p>Clickcito Dashboard v1.0</p></div>
                    <script>setTimeout(() => { window.print(); window.close(); }, 500);</script>
                </body>
            </html>
        `;
        printWindow.document.write(html);
        printWindow.document.close();
        toast.success("Ticket de cierre generado!");
    };

    const handleUpdateBanner = async () => {
        if (!user?.id_negocio) return;
        setIsUpdatingBanner(true);
        try {
            await updateNegocio(user.id_negocio, { anuncio_banner: bannerText });
            toast.success("¡Banner actualizado en vivo!");
        } catch { toast.error("Error al actualizar"); }
        finally { setIsUpdatingBanner(false); }
    };

    const handleDeleteTransaccion = async (id: string, phone?: string, silent: boolean = false) => {
        if (!user || user.rol !== "admin_clickcito") return toast.error("No tenés permisos para esta acción");
        if (!silent && !confirm(`¿Estás seguro de ELIMINAR permanentemente la orden ${phone ? `de ${phone}` : `#${id.slice(0, 6)}`}? Esta acción no se puede deshacer.`)) return;

        try {
            await deleteTransaccion(id);
            toast.success("Orden eliminada del historial");

            if (user.id_negocio) {
                await createActivityLog(user.id_negocio, {
                    usuario_email: user.email || "",
                    accion: "ELIMINAR_ORDEN",
                    detalles: `Eliminó la orden ${id}`
                });
            }
        } catch {
            toast.error("Error al eliminar");
        }
    };

    const handleDeleteManyTransacciones = async (ids: string[]) => {
        if (!user || user.rol !== "admin_clickcito") return toast.error("No tenés permisos para esta acción");
        if (!confirm(`¿Eliminar PERMANENTEMENTE ${ids.length} órdenes seleccionadas?`)) return;

        const loadingToast = toast.loading(`Eliminando ${ids.length} órdenes...`);
        try {
            // Dividir en chunks de 400 para Firestore batch limits
            const chunkSize = 400;
            for (let i = 0; i < ids.length; i += chunkSize) {
                const chunk = ids.slice(i, i + chunkSize);
                await deleteTransaccionesBatch(chunk);
            }

            toast.success("Historial limpiado correctamente", { id: loadingToast });
            if (user.id_negocio) {
                await createActivityLog(user.id_negocio, {
                    usuario_email: user.email || "",
                    accion: "ELIMINAR_HISTORIAL",
                    detalles: `Eliminó ${ids.length} órdenes en lote.`
                });
            }
        } catch {
            toast.error("Error al limpiar historial", { id: loadingToast });
        }
    };

    const handleSaveConfig = async () => {
        if (!user) return;
        setIsSavingConfig(true);
        try {
            // Actualizamos la información tanto del usuario como del negocio para mantener consistencia
            await updateUsuario(user.uid, {
                nombre: configEditData.nombre,
                nombre_negocio: configEditData.nombre_negocio
            });

            if (user.id_negocio) {
                await updateNegocio(user.id_negocio, {
                    nombre: configEditData.nombre_negocio
                });
            }

            toast.success("Configuración guardada");
            setIsConfigEditing(false);
        } catch {
            toast.error("Error al guardar cambios");
        } finally {
            setIsSavingConfig(false);
        }
    };

    const refreshAdminData = async () => {
        setIsLoadingAdmin(true);
        try {
            const [dueños, negocios] = await Promise.all([
                getAllUsuariosByRol("dueño_negocio"),
                getAllNegocios()
            ]);
            setAdminDueños(dueños);
            setAdminNegocios(negocios);
        } finally {
            setIsLoadingAdmin(false);
        }
    };

    const handleCrearNegocioParaUsuario = async (owner: any) => {
        const nombreSugerido = `Negocio de ${owner.nombre}`;
        const nombreInput = prompt(`Ingrese el nombre del negocio para ${owner.nombre}:`, nombreSugerido);
        if (!nombreInput) return;

        try {
            const finalId = nombreInput.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^\w-]/g, "") + "-" + Math.random().toString(36).substring(2, 7);

            const businessId = await createNegocio(finalId, {
                nombre: nombreInput,
                id_negocio: finalId,
                owner_uid: owner.uid,
                email: owner.email || "",
                rubro: "gastronomia",
                categoria_principal: "gastronomia",
                descripcion: "Bienvenido a mi nuevo negocio.",
                ubicacion: "",
                telefono: owner.telefono || "",
                activo: true,
                rating: { promedio: 0, total_resenas: 0, distribucion: [0, 0, 0, 0, 0] },
                horarios: { lunes: "Cerrado", martes: "Cerrado", miercoles: "Cerrado", jueves: "Cerrado", viernes: "Cerrado", sabado: "Cerrado", domingo: "Cerrado" },
                fotos: [],
                configuracion_logistica: { delivery_habilitado: false, takeaway_habilitado: false, mesa_habilitado: false, precio_delivery: 0, delivery_gratis_desde: 0, tiempo_aprox_delivery: "", direccion_retiro_local: "" },
                categorias: [],
                anuncio_banner: ""
            });

            if (businessId) {
                await updateUsuario(owner.uid, { id_negocio: businessId });
                toast.success("Negocio creado y asignado!");
                refreshAdminData();
            }
        } catch (error) {
            console.error("Error creating business:", error);
            toast.error("Error al crear negocio");
        }
    };

    const handleQuitarNegocio = async (owner: any) => {
        if (!confirm(`¿Estás seguro de quitar el negocio a ${owner.nombre}? El negocio NO se borrará, solo se desvinculará del usuario.`)) return;
        try {
            await updateUsuario(owner.uid, { id_negocio: null });
            toast.success("Negocio desvinculado correctamente");
            refreshAdminData();
        } catch (error) {
            console.error("Error unlinking business:", error);
            toast.error("Error al desvincular negocio");
        }
    };

    const handleAsignarNegocioExistente = async (owner: any, idNegocio: string) => {
        if (!idNegocio) return;
        try {
            await updateUsuario(owner.uid, { id_negocio: idNegocio });
            // También actualizamos el owner_uid en el negocio para consistencia
            await updateNegocio(idNegocio, { owner_uid: owner.uid, email: owner.email });
            toast.success("Negocio asignado correctamente");
            refreshAdminData();
        } catch (error) {
            console.error("Error assigning business:", error);
            toast.error("Error al asignar negocio");
        }
    };

    const handleToggleVisibility = async (id: string, current: boolean) => {
        try {
            await updateNegocio(id, { activo: !current });
            toast.success(`Visibilidad ${!current ? 'Activada' : 'Pausada'}`);
            // Also update local state to avoid full refresh if possible, or just refresh
            setAdminNegocios(prev => prev.map(n => n.id === id ? { ...n, activo: !current } : n));
            if (negocioData?.id === id) {
                setNegocioData(prev => prev ? { ...prev, activo: !current } : null);
            }
        } catch (error) {
            toast.error("Error al cambiar visibilidad");
        }
    };


    const renderOrderRow = (o: any) => (
        <OrderRow
            key={o.id_transaccion}
            orden={o}
            handleTogglePago={handleTogglePago}
            setSelectedOrder={setSelectedOrder}
            handleCambiarEstado={handleCambiarEstado}
            handleDeleteTransaccion={handleDeleteTransaccion}
            user={user}
        />
    );

    const PANEL_MAP: Record<string, () => React.ReactNode> = {
        dashboard: () => (
            <DashboardOverview
                user={user}
                metrics={metrics}
                loadingOrdenes={loadingOrdenes}
                ordenes={ordenes}
                renderOrderRow={renderOrderRow}
                setActiveTab={setActiveTab}
                handleCierreCaja={handleCierreCaja}
            />
        ),
        ordenes: () => (
            <OrdersPanel
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                timeFilter={timeFilter}
                setTimeFilter={setTimeFilter}
                customDate={customDate}
                setCustomDate={setCustomDate}
                ordenesFiltradas={ordenesFiltradas}
                filteredTotal={filteredTotal}
                handleTogglePago={handleTogglePago}
                setSelectedOrder={setSelectedOrder}
                handleCambiarEstado={handleCambiarEstado}
                handleDeleteTransaccion={handleDeleteTransaccion}
                handleDeleteManyTransacciones={handleDeleteManyTransacciones}
                user={user}
            />
        ),
        productos: () => (
            <ProductsPanel
                productos={productos}
                loadingProductos={loadingProductos}
                handleDeleteProducto={handleDeleteProducto}
                router={router}
                user={user}
                negocioData={managedBusinessData || negocioData}
                onStopManaging={managedBusinessId ? () => { setManagedBusinessId(null); setManagedBusinessData(null); } : undefined}
            />
        ),
        clientes: () => (
            <ClientsPanel
                clientesUnicos={clientesUnicos}
                ordenes={ordenes}
                loadingOrdenes={loadingOrdenes}
                user={user}
            />
        ),
        marketing: () => (
            <MarketingPanel
                user={user}
                loadingOrdenes={loadingOrdenes}
                clientesUnicos={clientesUnicos}
                ordenes={ordenes}
                bannerText={bannerText}
                setBannerText={setBannerText}
                handleUpdateBanner={handleUpdateBanner}
                isUpdatingBanner={isUpdatingBanner}
            />
        ),
        estadisticas: () => (
            <StatsPanel
                ordenes={ordenes}
                statsPeriod={statsPeriod}
                setStatsPeriod={setStatsPeriod}
                loadingOrdenes={loadingOrdenes}
            />
        ),
        configuracion: () => (
            <ConfigPanel
                user={user}
                loadingOrdenes={loadingOrdenes}
                isConfigEditing={isConfigEditing}
                setIsConfigEditing={setIsConfigEditing}
                configEditData={configEditData}
                setConfigEditData={setConfigEditData}
                handleSaveConfig={handleSaveConfig}
                isSavingConfig={isSavingConfig}
                handleLogout={handleLogout}
                router={router}
                negocioData={negocioData}
                onRefresh={refreshAdminData}
                handleToggleVisibility={handleToggleVisibility}
            />
        ),
        auditoria: () => (
            <ActivityLogPanel user={user} />
        ),
        admin_usuarios: () => (
            <AdminUsersPanel
                isLoadingAdmin={isLoadingAdmin}
                adminDueños={adminDueños}
                adminNegocios={adminNegocios}
                handleCrearNegocioParaUsuario={handleCrearNegocioParaUsuario}
                handleQuitarNegocio={handleQuitarNegocio}
                handleAsignarNegocioExistente={handleAsignarNegocioExistente}
                handleManageProducts={(n) => {
                    setManagedBusinessId(n.id);
                    setManagedBusinessData(n);
                    setActiveTab("productos");
                }}
                handleManageAcademy={(n) => {
                    setManagedBusinessId(n.id);
                    setManagedBusinessData(n);
                    setActiveTab("academy");
                }}
                router={router}
                onRefresh={refreshAdminData}
                handleToggleVisibility={handleToggleVisibility}
            />
        ),
        academy: () => (
            <EducationPanel
                productos={productos}
                negocio={managedBusinessData || negocioData}
                user={user}
                onStopManaging={managedBusinessId ? () => { setManagedBusinessId(null); setManagedBusinessData(null); } : undefined}
            />
        ),
    };

    const ALL_SIDEBAR_ITEMS = [...BASE_SIDEBAR_ITEMS, ...(user?.rol === "admin_clickcito" || user?.rol === "admin" ? ADMIN_SIDEBAR_ITEMS : [])];
    const tabLabel = ALL_SIDEBAR_ITEMS.find(i => i.id === activeTab)?.label || "Dashboard";

    return (
        <div className="flex min-h-screen bg-[#F8F8F8] dark:bg-[#0A0A0A] text-gray-900 dark:text-zinc-100">
            <Sidebar
                user={user}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setIsSidebarOpen={setIsSidebarOpen}
                isSidebarOpen={isSidebarOpen}
                metrics={metrics}
                handleLogout={handleLogout}
                router={router}
                loading={loading}
                negocio={negocioData}
            />

            {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />}

            <main className="flex-1 min-w-0 lg:ml-72 min-h-screen">
                <div className="max-w-[1200px] mx-auto p-4 md:p-8">
                    <div className="sticky top-0 z-40 bg-[#F8F8F8]/80 dark:bg-[#0A0A0A]/80 backdrop-blur-lg -mx-4 px-4 py-4 mb-6 md:-mx-8 md:px-8 md:py-6 md:mb-8 border-b border-gray-100 dark:border-zinc-800 lg:static lg:bg-transparent lg:backdrop-blur-none lg:border-none lg:p-0 lg:m-0 lg:mb-10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm active:scale-95 transition-all"><Menu size={20} /></button>
                            <div>
                                {loading ? (
                                    <div className="h-3 w-24 bg-gray-100 dark:bg-zinc-800 rounded-full animate-pulse mb-1" />
                                ) : (
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{user?.id_negocio || "Panel"}</p>
                                )}
                                <h1 className="text-xl md:text-3xl font-black tracking-tight">{tabLabel}</h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 relative">
                            <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 bg-white dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-800 hover:border-orange-500 transition-all active:scale-95">
                                <Bell size={18} className={showNotifications ? "text-orange-500" : "text-gray-500"} />
                                {metrics.pendientes > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />}
                            </button>

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
                                                            <p className="text-xs font-black truncate max-w-[120px]">{o.datos_logistica?.telefono_contacto || "Cliente"}</p>
                                                            <span className="text-[10px] font-bold text-gray-400">{o.estado === "pendiente" ? "Pendiente" : "Preparando"}</span>
                                                        </div>
                                                        <p className="text-[10px] text-gray-500 line-clamp-1 mb-2">{o.items?.map((i: any) => i.nombre_producto).join(", ")}</p>
                                                        <div className="flex gap-2">
                                                            <button onClick={(e) => { e.stopPropagation(); handleCambiarEstado(o.id_transaccion, o.estado === "pendiente" ? "en_preparacion" : "en_camino"); }} className="flex-1 py-1.5 bg-orange-600 text-white text-[10px] font-black rounded-lg hover:bg-orange-700 transition-colors">
                                                                {o.estado === "pendiente" ? "Aceptar" : "Despachar"}
                                                            </button>
                                                            <button onClick={() => { setSelectedOrder(o); setShowNotifications(false); }} className="px-2 py-1.5 bg-gray-100 dark:bg-zinc-800 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors">
                                                                <Eye size={12} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        <button onClick={() => { setActiveTab("ordenes"); setShowNotifications(false); }} className="w-full py-3 text-[10px] font-black text-gray-400 hover:text-orange-600 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all border-t border-gray-100 dark:border-zinc-800">Ver todas las órdenes</button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {PANEL_MAP[activeTab]?.() || PANEL_MAP.dashboard()}

                    <OrderModal
                        selectedOrder={selectedOrder}
                        setSelectedOrder={setSelectedOrder}
                        handlePrint={handlePrint}
                        handleShareWhatsApp={handleShareWhatsApp}
                        handleTogglePago={handleTogglePago}
                        handleCambiarEstado={handleCambiarEstado}
                    />
                </div>
            </main>
        </div>
    );
}
