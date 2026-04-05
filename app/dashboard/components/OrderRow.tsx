"use client";

import React from "react";
import { DollarSign, FileText, CheckCircle2, Trash2 } from "lucide-react";
import { STATUS_CONFIG } from "./constants";

export function OrderRow({
    orden,
    handleTogglePago,
    setSelectedOrder,
    handleCambiarEstado,
    handleDeleteTransaccion,
    user
}: {
    orden: any;
    handleTogglePago: (o: any) => void;
    setSelectedOrder: (o: any) => void;
    handleCambiarEstado: (id: string, s: string) => void;
    handleDeleteTransaccion?: (id: string, phone?: string, silent?: boolean) => void;
    user?: any;
}) {
    const isAdmin = user?.rol === "admin_clickcito";

    const sc = STATUS_CONFIG[orden.estado] || STATUS_CONFIG.pendiente;
    const StatusIcon = sc.icon;
    const total = orden.items?.reduce((a: number, i: any) => a + i.precio_unitario * i.cantidad, 0) || 0;
    const customerName = orden.datos_logistica?.nombre_contacto || orden.nombre_contacto || null;

    const handleActionWA = (estado_nuevo: string) => {
        handleCambiarEstado(orden.id_transaccion, estado_nuevo);
        const tel = orden.datos_logistica?.telefono_contacto || orden.telefono_contacto || "";
        const phone = tel.replace(/\D/g, '');
        const nombreCliente = orden.datos_logistica?.nombre_contacto || orden.nombre_contacto || "cliente";
        const link = `${window.location.origin}/mis-pedidos`;

        let msg = "";
        switch (estado_nuevo) {
            case "en_preparacion": msg = `¡Hola ${nombreCliente}! Tomamos tu pedido y ya lo estamos preparando. 🍳\n\nPodés seguir el estado acá:\n${link}`; break;
            case "en_camino": msg = `¡Hola ${nombreCliente}! Tu pedido ya está en camino a tu dirección. 🛵\n\nPodés seguir el estado acá:\n${link}`; break;
            case "entregado": msg = `¡Hola ${nombreCliente}! Marqué tu pedido como entregado. Esperamos que lo disfrutes. ✨\n\nTu ticket está acá:\n${link}`; break;
            case "cancelado": msg = `Hola ${nombreCliente}, lamentablemente tuvimos que cancelar tu pedido. Contáctanos para más detalles.`; break;
        }

        if (phone) {
            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
        } else {
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
        }
    };

    return (
        <div key={orden.id_transaccion} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-2 mb-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0">#{orden.id_transaccion.slice(0, 6)}</span>
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap ${sc.color}`}>
                        <StatusIcon size={12} />{sc.label}
                    </span>
                    {customerName && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap bg-violet-100 text-violet-700 dark:bg-violet-600/20 dark:text-violet-400">
                            {customerName}
                        </span>
                    )}
                </div>
                <p className="font-bold text-sm truncate">{customerName || orden.datos_logistica?.telefono_contacto || `Cliente ${orden.id_usuario?.slice(0, 5) || "???"}`}</p>
                <p className="text-xs text-gray-400 font-medium truncate">{orden.items?.length || 0} items • {orden.datos_logistica?.direccion_envio || "Sin dirección"}</p>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-2 md:gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-50 dark:border-zinc-800/50">
                <span className="text-lg font-black shrink-0">${total.toLocaleString()}</span>
                <div className="flex items-center gap-1 md:gap-2">
                    <button
                        onClick={() => handleTogglePago(orden)}
                        className={`p-2 rounded-xl transition-all border ${orden.pagado
                            ? "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-600/10 dark:border-emerald-600/20"
                            : "bg-gray-50 border-gray-100 text-gray-400 dark:bg-zinc-800 dark:border-zinc-700"}`}
                        title={orden.pagado ? "Pagado" : "Pendiente de pago"}
                    >
                        <DollarSign size={18} />
                    </button>
                    <button
                        onClick={() => setSelectedOrder(orden)}
                        className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-600/10 rounded-xl transition-all"
                    >
                        <FileText size={18} />
                    </button>

                    {isAdmin && (
                        <button
                            onClick={() => handleDeleteTransaccion?.(orden.id_transaccion, orden.datos_logistica?.telefono_contacto)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-600/10 rounded-xl transition-all"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}

                    <div className="min-w-[100px] flex sm:flex-col lg:flex-row justify-end gap-1">
                        {orden.estado !== "entregado" && orden.estado !== "cancelado" && (
                            <button onClick={() => { if (confirm("¿Cancelar pedido?")) handleActionWA("cancelado"); }} className="px-3 py-2 mr-1 bg-red-50 text-red-600 dark:bg-red-900/40 dark:text-red-400 text-[10px] font-black rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors whitespace-nowrap">Cancelar</button>
                        )}
                        {orden.estado === "pendiente" && (
                            <>
                                <button onClick={() => handleCambiarEstado(orden.id_transaccion, "en_preparacion")} className="w-full px-3 py-2 bg-orange-100 text-orange-700 text-[10px] font-black rounded-lg hover:bg-orange-200 transition-colors whitespace-nowrap">Aceptar</button>
                                <button onClick={() => handleActionWA("en_preparacion")} className="w-full px-3 py-2 bg-orange-600 text-white text-[10px] font-black rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap">+ Whatsapp</button>
                            </>
                        )}
                        {orden.estado === "en_preparacion" && (
                            <>
                                <button onClick={() => handleCambiarEstado(orden.id_transaccion, "en_camino")} className="w-full px-3 py-2 bg-blue-100 text-blue-700 text-[10px] font-black rounded-lg hover:bg-blue-200 transition-colors whitespace-nowrap">Despachar</button>
                                <button onClick={() => handleActionWA("en_camino")} className="w-full px-3 py-2 bg-blue-600 text-white text-[10px] font-black rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">+ Whatsapp</button>
                            </>
                        )}
                        {orden.estado === "en_camino" && (
                            <>
                                <button onClick={() => handleCambiarEstado(orden.id_transaccion, "entregado")} className="w-full px-3 py-2 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-lg hover:bg-emerald-200 transition-colors whitespace-nowrap">Entregar</button>
                                <button onClick={() => handleActionWA("entregado")} className="w-full px-3 py-2 bg-emerald-600 text-white text-[10px] font-black rounded-lg hover:bg-emerald-700 transition-colors whitespace-nowrap">+ Whatsapp</button>
                            </>
                        )}
                        {orden.estado === "entregado" && (
                            <div className="p-2 text-emerald-500"><CheckCircle2 size={20} /></div>
                        )}
                        {orden.estado === "cancelado" && (
                            <div className="w-full px-3 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-500 text-[10px] font-black rounded-lg text-center whitespace-nowrap shrink-0">Cancelado</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
