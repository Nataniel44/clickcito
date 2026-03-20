"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
    Loader2,
    CheckCircle2,
    Clock,
    Truck,
    Package,
    XCircle,
    ChefHat,
} from "lucide-react";

type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled";

type Order = {
    id: number;
    customerName: string;
    status: OrderStatus;
    total: number;
    createdAt: string;
    items: Array<{ name: string; quantity: number }>;
};

type Props = {
    orderId: number;
    onClose: () => void;
};

const statusConfig: Record<
    OrderStatus,
    { icon: React.ReactNode; label: string; color: string; bgColor: string }
> = {
    pending: {
        icon: <Clock className="w-6 h-6" />,
        label: "Pedido recibido",
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/20",
    },
    confirmed: {
        icon: <CheckCircle2 className="w-6 h-6" />,
        label: "Confirmado",
        color: "text-blue-400",
        bgColor: "bg-blue-500/20",
    },
    preparing: {
        icon: <ChefHat className="w-6 h-6" />,
        label: "En preparación",
        color: "text-orange-400",
        bgColor: "bg-orange-500/20",
    },
    ready: {
        icon: <Package className="w-6 h-6" />,
        label: "Listo para retirar",
        color: "text-purple-400",
        bgColor: "bg-purple-500/20",
    },
    delivered: {
        icon: <Truck className="w-6 h-6" />,
        label: "Entregado",
        color: "text-green-400",
        bgColor: "bg-green-500/20",
    },
    cancelled: {
        icon: <XCircle className="w-6 h-6" />,
        label: "Cancelado",
        color: "text-red-400",
        bgColor: "bg-red-500/20",
    },
};

const statusOrder: OrderStatus[] = [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "delivered",
];

export const OrderStatusTracker: React.FC<Props> = ({ orderId, onClose }) => {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);



    const fetchOrderStatus = useCallback(async () => {
        try {
            const res = await fetch(`/api/orders/${orderId}`);
            if (!res.ok) throw new Error("Error al obtener el pedido");
            const data = await res.json();
            setOrder(data);
            setError(null);
        } catch (err) {
            setError("No se pudo cargar el estado del pedido");
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        fetchOrderStatus();
        const interval = setInterval(fetchOrderStatus, 10000);
        return () => clearInterval(interval);
    }, [fetchOrderStatus]);

    const getCurrentStepIndex = () => {
        if (!order) return 0;
        const i = statusOrder.indexOf(order.status);
        return i === -1 ? 0 : i;
    };

    const currentStatus =
        order && statusConfig[order.status]
            ? statusConfig[order.status]
            : statusConfig.pending;

    if (loading)
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-scale-in">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
                        <p className="text-gray-700 dark:text-gray-300 font-medium">
                            Cargando estado del pedido...
                        </p>
                    </div>
                </div>
            </div>
        );

    if (error || !order)
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-scale-in">
                    <div className="text-center space-y-4">
                        <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            Error al cargar el pedido
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">{error}</p>
                        <button
                            onClick={onClose}
                            className="w-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-semibold transition"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        );

    const currentStep = getCurrentStepIndex();

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4  animate-fade-in"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90dvh] overflow-hidden overflow-y-auto animate-scale-in"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
                    <h2 className="text-2xl font-bold mb-2">Pedido #{order.id}</h2>
                    <p className="text-green-100">
                        {order.customerName} • ${order.total}
                    </p>
                </div>

                {/* Estado actual */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <div
                        className={`flex items-center gap-4 p-4 rounded-xl ${currentStatus.bgColor}`}
                    >
                        <div
                            className={`${currentStatus.color} animate-spin-slow`}
                        >
                            {currentStatus.icon}
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Estado actual
                            </p>
                            <p
                                className={`text-xl font-bold ${currentStatus.color}`}
                            >
                                {currentStatus.label}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="p-6 space-y-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                        Seguimiento del pedido
                    </h3>

                    {statusOrder.map((status, i) => {
                        const config = statusConfig[status];
                        const done = i <= currentStep;
                        const current = i === currentStep;
                        return (
                            <div
                                key={status}
                                className="flex items-center gap-4 animate-slide-in"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                <div
                                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${done
                                        ? `${config.bgColor} ${config.color}`
                                        : "bg-gray-200 dark:bg-gray-800 text-gray-400"
                                        } ${current ? "ring-4 ring-green-500/30" : ""}`}
                                >
                                    {config.icon}
                                </div>
                                <div className="flex-1">
                                    <p
                                        className={`font-medium ${done
                                            ? "text-gray-900 dark:text-white"
                                            : "text-gray-400 dark:text-gray-600"
                                            }`}
                                    >
                                        {config.label}
                                    </p>
                                </div>
                                {done && (
                                    <CheckCircle2 className="w-5 h-5 text-green-500 animate-pop-in" />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Items */}
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Productos
                    </h3>
                    <div className="space-y-2">
                        {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">
                                    {item.quantity}x {item.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 flex gap-3">
                    <button
                        onClick={fetchOrderStatus}
                        className="flex-1 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                    >
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Actualizar
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};
