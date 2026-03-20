"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Layout, Target, TrendingUp, Printer, Smartphone, Download, Share2, Users, Star, CalendarClock, MessageCircle, Coins, Zap, Plus, Megaphone, MessageSquare } from "lucide-react";
import { toast } from "react-hot-toast";

export function MarketingPanel({
    user,
    loadingOrdenes,
    clientesUnicos,
    ordenes,
    bannerText,
    setBannerText,
    handleUpdateBanner,
    isUpdatingBanner
}: {
    user: any;
    loadingOrdenes: boolean;
    clientesUnicos: any[];
    ordenes: any[];
    bannerText: string;
    setBannerText: (s: string) => void;
    handleUpdateBanner: () => void;
    isUpdatingBanner: boolean;
}) {
    if (typeof window === "undefined") return <></>;

    if (loadingOrdenes) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-64 bg-gray-100 dark:bg-zinc-800 rounded-3xl" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-48 bg-gray-100 dark:bg-zinc-800 rounded-3xl" />
                    <div className="h-48 bg-gray-100 dark:bg-zinc-800 rounded-3xl" />
                </div>
            </div>
        );
    }

    const shopUrl = `${window.location.origin}/negocio/${user?.id_negocio}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shopUrl)}`;

    const totalClientes = clientesUnicos.length || 1;
    const clientesNuevos = clientesUnicos.filter(c => c.ordenes === 1).length;
    const clientesRecurrentes = clientesUnicos.filter(c => c.ordenes > 1).length;

    const tasaRetencion = Math.round((clientesRecurrentes / totalClientes) * 100);
    const growthScore = Math.min(100, Math.round(tasaRetencion * 1.5 + 20));

    const topClientesEnriquecidos = clientesUnicos
        .slice(0, 5)
        .map(c => {
            const susOrdenes = ordenes.filter(o => o.id_usuario === c.uid);
            const ultimaOrden = susOrdenes.sort((a, b) => {
                const dateA = a.createdAt ? a.createdAt.seconds : 0;
                const dateB = b.createdAt ? b.createdAt.seconds : 0;
                return dateB - dateA;
            })[0];

            return {
                ...c,
                ultima_fecha: ultimaOrden?.createdAt ? new Date(ultimaOrden.createdAt.seconds * 1000).toLocaleDateString('es-AR') : 'Desconocida'
            };
        });

    const entries = Array.from(
        ordenes.flatMap(o => o.items?.map((i: any) => i.nombre_producto) || [])
            .reduce((acc, name) => acc.set(name, (acc.get(name) || 0) + 1), new Map<string, number>())
            .entries()
    ) as [string, number][];

    const prodFrecuentes = entries.sort((a, b) => b[1] - a[1]).slice(0, 3);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header / Business Health */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 rounded-2xl">
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black tracking-tight">Anuncio en Vivo</h3>
                                <p className="text-sm text-gray-500 font-medium">Lo que tus clientes ven arriba de tu menú</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <input
                                type="text"
                                value={bannerText}
                                onChange={(e) => setBannerText(e.target.value)}
                                placeholder="Ej: ¡Hoy envío GRATIS superando los $15.000! 🚚"
                                className="flex-1 bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20"
                            />
                            <button
                                onClick={handleUpdateBanner}
                                disabled={isUpdatingBanner}
                                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:scale-100 whitespace-nowrap"
                            >
                                {isUpdatingBanner ? "Guardando..." : "Actualizar Banner"}
                            </button>
                        </div>
                        <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Se muestra en tiempo real en tu catálogo
                        </p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-600/20 flex flex-col justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-100/60 mb-1 flex items-center gap-1">
                            <Target size={12} /> Score de Crecimiento
                        </p>
                        <h4 className="text-5xl font-black">{growthScore || 0}<span className="text-xl opacity-50">/100</span></h4>
                    </div>
                    <div className="space-y-2 mt-6">
                        <div className="flex justify-between text-xs font-bold">
                            <span>Tasa de Retención</span>
                            <span>{tasaRetencion}%</span>
                        </div>
                        <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${tasaRetencion}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* QR Experience */}
            <div className="bg-white dark:bg-zinc-900 rounded-[3rem] border border-gray-100 dark:border-zinc-800 p-8 md:p-12 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    <div className="relative group">
                        <div className="w-64 h-[450px] bg-zinc-950 rounded-[3rem] border-[8px] border-zinc-900 shadow-2xl relative overflow-hidden flex flex-col">
                            <div className="h-6 w-24 bg-zinc-900 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl z-20" />
                            <div className="p-4 pt-10 flex-1 flex flex-col gap-3">
                                <div className="bg-indigo-600 p-2 rounded-lg -mx-1 animate-pulse">
                                    <div className="h-1 w-full bg-white/20 rounded-full mb-1" />
                                    <p className="text-[6px] text-white font-bold leading-tight truncate">{bannerText || 'Tu anuncio aquí'}</p>
                                </div>
                                <div className="w-full h-24 bg-zinc-800 rounded-2xl" />
                                <div className="aspect-square bg-white rounded-2xl p-4 mt-4 scale-90 shadow-lg relative">
                                    <Image src={qrUrl} alt="QR" fill className="object-contain" unoptimized />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 space-y-8 text-center lg:text-left">
                        <h3 className="text-4xl font-black tracking-tighter mb-4 leading-none">Menú Digital en 1 Paso</h3>
                        <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                            Digitalizá tu salón o delivery. Los clientes escanean, eligen y el pedido llega directo a tu panel.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                            <button onClick={() => window.open(qrUrl, '_blank')} className="px-8 py-4 bg-orange-600 text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-orange-600/20 flex items-center gap-2">
                                <Download size={20} /> Descargar QR
                            </button>
                            <button onClick={() => { navigator.clipboard.writeText(shopUrl); toast.success("Link copiado!"); }} className="px-8 py-4 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-800 font-black rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all flex items-center gap-2">
                                <Share2 size={20} /> Copiar Link
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CRM & Intelligence */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-xl font-black tracking-tight mb-8">Top Clientes VIP</h3>
                    <div className="space-y-3">
                        {topClientesEnriquecidos.map((c, i) => (
                            <div key={`top-client-${i}`} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 rounded-2xl transition-colors border border-transparent hover:border-gray-100 dark:hover:border-zinc-700">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center font-black text-gray-400 text-xs">{c.tel?.slice(-3)}</div>
                                    <div>
                                        <p className="font-bold text-sm">{c.tel}</p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">{c.ultima_fecha}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        const msg = `¡Hola! Tenés un regalo sorpresa por ser cliente VIP: ${shopUrl}`;
                                        window.open(`https://wa.me/${c.tel.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
                                    }}
                                    className="p-3 text-green-600 bg-green-50 dark:bg-green-900/20 rounded-xl hover:scale-105 transition-all"
                                >
                                    <MessageCircle size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-zinc-800 shadow-sm">
                        <h3 className="font-black text-lg mb-6">Oportunidad de Combos</h3>
                        {prodFrecuentes.length >= 2 ? (
                            <div className="p-6 bg-orange-50 dark:bg-orange-600/5 rounded-3xl border border-orange-100 dark:border-orange-600/20">
                                <p className="font-black text-gray-900 dark:text-white flex items-center gap-2">
                                    {prodFrecuentes[0][0]} <Plus size={14} /> {prodFrecuentes[1][0]}
                                </p>
                                <p className="text-xs text-orange-600 dark:text-orange-400 font-bold mt-4">Sugerencia: Creá un &quot;Combo Power&quot; con estos 2 productos.</p>
                            </div>
                        ) : (
                            <p className="text-gray-400 font-medium text-sm text-center py-8">Necesitamos más órdenes para sugerir combos.</p>
                        )}
                    </div>

                    <div className="bg-[#128C7E] rounded-[2.5rem] p-8 text-white shadow-xl shadow-green-600/20 relative overflow-hidden group">
                        <div className="relative z-10 space-y-4">
                            <h3 className="text-xl font-black">Campañas Rápidas</h3>
                            <p className="text-white/80 text-sm font-medium">Atraé pedidos hoy mismo publicando en tus estados.</p>
                            <button
                                onClick={() => {
                                    const text = `🔥 *PROMO FLASH SOLO POR HOY* 🔥\n👉 ${shopUrl}`;
                                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                                }}
                                className="w-full py-4 bg-white text-[#128C7E] font-black rounded-2xl shadow-lg hover:scale-[1.02] transition-all"
                            >
                                Lanzar Promo Flash
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
