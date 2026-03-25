"use client";

import Image from "next/image";
import Link from "next/link";
import { RUBRO_CONFIG, Negocio } from "./types";
import { resolveImageUrl } from "@/app/utils/imageUtils";
import { useState } from "react";

export function BusinessCard({ negocio }: { negocio: Negocio }) {
    const [loadingImage, setLoadingImage] = useState(true);
    const config = RUBRO_CONFIG[negocio.rubro] || RUBRO_CONFIG.default;

    // Improved Logic for "isOpen" with time parsing
    const ahora = new Date();
    const currentDayIndex = ahora.getDay() === 0 ? 6 : ahora.getDay() - 1;
    const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const todayKey = diasSemana[currentDayIndex];
    const todaysHours = negocio.horarios?.[todayKey] || "Cerrado";

    const isBusinessCurrentlyOpen = () => {
        if (negocio.activo === false || todaysHours === "Cerrado") return false;

        const currentTime = ahora.getHours() * 60 + ahora.getMinutes();

        // Formatos soportados: "20:00 - 00:00", "11:00 - 15:00, 20:00 - 00:00", "11:00 a 15:00"
        const spans = todaysHours.split(',').map(s => s.trim());

        for (const span of spans) {
            const times = span.split(/[-a]/).map(t => t.trim());
            if (times.length < 2) continue;

            const [startH, startM] = times[0].split(':').map(Number);
            let [endH, endM] = times[1].split(':').map(Number);

            if (isNaN(startH) || isNaN(endH)) continue;

            const startTotal = startH * 60 + (startM || 0);
            let endTotal = endH * 60 + (endM || 0);

            // Handle midnight (00:00 is technically 1440 mins)
            if (endTotal <= startTotal) endTotal += 1440;

            if (currentTime >= startTotal && currentTime < endTotal) return true;
        }
        return false;
    };

    const isOpen = isBusinessCurrentlyOpen();
    const isNew = negocio.createdAt ? (Date.now() - negocio.createdAt.toMillis?.() < 30 * 24 * 60 * 60 * 1000) : true;
    const realRating = negocio.rating || null;
    const ratingAvg = realRating?.total_resenas && realRating.total_resenas > 0 ? Number(realRating.promedio).toFixed(1) : null;

    // Tags por defecto basados en el rubro
    const defaultTags = config.label === "Gastronomía" ? ["🍕 Pizzas", "🥟 Empanadas", "🍝 Pastas"]
        : config.label === "Moda y Tiendas" ? ["👗 Ropa", "👕 Remeras"]
            : config.label === "Servicios" ? ["✂️ Cortes", "💇 Coloración"]
                : ["🚀 Destacado"];
    const tags = negocio.categorias || defaultTags;

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
            className={`group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-[1.25rem] p-3 md:p-3.5 flex flex-col gap-2 md:gap-2.5 cursor-pointer transition-all hover:border-gray-300 dark:hover:border-zinc-700 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-zinc-900/50 ${!isOpen ? "opacity-75" : ""}`}
        >
            {/* Top row */}
            <div className="flex items-start gap-2 md:gap-2.5">
                <div className="w-[40px] h-[40px] md:w-[46px] md:h-[46px] rounded-xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center shrink-0 relative text-xl">
                    {negocio.logo_url ? (
                        <>
                            {loadingImage && (
                                <div className="absolute inset-0 bg-gray-100 dark:bg-zinc-800 animate-pulse z-10" />
                            )}
                            <Image
                                src={resolveImageUrl(negocio.logo_url)}
                                alt={negocio.nombre}
                                width={46}
                                height={46}
                                className={`w-full h-full object-cover rounded-xl transition-all duration-700 ${loadingImage ? 'opacity-0 scale-105 blur-sm' : 'opacity-100 scale-100 blur-0'}`}
                                unoptimized
                                onLoad={() => setLoadingImage(false)}
                                onError={() => setLoadingImage(false)}
                            />
                        </>
                    ) : (
                        <span className="leading-none text-lg md:text-xl">{config.emoji}</span>
                    )}
                    {isOpen && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full" />
                    )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col pt-0.5">
                    <div className="text-[13px] md:text-[14px] font-semibold text-gray-900 dark:text-white leading-[1.2] flex items-center gap-1.5 truncate">
                        <span className="truncate">{negocio.nombre}</span>
                        {isNew && <span className="bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-300 text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0">Nuevo</span>}
                    </div>
                    <div className="inline-flex items-center gap-1 text-[9px] md:text-[10px] font-medium text-gray-400 dark:text-gray-500 mt-1 self-start truncate max-w-full">
                        {config.label}
                    </div>
                </div>
            </div>

            {/* Rating row */}
            <div className="flex items-center gap-1 text-[10px] md:text-[11px] font-medium text-gray-600 dark:text-gray-300">
                <span className={`text-[10px] md:text-[11px] tracking-tight md:tracking-widest ${ratingAvg ? "text-amber-500" : "text-gray-300 dark:text-zinc-600"}`}>★★★★★</span>
                {ratingAvg ? (
                    <span className="ml-0.5 font-bold">{ratingAvg}</span>
                ) : (
                    <span className="ml-0.5 text-gray-400 font-normal">Sin reseñas</span>
                )}
            </div>

            {/* Desc - Hidden or reduced on small mobile */}
            <p className="text-[11px] md:text-[12px] text-gray-500 dark:text-gray-400 leading-[1.5] line-clamp-2 min-h-[33px] md:min-h-[36px]">
                {negocio.descripcion || "Ingresá para ver sus productos."}
            </p>

            {/* Tags array - Only first 2 for mobile */}
            {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-0.5 overflow-hidden">
                    {tags.slice(0, 3).map((tag: string, i: number) => (
                        <span key={i} className={`text-[9px] md:text-[10px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-zinc-800 px-2 py-0.5 rounded-md border border-gray-100 dark:border-zinc-700/50 ${i > 1 ? 'hidden md:inline' : ''}`}>
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Meta Row (Location & Status) */}
            <div className="flex items-center gap-1 text-[10px] md:text-[11px] text-gray-400 dark:text-zinc-500 mt-0.5">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <span className="truncate">{negocio.ubicacion || "Misiones"}</span>
                <span className="w-[3px] h-[3px] rounded-full bg-gray-300 dark:bg-zinc-700 shrink-0 mx-0.5" />
                {isOpen ? (
                    <span className="text-green-600 dark:text-green-500 font-semibold truncate">Abierto</span>
                ) : (
                    <span className="text-red-500 dark:text-red-500/80 font-semibold truncate">Cerrado</span>
                )}
            </div>

            {/* Action Row */}
            <div className="flex items-center gap-1.5 mt-auto pt-1">
                <div className="flex-1 py-1.5 md:py-2 border border-blue-500/10 dark:border-zinc-700/80 rounded-[8px] md:rounded-[10px] text-[11px] md:text-[12px] font-semibold text-orange-600 dark:text-orange-500 bg-orange-50/50 dark:bg-orange-500/5 flex items-center justify-center gap-1 transition-all group-hover:bg-[#D85A30] group-hover:text-white group-hover:border-[#D85A30]">
                    Entrar
                </div>
                <button onClick={handleWhatsapp} className="py-1.5 md:py-2 px-2 md:px-2.5 flex items-center justify-center gap-1.5 bg-green-50 dark:bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-500 rounded-[8px] md:rounded-[10px] hover:bg-green-100 transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                </button>
            </div>
        </Link>
    );
}
