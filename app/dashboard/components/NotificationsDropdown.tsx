"use client";

import React from "react";
import { Bell, Eye, Clock, PackageCheck, Send } from "lucide-react";

interface NotificationsDropdownProps {
    ordenes: any[];
    pendientes: number;
    selectedOrder: any | null;
    onSelectOrder: (order: any) => void;
    onCambiarEstado: (id: string, estado: string) => void;
    onVerOrdenes: () => void;
}

const STATUS_CONFIG: Record<string, { label: string; nextAction: string; nextStatus: string; icon: React.ElementType; color: string }> = {
    pendiente: {
        label: "Pendiente",
        nextAction: "Aceptar",
        nextStatus: "en_preparacion",
        icon: Clock,
        color: "text-red-500"
    },
    en_preparacion: {
        label: "Preparando",
        nextAction: "Despachar",
        nextStatus: "en_camino",
        icon: PackageCheck,
        color: "text-yellow-500"
    },
    en_camino: {
        label: "En camino",
        nextAction: "Entregado",
        nextStatus: "entregado",
        icon: Send,
        color: "text-blue-500"
    },
};

export function NotificationsDropdown({
    ordenes,
    pendientes,
    selectedOrder,
    onSelectOrder,
    onCambiarEstado,
    onVerOrdenes,
}: NotificationsDropdownProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const pendingOrders = ordenes.filter(o =>
        o.estado === "pendiente" || o.estado === "en_preparacion" || o.estado === "en_camino"
    );

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 bg-white dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-800 hover:border-orange-500 transition-all active:scale-95"
            >
                <Bell size={18} className={isOpen ? "text-orange-500" : "text-gray-500"} />
                {pendientes > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-2xl z-[70] overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                        {/* Header */}
                        <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-800/50">
                            <h3 className="font-black text-sm">Notificaciones</h3>
                            <span className="text-[10px] font-black bg-orange-100 dark:bg-orange-600/20 text-orange-600 px-2 py-0.5 rounded-full">
                                {pendientes} Pendiente{pendientes !== 1 ? 's' : ''}
                            </span>
                        </div>

                        {/* Orders List */}
                        <div className="max-h-96 overflow-y-auto no-scrollbar">
                            {pendingOrders.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Bell size={32} className="mx-auto text-gray-200 dark:text-zinc-800 mb-2" />
                                    <p className="text-xs font-bold text-gray-400">No hay pedidos pendientes</p>
                                </div>
                            ) : (
                                pendingOrders.map(o => {
                                    const status = STATUS_CONFIG[o.estado] || STATUS_CONFIG.pendiente;
                                    const StatusIcon = status.icon;

                                    return (
                                        <div
                                            key={o.id_transaccion}
                                            className="p-4 border-b border-gray-50 dark:border-zinc-800/50 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors group"
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <StatusIcon size={12} className={status.color} />
                                                    <p className="text-xs font-black truncate">{o.datos_logistica?.telefono_contacto || "Cliente"}</p>
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400 shrink-0">{status.label}</span>
                                            </div>
                                            <p className="text-[10px] text-gray-500 line-clamp-1 mb-2">
                                                {o.items?.map((i: any) => i.nombre_producto).join(", ")}
                                            </p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onCambiarEstado(o.id_transaccion, status.nextStatus);
                                                    }}
                                                    className="flex-1 py-1.5 bg-orange-600 text-white text-[10px] font-black rounded-lg hover:bg-orange-700 transition-colors"
                                                >
                                                    {status.nextAction}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        onSelectOrder(o);
                                                        setIsOpen(false);
                                                    }}
                                                    className="px-2 py-1.5 bg-gray-100 dark:bg-zinc-800 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors"
                                                >
                                                    <Eye size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer */}
                        <button
                            onClick={() => {
                                onVerOrdenes();
                                setIsOpen(false);
                            }}
                            className="w-full py-3 text-[10px] font-black text-gray-400 hover:text-orange-600 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all border-t border-gray-100 dark:border-zinc-800"
                        >
                            Ver todas las órdenes
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
