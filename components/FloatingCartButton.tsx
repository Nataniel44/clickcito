"use client";

import React from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingBag } from 'lucide-react';

interface FloatingCartButtonProps {
    primaryColor?: string;
}

export function FloatingCartButton({ primaryColor = '#000' }: FloatingCartButtonProps) {
    const { count, setIsCartOpen } = useCart();

    if (count === 0) return null;

    return (
        <button
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white text-gray-900 px-6 py-3 rounded-full shadow-2xl border border-gray-100 flex items-center gap-3 hover:scale-105 transition-transform animate-in slide-in-from-bottom-10 fade-in duration-500"
        >
            <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: primaryColor }}
            >
                {count}
            </div>
            <span className="font-bold text-lg">Ver Pedido</span>
        </button>
    );
}
