"use client";

import React, { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { ShoppingBag, X, Trash2, ChevronRight, Minus, Plus, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";

export function CartSidebar() {
    const { cart, removeFromCart, cartTotal, clearCart } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    if (cart.length === 0 && !isOpen) return null;

    return (
        <>
            {/* ═══════ BARRA FLOTANTE ESTILO APP (Bottom Bar) ═══════ */}
            {!isOpen && cart.length > 0 && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 left-4 right-4 z-40 mx-auto max-w-lg"
                >
                    <div className="bg-gray-900 dark:bg-white rounded-2xl shadow-2xl shadow-black/30 dark:shadow-white/10 px-5 py-4 flex items-center justify-between group hover:scale-[1.02] transition-transform active:scale-[0.98]">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <ShoppingBag size={22} className="text-white dark:text-gray-900" />
                                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full">
                                    {cart.length}
                                </span>
                            </div>
                            <div className="text-left">
                                <p className="text-white dark:text-gray-900 text-sm font-black">
                                    Ver pedido
                                </p>
                                <p className="text-white/60 dark:text-gray-500 text-xs font-medium">
                                    {cart.length} {cart.length === 1 ? "artículo" : "artículos"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-black text-orange-400 dark:text-orange-600">
                                ${cartTotal.toLocaleString('es-AR')}
                            </span>
                            <ChevronUp size={20} className="text-white/50 dark:text-gray-400 group-hover:text-white dark:group-hover:text-gray-900 transition-colors" />
                        </div>
                    </div>
                </button>
            )}

            {/* ═══════ BACKDROP ═══════ */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* ═══════ PANEL DESLIZABLE DESDE ABAJO (Mobile-First) ═══════ */}
            <div
                className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
            >
                <div className="bg-white dark:bg-zinc-900 rounded-t-[2rem] shadow-2xl shadow-black/20 max-h-[85vh] flex flex-col border-t border-gray-100 dark:border-zinc-800">
                    {/* Handle bar (drag indicator) */}
                    <div className="flex justify-center pt-3 pb-1">
                        <div className="w-10 h-1 bg-gray-300 dark:bg-zinc-700 rounded-full" />
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                                <ShoppingBag size={20} className="text-orange-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-gray-900 dark:text-white">Mi Pedido</h2>
                                <p className="text-xs text-gray-500 font-medium">{cart.length} {cart.length === 1 ? "artículo" : "artículos"}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2.5 bg-gray-100 dark:bg-zinc-800 rounded-xl text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Items List */}
                    <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-3 min-h-0">
                        {cart.length === 0 ? (
                            <div className="py-16 text-center">
                                <div className="text-6xl mb-4">🛒</div>
                                <p className="font-black text-gray-400 dark:text-zinc-500">Tu pedido está vacío</p>
                                <p className="text-sm text-gray-400 mt-1">¡Agregá productos para empezar!</p>
                            </div>
                        ) : (
                            cart.map((item) => {
                                // Detectar unidad desde los detalles del carrito
                                const d = item.detalles_seleccionados;
                                let unitShort = '';
                                if (d?.unidad_medida) unitShort = d.unidad_medida;
                                else if (d?.duracion) unitShort = d.duracion.includes('min') ? 'turno' : '';
                                else if (d?.talles) unitShort = 'u';

                                return (
                                    <div key={item.cartItemId} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800 group/item">
                                        {/* Item info */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                                                {item.nombre_producto}
                                            </h4>

                                            {/* Selected Extras */}
                                            {item.detalles_seleccionados?.extras_seleccionados?.length > 0 && (
                                                <div className="mt-0.5 space-y-0.5">
                                                    {item.detalles_seleccionados.extras_seleccionados.map((group: any, idx: number) => (
                                                        <div key={idx} className="flex flex-wrap gap-x-1 gap-y-0.5">
                                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{group.titulo}:</span>
                                                            {group.seleccion.map((opt: any, sIdx: number) => (
                                                                <span key={sIdx} className="text-[10px] font-bold text-orange-500/80 dark:text-orange-400/80 bg-orange-500/5 px-1 rounded">
                                                                    {opt.nombre}{opt.precio > 0 ? ` (+ $${opt.precio})` : ''}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className="text-xs font-bold text-gray-400">
                                                    x{item.cantidad}{unitShort ? ` ${unitShort}` : ''}
                                                </span>
                                                <span className="text-xs text-gray-300 dark:text-zinc-600">•</span>
                                                <span className="text-sm font-black text-orange-600 dark:text-orange-400">
                                                    ${(item.precio_unitario * item.cantidad).toLocaleString('es-AR')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Remove */}
                                        <button
                                            onClick={() => removeFromCart(item.cartItemId)}
                                            className="p-2 text-gray-300 dark:text-zinc-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover/item:opacity-100"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Footer - Checkout */}
                    {cart.length > 0 && (
                        <div className="px-6 pb-8 pt-4 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                            {/* Total */}
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-500 font-bold">Total</span>
                                <span className="text-3xl font-black text-gray-900 dark:text-white">${cartTotal.toLocaleString('es-AR')}</span>
                            </div>

                            {/* CTA */}
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    router.push("/checkout");
                                }}
                                className="w-full flex items-center justify-center gap-3 py-4 bg-orange-600 hover:bg-orange-700 text-white font-black text-lg rounded-2xl shadow-lg shadow-orange-600/20 transition-all active:scale-[0.98] hover:scale-[1.01]"
                            >
                                Completar Pedido
                                <ChevronRight size={22} />
                            </button>

                            {/* Clear */}
                            <button
                                onClick={clearCart}
                                className="mt-3 w-full text-center text-sm text-gray-400 hover:text-red-500 font-bold transition-colors py-2"
                            >
                                Vaciar carrito
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
