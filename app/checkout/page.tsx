"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { createTransaccion } from "@/app/firebase/db";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    const { user, loading } = useAuth();
    const router = useRouter();

    const [direccion, setDireccion] = useState("");
    const [telefono, setTelefono] = useState("");
    const [notas, setNotas] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    // 1. Validar si hay algo en el carrito
    if (cart.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Tu carrito está vacío</h2>
                <button
                    onClick={() => router.back()}
                    className="text-orange-500 hover:text-orange-600 font-medium"
                >
                    Volver al catálogo
                </button>
            </div>
        );
    }

    // 2. Validar que el usuario haya iniciado sesión (Reglas de Firestore lo exigen)
    if (!user) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 px-4 text-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    ¡Casi listo! Necesitas iniciar sesión
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Para proteger tu pedido, necesitamos que ingreses a tu cuenta.
                </p>
                <button
                    onClick={() => router.push("/login")}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md"
                >
                    Ir a Iniciar Sesión
                </button>
            </div>
        );
    }

    const handleConfirmarPedido = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) return;

        setIsSubmitting(true);
        try {
            // El carrito actualmente garantiza que todos los items son del mismo negocio.
            const idNegocio = cart[0].id_negocio;

            const metadataLogistica = {
                direccion_envio: direccion,
                telefono_contacto: telefono,
                notas_cliente: notas,
                metodo_pago: "Efectivo / Transferencia" // Mock para MVP
            };

            await createTransaccion(idNegocio, user.uid, cart, metadataLogistica);

            toast.success("¡Pedido enviado con éxito!");
            clearCart();
            // Opcionalmente redirigir a un "Order Tracker" o al index
            router.push("/");
        } catch (error: any) {
            toast.error("Ocurrió un error al enviar el pedido. Intenta nuevamente.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[80vh] bg-gray-50 dark:bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Formulario de Logística */}
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Datos de Entrega</h2>
                    <form id="checkout-form" onSubmit={handleConfirmarPedido} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Dirección de Envío
                            </label>
                            <input
                                type="text"
                                required
                                value={direccion}
                                onChange={(e) => setDireccion(e.target.value)}
                                placeholder="Calle, número, depto..."
                                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Teléfono de Contacto
                            </label>
                            <input
                                type="tel"
                                required
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                placeholder="+54 9 11 1234-5678"
                                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Notas para el negocio (Instrucciones)
                            </label>
                            <textarea
                                rows={3}
                                value={notas}
                                onChange={(e) => setNotas(e.target.value)}
                                placeholder="Ej: Tocar timbre fuerte..."
                                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                            />
                        </div>
                    </form>
                </div>

                {/* Resumen del Pedido */}
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700 h-fit">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Resumen del Pedido</h2>

                    <div className="space-y-4 mb-6">
                        {cart.map((item) => (
                            <div key={item.cartItemId} className="flex justify-between text-sm">
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-800 dark:text-gray-200">
                                        {item.cantidad}x {item.nombre_producto}
                                    </span>
                                </div>
                                <span className="text-gray-900 dark:text-gray-100 font-semibold">
                                    ${item.precio_unitario * item.cantidad}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-200 dark:border-zinc-700 pt-4 mb-6 flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                        <span className="text-2xl font-black text-orange-600 dark:text-orange-400">${cartTotal}</span>
                    </div>

                    <button
                        type="submit"
                        form="checkout-form"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 font-bold transition-all shadow-md disabled:opacity-50"
                    >
                        {isSubmitting ? "Por favor espera..." : "Confirmar Pedido"}
                    </button>
                </div>

            </div>
        </div>
    );
}
