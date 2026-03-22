"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { getAllNegocios } from "@/app/firebase/db";
import { Star, ShoppingBag } from "lucide-react";

// Componentes modularizados
import { RUBRO_CONFIG, Negocio } from "@/components/explorar/types";
import { BusinessCard } from "@/components/explorar/BusinessCard";
import { BusinessResultItem } from "@/components/explorar/BusinessResultItem";
import { SectionCarousel } from "@/components/explorar/SectionCarousel";
import { ExploreHero } from "@/components/explorar/ExploreHero";
import { PromoBanner } from "@/components/explorar/PromoBanner";
import { EmptyResults } from "@/components/explorar/EmptyResults";
import { FooterCTA } from "@/components/explorar/FooterCTA";

// Helper para distancia (KM)
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export default function ExplorarPage() {
    const [negocios, setNegocios] = useState<Negocio[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeRubro, setActiveRubro] = useState("todos");
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [isLocating, setIsLocating] = useState(false);

    useEffect(() => {
        async function fetchNegocios() {
            try {
                const data = await getAllNegocios();
                // "Sistema de recomendación" -> Barajar con semilla diaria para consistencia
                const today = new Date().toDateString();
                const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                const shuffled = [...data].sort((a, b) => {
                    const hashA = (a.id || "").split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + seed;
                    const hashB = (b.id || "").split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + seed;
                    return (hashA % 100) - (hashB % 100);
                }) as Negocio[];
                setNegocios(shuffled);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
                window.scrollTo({ top: 0, behavior: "instant" });
            }
        }
        fetchNegocios();
    }, []);

    const lastScrollY = useRef(0);
    const [showNavbar, setShowNavbar] = useState(true);
    const resultsRef = useRef<HTMLDivElement>(null);

    const isIdle = searchTerm === "" && activeRubro === "todos" && !userLocation;

    // Auto-scroll logic when filtering
    useEffect(() => {
        if ((searchTerm || activeRubro !== "todos" || userLocation) && !isIdle) {
            const timer = setTimeout(() => {
                const offset = 140; // Espacio para el Navbar + Sticky Header
                const elementPosition = resultsRef.current?.getBoundingClientRect().top;
                const offsetPosition = (elementPosition || 0) + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [activeRubro, searchTerm, isIdle, userLocation]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY < lastScrollY.current || currentScrollY < 10) {
                setShowNavbar(true);
            } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setShowNavbar(false);
            }
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleGetLocation = () => {
        if (!navigator.geolocation) return;
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserLocation({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                });
                setIsLocating(false);
                // Si detectamos ubicación, podemos resetear rubro o búsqueda para mostrar "Cerca de ti"
                // O simplemente dejar que el filtro actúe si hay coordenadas en los negocios
            },
            (err) => {
                console.error("Geolocation error:", err);
                setIsLocating(false);
            }
        );
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setActiveRubro("todos");
        setUserLocation(null);
    };

    const filtered = useMemo(() => {
        const result = negocios.filter((n) => {
            const nameSearch = n.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
            const descSearch = n.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
            const locSearch = n.ubicacion?.toLowerCase().includes(searchTerm.toLowerCase());
            const match = nameSearch || descSearch || locSearch;
            const rubroMatch = activeRubro === "todos" || n.rubro === activeRubro;
            return match && rubroMatch;
        }).map(n => {
            let distance: number | undefined;
            if (userLocation && n.coordenadas) {
                distance = getDistance(
                    userLocation.lat,
                    userLocation.lng,
                    n.coordenadas.lat,
                    n.coordenadas.lng
                );
            }
            return { ...n, distance };
        });

        if (userLocation) {
            return result.sort((a, b) => {
                if (a.distance !== undefined && b.distance !== undefined) {
                    return a.distance - b.distance;
                }
                if (a.distance !== undefined) return -1;
                if (b.distance !== undefined) return 1;
                return 0;
            });
        }
        return result;
    }, [negocios, searchTerm, activeRubro, userLocation]);

    // Agrupación por rubros
    const negociosPorRubro = useMemo(() => {
        const categories: Record<string, Negocio[]> = {};
        negocios.forEach(n => {
            const rubro = n.rubro || "default";
            if (!categories[rubro]) categories[rubro] = [];
            categories[rubro].push(n);
        });
        return categories;
    }, [negocios]);


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] dark:bg-[#060606]">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-20 h-20 bg-orange-100 dark:bg-zinc-900 rounded-[2.5rem] mb-6 flex items-center justify-center">
                        <ShoppingBag size={32} className="text-orange-500" />
                    </div>
                    <div className="h-2 w-32 bg-gray-100 dark:bg-zinc-900 rounded-full" />
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#060606] selection:bg-orange-100 selection:text-orange-600 pt-28 md:pt-28 pb-20">
            <div className="max-w-8xl mx-auto px-6">

                <ExploreHero
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    activeRubro={activeRubro}
                    setActiveRubro={setActiveRubro}
                    onLocationClick={handleGetLocation}
                    isLocating={isLocating}
                />

                {isIdle ? (
                    <div className="space-y-12 animate-fade-in">
                        {/* Recomendados */}
                        <SectionCarousel
                            title="Seleccionados para vos"
                            icon="✨"
                            subtitle="Los mejores negocios de la zona"
                            negocios={negocios.slice(0, 8)}
                        />

                        {/* Tendencias */}
                        {negocios.length > 3 && (
                            <SectionCarousel
                                title="En tendencia"
                                icon="🔥"
                                subtitle="Lo más elegido por la comunidad esta semana"
                                negocios={negocios.slice().reverse().slice(0, 8)}
                            />
                        )}

                        {/* Banner Promocional principal */}
                        <PromoBanner />

                        {/* Novedades */}
                        {negocios.length > 5 && (
                            <SectionCarousel
                                title="Nuevos ingresos"
                                icon="🚀"
                                subtitle="Descubrí las últimas propuestas en Clickcito"
                                negocios={negocios.slice(3, 10)}
                            />
                        )}

                        {/* Categorías Generales (Por rubros) */}
                        <div className="pt-4 border-t border-gray-100 dark:border-zinc-800/50">
                            <h3 className="text-xl font-bold px-4 mb-2">Explorá por rubro</h3>
                            <p className="text-sm text-gray-500 px-4 mb-6">Encontrá exactamente lo que buscás</p>
                            <div className="space-y-10">
                                {Object.entries(negociosPorRubro).map(([key, list]) => (
                                    <SectionCarousel
                                        key={key}
                                        title={RUBRO_CONFIG[key]?.label || key}
                                        icon={RUBRO_CONFIG[key]?.emoji || "📍"}
                                        negocios={list}
                                        subtitle={`Lo mejor en ${RUBRO_CONFIG[key]?.label.toLowerCase()}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Antojos de medianoche */}
                        {negocios.length > 4 && (
                            <SectionCarousel
                                title="Para cualquier antojo"
                                icon="🤤"
                                subtitle="Opciones que nunca fallan, a cualquier hora"
                                negocios={negocios.slice(1, 9)}
                            />
                        )}

                    </div>
                ) : (
                    <div ref={resultsRef} className="animate-fade-in max-w-5xl mx-auto">
                        <div className="flex flex-col gap-6">
                            {/* Sticky Search Header - Integrated with Navbar on Mobile */}
                            <div
                                className="sticky z-30 -mx-4 md:mx-0 px-4 py-3 md:py-4 bg-[#FDFDFD] dark:bg-[#060606] border-b border-gray-100 dark:border-zinc-800/80 shadow-sm md:shadow-none transition-all duration-500 ease-in-out"
                                style={{ top: showNavbar ? '68px' : '0px' }}
                            >
                                <div className="flex flex-col gap-2.5 max-w-5xl mx-auto">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-[12px] md:text-[14px] font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            {filtered.length} Resultados
                                            {searchTerm && <span className="text-orange-600 truncate max-w-[120px]">&quot;{searchTerm}&quot;</span>}
                                            {activeRubro !== "todos" && <span className="px-1 py-0.5 bg-orange-50 dark:bg-orange-600/10 text-orange-600 rounded text-[9px] uppercase tracking-tighter">{RUBRO_CONFIG[activeRubro]?.label}</span>}
                                        </h2>
                                        <button
                                            onClick={handleClearFilters}
                                            className="text-[10px] font-bold text-gray-400 hover:text-orange-600 transition-colors uppercase"
                                        >
                                            Limpiar
                                        </button>
                                    </div>

                                    {/* Category Search Filter - Compact horizontal scroll */}
                                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
                                        <button
                                            onClick={() => setActiveRubro("todos")}
                                            className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap shadow-sm border ${activeRubro === "todos"
                                                ? "bg-orange-600 text-white border-orange-600"
                                                : "bg-white dark:bg-zinc-900 text-gray-500 border-gray-100 dark:border-zinc-800"}`}
                                        >
                                            Todos
                                        </button>
                                        {Object.entries(RUBRO_CONFIG).filter(([k]) => k !== "default").map(([key, config]) => (
                                            <button
                                                key={key}
                                                onClick={() => setActiveRubro(key)}
                                                className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap shadow-sm border ${activeRubro === key
                                                    ? "bg-orange-600 text-white border-orange-600"
                                                    : "bg-white dark:bg-zinc-900 text-gray-500 border-gray-100 dark:border-zinc-800"}`}
                                            >
                                                {config.label}
                                            </button>
                                        ))}
                                        {/* Quick Filters */}
                                        <div className="w-[1px] h-4 bg-gray-100 dark:bg-zinc-800 shrink-0 mx-1" />
                                        <button className="px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl text-[11px] font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap hover:border-orange-500 transition-colors">
                                            Abiertos
                                        </button>
                                        {userLocation && (
                                            <div className="px-4 py-2 bg-green-500 text-white rounded-xl text-[11px] font-bold whitespace-nowrap flex items-center gap-1.5 shadow-md shadow-green-500/10">
                                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                                Cerca
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {filtered.length > 0 ? (
                                <div className="bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 rounded-2xl md:rounded-3xl overflow-hidden shadow-sm">
                                    <div className="flex flex-col">
                                        {filtered.map((n) => (
                                            <BusinessResultItem key={n.id} negocio={n} distancia={n.distance} />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <EmptyResults onClear={handleClearFilters} />
                            )}
                        </div>
                    </div>
                )}

                <FooterCTA />
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
