"use client";

import { ExternalLink, MapPin } from "lucide-react";
import { OSMBusiness } from "@/app/utils/osm";
import { RUBRO_CONFIG } from "./types";

export function ExternalBusinessCard({ business }: { business: OSMBusiness }) {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.name)}&query_place_id=${business.id}`;

    // Mapear categoría interna para obtener el icono/color
    const config = RUBRO_CONFIG[business.category] || RUBRO_CONFIG.default;

    return (
        <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-[1.25rem] p-3 md:p-3.5 flex flex-col gap-2 md:gap-2.5 transition-all hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/5"
        >
            {/* Top row */}
            <div className="flex items-start gap-2 md:gap-2.5">
                <div className="w-[40px] h-[40px] md:w-[46px] md:h-[46px] rounded-xl bg-orange-50 dark:bg-orange-600/10 flex items-center justify-center shrink-0 relative text-xl">
                    <span className="leading-none text-lg md:text-xl">{config.emoji}</span>
                    <div className="absolute -top-1 -right-1 p-0.5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-full">
                        <div className="bg-blue-500 w-2 h-2 rounded-full" />
                    </div>
                </div>
                <div className="flex-1 min-w-0 flex flex-col pt-0.5">
                    <div className="text-[13px] md:text-[14px] font-semibold text-gray-900 dark:text-white leading-[1.2] flex items-center gap-1.5 truncate">
                        <span className="truncate">{business.name}</span>
                        <span className="bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-300 text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0">Maps</span>
                    </div>
                    <div className="inline-flex items-center gap-1 text-[9px] md:text-[10px] font-medium text-gray-400 dark:text-gray-500 mt-1 self-start truncate max-w-full">
                        {business.type.replace(/_/g, " ")}
                    </div>
                </div>
            </div>

            {/* Middle Row (Address) */}
            <div className="flex items-center gap-1.5 text-[11px] md:text-[12px] text-gray-500 dark:text-gray-400 mt-1">
                <MapPin size={10} className="shrink-0 text-gray-400" />
                <span className="truncate">{business.address || "Dirección no disponible"}</span>
            </div>

            {/* Info Badge */}
            <div className="mt-2 py-1.5 px-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                Disponible en Google Maps. No podés pedir por Clickcito todavía.
            </div>

            {/* Action Row */}
            <div className="flex items-center gap-1.5 mt-auto pt-2">
                <div className="flex-1 py-1.5 md:py-2 border border-gray-200 dark:border-zinc-800 rounded-[8px] md:rounded-[10px] text-[11px] md:text-[12px] font-semibold text-gray-600 dark:text-gray-300 bg-gray-50/50 dark:bg-gray-800/20 flex items-center justify-center gap-1.5 transition-all group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500">
                    Ver en Maps
                    <ExternalLink size={12} />
                </div>
            </div>
        </a>
    );
}
