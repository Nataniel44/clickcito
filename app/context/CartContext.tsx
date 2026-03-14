"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

// Definimos la interfaz del carrito flexible para soportar comida, madera, ropa, etc.
export interface CartItem {
    cartItemId: string; // ID único temporal generado al añadir
    id_producto: string;
    id_negocio: string;
    nombre_producto: string;
    precio_unitario: number; // El precio final calculado con extras antes de mutiplicar por cantidad
    cantidad: number;
    detalles_seleccionados?: any; // Cualquier extra, tamaño o medida
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, "cartItemId">) => void;
    removeFromCart: (cartItemId: string) => void;
    clearCart: () => void;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartTotal, setCartTotal] = useState(0);

    // Cada vez que el carrito cambia, recalculamos el total
    useEffect(() => {
        const total = cart.reduce((acc, item) => acc + (item.precio_unitario * item.cantidad), 0);
        setCartTotal(total);
    }, [cart]);

    // Almacenamiento local temporal (si refresca la página, se pierde. Puede mejorarse con localStorage si se requiere luego)

    const addToCart = (item: Omit<CartItem, "cartItemId">) => {
        // Si intenta añadir algo de otro negocio, limpiamos el primer o bloqueamos.
        // Para el MVP asumimos que solo navega en un negocio a la vez.
        if (cart.length > 0 && cart[0].id_negocio !== item.id_negocio) {
            toast.error("Tienes productos de otro negocio en el carrito. Vaciándolo primero...");
            setCart([{ ...item, cartItemId: crypto.randomUUID() }]);
            return;
        }

        setCart((prev) => [...prev, { ...item, cartItemId: crypto.randomUUID() }]);
        toast.success(`${item.nombre_producto} agregado al carrito`);
    };

    const removeFromCart = (cartItemId: string) => {
        setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart debe ser usado dentro de un CartProvider");
    }
    return context;
};
