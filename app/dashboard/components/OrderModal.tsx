"use client";

import React from "react";
import { X, Phone, MapPin, MessageCircle, Printer, Share2, DollarSign, Calendar, Clock, User, Building2, Send, CheckCircle2 } from "lucide-react";
import { STATUS_CONFIG } from "./constants";

export function OrderModal({
    selectedOrder,
    setSelectedOrder,
    handlePrint,
    handleShareWhatsApp,
    handleTogglePago,
    handleCambiarEstado
}: {
    selectedOrder: any;
    setSelectedOrder: (o: any) => void;
    handlePrint: (o: any) => void;
    handleShareWhatsApp: (o: any) => void;
    handleTogglePago: (o: any) => void;
    handleCambiarEstado: (id: string, s: string) => void;
}) {
    if (!selectedOrder) return null;
    const o = selectedOrder;
    const sc = STATUS_CONFIG[o.estado] || STATUS_CONFIG.pendiente;
    const total = o.items?.reduce((a: number, i: any) => a + i.precio_unitario * i.cantidad, 0) || 0;
    const customerName = o.datos_logistica?.nombre_contacto || o.nombre_contacto || null;
    const orderDate = o.createdAt ? new Date(o.createdAt.seconds * 1000) : null;

    const handleNotifyWA = (estado_nuevo: string) => {
        const rawTel = o.datos_logistica?.telefono_contacto || o.telefono_contacto || "";
        const phone = rawTel.replace(/[^0-9]/g, '');
        const nombreCliente = customerName || "cliente";
        const link = `${window.location.origin}/mis-pedidos`;

        let mensaje = "";
        switch (estado_nuevo) {
            case "en_preparacion": mensaje = `¡Hola ${nombreCliente}! Tomamos tu pedido y ya lo estamos preparando. 🍳\n\nPodés seguir el estado acá:\n${link}`; break;
            case "en_camino": mensaje = `¡Hola ${nombreCliente}! Tu pedido ya está en camino a tu dirección. 🛵\n\nPodés seguir el estado acá:\n${link}`; break;
            case "entregado": mensaje = `¡Hola ${nombreCliente}! Marqué tu pedido como entregado. Esperamos que lo disfrutes. ✨\n\nTu ticket está acá:\n${link}`; break;
            case "cancelado": mensaje = `Hola ${nombreCliente}, lamentablemente tuvimos que cancelar tu pedido. Contáctanos para más detalles.`; break;
        }

        if (phone) {
            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(mensaje)}`, '_blank');
        } else {
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(mensaje)}`, '_blank');
        }

        handleCambiarEstado(o.id_transaccion, estado_nuevo);
        setSelectedOrder(null);
    };

    const extraFields = Object.entries(o.datos_logistica || {})
        .filter(([k]) => !['telefono_contacto', 'direccion_envio', 'notas_cliente', 'nombre_contacto'].includes(k));

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
            <div className="relative bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="p-6 pb-4 border-b border-gray-100 dark:border-zinc-800">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">#{o.id_transaccion.slice(0, 8).toUpperCase()}</span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${sc.color}`}>{sc.label}</span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${o.pagado ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-600/20 dark:text-emerald-400" : "bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-500"}`}>{o.pagado ? "PAGADO" : "IMPAGO"}</span>
                                {customerName && (
                                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-violet-100 text-violet-700 dark:bg-violet-600/20 dark:text-violet-400">
                                        {customerName}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-2xl font-black tracking-tight">Detalle del Pedido</h2>
                        </div>
                        <button onClick={() => setSelectedOrder(null)} className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-2xl text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors shrink-0">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Date & Time */}
                    {orderDate && (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Clock size={14} />
                            <span>{orderDate.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })} — {orderDate.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 pb-36 max-h-[calc(90vh-200px)] overflow-y-auto no-scrollbar space-y-6">
                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            {customerName && (
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-violet-50 dark:bg-violet-600/10 rounded-xl text-violet-600 shrink-0">
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Cliente</p>
                                        <p className="font-bold text-sm">{customerName}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-start gap-3">
                                <div className="p-2.5 bg-orange-50 dark:bg-orange-600/10 rounded-xl text-orange-600 shrink-0">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase">Teléfono</p>
                                    <p className="font-bold text-sm">{o.datos_logistica?.telefono_contacto || o.telefono_contacto || "No especificado"}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2.5 bg-blue-50 dark:bg-blue-600/10 rounded-xl text-blue-600 shrink-0">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase">Dirección</p>
                                    <p className="font-bold text-sm">{o.datos_logistica?.direccion_envio || o.direccion_envio || "Retira por local"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-zinc-800/50 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase mb-2 flex items-center gap-2">
                                <MessageCircle size={14} /> Notas
                            </h4>
                            <p className="text-sm font-medium italic text-gray-600 dark:text-zinc-400 leading-relaxed">
                                {o.datos_logistica?.notas_cliente || o.notas_cliente || "Sin notas."}
                            </p>
                        </div>
                    </div>

                    {/* Extra fields */}
                    {extraFields.length > 0 && (
                        <div className="bg-gray-50 dark:bg-zinc-800/50 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase mb-4 flex items-center gap-2">
                                <Building2 size={14} /> Detalles Adicionales
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {extraFields.map(([key, value]) => (
                                    <div key={key}>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">{key.replace(/_/g, " ")}</p>
                                        <p className="font-bold text-sm text-gray-900 dark:text-white">{String(value)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Items Summary */}
                    <div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Resumen</h4>
                        <div className="bg-white dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
                            {o.items?.map((item: any, i: number) => (
                                <div key={i} className="flex justify-between items-center p-4 border-b border-gray-50 dark:border-zinc-800/50 last:border-0 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-600/20 text-orange-600 rounded-xl flex items-center justify-center font-black text-sm shrink-0">
                                            {item.cantidad || 1}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{item.nombre_producto}</p>
                                            <p className="text-[10px] font-black text-gray-400">${(item.precio_unitario || 0).toLocaleString()} c/u</p>
                                        </div>
                                    </div>
                                    <p className="font-black">${((item.precio_unitario || 0) * (item.cantidad || 1)).toLocaleString()}</p>
                                </div>
                            ))}
                            <div className="p-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex justify-between items-center">
                                <span className="text-sm font-black uppercase tracking-tighter">Total</span>
                                <span className="text-2xl font-black">${total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800">
                    {/* Quick Actions Row */}
                    <div className="flex items-center gap-2 mb-3">
                        <button onClick={() => handlePrint(o)} className="p-2.5 bg-gray-100 dark:bg-zinc-800 rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors" title="Imprimir">
                            <Printer size={16} />
                        </button>
                        <button onClick={() => handleShareWhatsApp(o)} className="p-2.5 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors" title="WhatsApp">
                            <Share2 size={16} />
                        </button>
                        <button onClick={() => { handleTogglePago(o); setSelectedOrder(null); }} className={`p-2.5 rounded-xl border transition-colors ${o.pagado ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-100 dark:border-emerald-900/30" : "bg-orange-50 dark:bg-orange-900/20 text-orange-600 border-orange-100 dark:border-orange-900/30"}`} title={o.pagado ? "Pagado" : "Marcar pagado"}>
                            <DollarSign size={16} />
                        </button>
                        {o.estado !== "entregado" && o.estado !== "cancelado" && (
                            <button onClick={() => { if (confirm("¿Seguro que deseas cancelar este pedido? Se notificará al cliente.")) { handleNotifyWA("cancelado"); } }} className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors ml-auto" title="Cancelar">
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Status Transition Buttons */}
                    {o.estado === "pendiente" && (
                        <div className="flex gap-2">
                            <button onClick={() => { handleCambiarEstado(o.id_transaccion, "en_preparacion"); setSelectedOrder(null); }} className="flex-1 py-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 font-black rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-all text-[10px] uppercase tracking-widest hidden sm:block">
                                Solo Aceptar
                            </button>
                            <button onClick={() => handleNotifyWA("en_preparacion")} className="flex-[2] py-3 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-xl flex items-center justify-center gap-2 transition-all text-[10px] sm:text-xs uppercase tracking-widest shadow-lg shadow-orange-600/20 hover:scale-[1.02]">
                                Aceptar + Avisar <Send size={14} />
                            </button>
                        </div>
                    )}
                    {o.estado === "en_preparacion" && (
                        <div className="flex gap-2">
                            <button onClick={() => { handleCambiarEstado(o.id_transaccion, "en_camino"); setSelectedOrder(null); }} className="flex-1 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 font-black rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all text-[10px] uppercase tracking-widest hidden sm:block">
                                Solo Despachar
                            </button>
                            <button onClick={() => handleNotifyWA("en_camino")} className="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl flex items-center justify-center gap-2 transition-all text-[10px] sm:text-xs uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:scale-[1.02]">
                                Despachar + Avisar <Send size={14} />
                            </button>
                        </div>
                    )}
                    {o.estado === "en_camino" && (
                        <div className="flex gap-2">
                            <button onClick={() => { handleCambiarEstado(o.id_transaccion, "entregado"); setSelectedOrder(null); }} className="flex-1 py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 font-black rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all text-[10px] uppercase tracking-widest hidden sm:block">
                                Solo Entregar
                            </button>
                            <button onClick={() => handleNotifyWA("entregado")} className="flex-[2] py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl flex items-center justify-center gap-2 transition-all text-[10px] sm:text-xs uppercase tracking-widest shadow-lg shadow-emerald-600/20 hover:scale-[1.02]">
                                Entregar + Avisar <Send size={14} />
                            </button>
                        </div>
                    )}
                    {o.estado === "entregado" && (
                        <div className="flex items-center justify-center gap-2 py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 font-black rounded-xl">
                            <CheckCircle2 size={16} /> Pedido Completado
                        </div>
                    )}
                    {o.estado === "cancelado" && (
                        <div className="flex items-center justify-center gap-2 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 font-black rounded-xl">
                            <X size={16} /> Pedido Cancelado
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
