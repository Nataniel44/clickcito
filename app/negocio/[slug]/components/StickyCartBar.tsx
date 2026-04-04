"use client";

import { ShoppingBag, ChevronRight, Trash2, X } from "lucide-react";
import { useState } from "react";

interface StickyCartBarProps {
    itemsInCart: number;
    cartTotal: number;
    accent: string;
    isOpen: boolean;
    onContinue: () => void;
    onClear: () => void;
}

export function StickyCartBar({
    itemsInCart,
    cartTotal,
    accent,
    isOpen,
    onContinue,
    onClear
}: StickyCartBarProps) {
    const [showConfirm, setShowConfirm] = useState(false);

    if (itemsInCart === 0) return null;

    return (
        <>
            <div className="fixed bottom-0 inset-x-0 z-[100] px-4 pb-6 pt-4 bg-gradient-to-t from-[#F6F6F6] dark:from-[#060606] via-[#F6F6F6]/80 dark:via-[#060606]/80 to-transparent">
                <div className="max-w-[720px] mx-auto bg-gray-900 dark:bg-white rounded-2xl px-5 py-4 flex items-center justify-between gap-4 shadow-2xl shadow-black/40 ring-1 ring-white/10 dark:ring-black/5 animate-in slide-in-from-bottom-5">
                    <div className="flex items-center gap-6">
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
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowConfirm(true);
                            }}
                            className="text-[10px] font-black text-red-400 hover:text-red-500 uppercase tracking-widest transition-colors py-1"
                        >
                            Vaciar
                        </button>
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

            {showConfirm && (
                <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
                    <div className="relative bg-white dark:bg-zinc-900 w-full max-w-sm rounded-3xl shadow-2xl p-6 animate-in slide-in-from-bottom-4 fade-in zoom-in duration-200">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                                <Trash2 size={22} className="text-red-500" />
                            </div>
                            <button onClick={() => setShowConfirm(false)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">Vaciar carrito</h3>
                        <p className="text-sm text-gray-400 font-medium mb-6">Se eliminarán todos los productos. Esta acción no se puede deshacer.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 py-3.5 px-4 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 font-black rounded-xl text-sm hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    onClear();
                                    setShowConfirm(false);
                                }}
                                className="flex-1 py-3.5 px-4 bg-red-500 text-white font-black rounded-xl text-sm hover:bg-red-600 active:scale-95 transition-all shadow-lg shadow-red-500/20"
                            >
                                Sí, vaciar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
