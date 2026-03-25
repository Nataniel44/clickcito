"use client";

import { ExternalLink, MapPin, Search } from "lucide-react";
import { OSMBusiness } from "@/app/utils/osm";

interface ExternalBusinessesProps {
    businesses: OSMBusiness[];
    loading: boolean;
    onSearchMore?: () => void;
}

export function ExternalBusinesses({ businesses, loading, onSearchMore }: ExternalBusinessesProps) {
    if (loading) {
        return (
            <div className="mt-16 animate-pulse px-4 border-t border-gray-100 dark:border-zinc-800 pt-16">
                <div className="h-6 w-48 bg-gray-200 dark:bg-zinc-800 rounded mb-4 mx-auto md:mx-0"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-100 dark:bg-zinc-900 rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (businesses.length === 0) {
        return (
            <div className="mt-16 text-center px-4 border-t border-gray-100 dark:border-zinc-800 pt-16 mb-20">
                <div className="inline-flex items-center justify-center p-4 bg-gray-50 dark:bg-zinc-900 rounded-2xl mb-4">
                    <MapPin className="text-gray-300" size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">No hay otros comercios detectados</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">
                    No encontramos negocios de Google Maps en el radio de esta ubicación.
                </p>
            </div>
        );
    }

    return (
        <div className="mt-16 border-t border-gray-100 dark:border-zinc-800 pt-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 text-center md:text-left">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 dark:bg-orange-950/20 text-orange-600 rounded-full text-[11px] font-semibold mb-3 tracking-wide uppercase">
                            Otros comercios
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Lugares cerca de tu ubicación
                        </h2>
                        <p className="text-[14px] text-gray-500 dark:text-gray-400 mt-1">
                            Estos negocios no están en Clickcito todavía, podés verlos en Google Maps.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {businesses.map((biz) => {
                        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(biz.name)}&query_place_id=${biz.id}`;
                        const isFood = biz.category === "gastronomia";

                        return (
                            <a
                                key={biz.id}
                                href={mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group p-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl flex flex-col justify-between hover:border-orange-500/20 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300"
                            >
                                <div>
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={`p-2 rounded-xl scale-90 -ml-1 ${isFood ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                                            {isFood ? '🍽' : '🛍'}
                                        </div>
                                        <ExternalLink size={14} className="text-gray-300 group-hover:text-orange-500 transition-colors" />
                                    </div>
                                    <h3 className="font-bold text-[15px] text-gray-900 dark:text-white line-clamp-1 mb-1">
                                        {biz.name}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                        <MapPin size={12} className="shrink-0" />
                                        <span className="capitalize">{biz.type.replace(/_/g, " ")}</span>
                                        {biz.address && <span className="text-gray-300 mx-1">•</span>}
                                        {biz.address && <span className="line-clamp-1">{biz.address}</span>}
                                    </div>
                                </div>

                                <button className="mt-4 w-full py-2 bg-gray-50 dark:bg-zinc-800 group-hover:bg-orange-500 group-hover:text-white text-gray-500 dark:text-gray-300 text-[12px] font-semibold rounded-lg transition-all flex items-center justify-center gap-2">
                                    Ver en Maps
                                </button>
                            </a>
                        );
                    })}
                </div>

                <div className="mt-10 flex justify-center">
                    <button onClick={() => window.open('https://www.google.com/maps', '_blank')} className="flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4">
                        <Search size={14} />
                        ¿No encontrás algo? Buscá en Google Maps
                    </button>
                </div>
            </div>
        </div>
    );
}
