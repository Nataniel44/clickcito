"use client";

import React from 'react';
import { useCart } from '@/context/CartContext';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

interface CartSidebarProps {
    restaurantName: string;
    whatsappNumber?: string;
    primaryColor?: string;
}

export function CartSidebar({ restaurantName, whatsappNumber, primaryColor = '#000' }: CartSidebarProps) {
    const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, total } = useCart();

    if (!isCartOpen) return null;

    const handleCheckout = () => {
        if (!whatsappNumber) {
            alert("Este restaurante no tiene configurado un número de WhatsApp.");
            return;
        }

        let message = `*Hola ${restaurantName}, quiero realizar el siguiente pedido:*\n\n`;
        items.forEach(item => {
            message += `• ${item.quantity}x ${item.name} - $${parseInt(item.price) * item.quantity}\n`;
        });
        message += `\n*Total: $${total}*`;

        const url = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Sidebar */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <ShoppingBag size={20} />
                        Tu Pedido
                    </h2>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                            <ShoppingBag size={64} className="opacity-20" />
                            <p>Tu carrito está vacío</p>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="text-sm font-medium underline hover:text-gray-600"
                            >
                                Volver al menú
                            </button>
                        </div>
                    ) : (
                        items.map(item => (
                            <div key={item.id} className="flex gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                {item.image?.url && (
                                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                        <Image
                                            src={item.image.url}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-800 line-clamp-1">{item.name}</h3>
                                        <p className="text-sm text-gray-500">${item.price}</p>
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-1 hover:bg-white rounded shadow-sm transition-all disabled:opacity-50"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-1 hover:bg-white rounded shadow-sm transition-all"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-400 hover:text-red-600 p-2"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-4 border-t bg-gray-50 space-y-4">
                        <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                            <span>Total</span>
                            <span>${total}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            style={{ backgroundColor: primaryColor }}
                        >
                            Completar Pedido por WhatsApp
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
