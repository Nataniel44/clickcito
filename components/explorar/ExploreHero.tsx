"use client";

import { Search, X, MapPin, Navigation, ArrowRight } from "lucide-react";
import { RUBRO_CONFIG } from "./types";
import { useState } from "react";

interface ExploreHeroProps {
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    activeRubro: string;
    setActiveRubro: (val: string) => void;
    onLocationClick?: () => void;
    isLocating?: boolean;
    onManualLocation?: (query: string) => void;
    locationName?: string;
}

export function ExploreHero({
    searchTerm,
    setSearchTerm,
    activeRubro,
    setActiveRubro,
    onLocationClick,
    isLocating,
    onManualLocation,
    locationName
}: ExploreHeroProps) {
    const [showManual, setShowManual] = useState(false);
    const [manualInput, setManualInput] = useState("");

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualInput.trim() && onManualLocation) {
            onManualLocation(manualInput);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mb-8 md:mb-12 px-2 sm:px-4 flex flex-col items-center">
            {/* Ubicación Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-full text-[10px] md:text-xs font-medium text-gray-600 dark:text-gray-300 mb-4 md:mb-6 shadow-sm">
                <span className={`w-2 h-2 rounded-full ${locationName ? 'bg-green-500' : 'bg-orange-600 animate-pulse'}`}></span>
                {locationName || "Misiones, Argentina"}
            </div>

            {/* Título y Subtítulo */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight leading-[1.1] md:leading-[1.15] mb-3 md:mb-4 text-center">
                Comprá en negocios<br className="sm:hidden" /><span className="text-orange-600"> cerca tuyo.</span>
            </h1>

            {/* Fila de Búsqueda */}
            <div className="w-full max-w-2xl px-2 sm:px-0 space-y-3 mb-6 md:mb-8">
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="¿Qué buscás? comida, ropa, talleres..."
                            className="w-full pl-11 pr-10 py-3 md:py-3.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl md:rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 text-gray-900 dark:text-white placeholder-gray-400 transition-all font-medium text-[14px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-gray-100 dark:bg-zinc-800 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors text-gray-500">
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    {!showManual ? (
                        <button
                            onClick={onLocationClick}
                            disabled={isLocating}
                            className="flex items-center justify-center gap-2 px-6 py-3 md:py-3.5 bg-orange-600 text-white rounded-xl md:rounded-2xl font-semibold text-[14px] hover:bg-orange-700 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-600/20 whitespace-nowrap"
                        >
                            {isLocating ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <MapPin size={16} />
                            )}
                            {isLocating ? "Buscando..." : "Cerca de mí"}
                        </button>
                    ) : (
                        <form onSubmit={handleManualSubmit} className="flex-1 flex gap-2">
                            <div className="relative flex-1 group">
                                <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={16} />
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="Ciudad o dirección..."
                                    className="w-full pl-11 pr-4 py-3 md:py-3.5 bg-white dark:bg-zinc-900 border border-orange-200 dark:border-orange-900/30 rounded-xl md:rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 text-gray-900 dark:text-white placeholder-gray-400 transition-all font-medium text-[14px]"
                                    value={manualInput}
                                    onChange={(e) => setManualInput(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="flex items-center justify-center p-3 md:p-3.5 bg-orange-600 text-white rounded-xl md:rounded-2xl font-semibold hover:bg-orange-700 active:scale-[0.98] transition-all shadow-lg shadow-orange-600/20"
                            >
                                <ArrowRight size={20} />
                            </button>
                        </form>
                    )}
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={() => setShowManual(!showManual)}
                        className="text-[11px] font-bold text-gray-400 hover:text-orange-500 transition-colors uppercase tracking-widest flex items-center gap-1.5"
                    >
                        {showManual ? "Quitar ubicación manual" : "¿No encontrás tu ubicación? Ponela a mano"}
                    </button>
                </div>
            </div>

            {/* Chips de Categorías - Scrollable on mobile */}
            <div className="w-full relative px-2 mb-8 md:mb-10">
                <div className="flex overflow-x-auto no-scrollbar sm:flex-wrap sm:justify-center gap-2 pb-2 -mx-2 px-2 scroll-smooth">
                    <button
                        onClick={() => setActiveRubro("todos")}
                        className={`flex items-center gap-1.5 px-4 md:px-5 py-2 md:py-2.5 rounded-full text-[13px] md:text-[14px] font-semibold transition-all whitespace-nowrap border ${activeRubro === "todos"
                            ? "bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-500/20 active:scale-95"
                            : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                            }`}
                    >
                        Todo
                    </button>
                    {Object.entries(RUBRO_CONFIG).filter(([k]) => k !== "default").map(([key, c]) => {
                        const emoji = key === "gastronomia" ? "🍽" : key === "retail" ? "👕" : key === "servicios" ? "✂️" : key === "construccion" ? "🔨" : "";
                        return (
                            <button
                                key={key}
                                onClick={() => setActiveRubro(key)}
                                className={`flex items-center gap-1.5 px-4 md:px-5 py-2 md:py-2.5 rounded-full text-[13px] md:text-[14px] font-semibold transition-all whitespace-nowrap border ${activeRubro === key
                                    ? "bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-500/20 active:scale-95"
                                    : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                                    }`}
                            >
                                {emoji && <span>{emoji}</span>}
                                {c.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center justify-center gap-y-4 gap-x-8 md:gap-x-12">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                    <span className="text-[18px] md:text-[22px] font-bold text-gray-900 dark:text-white leading-tight">120+</span>
                    <span className="text-[11px] md:text-[12px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">Negocios activos</span>
                </div>
                <div className="w-px h-8 bg-gray-200 dark:bg-zinc-800 hidden sm:block"></div>
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                    <span className="text-[18px] md:text-[22px] font-bold text-gray-900 dark:text-white leading-tight">Gratis</span>
                    <span className="text-[11px] md:text-[12px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">Sin comisiones</span>
                </div>
                <div className="w-px h-8 bg-gray-200 dark:bg-zinc-800 hidden sm:block"></div>
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                    <span className="text-[18px] md:text-[22px] font-bold text-gray-900 dark:text-white leading-tight">WhatsApp</span>
                    <span className="text-[11px] md:text-[12px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">Contacto directo</span>
                </div>
            </div>
        </div>
    );
}
