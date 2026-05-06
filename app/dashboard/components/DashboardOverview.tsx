"use client";

import React, { useState } from "react";
import { DollarSign, ShoppingBag, Clock, Target, History, QrCode, Plus, ChevronRight, Printer, TrendingUp, Users, Star, Store } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { BusinessEditorModal } from "./BusinessEditorModal";

export function DashboardOverview({
    user,
    metrics,
    loadingOrdenes,
    ordenes,
    renderOrderRow,
    setActiveTab,
    handleCierreCaja,
    negocioData,
    onRefresh
}: {
    user: any;
    metrics: any;
    loadingOrdenes: boolean;
    ordenes: any[];
    renderOrderRow: (o: any) => React.ReactNode;
    setActiveTab: (tab: string) => void;
    handleCierreCaja: () => void;
    negocioData?: any;
    onRefresh?: () => void;
}) {
    const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
    if (loadingOrdenes) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-gray-100 dark:bg-zinc-800 rounded-3xl" />
                    ))}
                </div>
            </div>
        );
    }

    const now = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
    const pendingOrders = ordenes.filter(o => o.estado === "pendiente" || o.estado === "en_preparacion");
    const recentDelivered = ordenes.filter(o => o.estado === "entregado").slice(0, 3);
    const avgTicket = metrics.cantidadOrdenes > 0 ? metrics.totalVentas / metrics.cantidadOrdenes : 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header & Greeting */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-500">Clickcito — v2.0</span>
                        <div className="h-px w-8 bg-yellow-500/30" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
                        Hola, {user?.nombre?.split(' ')[0] || "Admin"}
                    </h2>
                    <p className="text-gray-500 font-medium text-sm capitalize mt-1">{now}</p>
                </div>

                <div className="flex items-center gap-2">
                    {metrics.pendientesHoy > 0 && (
                        <button
                            onClick={() => setActiveTab("ordenes")}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-500/10 rounded-2xl border border-orange-100 dark:border-orange-500/20 hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors"
                        >
                            <Clock size={14} className="text-orange-600" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">{metrics.pendientesHoy} pendiente{metrics.pendientesHoy > 1 ? 's' : ''}</span>
                        </button>
                    )}
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Online</span>
                    </div>
                </div>
            </div>

            {/* Primary Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Ventas Hoy", value: `$${metrics.ventasHoy.toLocaleString()}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
                    { label: "Pedidos Hoy", value: metrics.ordenesHoy, icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
                    { label: "Ticket Promedio", value: avgTicket > 0 ? `$${Math.round(avgTicket).toLocaleString()}` : "—", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
                    { label: "Total Recaudado", value: `$${metrics.totalVentas.toLocaleString()}`, icon: Target, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
                ].map((m, i) => (
                    <div key={i} className="group bg-white dark:bg-zinc-900 p-5 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${m.bg} ${m.color} shadow-inner group-hover:scale-110 transition-transform`}>
                                <m.icon size={20} />
                            </div>
                            {m.label === "Pedidos Hoy" && metrics.pendientesHoy > 0 && (
                                <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-ping" />
                            )}
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{m.label}</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter truncate">{m.value}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 mb-4">Acciones Rápidas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                        onClick={() => setActiveTab("productos")}
                        className="flex flex-col items-center gap-3 p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 hover:border-orange-200 dark:hover:border-orange-500/30 hover:shadow-md transition-all group"
                    >
                        <div className="p-3 bg-orange-50 dark:bg-orange-500/10 rounded-xl text-orange-600 group-hover:scale-110 transition-transform">
                            <Plus size={20} />
                        </div>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Nuevo Producto</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("marketing")}
                        className="flex flex-col items-center gap-3 p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-blue-500/30 hover:shadow-md transition-all group"
                    >
                        <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600 group-hover:scale-110 transition-transform">
                            <QrCode size={20} />
                        </div>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Menú Digital</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("clientes")}
                        className="flex flex-col items-center gap-3 p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:shadow-md transition-all group"
                    >
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600 group-hover:scale-110 transition-transform">
                            <Users size={20} />
                        </div>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Clientes</span>
                    </button>

                    <button
                        onClick={handleCierreCaja}
                        className="flex flex-col items-center gap-3 p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 hover:border-purple-200 dark:hover:border-purple-500/30 hover:shadow-md transition-all group"
                    >
                        <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-xl text-purple-600 group-hover:scale-110 transition-transform">
                            <Printer size={20} />
                        </div>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Cierre de Caja</span>
                    </button>

                    <button
                        onClick={() => setIsBusinessModalOpen(true)}
                        className="flex flex-col items-center gap-3 p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 hover:border-orange-200 dark:hover:border-orange-500/30 hover:shadow-md transition-all group"
                    >
                        <div className="p-3 bg-orange-50 dark:bg-orange-500/10 rounded-xl text-orange-600 group-hover:scale-110 transition-transform">
                            <Store size={20} />
                        </div>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Mi Negocio</span>
                    </button>
                </div>
            </div>

            {/* Recent Orders & Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                            <History size={16} className="text-gray-400" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">Últimos Pedidos</h3>
                        </div>
                        <button
                            onClick={() => setActiveTab("ordenes")}
                            className="text-[10px] font-black text-orange-600 uppercase tracking-widest hover:bg-orange-50 dark:hover:bg-orange-500/10 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
                        >
                            Ver Historial
                            <ChevronRight size={12} />
                        </button>
                    </div>
                    <div className="space-y-3">
                        {ordenes.slice(0, 4).map(o => renderOrderRow(o))}
                        {ordenes.length === 0 && <EmptyState icon={ShoppingBag} text="Aún no hay órdenes" />}
                    </div>
                </div>

                {/* Insights Sidebar */}
                <div className="space-y-4">
                    {/* Pending Orders */}
                    {pendingOrders.length > 0 && (
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <Clock size={16} className="text-orange-500" />
                                <h4 className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">Pendientes</h4>
                                <span className="ml-auto text-[10px] font-black bg-orange-100 dark:bg-orange-600/20 text-orange-600 px-2 py-0.5 rounded-full">{pendingOrders.length}</span>
                            </div>
                            <div className="space-y-2">
                                {pendingOrders.slice(0, 3).map(o => (
                                    <button
                                        key={o.id_transaccion}
                                        onClick={() => setActiveTab("ordenes")}
                                        className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-left"
                                    >
                                        <div className={`w-2 h-2 rounded-full shrink-0 ${o.estado === "pendiente" ? "bg-red-500" : "bg-yellow-500"}`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold truncate">{o.datos_logistica?.telefono_contacto || "Cliente"}</p>
                                            <p className="text-[10px] text-gray-400 truncate">{o.items?.map((i: any) => i.nombre_producto).join(", ")}</p>
                                        </div>
                                        <ChevronRight size={14} className="text-gray-300 shrink-0" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent Delivered */}
                    {recentDelivered.length > 0 && (
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <Star size={16} className="text-emerald-500" />
                                <h4 className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">Entregados Recientes</h4>
                            </div>
                            <div className="space-y-2">
                                {recentDelivered.map(o => (
                                    <div key={o.id_transaccion} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold truncate">#{o.id_transaccion.slice(0, 8)}</p>
                                            <p className="text-[10px] text-gray-400">
                                                ${o.items?.reduce((a: number, i: any) => a + i.precio_unitario * i.cantidad, 0).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Cierre de Caja Banner */}
            <div className="pt-4">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-[2.5rem] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-orange-600/20 relative overflow-hidden group">
                    <div className="relative z-10 text-center md:text-left space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                            Administración Diaria
                        </div>
                        <h3 className="text-3xl font-black tracking-tight leading-none">
                            Cierre de Caja
                        </h3>
                        <p className="text-orange-50 font-medium text-sm leading-relaxed max-w-sm opacity-90">
                            Generá un ticket con el resumen de todas las ventas entregadas y el total recaudado.
                        </p>
                    </div>

                    <div className="relative z-10 w-full md:w-auto flex flex-col items-center gap-4">
                        <div className="text-center md:text-right hidden md:block">
                            <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Total Hoy</p>
                            <p className="text-4xl font-black">${metrics.ventasHoy.toLocaleString()}</p>
                        </div>
                        <button
                            onClick={handleCierreCaja}
                            className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-white text-orange-600 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl whitespace-nowrap text-sm"
                        >
                            <Printer size={20} /> Generar Ticket
                        </button>
                    </div>

                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl opacity-50" />
                    </div>
                </div>

                <footer className="mt-12 text-center">
                    <p className="text-[10px] font-black text-gray-300 dark:text-zinc-800 uppercase tracking-[0.4em]">Clickcito Dashboard OS v2.0</p>
                </footer>
            </div>

            {isBusinessModalOpen && negocioData && user?.id_negocio && (
                <BusinessEditorModal
                    isOpen={isBusinessModalOpen}
                    onClose={() => setIsBusinessModalOpen(false)}
                    negocio={{ id: user.id_negocio, ...negocioData }}
                    onSuccess={onRefresh}
                />
            )}
        </div>
    );
}
