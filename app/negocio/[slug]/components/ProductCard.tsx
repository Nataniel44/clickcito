"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Star, Clock, Check, CheckCircle2, ArrowRight } from "lucide-react";
import { resolveImageUrl } from "@/app/utils/imageUtils";

// Constantes y Helpers de Unidad
export const UNIT_MAP: Record<string, { short: string; long: string; priceTag: string }> = {
    'm²': { short: 'm²', long: 'metros²', priceTag: '/m²' },
    'metros': { short: 'm', long: 'metros', priceTag: '/m' },
    'kg': { short: 'kg', long: 'kilogramos', priceTag: '/kg' },
    'bolsa': { short: 'bolsa', long: 'bolsas', priceTag: '/bolsa' },
    'litro': { short: 'lt', long: 'litros', priceTag: '/lt' },
    'rollo': { short: 'rollo', long: 'rollos', priceTag: '/rollo' },
    'placa': { short: 'placa', long: 'placas', priceTag: '/placa' },
    'curso': { short: 'curso', long: 'cursos', priceTag: '/curso' },
    'clase': { short: 'clase', long: 'clases', priceTag: '/clase' },
    'modulo': { short: 'mód', long: 'módulos', priceTag: '/mód' },
};

export interface UnitInfo {
    unitLabel: string;
    unitLabelLong: string;
    priceLabel: string;
    qtyLabel: (n: number) => string;
    step: number;
    isFractional: boolean;
}

export function resolveUnit(detalles: any): UnitInfo {
    if (!detalles || typeof detalles !== 'object') {
        return { unitLabel: 'u', unitLabelLong: 'unidad', priceLabel: '', qtyLabel: (n) => `${n}`, step: 1, isFractional: false };
    }
    const um = detalles.unidad_medida as string | undefined;
    const fraccionado = detalles.venta_fraccionada === true;

    if (um) {
        const mapped = UNIT_MAP[um.toLowerCase()] || { short: um, long: um, priceTag: `/${um}` };
        return { unitLabel: mapped.short, unitLabelLong: mapped.long, priceLabel: mapped.priceTag, qtyLabel: (n) => `${n} ${n === 1 ? mapped.short : mapped.long}`, step: fraccionado ? 0.5 : 1, isFractional: fraccionado };
    }
    return { unitLabel: 'u', unitLabelLong: 'unidad', priceLabel: '', qtyLabel: (n) => `${n}`, step: 1, isFractional: false };
}

interface ProductCardProps {
    prod: any;
    onAdd: (qty: number) => void;
    onOpenDetail: () => void;
    accent: string;
    isAdded?: boolean;
    fallbackEmoji?: string;
    isClosed?: boolean;
    purchased?: any;
}

