"use client";
import React, { useState } from "react";
import { CartItem } from "@/context/CartContext";
import { UserForm } from "./UserForm";

type Props = {
    cart: CartItem[];
    onPay: (userData: { name: string; phone: string; address: string }) => void;
};

export const Checkout: React.FC<Props> = ({ cart, onPay }) => {
    const [showForm, setShowForm] = useState(false);

    const subtotal = cart.reduce(
        (acc, item) => {
            const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
            return acc + (price * item.quantity);
        },
        0
    );

    const deliveryFee = 50;
    const total = subtotal + deliveryFee;

    if (cart.length === 0) return <p className="text-white text-center">El carrito está vacío</p>;

    return (
        <div className="p-4 border-t border-white/20 space-y-4">
            {!showForm ? (
                <>
                    <div className="flex justify-between text-white/80">
                        <span>Subtotal:</span>
                        <span>${subtotal}</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                        <span>Envío:</span>
                        <span>${deliveryFee}</span>
                    </div>
                    <div className="flex justify-between font-bold text-white text-lg">
                        <span>Total:</span>
                        <span>${total}</span>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="w-full mt-2 bg-green-500 hover:bg-green-600 p-3 rounded-lg text-white font-bold"
                    >
                        Pagar
                    </button>
                </>
            ) : (
                <UserForm total={total} onSubmit={onPay} />
            )}
        </div>
    );
};
