"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { X, Plus, Minus, Check } from "lucide-react";
import { resolveImageUrl } from "@/app/utils/imageUtils";

interface ProductDetailModalProps {
    isOpen: boolean;
    isOpenBusiness: boolean;
    onClose: () => void;
    product: any;
    onAddToCart: (qty: number, extras: any[]) => void;
    accent: string;
}

export function ProductDetailModal({ isOpen, isOpenBusiness, onClose, product, onAddToCart, accent }: ProductDetailModalProps) {
    const [qty, setQty] = useState(1);
    const [selectedExtras, setSelectedExtras] = useState<Record<number, string[]>>({}); // groupIdx -> [optionName]
    const [loadingImage, setLoadingImage] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setQty(1);
            setSelectedExtras({});
            // Reset scroll or anything if needed
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => { document.body.style.overflow = "auto"; };
    }, [isOpen]);

    const extras = useMemo(() => product?.detalles_especificos?.extras || [], [product]);

    const totalPrice = useMemo(() => {
        if (!product) return 0;
        let base = Number(product.precio_base) || 0;
        let extrasTotal = 0;

        Object.entries(selectedExtras).forEach(([groupIdx, selectedNames]) => {
            const group = extras[Number(groupIdx)];
            if (group) {
                selectedNames.forEach(name => {
                    const option = group.opciones.find((o: any) => o.nombre === name);
                    if (option) extrasTotal += Number(option.precio) || 0;
                });
            }
        });

        return (base + extrasTotal) * qty;
    }, [product, selectedExtras, qty, extras]);

    const handleToggleExtra = (groupIdx: number, optionName: string, tipo: "unica" | "multiple") => {
        setSelectedExtras(prev => {
            const current = prev[groupIdx] || [];
            if (tipo === "unica") {
                return { ...prev, [groupIdx]: [optionName] };
            } else {
                if (current.includes(optionName)) {
                    return { ...prev, [groupIdx]: current.filter(n => n !== optionName) };
                } else {
                    return { ...prev, [groupIdx]: [...current, optionName] };
                }
            }
        });
    };

    const handleAdd = () => {
        // Can add validation for "obligatorio" groups here
        const formattedExtras = Object.entries(selectedExtras).map(([groupIdx, names]) => {
            const group = extras[Number(groupIdx)];
            return {
                titulo: group.titulo,
                seleccion: names.map(name => {
                    const opt = group.opciones.find((o: any) => o.nombre === name);
                    return { nombre: name, precio: opt?.precio || 0 };
                })
            };
        });
        onAddToCart(qty, formattedExtras);
        onClose();
    };

    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col lg:flex-row bg-white dark:bg-zinc-950 animate-in fade-in slide-in-from-bottom-10 lg:slide-in-from-right-10 duration-300 overflow-hidden">
            {/* ── Close button (Global for PC) ── */}
            <button
                onClick={onClose}
                className="hidden lg:flex absolute top-8 right-8 p-3 rounded-full bg-gray-100/80 dark:bg-zinc-900/80 backdrop-blur-md text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-800 hover:scale-110 active:scale-95 transition-all z-[110]"
            >
                <X size={24} />
            </button>

            {/* ── Image Area (Left Column on PC) ── */}
            <div className="relative w-full h-[40vh] sm:h-[50vh] lg:h-full lg:w-1/2 shrink-0 bg-gray-100 dark:bg-zinc-900/40">
                {product.imagen_url ? (
                    <>
                        {loadingImage && (
                            <div className="absolute inset-0 bg-gray-200 dark:bg-zinc-800 animate-pulse z-20" />
                        )}
                        <Image
                            src={resolveImageUrl(product.imagen_url)}
                            alt={product.nombre_producto}
                            fill
                            className={`object-cover lg:object-center transition-all duration-700 ${loadingImage ? 'opacity-0 scale-105 blur-sm' : 'opacity-100 scale-100 blur-0'}`}
                            unoptimized
                            onLoad={() => setLoadingImage(false)}
                            onError={() => setLoadingImage(false)}
                        />
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-7xl lg:text-9xl grayscale opacity-20">
                        📦
                    </div>
                )}

                {/* Close button (Mobile only) */}
                <button
                    onClick={onClose}
                    className="lg:hidden absolute top-6 left-6 p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 hover:bg-black/60 transition-all z-10"
                >
                    <X size={20} />
                </button>

                {/* Info Overlay (Desktop only) */}
                <div className="hidden lg:flex absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent items-end p-12">
                    <div className="text-white">
                        <h2 className="text-4xl font-black mb-2 leading-tight drop-shadow-lg">
                            {product.nombre_producto}
                        </h2>
                        <span className="text-3xl font-black opacity-90 drop-shadow-lg">
                            ${Number(product.precio_base).toLocaleString('es-AR')}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Content Area (Right Column on PC) ── */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
                <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
                    <div className="max-w-2xl lg:max-w-none lg:mx-0 mx-auto px-6 lg:px-12 pt-8 lg:pt-20 pb-40">
                        {/* Title & Price (Mobile/Tablet only) */}
                        <div className="lg:hidden flex justify-between items-start gap-4 mb-2">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
                                    {product.nombre_producto}
                                </h2>
                                {product.detalles_especificos?.sku && (
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{product.detalles_especificos.sku}</span>
                                )}
                            </div>
                            <span className="text-2xl font-black text-gray-900 dark:text-white shrink-0">
                                ${Number(product.precio_base).toLocaleString('es-AR')}
                            </span>
                        </div>

                        {product.descripcion && (
                            <div className="mb-10 max-w-xl">
                                <h4 className="lg:hidden text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Descripción</h4>
                                <p className="text-gray-500 dark:text-zinc-400 text-base leading-relaxed italic">
                                    &quot;{product.descripcion}&quot;
                                </p>
                            </div>
                        )}

                        {/* Extras Sections */}
                        <div className="space-y-10">
                            {extras.map((group: any, gIdx: number) => (
                                <div key={gIdx} className="space-y-5">
                                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-900 pb-3">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-black text-gray-900 dark:text-white capitalize tracking-tight">
                                                {group.titulo}
                                            </h3>
                                            <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-tighter">
                                                {group.tipo === 'unica' ? 'Selección Única' : 'Múltiple'}
                                            </span>
                                        </div>
                                        {group.obligatorio && (
                                            <span className="text-[10px] font-black bg-orange-500 text-white px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-orange-500/20">
                                                Requerido
                                            </span>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
                                        {group.opciones.map((opt: any, oIdx: number) => {
                                            const isSelected = selectedExtras[gIdx]?.includes(opt.nombre);
                                            return (
                                                <button
                                                    key={oIdx}
                                                    onClick={() => handleToggleExtra(gIdx, opt.nombre, group.tipo)}
                                                    className={`group relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${isSelected
                                                        ? "border-orange-500 bg-orange-50/50 dark:bg-orange-500/10 scale-[1.02] shadow-sm"
                                                        : "border-gray-100 dark:border-zinc-900 bg-white dark:bg-zinc-900/50 hover:border-gray-200 dark:hover:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/80"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isSelected ? "bg-orange-500 border-orange-500 ring-4 ring-orange-500/10" : "border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                                                            }`}>
                                                            {isSelected && <Check size={14} className="text-white" strokeWidth={4} />}
                                                        </div>
                                                        <div className="text-left">
                                                            <p className={`font-bold text-sm transition-colors ${isSelected ? "text-orange-600 dark:text-orange-400" : "text-gray-800 dark:text-zinc-200"}`}>{opt.nombre}</p>
                                                        </div>
                                                    </div>
                                                    {opt.precio > 0 && (
                                                        <span className={`text-[13px] font-black tabular-nums transition-colors ${isSelected ? "text-orange-600 dark:text-orange-400" : "text-gray-400 dark:text-zinc-500"}`}>
                                                            + ${Number(opt.precio).toLocaleString('es-AR')}
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Sticky Action Bar */}
                <div className="sticky lg:relative bottom-0 inset-x-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-t border-gray-100 dark:border-zinc-900 p-5 lg:p-8 z-50 mt-auto">
                    <div className="max-w-2xl mx-auto lg:max-w-none flex items-center gap-5">
                        {/* Quantity Selector */}
                        <div className="flex items-center gap-2 lg:gap-4 bg-gray-100 dark:bg-zinc-900/50 rounded-2xl p-1 lg:p-1.5 border border-gray-200 dark:border-zinc-800 shrink-0">
                            <button
                                onClick={() => setQty(Math.max(1, qty - 1))}
                                className="w-9 h-9 lg:w-11 lg:h-11 flex items-center justify-center text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-xl hover:bg-white dark:hover:bg-zinc-800 transition-all active:scale-90"
                            >
                                <Minus size={18} />
                            </button>
                            <span className="text-lg lg:text-xl font-black min-w-[28px] lg:min-w-[34px] text-center text-gray-900 dark:text-white tabular-nums">
                                {qty}
                            </span>
                            <button
                                onClick={() => setQty(qty + 1)}
                                className="w-9 h-9 lg:w-11 lg:h-11 flex items-center justify-center text-gray-400 hover:text-green-500 dark:hover:text-green-400 rounded-xl hover:bg-white dark:hover:bg-zinc-800 transition-all active:scale-90"
                            >
                                <Plus size={18} />
                            </button>
                        </div>

                        {/* Add to Cart Button */}
                        {product.detalles_especificos?.disponible !== false ? (
                            isOpenBusiness !== false ? (
                                <button
                                    onClick={handleAdd}
                                    className={`flex-1 flex items-center justify-between px-5 lg:px-8 py-4 lg:py-4.5 rounded-2xl text-white font-black transition-all active:scale-95 shadow-2xl hover:brightness-110 active:brightness-90 ${accent}`}
                                >
                                    <span className="text-[13px] lg:text-[15px] uppercase tracking-[0.1em] font-black opacity-90">Agregar</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-[1px] h-4 bg-white/20 mx-1 hidden sm:block" />
                                        <span className="text-[17px] lg:text-[19px] tabular-nums">$ {totalPrice.toLocaleString('es-AR')}</span>
                                    </div>
                                </button>
                            ) : (
                                <div className="flex-1 flex items-center justify-center py-4 lg:py-4.5 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-extrabold uppercase tracking-widest text-[11px] text-center border border-red-200 dark:border-red-900/30">
                                    Negocio Cerrado
                                </div>
                            )
                        ) : (
                            <div className="flex-1 flex items-center justify-center py-4 lg:py-4.5 rounded-2xl bg-gray-100 dark:bg-zinc-800 text-gray-400 font-extrabold uppercase tracking-widest text-[11px] text-center border border-gray-200 dark:border-zinc-700">
                                Agotado
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