export function ProductCard({ prod, onAdd, onOpenDetail, accent, isAdded, fallbackEmoji, isClosed, purchased }: ProductCardProps) {
    const hasAccess = !!purchased;
    const unitInfo = useMemo(() => resolveUnit(prod.detalles_especificos), [prod.detalles_especificos]);
    const [qty, setQty] = useState(unitInfo.step);
    const [animating, setAnimating] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [loadingImage, setLoadingImage] = useState(true);

    const isAvailable = prod.detalles_especificos?.disponible !== false;
    const canAddToCart = isAvailable && !isClosed;

    const handleAdd = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!canAddToCart) return;
        onAdd(qty);
        setAnimating(true);
        setTimeout(() => setAnimating(false), 1000);
        setQty(unitInfo.step);
    };

    return (
        <div
            onClick={onOpenDetail}
            className={`bg-white dark:bg-zinc-900 border ${isAdded ? 'border-orange-500/30' : 'border-gray-100 dark:border-zinc-800/70'} rounded-2xl p-4 flex items-center gap-4 transition-all hover:shadow-md hover:border-gray-200 dark:hover:border-zinc-700 group relative cursor-pointer`}
        >
            {isAdded && (
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full z-10 animate-in fade-in zoom-in">
                    <Check size={8} strokeWidth={4} />
                    EN EL CARRITO
                </div>
            )}

            {/* Imagen con Aspect Ratio controlado */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-2xl shrink-0 relative overflow-hidden border border-gray-100 dark:border-zinc-800/60 shadow-sm">
                {prod.imagen_url && !imageError ? (
                    <>
                        {loadingImage && (
                            <div className="absolute inset-0 bg-gray-200 dark:bg-zinc-800 animate-pulse z-10" />
                        )}
                        <Image
                            src={resolveImageUrl(prod.imagen_url)}
                            alt={prod.nombre_producto || "Producto"}
                            fill
                            className={`object-cover group-hover:scale-110 transition-all duration-700 ${!isAvailable ? 'grayscale opacity-50' : ''} ${loadingImage ? 'opacity-0 scale-105 blur-sm' : 'opacity-100 scale-100 blur-0'}`}
                            unoptimized
                            onLoad={() => setLoadingImage(false)}
                            onError={() => {
                                setImageError(true);
                                setLoadingImage(false);
                            }}
                        />
                    </>
                ) : (
                    <span className="text-2xl opacity-70">{fallbackEmoji || "🏪"}</span>
                )}
                {!isAvailable && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-1">
                        <span className="text-[10px] font-black text-white bg-red-600 px-1.5 py-0.5 rounded-md transform -rotate-12 shadow-lg tracking-widest uppercase">AGOTADO</span>
                    </div>
                )}
            </div>

            {/* Info con mejor tipografía */}
            <div className="flex-1 min-w-0">
                <h3 className="text-[14px] sm:text-[15px] font-black text-gray-900 dark:text-white leading-tight mb-1">
                    {prod.nombre_producto}
                </h3>
                {prod.descripcion && (
                    <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-0.5 line-clamp-2 leading-tight pr-2">
                        {prod.descripcion}
                    </p>
                )}

                {/* Detalles extra para educación: Nivel y Duración */}
                {(prod.detalles_especificos?.nivel || prod.detalles_especificos?.duracion) && (
                    <div className="flex flex-wrap gap-2 mt-1 mb-2">
                        {prod.detalles_especificos.nivel && (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 dark:text-indigo-400 px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-md uppercase tracking-tighter">
                                <Star size={10} fill="currentColor" />
                                {prod.detalles_especificos.nivel}
                            </div>
                        )}
                        {prod.detalles_especificos.duracion && (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 dark:text-zinc-400 px-1.5 py-0.5 bg-gray-50 dark:bg-zinc-800 rounded-md uppercase tracking-tighter">
                                <Clock size={10} />
                                {prod.detalles_especificos.duracion}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-1.5">
                    <span className="text-[17px] font-black text-gray-900 dark:text-white">
                        ${Number(prod.precio_base).toLocaleString('es-AR')}
                    </span>
                    {unitInfo.priceLabel && (
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{unitInfo.priceLabel}</span>
                    )}
                </div>
            </div>

            {/* Actions con feedback visual */}
            <div className="shrink-0 flex flex-col items-end gap-2 sm:gap-3">
                {hasAccess ? (
                    <div className="flex flex-col items-end gap-2">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                            <CheckCircle2 size={10} strokeWidth={3} /> Inscripto
                        </span>
                        <Link
                            href={`/cursos/${prod.id_producto}`}
                            className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-wider rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                        >
                            Ver Ahora <ArrowRight size={12} strokeWidth={3} />
                        </Link>
                    </div>
                ) : (
                    <>
                        <button
                            onClick={handleAdd}
                            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${animating ? 'bg-emerald-500 text-white scale-125' : 'bg-gray-50 dark:bg-zinc-800 text-gray-400 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white'}`}
                        >
                            {animating ? <Check size={16} strokeWidth={4} /> : <Plus size={16} />}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
