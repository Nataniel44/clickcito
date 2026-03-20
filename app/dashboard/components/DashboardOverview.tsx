"use client";

import React from "react";
import { DollarSign, ShoppingBag, Clock, Target, History, QrCode, Plus, ChevronRight, RefreshCcw, Printer } from "lucide-react";
import { EmptyState } from "./EmptyState";

export function DashboardOverview({
    user,
    metrics,
    loadingOrdenes,
    ordenes,
    renderOrderRow,
    setActiveTab,
    handleCierreCaja
}: {
    user: any;
    metrics: any;
    loadingOrdenes: boolean;
    ordenes: any[];
    renderOrderRow: (o: any) => React.ReactNode;
    setActiveTab: (tab: string) => void;
    handleCierreCaja: () => void;
}) {
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

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-10">
            {/* 1. Header & Quick Greeting */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600">Overview</span>
                        <div className="h-px w-8 bg-orange-600/30" />
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">
                        Hola, {user?.nombre?.split(' ')[0] || "Admin"}
                    </h2>
                    <p className="text-gray-500 font-bold text-sm capitalize mt-1 opacity-70">{now}</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Online</span>
                    </div>
                </div>
            </div>

            {/* 2. Primary Metrics (Widget Style) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Ventas Hoy", value: `$${metrics.ventasHoy.toLocaleString()}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10", trend: "+12%" },
                    { label: "Pedidos Hoy", value: metrics.ordenesHoy, icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10", trend: "Normal" },
                    { label: "Pendientes", value: metrics.pendientesHoy, icon: Clock, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10", alert: metrics.pendientesHoy > 0 },
                    { label: "Total Recaudado", value: `$${metrics.totalVentas.toLocaleString()}`, icon: Target, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10", trend: "Histórico" },
                ].map((m, i) => (
                    <div key={i} className="group bg-white dark:bg-zinc-900 p-5 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${m.bg} ${m.color} shadow-inner group-hover:scale-110 transition-transform`}><m.icon size={20} /></div>
                            {m.alert ? (
                                <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-ping" />
                            ) : (
                                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{m.trend}</span>
                            )}
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{m.label}</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter truncate">{m.value}</p>
                    </div>
                ))}
            </div>

            {/* 3. Recent Orders & Quick Management */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                            <History size={16} className="text-gray-400" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">Últimos Pedidos</h3>
                        </div>
                        <button onClick={() => setActiveTab("ordenes")} className="text-[10px] font-black text-orange-600 uppercase tracking-widest hover:bg-orange-50 dark:hover:bg-orange-500/10 px-3 py-1.5 rounded-lg transition-all">Ver Historial</button>
                    </div>
                    <div className="space-y-3">
                        {ordenes.slice(0, 4).map(o => renderOrderRow(o))}
                        {ordenes.length === 0 && <EmptyState icon={ShoppingBag} text="Aún no hay órdenes" />}
                    </div>
                </div>

                {/* 4. Secondary App Widgets (Marketing/QR) */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="p-4 bg-blue-50 dark:bg-blue-600/10 text-blue-600 rounded-3xl w-fit mb-6 shadow-inner">
                                <QrCode size={32} strokeWidth={2.5} />
                            </div>
                            <h4 className="text-xl font-black mb-2 text-gray-900 dark:text-white tracking-tight">Tu Menú Digital</h4>
                            <p className="text-xs text-gray-400 font-medium leading-relaxed mb-6">Compartí tu catálogo con un click o descargá el código QR para tu local.</p>
                            <button
                                onClick={() => setActiveTab("marketing")}
                                className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-black text-xs rounded-2xl hover:bg-orange-600 dark:hover:bg-orange-500 dark:hover:text-white transition-all shadow-lg active:scale-95"
                            >
                                Abrir Marketing
                            </button>
                        </div>
                        {/* Accent Decoration */}
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
                    </div>

                    <div onClick={() => setActiveTab("productos")} className="bg-zinc-900 dark:bg-white rounded-[2.5rem] p-6 text-white dark:text-black flex items-center justify-between group cursor-pointer hover:scale-[1.02] transition-transform">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-zinc-800 dark:bg-gray-100 rounded-2xl"><Plus size={20} className="text-orange-500" /></div>
                            <div>
                                <p className="font-black text-sm">Nuevo Producto</p>
                                <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest">Añadir al catálogo</p>
                            </div>
                        </div>
                        <ChevronRight size={20} className="opacity-30 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>

            {/* 5. Cierre de Caja (At the bottom, App Dashboard Footer Style) */}
            <div className="pt-8 border-t border-gray-100 dark:border-zinc-900">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-[2.5rem] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-orange-600/20 relative overflow-hidden group">
                    <div className="relative z-10 text-center md:text-left space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                            <RefreshCcw size={12} className="group-hover:rotate-180 transition-transform duration-1000" /> Administración Diaria
                        </div>
                        <h3 className="text-3xl font-black tracking-tight leading-none">
                            Cierre de Caja Diaria
                        </h3>
                        <p className="text-orange-50 font-medium text-sm leading-relaxed max-w-sm opacity-90">
                            Al finalizar tu jornada, generá un ticket con el resumen de todas las ventas entregadas y el total recaudado.
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
                            <Printer size={20} /> Generar Ticket de Cierre
                        </button>
                    </div>

                    {/* Decoración Estilo App */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl opacity-50" />
                    </div>
                </div>

                <footer className="mt-12 text-center">
                    <p className="text-[10px] font-black text-gray-300 dark:text-zinc-800 uppercase tracking-[0.4em]">Clickcito Dashboard OS v2.0</p>
                </footer>
            </div>
        </div>
    );
}
