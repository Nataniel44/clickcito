"use client";

import { ShoppingBag, MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { ProductCard } from "./ProductCard";

interface ProductListSectionProps {
    productos: any[];
    productosPorTipo: Record<string, any[]>;
    categoriasOrdenadas: string[];
    activeCategory: string;
    isNavbarVisible: boolean;
    accent: string;
    emoji: string;
    isOpen: boolean;
    purchasedProducts: Record<string, any>;
    cart: any[];
    negocio: any;
    onAddProduct: (prod: any, qty: number) => void;
    onOpenDetail: (prod: any) => void;
    onScrollToCategory: (tipo: string) => void;
    categoryNavRef: React.RefObject<HTMLDivElement | null>;
    categoryRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}

export function ProductListSection({
    productos,
    productosPorTipo,
    categoriasOrdenadas,
    activeCategory,
    isNavbarVisible,
    accent,
    emoji,
    isOpen,
    purchasedProducts,
    cart,
    negocio,
    onAddProduct,
    onOpenDetail,
    onScrollToCategory,
    categoryNavRef,
    categoryRefs
}: ProductListSectionProps) {
    // Auto-scroll the category nav to center the active category
    useEffect(() => {
        if (!activeCategory || !categoryNavRef.current) return;

        const nav = categoryNavRef.current;
        const activeBtn = nav.querySelector<HTMLElement>(`[data-category="${activeCategory}"]`);
        if (!activeBtn) return;

        // Centrar el botón activo en el scroll horizontal del contenedor
        const navRect = nav.getBoundingClientRect();
        const btnCenter = activeBtn.offsetLeft + activeBtn.offsetWidth / 2;
        const targetScroll = btnCenter - navRect.width / 2;

        nav.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
    }, [activeCategory, categoryNavRef]);

    return (
        <div className="flex flex-col gap-4">
            {/* Catalog Label */}
            <div className="flex items-center justify-between px-1 mt-4">
                <h2 className="text-[12px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <ShoppingBag size={14} className="opacity-40" />
                    Nuestro Menú
                </h2>
                {productos.length > 0 && (
                    <span className="text-[11px] font-black text-orange-600 dark:text-orange-500 bg-orange-500/5 px-2.5 py-1 rounded-full">{productos.length} variedades</span>
                )}
            </div>

            {/* Products */}
            {productos.length > 0 ? (
                <div className="flex flex-col gap-3 relative">
                    {/* ── Sticky Category Navigation ── */}
                    {Object.keys(productosPorTipo).length > 1 && (
                        <div className={`sticky z-30 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md pt-3 pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-gray-100 dark:border-zinc-800/50 mb-2 rounded-b-xl transition-all duration-300 ease-in-out ${isNavbarVisible ? "top-[139px]" : "top-[64px]"}`}>
                            <div ref={categoryNavRef} className="flex gap-2 overflow-x-auto custom-scrollbar scroll-smooth snap-x">
                                {categoriasOrdenadas.map((tipo) => (
                                    <button
                                        key={tipo}
                                        data-category={tipo}
                                        onClick={() => onScrollToCategory(tipo)}
                                        className={`snap-center shrink-0 px-4 py-1.5 rounded-full text-[13px] font-bold transition-all border ${activeCategory === tipo
                                            ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white shadow-md scale-105'
                                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-900 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500'
                                            }`}
                                    >
                                        {tipo.includes(' - ') ? tipo.split(' - ')[1] : tipo}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {categoriasOrdenadas.map((tipo) => {
                        const prods = productosPorTipo[tipo];
                        return (
                            <div
                                key={tipo}
                                id={tipo}
                                ref={(el) => { if (categoryRefs.current) categoryRefs.current[tipo] = el; }}
                                className="scroll-mt-[120px] pb-4"
                            >
                                {Object.keys(productosPorTipo).length > 1 && (
                                    <div className="flex items-center gap-2 mb-3 px-1 mt-4">
                                        <h3 className="text-[15px] font-black text-gray-900 dark:text-white capitalize tracking-tight">{tipo.includes(' - ') ? tipo.split(' - ')[1] : tipo}</h3>
                                        <span className="text-[10px] font-bold bg-gray-100 dark:bg-zinc-800/80 text-gray-400 px-2 py-0.5 rounded-md">{prods.length}</span>
                                    </div>
                                )}
                                <div className="flex flex-col gap-2.5">
                                    {prods.map((prod: any) => (
                                        <ProductCard
                                            key={prod.id_producto}
                                            prod={prod}
                                            accent={accent}
                                            fallbackEmoji={emoji}
                                            onAdd={(qty) => onAddProduct(prod, qty)}
                                            onOpenDetail={() => onOpenDetail(prod)}
                                            isAdded={cart.some(c => c.id_producto === prod.id_producto)}
                                            isClosed={!isOpen}
                                            purchased={purchasedProducts[prod.id_producto]}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/70 rounded-2xl py-16 text-center shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">{emoji}</div>
                    <h3 className="text-base font-black text-gray-900 dark:text-white mb-1.5">Catálogo vacío</h3>
                    <p className="text-[13px] text-gray-400 font-medium">Este negocio aún no publicó productos.</p>
                    <button onClick={() => window.open(`https://wa.me/${negocio.telefono?.replace(/\D/g, '')}`, '_blank')} className="mt-5 px-5 py-2.5 bg-green-500/10 text-green-600 dark:text-green-500 font-bold rounded-xl text-[13px] border border-green-500/20 flex items-center gap-2 mx-auto hover:bg-green-500/20 transition-colors">
                        <MessageCircle size={14} />
                        Consultá por WhatsApp
                    </button>
                </div>
            )}
        </div>
    );
}
