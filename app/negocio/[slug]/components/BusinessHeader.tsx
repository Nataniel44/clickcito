"use client";

import { ArrowLeft, Share, MessageCircle, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { resolveImageUrl } from "@/app/utils/imageUtils";
import { useState, memo } from "react";
import { ScrollableNavbar } from "./ScrollableNavbar";

const LogoImage = memo(function LogoImage({ src, alt, size, className }: { src: string; alt: string; size: "small" | "large"; className?: string }) {
    const [loading, setLoading] = useState(true);

    return (
        <>
            {loading && (
                <div className={`absolute inset-0 ${size === "large" ? "bg-white/10" : "bg-gray-200 dark:bg-zinc-800"} animate-pulse z-10`} />
            )}
            <Image
                src={src}
                fill
                className={`object-cover transition-all duration-700 ${loading ? 'opacity-0 scale-110 blur-sm' : 'opacity-100 scale-100 blur-0'} ${className || ''}`}
                alt={alt}
                unoptimized
                loading="lazy"
                sizes={size === "large" ? "80px" : "32px"}
                onLoad={() => setLoading(false)}
                onError={() => setLoading(false)}
            />
        </>
    );
});

interface BusinessHeaderProps {
    negocio: any;
    gradient: string;
    emoji: string;
    isScrolled: boolean;
    onBack: () => void;
    onShare: () => void;
    onWhatsapp: () => void;
}

export function BusinessHeader({
    negocio,
    gradient,
    emoji,
    isScrolled,
    onBack,
    onShare,
    onWhatsapp
}: BusinessHeaderProps) {
    const rating = negocio.rating || null;

    return (
        <>
            {/* ── Fixed Top Bar (Compact): only visible on scroll ── */}
            <ScrollableNavbar
                onBack={onBack}
                onShare={onShare}
                onWhatsapp={onWhatsapp}
            />

            {/* ── Hero Banner ── */}
            <div className={`relative w-full bg-gradient-to-br ${gradient} overflow-hidden`} style={{ minHeight: '250px', paddingTop: '64px' }}>
                {/* Floating Action Buttons in Hero - positioned below the main navbar */}
                <div className={`absolute top-[90px] inset-x-0 z-40 transition-opacity duration-300 ${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
                        <button
                            onClick={onBack}
                            className="p-2.5 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-black/30 transition-all active:scale-95 shadow-md"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div className="flex items-center gap-2">
                            <button onClick={onShare} className="p-2.5 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-black/30 transition-all active:scale-95 shadow-md">
                                <Share size={16} />
                            </button>
                            <button onClick={onWhatsapp} className="p-2.5 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-black/30 transition-all active:scale-95 shadow-md">
                                <MessageCircle size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -top-10 -left-10 w-48 h-48 bg-black/5 rounded-full blur-2xl" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="max-w-3xl mx-auto flex items-end gap-3 sm:gap-4">
                        {/* Logo */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 shadow-xl relative overflow-hidden shrink-0">
                            {negocio.logo_url ? (
                                <LogoImage
                                    src={resolveImageUrl(negocio.logo_url)}
                                    alt={negocio.nombre}
                                    size="large"
                                />
                            ) : (
                                <span className="absolute inset-0 flex items-center justify-center text-3xl">{emoji}</span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0 pb-0.5">
                            <div className="flex items-center gap-1.5 flex-wrap -mb-0.5">
                                <h1 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md">{negocio.nombre}</h1>
                                {negocio.verificado && <CheckCircle2 size={16} className="text-white/90 shrink-0" fill="currentColor" />}
                            </div>
                            <p className="text-white/80 text-[11px] sm:text-[12px] leading-tight line-clamp-1 italic">{negocio.rubro}</p>
                        </div>
                        {rating && rating.total_resenas > 0 && (
                            <div className="shrink-0 flex flex-col items-center bg-white/20 backdrop-blur-md rounded-xl px-3 py-2 border border-white/30 shadow-md">
                                <span className="text-[18px] font-black text-white leading-none">{Number(rating.promedio).toFixed(1)}</span>
                                <span className="text-amber-300 text-[10px]">★★★★★</span>
                                <span className="text-white/60 text-[9px] mt-0.5">{rating.total_resenas} votos</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
