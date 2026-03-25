"use client";

import { MapPin, Share, Navigation, MessageCircle, Clock, Star, Truck, Package, Armchair } from "lucide-react";

interface BusinessDetailsSectionProps {
    negocio: any;
    isOpen: boolean;
    onShare: () => void;
    onMaps: () => void;
    onWhatsapp: () => void;
    diasSemana: { key: string; label: string }[];
    currentDayIndex: number;
}

export function BusinessDetailsSection({
    negocio,
    isOpen,
    onShare,
    onMaps,
    onWhatsapp,
    diasSemana,
    currentDayIndex
}: BusinessDetailsSectionProps) {
    const rating = negocio.rating || null;
    const logistica = negocio.configuracion_logistica || {};

    return (
        <div className="flex flex-col gap-4">
            {/* Info Section Label */}
            <div className="mt-8 mb-4 flex items-center px-1">
                <h2 className="text-[12px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={14} className="opacity-40" />
                    Conocenos más
                </h2>
            </div>

            {/* Action Buttons Row */}
            <div className="grid grid-cols-3 gap-2.5">
                <button onClick={onShare} className="flex flex-col items-center justify-center gap-1.5 py-4 px-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/70 rounded-2xl text-gray-500 dark:text-zinc-400 hover:border-gray-300 dark:hover:border-zinc-700 transition-all active:scale-95 shadow-sm">
                    <Share size={18} />
                    <span className="text-[10px] font-bold">Compartir</span>
                </button>
                <button onClick={onMaps} className="flex flex-col items-center justify-center gap-1.5 py-4 px-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/70 rounded-2xl text-gray-500 dark:text-zinc-400 hover:border-gray-300 dark:hover:border-zinc-700 transition-all active:scale-95 shadow-sm">
                    <Navigation size={18} />
                    <span className="text-[10px] font-bold">Ver Maps</span>
                </button>
                <button onClick={onWhatsapp} className="flex flex-col items-center justify-center gap-1.5 py-4 px-2 bg-green-50 dark:bg-green-500/10 border border-green-200/50 dark:border-green-500/20 rounded-2xl text-green-600 dark:text-green-500 hover:bg-green-100 dark:hover:bg-green-500/20 transition-all active:scale-95 shadow-sm">
                    <MessageCircle size={18} fill="currentColor" strokeWidth={0} />
                    <span className="text-[10px] font-bold">Chat WA</span>
                </button>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Horarios */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/70 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-50 dark:border-zinc-800">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-600/10 flex items-center justify-center">
                                <Clock size={14} className="text-orange-600" />
                            </div>
                            <span className="text-[13px] font-bold text-gray-900 dark:text-white">Horarios</span>
                        </div>
                        {negocio.activo !== false && (
                            <span className={`text-[10px] font-black flex items-center gap-1 px-2 py-0.5 rounded-full border ${isOpen ? 'text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-500/10 border-green-200/50 dark:border-green-500/20' : 'text-gray-500 bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700'}`}>
                                <span className={`w-1 h-1 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} /> {isOpen ? 'Abierto' : 'Cerrado'}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        {negocio.horarios ? diasSemana.map((dia, idx) => {
                            const horario = negocio.horarios[dia.key] || "Cerrado";
                            const isHoy = idx === currentDayIndex;
                            if (horario === "Cerrado" && !isHoy) return null;
                            return (
                                <div key={dia.key} className={`flex justify-between items-center px-2.5 py-1.5 rounded-lg ${isHoy ? "bg-orange-50 dark:bg-orange-600/10 border border-orange-100 dark:border-orange-600/20" : ""}`}>
                                    <span className={`text-[12px] font-medium ${isHoy ? "text-orange-700 dark:text-orange-400 font-bold" : "text-gray-500 dark:text-zinc-400"}`}>
                                        {isHoy ? `Hoy (${dia.label})` : dia.label}
                                    </span>
                                    <span className={`text-[12px] ${horario === "Cerrado" ? "text-gray-400" : "font-bold text-gray-900 dark:text-white"}`}>
                                        {horario}
                                    </span>
                                </div>
                            );
                        }) : (
                            <span className="text-[12px] text-gray-400 text-center py-2">Consultar disponibilidad</span>
                        )}
                    </div>
                </div>

                {/* Rating + Logística */}
                <div className="flex flex-col gap-3.5">
                    {/* Rating */}
                    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/70 rounded-2xl p-4 shadow-sm">
                        {rating && rating.total_resenas > 0 ? (
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col items-center shrink-0">
                                    <span className="text-[30px] font-black text-gray-900 dark:text-white leading-none">{Number(rating.promedio).toFixed(1)}</span>
                                    <div className="text-amber-400 text-[11px] tracking-widest mt-1">★★★★★</div>
                                    <span className="text-[10px] text-gray-400 mt-0.5">{rating.total_resenas} votos</span>
                                </div>
                                <div className="flex-1 flex flex-col gap-1">
                                    {(rating.distribucion || [100, 0, 0, 0, 0]).map((pct: number, i: number) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <span className="text-[9px] text-gray-400 w-2 text-right font-bold">{5 - i}</span>
                                            <div className="flex-1 h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-amber-400 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="text-[11px] font-black text-orange-600 bg-orange-50 dark:bg-orange-600/10 px-3 py-2 rounded-xl shrink-0 border border-orange-100 dark:border-orange-600/20 hover:bg-orange-100 transition-colors">
                                    + Reseña
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
                                    <Star size={22} className="text-amber-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-bold text-gray-900 dark:text-white">Sin reseñas aún</p>
                                    <p className="text-[11px] text-gray-400 mt-0.5">¡Sé el primero en opinar!</p>
                                </div>
                                <button className="text-[11px] font-black text-orange-600 bg-orange-50 dark:bg-orange-600/10 px-3 py-2 rounded-xl border border-orange-100 dark:border-orange-600/20 whitespace-nowrap hover:bg-orange-100 transition-colors">
                                    + Reseña
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Logística */}
                    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/70 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                        <div className={`flex items-center gap-3 ${logistica.delivery_habilitado === false ? 'opacity-40' : ''}`}>
                            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                                <Truck size={16} className="text-blue-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-bold text-gray-900 dark:text-white">
                                    {logistica.delivery_habilitado !== false ? 'Delivery disponible' : 'Sin delivery'}
                                </p>
                                {logistica.delivery_habilitado !== false && (
                                    <p className="text-[10px] text-gray-400 mt-0.5">
                                        {logistica.tiempo_aprox_delivery || 'Tiempo a consultar'}
                                        {logistica.precio_delivery ? ` · $${logistica.precio_delivery}` : ''}
                                    </p>
                                )}
                            </div>
                            {logistica.delivery_gratis_desde && (
                                <span className="text-[9px] font-black bg-green-50 dark:bg-green-500/10 text-green-600 border border-green-200/50 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                                    Gratis +${(logistica.delivery_gratis_desde / 1000).toFixed(0)}k
                                </span>
                            )}
                        </div>
                        <div className={`flex items-center gap-3 ${logistica.takeaway_habilitado === false ? 'opacity-40' : ''}`}>
                            <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center shrink-0">
                                <Package size={16} className="text-orange-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-bold text-gray-900 dark:text-white">
                                    {logistica.takeaway_habilitado !== false ? 'Retiro en local' : 'Sin retiro en local'}
                                </p>
                                {logistica.takeaway_habilitado !== false && logistica.direccion_retiro_local && (
                                    <p className="text-[10px] text-gray-400 mt-0.5 truncate">{logistica.direccion_retiro_local}</p>
                                )}
                            </div>
                        </div>
                        <div className="h-px bg-gray-50 dark:bg-zinc-800/80 w-full" />
                        <div className={`flex items-center gap-3 ${!logistica.mesa_habilitado ? 'opacity-40' : ''}`}>
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                                <Armchair size={16} className="text-emerald-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-bold text-gray-900 dark:text-white">
                                    {logistica.mesa_habilitado ? 'Pedido en Mesa' : 'Sin pedido en mesa'}
                                </p>
                                {logistica.mesa_habilitado && (
                                    <p className="text-[10px] text-gray-400 mt-0.5">Pedí desde tu mesa con el código QR</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
