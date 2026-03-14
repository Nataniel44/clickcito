"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import {
    Clock, PackageCheck, Send, CheckCircle2,
    ShoppingBag, Calendar, ArrowLeft, Package
} from "lucide-react";

export default function MisPedidosPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [ordenes, setOrdenes] = useState<any[]>([]);
    const [loadingOrdenes, setLoadingOrdenes] = useState(true);
    const [activeFilter, setActiveFilter] = useState("todas");

    // Protección: solo clientes logueados
    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    // Suscripción en tiempo real a las órdenes del cliente
    useEffect(() => {
        if (!user?.uid) return;

        const q = query(
            collection(db, "transacciones"),
            where("id_usuario", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id_transaccion: doc.id,
                ...doc.data()
            }));
            setOrdenes(data);
            setLoadingOrdenes(false);
        }, (error) => {
            console.error("Error cargando pedidos:", error);
            setLoadingOrdenes(false);
        });

        return () => unsubscribe();
    }, [user]);

    const ordenesFiltradas = ordenes.filter(o =>
        activeFilter === "todas" || o.estado === activeFilter
    );

    const statusConfig: any = {
        pendiente: { label: "Pendiente", color: "bg-amber-100 text-amber-800 dark:bg-amber-600/20 dark:text-amber-400", icon: <Clock size={16} />, step: 1 },
        en_preparacion: { label: "En Preparación", color: "bg-blue-100 text-blue-800 dark:bg-blue-600/20 dark:text-blue-400", icon: <PackageCheck size={16} />, step: 2 },
        en_camino: { label: "En Camino", color: "bg-purple-100 text-purple-800 dark:bg-purple-600/20 dark:text-purple-400", icon: <Send size={16} />, step: 3 },
        entregado: { label: "Entregado", color: "bg-green-100 text-green-800 dark:bg-green-600/20 dark:text-green-400", icon: <CheckCircle2 size={16} />, step: 4 },
    };

    if (loading || loadingOrdenes) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-500 font-bold">Cargando tus pedidos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0A0A0A] pt-24 pb-16 px-4 sm:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-500 hover:text-orange-600 font-bold text-sm mb-6 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Volver
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-600 rounded-2xl shadow-lg shadow-orange-600/20">
                            <Package className="text-white" size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                                Mis Pedidos
                            </h1>
                            <p className="text-gray-500 dark:text-zinc-400 font-medium mt-1">
                                {ordenes.length} {ordenes.length === 1 ? "pedido" : "pedidos"} en total
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="flex p-1 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-x-auto no-scrollbar mb-8">
                    {["todas", "pendiente", "en_preparacion", "en_camino", "entregado"].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold capitalize transition-all whitespace-nowrap ${activeFilter === filter
                                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                                : "text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800"
                                }`}
                        >
                            {filter === "todas" ? "Todos" : filter.replace("_", " ")}
                        </button>
                    ))}
                </div>

                {/* Lista de Pedidos */}
                {ordenesFiltradas.length === 0 ? (
                    <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-dashed border-gray-300 dark:border-zinc-800 p-16 text-center">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag size={40} className="text-gray-300 dark:text-zinc-600" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                            {activeFilter === "todas" ? "Aún no tenés pedidos" : "Sin pedidos en este estado"}
                        </h2>
                        <p className="text-gray-500 dark:text-zinc-400 mt-2 text-lg">
                            {activeFilter === "todas"
                                ? "Cuando hagas tu primera compra, aparecerá aquí."
                                : "Probá con otro filtro."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {ordenesFiltradas.map((orden) => {
                            const status = statusConfig[orden.estado] || statusConfig.pendiente;
                            const total = orden.items?.reduce((acc: number, item: any) => acc + (item.precio_unitario * item.cantidad), 0) || 0;
                            const fecha = orden.createdAt?.seconds
                                ? new Date(orden.createdAt.seconds * 1000)
                                : null;

                            return (
                                <div
                                    key={orden.id_transaccion}
                                    className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-lg transition-shadow"
                                >
                                    {/* Encabezado de la orden */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    Pedido #{orden.id_transaccion.slice(0, 8)}
                                                </span>
                                            </div>
                                            {fecha && (
                                                <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                                                    <Calendar size={14} />
                                                    {fecha.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
                                                    {" · "}
                                                    {fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                </div>
                                            )}
                                        </div>
                                        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider ${status.color}`}>
                                            {status.icon}
                                            {status.label}
                                        </div>
                                    </div>

                                    {/* Barra de progreso */}
                                    <div className="flex items-center gap-1 mb-6">
                                        {[1, 2, 3, 4].map((step) => (
                                            <div
                                                key={step}
                                                className={`h-1.5 flex-1 rounded-full transition-all ${step <= status.step
                                                        ? "bg-orange-500"
                                                        : "bg-gray-200 dark:bg-zinc-800"
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    {/* Items */}
                                    <div className="bg-gray-50/50 dark:bg-zinc-800/30 rounded-2xl p-4 space-y-3 mb-4">
                                        {orden.items?.map((item: any, i: number) => (
                                            <div key={i} className="flex justify-between items-center text-sm">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center justify-center w-7 h-7 bg-orange-100 dark:bg-orange-600/20 text-orange-600 rounded-lg text-xs font-black">
                                                        {item.cantidad}
                                                    </span>
                                                    <span className="font-bold text-gray-800 dark:text-zinc-200">
                                                        {item.nombre_producto}
                                                    </span>
                                                </div>
                                                <span className="text-gray-500 font-black font-mono">
                                                    ${(item.precio_unitario * item.cantidad).toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Notas y dirección */}
                                    {(orden.datos_logistica?.notas_cliente || orden.datos_logistica?.direccion_envio) && (
                                        <div className="space-y-2 mb-4">
                                            {orden.datos_logistica.direccion_envio && (
                                                <p className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
                                                    📍 {orden.datos_logistica.direccion_envio}
                                                </p>
                                            )}
                                            {orden.datos_logistica.notas_cliente && (
                                                <p className="text-xs text-orange-600 dark:text-orange-400 font-bold bg-orange-50 dark:bg-orange-600/5 p-2 rounded-xl">
                                                    💬 {orden.datos_logistica.notas_cliente}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Total */}
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-zinc-800">
                                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total</span>
                                        <span className="text-2xl font-black text-gray-900 dark:text-white">
                                            ${total.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
