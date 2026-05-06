"use client";

import React from "react";
import { TrendingUp, Receipt, Clock, ShoppingBag, BarChart3, Calendar } from "lucide-react";
import { STATUS_CONFIG } from "./constants";
import { EmptyState } from "./EmptyState";

export function StatsPanel({
    ordenes,
    statsPeriod,
    setStatsPeriod,
    statsCustomDate,
    setStatsCustomDate,
    statsDateFrom,
    setStatsDateFrom,
    statsDateTo,
    setStatsDateTo,
    loadingOrdenes
}: {
    ordenes: any[];
    statsPeriod: string;
    setStatsPeriod: (s: string) => void;
    statsCustomDate: string;
    setStatsCustomDate: (s: string) => void;
    statsDateFrom: string;
    setStatsDateFrom: (s: string) => void;
    statsDateTo: string;
    setStatsDateTo: (s: string) => void;
    loadingOrdenes: boolean;
}) {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - (now.getDay() || 7) + 1);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const statsOrders = ordenes.filter(o => {
        if (!o.createdAt) return false;
        const orderDate = new Date(o.createdAt.seconds * 1000);
        
        if (statsPeriod === "hoy") {
            return orderDate >= startOfToday;
        } else if (statsPeriod === "ayer") {
            const yesterday = new Date(startOfToday);
            yesterday.setDate(yesterday.getDate() - 1);
            const endOfYesterday = new Date(yesterday);
            endOfYesterday.setDate(endOfYesterday.getDate() + 1);
            return orderDate >= yesterday && orderDate < endOfYesterday;
        } else if (statsPeriod === "7d") {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(now.getDate() - 7);
            return orderDate >= sevenDaysAgo;
        } else if (statsPeriod === "30d") {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(now.getDate() - 30);
            return orderDate >= thirtyDaysAgo;
        } else if (statsPeriod === "semana") {
            return orderDate >= startOfWeek;
        } else if (statsPeriod === "mes") {
            return orderDate >= startOfMonth;
        } else if (statsPeriod === "año") {
            return orderDate >= startOfYear;
        } else if (statsPeriod === "fecha" && statsCustomDate) {
            const [y, m, d] = statsCustomDate.split("-").map(Number);
            const selected = new Date(y, m - 1, d);
            const nextDay = new Date(y, m - 1, d + 1);
            return orderDate >= selected && orderDate < nextDay;
        } else if (statsPeriod === "rango" && statsDateFrom && statsDateTo) {
            const [yF, mF, dF] = statsDateFrom.split("-").map(Number);
            const [yT, mT, dT] = statsDateTo.split("-").map(Number);
            const from = new Date(yF, mF - 1, dF);
            const to = new Date(yT, mT - 1, dT + 1);
            return orderDate >= from && orderDate < to;
        }
        return true;
    });

    const byStatus = Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
        ...cfg,
        key,
        count: statsOrders.filter(o => o.estado === key).length
    }));

    const totalIngresos = statsOrders.reduce((a, o) => a + (o.items?.reduce((ia: number, i: any) => ia + i.precio_unitario * i.cantidad, 0) || 0), 0);
    const totalPagado = statsOrders.filter(o => o.pagado).reduce((a, o) => a + (o.items?.reduce((ia: number, i: any) => ia + i.precio_unitario * i.cantidad, 0) || 0), 0);
    const pendienteCobro = totalIngresos - totalPagado;
    const ticketPromedio = statsOrders.length > 0 ? Math.round(totalIngresos / statsOrders.length) : 0;

    const prodMap = new Map<string, { name: string; qty: number; revenue: number }>();
    statsOrders.forEach(o => o.items?.forEach((i: any) => {
        const key = i.nombre_producto || "Desconocido";
        const existing = prodMap.get(key) || { name: key, qty: 0, revenue: 0 };
        existing.qty += i.cantidad;
        existing.revenue += i.precio_unitario * i.cantidad;
        prodMap.set(key, existing);
    }));
    const topProducts = Array.from(prodMap.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    const ventasPorFechaMap = statsOrders.reduce((acc: any, o) => {
        const fechaObj = o.createdAt ? new Date(o.createdAt.seconds * 1000) : null;
        const fechaDate = fechaObj ? fechaObj.toLocaleDateString('es-AR') : 'Sin fecha';

        if (!acc[fechaDate]) acc[fechaDate] = { fecha: fechaDate, rawDate: fechaObj, cantidad: 0, total: 0 };
        acc[fechaDate].cantidad += 1;
        acc[fechaDate].total += (o.items?.reduce((ia: number, i: any) => ia + i.precio_unitario * i.cantidad, 0) || 0);
        return acc;
    }, {});

    const ultimosDias = Object.values(ventasPorFechaMap)
        .sort((a: any, b: any) => {
            if (!a.rawDate) return 1; if (!b.rawDate) return -1;
            return b.rawDate.getTime() - a.rawDate.getTime();
        });

    const ultimasOrdenes = [...statsOrders]
        .sort((a, b) => {
            const dateA = a.createdAt ? a.createdAt.seconds : 0;
            const dateB = b.createdAt ? b.createdAt.seconds : 0;
            return dateB - dateA;
        })
        .slice(0, 5);

    if (loadingOrdenes) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-gray-100 dark:bg-zinc-800 rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 p-1 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 w-fit">
                {[
                    { id: "hoy", label: "Hoy" },
                    { id: "ayer", label: "Ayer" },
                    { id: "7d", label: "7 días" },
                    { id: "30d", label: "30 días" },
                    { id: "semana", label: "Semana" },
                    { id: "mes", label: "Mes" },
                    { id: "año", label: "Año" },
                    { id: "fecha", label: "Día específico" },
                    { id: "rango", label: "Rango" },
                    { id: "todas", label: "Todo" },
                ].map(p => (
                    <button
                        key={p.id}
                        onClick={() => setStatsPeriod(p.id)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${statsPeriod === p.id ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
                    >
                        {p.label}
                    </button>
                ))}
            </div>
            
            {statsPeriod === "fecha" && (
                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        value={statsCustomDate}
                        onChange={(e) => setStatsCustomDate(e.target.value)}
                        className="px-4 py-2 rounded-xl text-sm border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                    />
                </div>
            )}
            
            {statsPeriod === "rango" && (
                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        value={statsDateFrom}
                        onChange={(e) => setStatsDateFrom(e.target.value)}
                        className="px-4 py-2 rounded-xl text-sm border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                        placeholder="Desde"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                        type="date"
                        value={statsDateTo}
                        onChange={(e) => setStatsDateTo(e.target.value)}
                        className="px-4 py-2 rounded-xl text-sm border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                        placeholder="Hasta"
                    />
                </div>
            )}
        </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-5 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase">Ventas Brutas</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">${totalIngresos.toLocaleString()}</p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-600/5 rounded-2xl border border-emerald-100 dark:border-emerald-600/20 p-5 shadow-sm">
                    <p className="text-xs font-bold text-emerald-600/60 uppercase">Cobrado Efec.</p>
                    <p className="text-2xl font-black text-emerald-600">${totalPagado.toLocaleString()}</p>
                </div>
                <div className="bg-red-50 dark:bg-red-600/5 rounded-2xl border border-red-100 dark:border-red-600/20 p-5 shadow-sm">
                    <p className="text-xs font-bold text-red-600/60 uppercase">Pendiente de Pago</p>
                    <p className="text-2xl font-black text-red-600">${pendienteCobro.toLocaleString()}</p>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-600/5 rounded-2xl border border-indigo-100 dark:border-indigo-600/20 p-5 shadow-sm">
                    <p className="text-xs font-bold text-indigo-600/60 uppercase">Ticket Promedio</p>
                    <p className="text-2xl font-black text-indigo-600">${ticketPromedio.toLocaleString()}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                        <BarChart3 size={20} className="text-orange-500" /> Desglose por Estado
                    </h3>
                    <div className="space-y-3">
                        {byStatus.map(s => {
                            const pct = ordenes.length > 0 ? Math.round((s.count / ordenes.length) * 100) : 0;
                            return (
                                <div key={s.key} className="bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 border p-4 rounded-2xl flex items-center gap-4">
                                    <div className={`p-2.5 rounded-xl ${s.color}`}><s.icon size={18} /></div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1.5 font-bold text-sm capitalize">{s.label} <span className="text-xs font-black text-gray-400">{s.count} ({pct}%)</span></div>
                                        <div className="h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                        <Calendar size={20} className="text-blue-500" /> Ventas por Día
                    </h3>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {ultimosDias.map((dia: any, i) => (
                            <div key={i} className="bg-white dark:bg-zinc-900 border p-4 rounded-2xl flex items-center justify-between border-gray-100 dark:border-zinc-800">
                                <div><p className="font-bold text-sm">{dia.fecha}</p><p className="text-xs text-gray-400">{dia.cantidad} órdenes</p></div>
                                <span className="font-black text-sm text-blue-600">${dia.total.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-black mb-4 flex items-center gap-2"><ShoppingBag size={20} className="text-orange-500" /> Top 5 Productos</h3>
                    <div className="space-y-3">
                        {topProducts.map((p, i) => (
                            <div key={p.name} className="bg-white dark:bg-zinc-900 border p-4 rounded-2xl border-gray-100 dark:border-zinc-800 flex items-center gap-4">
                                <span className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 font-black text-sm">{i + 1}</span>
                                <div className="flex-1 min-w-0"><p className="font-bold text-sm truncate">{p.name}</p><p className="text-xs text-gray-400">{p.qty} vendidos</p></div>
                                <span className="font-black text-sm">${p.revenue.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-black mb-4 flex items-center gap-2"><Clock size={20} className="text-purple-500" /> Últimas Órdenes</h3>
                    <div className="space-y-3">
                        {ultimasOrdenes.map((o: any, i) => (
                            <div key={o.id_transaccion || i} className="bg-white dark:bg-zinc-900 border p-4 rounded-2xl border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                                <div><p className="font-bold text-sm">Orden #{o.id_transaccion?.slice(0, 6)}</p><p className="text-xs text-gray-400">{o.estado}</p></div>
                                <div className="text-right">
                                    <span className="font-black text-sm block">${(o.items?.reduce((ia: number, it: any) => ia + it.precio_unitario * it.cantidad, 0) || 0).toLocaleString()}</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${o.pagado ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{o.pagado ? 'Pagado' : 'Pendiente'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
