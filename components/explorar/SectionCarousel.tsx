import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BusinessCard } from "./BusinessCard";
import { Negocio } from "./types";

interface SectionCarouselProps {
    title: string;
    icon: React.ElementType | string;
    negocios: Negocio[];
    subtitle?: string;
}

export function SectionCarousel({ title, icon: Icon, negocios, subtitle }: SectionCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const updateScrollState = useCallback(() => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 5);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }, []);

    useEffect(() => {
        const currentRef = scrollRef.current;
        if (currentRef) {
            updateScrollState();
            currentRef.addEventListener("scroll", updateScrollState, { passive: true });
            window.addEventListener("resize", updateScrollState);
        }
        return () => {
            currentRef?.removeEventListener("scroll", updateScrollState);
            window.removeEventListener("resize", updateScrollState);
        };
    }, [updateScrollState]);

    const scroll = useCallback((direction: "left" | "right") => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === "left" ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    }, []);

    if (negocios.length === 0) return null;

    return (
        <section className="mb-14 relative group px-2 sm:px-0">
            <div className="flex items-end justify-between mb-5 px-1 sm:px-0">
                <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-orange-50 dark:bg-orange-600/10 rounded-2xl text-orange-600 shadow-sm shadow-orange-500/5 min-w-[48px] h-[48px] flex items-center justify-center">
                        {typeof Icon === "string" ? (
                            <span className="text-xl leading-none" role="img" aria-label="icon">{Icon}</span>
                        ) : (
                            <Icon size={22} className="opacity-90" />
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">{title}</h2>
                        {subtitle && <p className="text-[13px] md:text-sm text-gray-500 font-medium mt-0.5">{subtitle}</p>}
                    </div>
                </div>

                <div className="hidden sm:flex gap-2">
                    <button
                        onClick={() => scroll("left")}
                        disabled={!canScrollLeft}
                        aria-label="Desplazar a la izquierda"
                        className={`p-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl transition-all shadow-sm ${!canScrollLeft ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-zinc-800 active:scale-95'}`}
                    >
                        <ChevronLeft size={18} className="text-gray-600 dark:text-zinc-400" />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        disabled={!canScrollRight}
                        aria-label="Desplazar a la derecha"
                        className={`p-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl transition-all shadow-sm ${!canScrollRight ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-zinc-800 active:scale-95'}`}
                    >
                        <ChevronRight size={18} className="text-gray-600 dark:text-zinc-400" />
                    </button>
                </div>
            </div>

            <div className="relative">
                {/* Fade Indicators for Mobile/Touch */}
                <div className={`absolute left-0 top-0 bottom-6 w-12 bg-gradient-to-r from-[#FDFDFD] dark:from-[#060606] to-transparent z-10 pointer-events-none sm:hidden transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />
                <div className={`absolute right-0 top-0 bottom-6 w-12 bg-gradient-to-l from-[#FDFDFD] dark:from-[#060606] to-transparent z-10 pointer-events-none sm:hidden transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />

                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto pb-6 pt-2 scroll-smooth no-scrollbar -mx-2 px-2 sm:mx-0 sm:px-0"
                >
                    {negocios.map((n) => (
                        <div key={n.id} className="min-w-[280px] sm:min-w-[280px] flex-shrink-0">
                            <BusinessCard negocio={n} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
