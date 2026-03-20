"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, MessageCircle, ChevronRight, CheckCircle2 } from "lucide-react";
import { RUBRO_CONFIG, Negocio } from "./types";

export function BusinessResultItem({ negocio, distancia }: { negocio: Negocio; distancia?: number }) {
    const config = RUBRO_CONFIG[negocio.rubro] || RUBRO_CONFIG.default;

    // Horarios logic
    let currentDayIndex = new Date().getDay();
    currentDayIndex = currentDayIndex === 0 ? 6 : currentDayIndex - 1;
    const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const todayKey = diasSemana[currentDayIndex];
    const todaysHours = negocio.horarios?.[todayKey] || "Cerrado";
    const isOpen = negocio.activo !== false && todaysHours !== "Cerrado";

    const ratingAvg = negocio.rating?.total_resenas && negocio.rating.total_resenas > 0
        ? Number(negocio.rating.promedio).toFixed(1)
        : null;

    const handleWhatsapp = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const telefono = negocio.telefono || "5493755000000";
        const text = encodeURIComponent(`Hola ${negocio.nombre}, vengo desde Clickcito!`);
        window.open(`https://wa.me/${telefono.replace(/\D/g, '')}?text=${text}`, '_blank');
    };

    return (
        <Link
            href={"/negocio/" + negocio.id}
            className="group block bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800/50 last:border-0 hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-all"
        >
            <div className="p-4 sm:p-5 flex gap-4 sm:gap-8 max-w-5xl mx-auto">
                {/* Image Section */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 overflow-hidden rounded-2xl bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-800 shadow-sm self-center">
                    {negocio.logo_url ? (
                        <Image
                            src={negocio.logo_url}
                            alt={negocio.nombre}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            unoptimized
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl sm:text-4xl select-none">
                            {config.emoji}
                        </div>
                    )}
                    {isOpen && (
                        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-green-500 text-white text-[9px] font-bold rounded-md shadow-sm">
                            ABIERTO
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                    {/* Details Column */}
                    <div className="flex-1 flex flex-col min-w-0">
                        <div className="flex flex-col mb-1.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <h3 className="text-[15px] sm:text-[18px] font-bold text-gray-900 dark:text-white leading-tight truncate">
                                    {negocio.nombre}
                                </h3>
                                {negocio.verificado && (
                                    <CheckCircle2 size={16} className="text-blue-500 shrink-0" fill="currentColor" />
                                )}
                            </div>
                            <span className="text-[11px] sm:text-[12px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                {config.label}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-0.5 text-amber-500">
                                <Star size={12} fill="currentColor" />
                                <span className="text-xs sm:text-sm font-bold">{ratingAvg || "5.0"}</span>
                            </div>
                            <span className="text-[11px] sm:text-xs text-gray-400 font-medium">
                                ({negocio.rating?.total_resenas || 0} opiniones)
                            </span>
                        </div>

                        <p className="hidden sm:block text-[13.5px] text-gray-500 dark:text-gray-400 line-clamp-2 max-w-xl mb-3 leading-relaxed">
                            {negocio.descripcion || "Explorá sus productos y hacé tu pedido online por WhatsApp."}
                        </p>

                        <div className="flex flex-wrap gap-1.5">
                            {negocio.categorias?.slice(0, 3).map((cat, i) => (
                                <span key={i} className="px-2 py-0.5 bg-gray-50 dark:bg-zinc-800/80 text-gray-500 dark:text-gray-400 rounded-md text-[10px] sm:text-[11px] border border-gray-100 dark:border-zinc-700/50">
                                    {cat}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Meta & Actions Column (Desktop split) */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 sm:min-w-[140px] sm:pl-6 sm:border-l sm:border-gray-50 dark:border-zinc-800">
                        <div className="flex flex-col items-start sm:items-end gap-1">
                            <div className="flex items-center gap-1 text-gray-500 dark:text-zinc-500">
                                <MapPin size={12} />
                                <span className="text-[11px] sm:text-xs font-medium">
                                    {negocio.ubicacion || "Misiones"}
                                </span>
                            </div>
                            {distancia !== undefined && (
                                <span className="text-[10px] sm:text-xs text-orange-600 font-bold bg-orange-50 dark:bg-orange-600/10 px-2 py-0.5 rounded-full">
                                    A {distancia.toFixed(1)} km
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleWhatsapp}
                                className="p-2 sm:px-4 sm:py-2 bg-green-500/10 text-green-600 dark:text-green-500 rounded-xl hover:bg-green-600 hover:text-white transition-all flex items-center gap-2 border border-green-500/20"
                            >
                                <MessageCircle size={17} />
                                <span className="hidden sm:inline text-[13px] font-bold text-current">Consultar</span>
                            </button>
                            <div className="p-2.5 bg-gray-100 dark:bg-zinc-800 text-gray-400 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-all shadow-sm">
                                <ChevronRight size={18} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
