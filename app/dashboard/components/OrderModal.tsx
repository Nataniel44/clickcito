"use client";

import React from "react";
import { X, Phone, MapPin, MessageCircle, Printer, Share2, DollarSign, Calendar } from "lucide-react";
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

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
            <div className="relative bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-8 pb-32 max-h-[90vh] overflow-y-auto no-scrollbar">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID: {o.id_transaccion}</span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${sc.color}`}>{sc.label}</span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${o.pagado ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-600/20 dark:text-emerald-400" : "bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-500"}`}>{o.pagado ? "PAGADO" : "IMPAGO"}</span>
                            </div>
                            <h2 className="text-3xl font-black tracking-tighter">Detalle del Pedido</h2>
                        </div>
                        <button onClick={() => setSelectedOrder(null)} className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-2xl text-gray-400 hover:text-gray-900 transition-colors"><X size={24} /></button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-orange-50 dark:bg-orange-600/10 rounded-2xl text-orange-600"><Phone size={20} /></div>
                                <div><p className="text-[10px] font-black text-gray-400 uppercase">Teléfono</p><p className="font-bold">{o.datos_logistica?.telefono_contacto || "No especificado"}</p></div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-50 dark:bg-blue-600/10 rounded-2xl text-blue-600"><MapPin size={20} /></div>
                                <div><p className="text-[10px] font-black text-gray-400 uppercase">Dirección</p><p className="font-bold text-sm">{o.datos_logistica?.direccion_envio || "Retira por local"}</p></div>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase mb-3 flex items-center gap-2"><MessageCircle size={14} /> Notas</h4>
                            <p className="text-sm font-medium italic text-gray-600 dark:text-zinc-400 leading-relaxed">{o.datos_logistica?.notas_cliente || "Sin notas."}</p>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Resumen</h4>
                        <div className="bg-white dark:bg-zinc-800/50 rounded-3xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
                            {o.items?.map((item: any, i: number) => (
                                <div key={i} className="flex justify-between items-center p-4 border-b border-gray-50 dark:border-zinc-800/50 last:border-0 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                                    <div className="flex items-center gap-4"><div className="w-10 h-10 bg-orange-100 dark:bg-orange-600/20 text-orange-600 rounded-xl flex items-center justify-center font-black">{item.cantidad}</div><div><p className="font-bold text-sm">{item.nombre_producto}</p><p className="text-[10px] font-black text-gray-400">${item.precio_unitario.toLocaleString()} c/u</p></div></div>
                                    <p className="font-black">${(item.precio_unitario * item.cantidad).toLocaleString()}</p>
                                </div>
                            ))}
                            <div className="p-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex justify-between items-center"><span className="text-lg font-black uppercase tracking-tighter">Total</span><span className="text-3xl font-black">${total.toLocaleString()}</span></div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 flex flex-wrap gap-2 md:gap-4">
                    {o.estado !== "entregado" && o.estado !== "cancelado" && (
                        <button onClick={() => { if (confirm("¿Seguro que deseas cancelar este pedido? Se notificará que fue cancelado.")) { handleCambiarEstado(o.id_transaccion, "cancelado"); setSelectedOrder(null); } }} className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors" title="Cancelar Pedido"><X size={20} /></button>
                    )}
                    <button onClick={() => handlePrint(o)} className="p-4 bg-gray-100 dark:bg-zinc-800 rounded-2xl hover:bg-gray-200" title="Imprimir"><Printer size={20} /></button>
                    <button onClick={() => handleShareWhatsApp(o)} className="p-4 bg-green-50 text-green-600 rounded-2xl hover:bg-green-100" title="WhatsApp"><Share2 size={20} /></button>
                    <button onClick={() => { handleTogglePago(o); setSelectedOrder(null); }} className={`p-4 rounded-2xl border ${o.pagado ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"}`} title="Pago"><DollarSign size={20} /></button>

                    {o.estado === "pendiente" && <button onClick={() => { handleCambiarEstado(o.id_transaccion, "en_preparacion"); setSelectedOrder(null); }} className="flex-1 py-4 bg-orange-600 text-white font-black rounded-2xl">Aceptar</button>}
                    {o.estado === "en_preparacion" && <button onClick={() => { handleCambiarEstado(o.id_transaccion, "en_camino"); setSelectedOrder(null); }} className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl">Despachar</button>}
                    {o.estado === "en_camino" && <button onClick={() => { handleCambiarEstado(o.id_transaccion, "entregado"); setSelectedOrder(null); }} className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-2xl">Entregar</button>}
                    {o.estado === "entregado" && <div className="flex-1 py-4 bg-gray-100 text-gray-500 text-center font-black rounded-2xl">Completado</div>}
                    {o.estado === "cancelado" && <div className="flex-1 py-4 bg-red-50 text-red-600 text-center font-black rounded-2xl">Cancelado</div>}
                </div>
            </div>
        </div>
    );
}
