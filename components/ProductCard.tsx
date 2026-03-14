"use client";

import React from 'react';
import { Product } from '@/lib/wordpress';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Plus } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    primaryColor?: string;
}

export function ProductCard({ product, primaryColor = '#000' }: ProductCardProps) {
    const { addToCart } = useCart();

    return (
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full transform hover:-translate-y-1">
            {product.image?.url && (
                <div className="relative h-56 w-full overflow-hidden">
                    <Image
                        src={product.image.url}
                        alt={product.image.alt || product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <span className="text-white font-medium text-sm">Ver detalles</span>
                    </div>
                </div>
            )}
            <div className="p-5 flex flex-col flex-grow relative">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-xl text-gray-800 leading-tight">{product.name}</h3>
                    <span className="font-bold text-lg text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg ml-2 whitespace-nowrap">
                        ${product.price}
                    </span>
                </div>

                <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-grow leading-relaxed">
                    {product.description}
                </p>

                <button
                    onClick={() => addToCart(product)}
                    className="w-full py-3 rounded-xl text-white font-bold text-sm mt-auto shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: primaryColor }}
                >
                    <Plus size={18} />
                    Agregar al pedido
                </button>
            </div>
        </div>
    );
}