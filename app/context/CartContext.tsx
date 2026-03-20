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
    pendingItem: Omit<CartItem, "cartItemId"> | null;
    setPendingItem: (item: Omit<CartItem, "cartItemId"> | null) => void;
    confirmNewBusiness: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [isInitialized, setIsInitialized] = useState(false);
    const [pendingItem, setPendingItem] = useState<Omit<CartItem, "cartItemId"> | null>(null);

    // Cargar carrito de localStorage cuando nace el componente
    useEffect(() => {
        const savedCart = localStorage.getItem("clickcito_cart");
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Error al parsear el carrito guardado", e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Guardar en localStorage cada vez que cambia
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("clickcito_cart", JSON.stringify(cart));
            const total = cart.reduce((acc, item) => acc + (item.precio_unitario * item.cantidad), 0);
            setCartTotal(total);
        }
    }, [cart, isInitialized]);

    const generateId = () => {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    };

    const addToCart = (item: Omit<CartItem, "cartItemId">) => {
        // Bloqueo de negocio diferente (Estilo PedidosYa)
        if (cart.length > 0 && cart[0].id_negocio !== item.id_negocio) {
            setPendingItem(item); // Activamos modal de conflicto
            return;
        }

        setCart((prev) => [...prev, { ...item, cartItemId: generateId() }]);
        toast.success(`¡${item.nombre_producto} agregado!`);
    };

    const confirmNewBusiness = () => {
        if (!pendingItem) return;
        setCart([{ ...pendingItem, cartItemId: generateId() }]);
        setPendingItem(null);
        toast.success("Carrito actualizado con el nuevo local");
    };

    const removeFromCart = (cartItemId: string) => {
        setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{
            cart, addToCart, removeFromCart, clearCart, cartTotal,
            pendingItem, setPendingItem, confirmNewBusiness
        }}>
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
