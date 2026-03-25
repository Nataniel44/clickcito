"use client";

import { ShoppingBag, ChevronRight } from "lucide-react";

interface StickyCartBarProps {
    itemsInCart: number;
    cartTotal: number;
    accent: string;
    isOpen: boolean;
    onContinue: () => void;
}

export function StickyCartBar({
    itemsInCart,
    cartTotal,
    accent,
    isOpen,
    onContinue
}: StickyCartBarProps) {
    if (itemsInCart === 0) return null;

    return (
        <div className="fixed bottom-0 inset-x-0 z-[100] px-4 pb-6 pt-4 bg-gradient-to-t from-[#F6F6F6] dark:from-[#060606] via-[#F6F6F6]/80 dark:via-[#060606]/80 to-transparent">
            <div className="max-w-[720px] mx-auto bg-gray-900 dark:bg-white rounded-2xl px-5 py-4 flex items-center justify-between gap-4 shadow-2xl shadow-black/40 ring-1 ring-white/10 dark:ring-black/5 animate-in slide-in-from-bottom-5">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <ShoppingBag size={22} className="text-white dark:text-gray-900" />
                        <span className={`absolute -top-1.5 -right-1.5 w-4 h-4 ${accent} text-white text-[9px] font-black rounded-full flex items-center justify-center`}>
                            {itemsInCart}
                        </span>
                    </div>
                    <div>
                        <p className="text-[14px] font-black text-white dark:text-gray-900 leading-none">
                            ${cartTotal.toLocaleString('es-AR')}
                        </p>
                        <p className="text-[10px] text-white/60 dark:text-gray-500 mt-0.5">
                            {itemsInCart} {itemsInCart === 1 ? 'artículo' : 'artículos'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={onContinue}
                    disabled={!isOpen}
                    className={`flex items-center gap-2 px-5 py-2.5 font-black rounded-xl text-[13px] transition-all active:scale-95 shadow-lg ${isOpen
                        ? `${accent} hover:opacity-90 text-white shadow-current/20`
                        : "bg-gray-100 dark:bg-zinc-800 text-gray-400 cursor-not-allowed shadow-none border border-gray-200 dark:border-zinc-700"}`}
                >
                    {isOpen ? (
                        <>
                            Continuar
                            <ChevronRight size={16} />
                        </>
                    ) : (
                        "Cerrado ahora"
                    )}
                </button>
            </div>
        </div>
    );
}
