"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronDown, Grid } from "lucide-react";

type Subcategory = { id: number; name: string };
type Category = { id: number; name: string; slug: string; subcategories: Subcategory[] };

type Props = {
    categories: Category[];
    activeCategory: string | null;
    activeSubcategory: number | null;
    onSelectCategory: (slug: string) => void;
    onSelectSubcategory: (id: number | null) => void;
};

export const CategorySelector: React.FC<Props> = ({
    categories,
    activeCategory,
    activeSubcategory,
    onSelectCategory,
    onSelectSubcategory,
}) => {
    const categoryRef = useRef<HTMLDivElement | null>(null);
    const [showSubcategories, setShowSubcategories] = useState(false);
    const [topPosition, setTopPosition] = useState("top-20");

    // Detectar si el navbar está visible
    useEffect(() => {
        const updateTopPosition = () => {
            const navbarVisible = getComputedStyle(document.documentElement)
                .getPropertyValue('--navbar-visible');

            // Si el navbar está oculto, ajustar posición
            setTopPosition(navbarVisible === '0' ? 'top-0' : 'top-16');
        };

        // Observar cambios en la variable CSS
        const observer = new MutationObserver(updateTopPosition);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['style']
        });

        updateTopPosition();

        return () => observer.disconnect();
    }, []);

    if (!categories || categories.length === 0) {
        return <div className="text-center text-gray-500 py-6">No hay categorías disponibles.</div>;
    }

    const activeCat = categories.find((c) => c.slug === activeCategory);
    const hasSubcategories = activeCat && activeCat.subcategories?.length > 0;

    const scrollToCenter = (
        containerRef: React.RefObject<HTMLDivElement | null>,
        element: HTMLElement
    ) => {
        const container = containerRef.current;
        if (!container) return;
        const containerWidth = container.offsetWidth;
        const elementLeft = element.offsetLeft;
        const elementWidth = element.offsetWidth;
        const scrollPosition = elementLeft - containerWidth / 2 + elementWidth / 2;

        container.scrollTo({ left: scrollPosition, behavior: "smooth" });
    };

    return (
        <div className={`sticky ${topPosition} z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 shadow-md transition-all duration-300`}>
            <div className="max-w-7xl mx-auto px-3 py-3">
                {/* 🔹 Título UX/UI */}
                <div className="flex items-center gap-2 mb-2">
                    <Grid className="w-4 h-4 text-green-500 animate-pulse-slow" />
                    <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 tracking-wide">
                        Explorar categorías
                    </h2>
                </div>

                {/* Categorías */}
                <div
                    ref={categoryRef}
                    className="flex gap-2 p-2 overflow-x-auto scroll-smooth scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-transparent"

                >
                    {categories.map((cat) => {
                        const isActive = activeCategory === cat.slug;
                        return (
                            <button
                                key={cat.id}
                                onClick={(e) => {
                                    onSelectCategory(cat.slug);
                                    onSelectSubcategory(null);
                                    setShowSubcategories(false);
                                    scrollToCenter(categoryRef, e.currentTarget);
                                }}
                                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 active:scale-95 ${isActive
                                    ? "bg-green-500/90 text-white shadow-md shadow-green-500/30"
                                    : "bg-gray-100/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-700/80"
                                    }`}
                            >
                                {cat.name}
                                {cat.subcategories?.length > 0 && (
                                    <ChevronDown
                                        className={`w-3.5 h-3.5 transition-transform ${isActive && showSubcategories ? "rotate-180" : ""
                                            }`}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Subcategorías */}
                {hasSubcategories && (
                    <div className="mt-2 flex items-center gap-2">
                        <button
                            onClick={() => setShowSubcategories(!showSubcategories)}
                            className="text-xs text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 font-medium flex items-center gap-1 transition-colors"
                        >
                            {showSubcategories ? "Ocultar" : "Ver"} subcategorías
                            <ChevronDown
                                className={`w-3 h-3 transition-transform ${showSubcategories ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        <div
                            className={`transition-all overflow-hidden duration-300 ${showSubcategories ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
                                } flex gap-2 overflow-x-auto scrollbar-hide flex-1`}
                        >
                            {showSubcategories && (
                                <>
                                    <button
                                        onClick={() => onSelectSubcategory(null)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${activeSubcategory === null
                                            ? "bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/30"
                                            : "bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 text-gray-600 dark:text-gray-400"
                                            }`}
                                    >
                                        Todos
                                    </button>

                                    {activeCat.subcategories.map((sub) => (
                                        <button
                                            key={sub.id}
                                            onClick={() => onSelectSubcategory(sub.id)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${activeSubcategory === sub.id
                                                ? "bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/30"
                                                : "bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 text-gray-600 dark:text-gray-400"
                                                }`}
                                        >
                                            {sub.name}
                                        </button>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};