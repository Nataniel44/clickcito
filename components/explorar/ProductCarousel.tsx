"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { getAllProductos } from "@/app/firebase/db";
import { getAllNegocios } from "@/app/firebase/db";
import { resolveImageUrl } from "@/app/utils/imageUtils";

interface Producto {
    id_producto: string;
    nombre_producto: string;
    precio_base: number;
    imagen?: string;
    imagen_url?: string;
    categoria_producto?: string;
    detalles_especificos?: {
        tipo?: string;
    };
    id_negocio: string;
    estado?: string;
}

interface Negocio {
    id: string;
    nombre: string;
    activo?: boolean;
    horarios?: Record<string, string>;
    abierto_siempre?: boolean;
}

export function ProductCarousel() {
    const [products, setProducts] = useState<(Producto & { negocioId: string; negocioNombre: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const carouselRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval>>(null);
    const resumeTimeout = useRef<ReturnType<typeof setTimeout>>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const [productosData, negociosData] = await Promise.all([
                    getAllProductos(),
                    getAllNegocios(),
                ]);

                const negociosMap = new Map<string, Negocio>();
                negociosData.forEach((n: Negocio) => negociosMap.set(n.id, n));

                const now = new Date();
                const days = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
                const currentDay = days[now.getDay()];
                const currentTime = now.getHours() * 60 + now.getMinutes();

                function isBusinessOpen(negocio: Negocio): boolean {
                    if (negocio.activo === false) return false;
                    if (negocio.abierto_siempre) return true;
                    if (!negocio.horarios) return true;

                    const range = negocio.horarios[currentDay];
                    if (!range || range === "Cerrado" || range.toLowerCase().includes("cerrado")) return false;

                    try {
                        const parts = range.split(/[-a]/);
                        if (parts.length !== 2) return true;
                        const [startStr, endStr] = parts.map((s: string) => s.trim());
                        const parseTime = (t: string) => {
                            const [h, m] = t.split(':').map(Number);
                            return h * 60 + m;
                        };
                        const start = parseTime(startStr);
                        let end = parseTime(endStr);
                        if (end < start) return currentTime >= start || currentTime <= end;
                        return currentTime >= start && currentTime <= end;
                    } catch {
                        return true;
                    }
                }

                const productosConNegocio = (productosData as Producto[])
                    .filter((p) => {
                        if (p.estado === "inactivo" || !p.id_negocio) return false;
                        const negocio = negociosMap.get(p.id_negocio);
                        if (!negocio) return false;
                        return isBusinessOpen(negocio);
                    })
                    .map((p) => {
                        const negocio = negociosMap.get(p.id_negocio);
                        return {
                            ...p,
                            negocioId: negocio?.id || p.id_negocio,
                            negocioNombre: negocio?.nombre || "Negocio",
                        };
                    });

                const shuffled = [...productosConNegocio].sort(() => Math.random() - 0.5);
                setProducts(shuffled);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const scrollToNext = useCallback(() => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        const firstCard = carousel.children[0] as HTMLElement;
        if (!firstCard) return;

        const itemWidth = firstCard.offsetWidth + (parseFloat(getComputedStyle(carousel).gap) || 0);
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;

        let nextScroll = carousel.scrollLeft + itemWidth;
        if (nextScroll > maxScroll - 5) {
            nextScroll = 0;
        }

        carousel.scrollTo({ left: nextScroll, behavior: "smooth" });
    }, []);

    const startAutoScroll = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            scrollToNext();
        }, 3500);
    }, [scrollToNext]);

    const stopAutoScroll = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    }, []);

    const pauseAndResume = useCallback(() => {
        stopAutoScroll();
        if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
        resumeTimeout.current = setTimeout(() => {
            startAutoScroll();
        }, 3000);
    }, [startAutoScroll, stopAutoScroll]);

    useEffect(() => {
        if (loading || products.length === 0) return;

        const container = containerRef.current;
        if (!container) return;

        startAutoScroll();

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    startAutoScroll();
                } else {
                    stopAutoScroll();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(container);

        container.addEventListener("pointerdown", pauseAndResume);
        container.addEventListener("touchstart", pauseAndResume, { passive: true });

        return () => {
            stopAutoScroll();
            observer.disconnect();
            container.removeEventListener("pointerdown", pauseAndResume);
            container.removeEventListener("touchstart", pauseAndResume);
            if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
        };
    }, [loading, products, startAutoScroll, stopAutoScroll, pauseAndResume]);

    if (loading) {
        return (
            <div ref={containerRef} className="w-full mb-8 md:mb-12">
                <div className="flex gap-4 md:gap-6 overflow-x-hidden">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex-shrink-0 w-44 sm:w-52 md:w-60">
                            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl overflow-hidden">
                                <div className="w-full aspect-square bg-gray-100 dark:bg-zinc-800 animate-pulse" />
                                <div className="p-3 md:p-4 space-y-3">
                                    <div className="h-4 bg-gray-100 dark:bg-zinc-800 rounded-lg animate-pulse w-3/4" />
                                    <div className="h-3 bg-gray-100 dark:bg-zinc-800 rounded-lg animate-pulse w-1/2" />
                                    <div className="h-5 bg-gray-100 dark:bg-zinc-800 rounded-lg animate-pulse w-1/3" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (products.length === 0) return null;

    const getCategoryEmoji = (categoria?: string, tipo?: string) => {
        const cat = (categoria || tipo || "").toLowerCase();
        if (cat.includes("comida") || cat.includes("pizza") || cat.includes("hamburguesa")) return "🍔";
        if (cat.includes("bebida") || cat.includes("jugo") || cat.includes("agua")) return "🥤";
        if (cat.includes("trag") || cat.includes("cocktail") || cat.includes("cerveza")) return "🍺";
        if (cat.includes("postre") || cat.includes("dulce") || cat.includes("helado")) return "🍰";
        if (cat.includes("ropa") || cat.includes("vestido") || cat.includes("camisa")) return "👕";
        if (cat.includes("tecnología") || cat.includes("electronica")) return "📱";
        if (cat.includes("servicio") || cat.includes("curso") || cat.includes("clase")) return "📚";
        if (cat.includes("salud") || cat.includes("belleza")) return "💆";
        return "🛍️";
    };

    return (
        <div ref={containerRef} className="w-full mb-8 md:mb-12">
            <div
                ref={carouselRef}
                className="flex gap-4 md:gap-6 overflow-x-auto cursor-grab snap-x snap-mandatory custom-scrollbar"
            >
                {products.map((prod) => {
                    const categoria = prod.categoria_producto || prod.detalles_especificos?.tipo || "Producto";
                    const imagen = prod.imagen || prod.imagen_url;
                    const emoji = getCategoryEmoji(prod.categoria_producto, prod.detalles_especificos?.tipo);
                    const negocioUrl = `/negocio/${prod.negocioId}`;

                    return (
                        <Link
                            key={prod.id_producto}
                            href={negocioUrl}
                            className="flex-shrink-0 w-44 sm:w-52 md:w-60 snap-center group"
                            tabIndex={-1}
                        >
                            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                <div className="relative w-full aspect-square bg-gray-50 dark:bg-zinc-800 overflow-hidden">
                                    {imagen ? (
                                        <img
                                            src={resolveImageUrl(imagen)}
                                            alt={prod.nombre_producto}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            loading="lazy"
                                            draggable={false}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl md:text-5xl">
                                            {emoji}
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-emerald-500/90 backdrop-blur-sm rounded-full text-[9px] md:text-[10px] font-bold text-white uppercase tracking-wider">
                                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                        Abierto
                                    </div>
                                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-[10px] md:text-[11px] font-bold text-white uppercase tracking-wider">
                                        {categoria}
                                    </div>
                                </div>
                                <div className="p-3 md:p-4">
                                    <h3 className="text-[13px] md:text-[15px] font-bold text-gray-900 dark:text-white truncate leading-tight">
                                        {prod.nombre_producto}
                                    </h3>
                                    <p className="text-[11px] md:text-[12px] text-gray-500 dark:text-zinc-400 mt-1 truncate">
                                        {prod.negocioNombre}
                                    </p>
                                    <p className="text-[16px] md:text-[18px] font-black text-orange-600 dark:text-orange-500 mt-2">
                                        ${Number(prod.precio_base).toLocaleString("es-AR")}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
