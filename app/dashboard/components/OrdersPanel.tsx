"use client";

import React from "react";
import { Search, Receipt } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { OrderRow } from "./OrderRow";

export function OrdersPanel({
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    timeFilter,
    setTimeFilter,
    customDate,
    setCustomDate,
    ordenesFiltradas,
    filteredTotal,
    handleTogglePago,
    setSelectedOrder,
    handleCambiarEstado,
    handleDeleteTransaccion,
    handleDeleteManyTransacciones,
    user,
}: {
    searchTerm: string;
    setSearchTerm: (s: string) => void;
    statusFilter: string;
    setStatusFilter: (s: string) => void;
    timeFilter: string;
    setTimeFilter: (s: string) => void;
    customDate: string;
    setCustomDate: (s: string) => void;
    ordenesFiltradas: any[];
    filteredTotal: number;
    handleTogglePago: (o: any) => void;
    setSelectedOrder: (o: any) => void;
    handleCambiarEstado: (id: string, s: string) => void;
    handleDeleteTransaccion: (id: string, phone?: string, silent?: boolean) => void;
    handleDeleteManyTransacciones?: (ids: string[]) => void;
    user: any;
}) {
    const isAdmin = user?.rol === "admin_clickcito";

    const handleClearFiltered = async () => {
        if (!isAdmin || !handleDeleteManyTransacciones) return;
        if (!confirm(`ADVERTENCIA: Vas a borrar PERMANENTEMENTE las ${ordenesFiltradas.length} órdenes que estás viendo ahora mismo (${statusFilter === "todas" ? "TODAS" : statusFilter}).\n\n¿Estás absolutamente seguro?`)) return;

        const ids = ordenesFiltradas.map(o => o.id_transaccion);
        await handleDeleteManyTransacciones(ids);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Filters Bar */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-4 w-full">
                    {/* Search Field */}
                    <div className="relative group flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar orden por teléfono..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl pl-12 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-orange-500/20"
                        />
                    </div>

                    <div className="flex gap-2">
                        {/* Status Filter */}
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-orange-500/20 appearance-none min-w-[140px]"
                            >
                                <option value="todas">Todos los estados</option>
                                <option value="pendiente">Pendientes</option>
                                <option value="en_preparacion">En Preparación</option>
                                <option value="en_camino">En Camino</option>
                                <option value="entregado">Entregados</option>
                            </select>
                        </div>

                        {/* Time Filter */}
                        <div className="flex gap-1">
                            <select
                                value={timeFilter}
                                onChange={(e) => setTimeFilter(e.target.value)}
                                className="bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-orange-500/20 appearance-none min-w-[140px]"
                            >
                                <option value="todas">Histórico</option>
                                <option value="hoy">Hoy</option>
                                <option value="semana">Esta Semana</option>
                                <option value="mes">Este Mes</option>
                                <option value="año">Este Año</option>
                                <option value="personalizado">Fecha Específica...</option>
                            </select>
                            {timeFilter === "personalizado" && (
                                <input
                                    type="date"
                                    value={customDate}
                                    onChange={(e) => setCustomDate(e.target.value)}
                                    className="px-3 py-1.5 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl text-[10px] font-black focus:ring-0 mr-1"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary bar for filtered results */}
            <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-600/5 rounded-2xl border border-orange-100 dark:border-orange-600/20">
                <div className="flex items-center gap-3">
                    <Receipt className="text-orange-600" size={20} />
                    <div>
                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Resumen del Filtro</p>
                        <p className="text-xs text-orange-800 dark:text-orange-400 font-bold">
                            {ordenesFiltradas.length} órdenes encontradas
                        </p>
                    </div>
                </div>
                <div className="text-right flex items-center gap-4">
                    <p className="text-sm font-black text-orange-600">${filteredTotal.toLocaleString()}</p>
                    {isAdmin && ordenesFiltradas.length > 0 && (
                        <button
                            onClick={handleClearFiltered}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-red-100 dark:border-red-900/30"
                        >
                            Borrar Historial Filtrado
                        </button>
                    )}
                </div>
            </div>

            {/* List with Vertical Scroll */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar pb-10">
                {ordenesFiltradas.map(o => (
                    <OrderRow
                        key={o.id_transaccion}
                        orden={o}
                        handleTogglePago={handleTogglePago}
                        setSelectedOrder={setSelectedOrder}
                        handleCambiarEstado={handleCambiarEstado}
                        handleDeleteTransaccion={handleDeleteTransaccion}
                        user={user}
                    />
                ))}
                {ordenesFiltradas.length === 0 && (
                    <div className="py-20">
                        <EmptyState icon={Search} text="No hay órdenes que coincidan con los filtros" sub="Probá cambiando el estado o la fecha seleccionada." />
                    </div>
                )}
            </div>
        </div>
    );
}
