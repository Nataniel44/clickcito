"use client";

import { MapPin, Truck, Globe, Package, Armchair, MessageCircle } from "lucide-react";
import Image from "next/image";
import { resolveImageUrl } from "@/app/utils/imageUtils";
import { useState, memo } from "react";

const GalleryItem = memo(function GalleryItem({ src, index, onPhotoClick }: { src: string; index: number; onPhotoClick: (index: number) => void }) {
    const [loading, setLoading] = useState(true);
    const isImage = src.startsWith('http') || src.startsWith('/');

    return (
        <div
            onClick={() => isImage && onPhotoClick(index)}
            className="w-[94px] h-[94px] sm:w-[110px] sm:h-[110px] rounded-xl bg-gray-50 dark:bg-zinc-800 overflow-hidden shrink-0 relative cursor-pointer transition-all border border-gray-100 dark:border-zinc-700 active:opacity-70"
        >
            {isImage ? (
                <>
                    {loading && (
                        <div className="absolute inset-0 bg-gray-200 dark:bg-zinc-800 animate-pulse z-10" />
                    )}
                    <Image
                        src={resolveImageUrl(src)}
                        fill
                        className={`object-cover transition-all duration-700 ${loading ? 'opacity-0 scale-110 blur-sm' : 'opacity-100 scale-100 blur-0'}`}
                        alt={`Foto ${index + 1}`}
                        unoptimized
                        onLoad={() => setLoading(false)}
                        onError={() => setLoading(false)}
                    />
                </>
            ) : (
                <span className="absolute inset-0 flex items-center justify-center text-3xl">{src}</span>
            )}
        </div>
    );
});

interface BusinessMainInfoProps {
    negocio: any;
    isOpen: boolean;
    emoji: string;
    onMaps: () => void;
    onWhatsapp: () => void;
    onPhotoClick: (index: number) => void;
}

export const BusinessMainInfo = memo(function BusinessMainInfo({
    negocio,
    isOpen,
    emoji,
    onMaps,
    onWhatsapp,
    onPhotoClick
}: BusinessMainInfoProps) {
    const logistica = negocio.configuracion_logistica || {};

    return (
        <div className="flex flex-col gap-4">
            {/* Quick Info Strip */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800/70 px-4 py-3">
                <div className="flex items-center gap-4 flex-wrap justify-between text-[12px]">
                    {negocio.activo !== false && (
                        <div className={`flex items-center gap-1.5 font-bold ${isOpen ? 'text-green-600 dark:text-green-500' : 'text-gray-500'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                            {isOpen ? 'Abierto ahora' : 'Cerrado ahora'}
                        </div>
                    )}
                    {negocio.ubicacion && (
                        <button onClick={onMaps} className="flex items-center gap-1.5 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
                            <MapPin size={13} />
                            <span className="truncate max-w-[180px]">{negocio.ubicacion}</span>
                        </button>
                    )}
                    {logistica.delivery_habilitado !== false && (
                        <div className="flex items-center gap-1.5 text-gray-500 dark:text-zinc-400 font-medium">
                            <Truck size={13} />
                            <span>{logistica.tiempo_aprox_delivery || "Envío disponible"}</span>
                        </div>
                    )}
                    {logistica.online_habilitado && (
                        <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold">
                            <Globe size={13} />
                            <span>Online / En Vivo</span>
                        </div>
                    )}
                    {logistica.presencial_habilitado && (
                        <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-bold">
                            <MapPin size={13} />
                            <span>Presencial</span>
                        </div>
                    )}
                    {logistica.digital_habilitado && (
                        <div className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400 font-bold">
                            <Package size={13} />
                            <span>Material Digital</span>
                        </div>
                    )}
                    {logistica.mesa_habilitado && (
                        <div className="flex items-center gap-1.5 text-gray-500 dark:text-zinc-400 font-medium">
                            <Armchair size={13} />
                            <span>Mesa</span>
                        </div>
                    )}
                    <button onClick={onWhatsapp} className="flex items-center gap-1.5 font-bold text-green-600 dark:text-green-500 ml-auto">
                        <MessageCircle size={13} fill="currentColor" strokeWidth={0} />
                        Consultar
                    </button>
                </div>
            </div>

            {/* Galería de fotos */}
            {negocio.fotos && negocio.fotos.length > 0 && (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800/70 p-3 shadow-sm">
                    <div className="flex items-center justify-between mb-2.5 px-1">
                        <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Galería</p>
                        <span className="text-[9px] font-bold text-gray-400">{negocio.fotos.length} fotos</span>
                    </div>
                    <div className="flex gap-2.5 overflow-x-auto custom-scrollbar">
                        {negocio.fotos.map((src: string, i: number) => (
                            <GalleryItem
                                key={i}
                                src={src}
                                index={i}
                                onPhotoClick={onPhotoClick}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
});
