"use client";

import React from "react";
import { Users, Award, TrendingUp, Star, Phone, MapPin, CalendarClock, ShoppingBag, MessageCircle } from "lucide-react";
import { EmptyState } from "./EmptyState";

export function ClientsPanel({
    clientesUnicos,
    ordenes,
    loadingOrdenes,
    user
}: {
    clientesUnicos: any[];
    ordenes: any[];
    loadingOrdenes: boolean;
    user: any;
}) {
    if (typeof window === "undefined") return <></>;

    // 1. ENRIQUECIMIENTO Y ORDENAMIENTO DE DATOS
    const clientesEnriquecidos = [...clientesUnicos].map(c => {
        const susOrdenes = ordenes.filter(o => {
            const telOrden = o.datos_logistica?.telefono_contacto;
            return telOrden ? telOrden === c.tel : o.id_usuario === c.uid;
        });

        const ultimaOrden = susOrdenes.sort((a, b) => {
            const dateA = a.createdAt ? a.createdAt.seconds : 0;
            const dateB = b.createdAt ? b.createdAt.seconds : 0;
            return dateB - dateA;
        })[0];

        return {
            ...c,
            ticketPromedio: c.ordenes > 0 ? Math.round(c.total / c.ordenes) : 0,
            ultima_fecha: ultimaOrden?.createdAt ? new Date(ultimaOrden.createdAt.seconds * 1000).toLocaleDateString('es-AR') : 'Desconocida',
            isVIP: c.ordenes >= 3
        };
    }).sort((a, b) => b.total - a.total);

    const totalClientes = clientesEnriquecidos.length;
    const clientesVIP = clientesEnriquecidos.filter(c => c.isVIP).length;
    const totalHistorico = clientesEnriquecidos.reduce((acc, c) => acc + c.total, 0);

    if (loadingOrdenes) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 bg-gray-100 dark:bg-zinc-800 rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* --- CABECERA DE MÉTRICAS --- */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-bold text-gray-400 uppercase">Total Clientes</p>
                        <Users size={16} className="text-blue-500" />
                    </div>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">{totalClientes}</p>
                    <p className="text-[10px] text-gray-500 font-bold mt-1">Registrados en el sistema</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-600/10 dark:to-orange-600/5 rounded-2xl border border-orange-200 dark:border-orange-600/20 p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-bold text-orange-600/80 uppercase">Clientes VIP</p>
                        <Award size={16} className="text-orange-500" />
                    </div>
                    <p className="text-2xl font-black text-orange-600">{clientesVIP}</p>
                    <p className="text-[10px] text-orange-600/60 font-bold mt-1">Con 3 o más compras</p>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-bold text-gray-400 uppercase">Valor Histórico</p>
                        <TrendingUp size={16} className="text-emerald-500" />
                    </div>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">${totalHistorico.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-500 font-bold mt-1">Ingresos totales generados</p>
                </div>
            </div>

            {/* --- LISTADO DE CLIENTES --- */}
            {totalClientes === 0 ? (
                <EmptyState icon={Users} text="Aún no tenés clientes" sub="Cuando recibas tu primer pedido, aparecerán acá ordenados por compras." />
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {clientesEnriquecidos.map((c, i) => (
                        <div key={`client-${i}`} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-blue-100 dark:hover:border-zinc-700 transition-colors shadow-sm group">
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-inner
                                ${i === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30' :
                                        i === 1 ? 'bg-gray-200 text-gray-700 dark:bg-gray-800' :
                                            i === 2 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30' :
                                                'bg-blue-50 text-blue-600 dark:bg-blue-900/20'}`}>
                                    #{i + 1}
                                </div>
                                <div className="flex-1 min-w-0 sm:hidden">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm text-gray-900 dark:text-white">{c.tel}</span>
                                        {c.isVIP && <Star size={12} className="text-yellow-500 fill-yellow-500" />}
                                    </div>
                                    <p className="text-xs text-gray-500 truncate mt-1">{c.dir || 'Sin dirección registrada'}</p>
                                </div>
                            </div>

                            <div className="hidden sm:block flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <Phone size={14} className="text-gray-400" />
                                    <span className="font-bold text-base text-gray-900 dark:text-white">{c.tel}</span>
                                    {c.isVIP && (
                                        <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <Star size={10} className="fill-current" /> VIP
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                                    <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                                        <MapPin size={12} /> <span className="truncate">{c.dir || 'Sin dirección'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <CalendarClock size={12} /> Últ. vez: {c.ultima_fecha}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-gray-100 dark:border-zinc-800">
                                <div className="flex gap-6 text-right">
                                    <div className="hidden md:block">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Ticket Prom.</p>
                                        <p className="font-bold text-sm text-gray-600 dark:text-gray-300 flex items-center justify-end gap-1">
                                            <ShoppingBag size={12} /> ${c.ticketPromedio.toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Total Gastado</p>
                                        <p className="font-black text-base text-emerald-600 dark:text-emerald-500">${c.total.toLocaleString()}</p>
                                        <p className="text-[10px] font-bold text-gray-400">{c.ordenes} {c.ordenes === 1 ? "orden" : "órdenes"}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        const msg = `¡Hola! Nos comunicamos de ${user?.nombre_negocio || 'el local'}. ¡Gracias por elegirnos siempre!`;
                                        window.open(`https://wa.me/${c.tel.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
                                    }}
                                    className="p-3 sm:p-2.5 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/40 hover:scale-105 active:scale-95 transition-all shadow-sm"
                                    title="Escribir por WhatsApp"
                                >
                                    <MessageCircle size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
