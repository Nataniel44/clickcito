"use client";

import { Plus, ChevronRight } from "lucide-react";
import Image from "next/image";
import { resolveImageUrl } from "@/app/utils/imageUtils";

interface PhotoLightboxProps {
    activePhotoIndex: number | null;
    fotos: string[];
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
}

export function PhotoLightbox({
    activePhotoIndex,
    fotos,
    onClose,
    onNext,
    onPrev
}: PhotoLightboxProps) {
    if (activePhotoIndex === null) return null;

    const currentPhoto = fotos[activePhotoIndex];

    return (
        <div
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center select-none"
            onClick={onClose}
        >
            {/* Header Controls */}
            <div className="absolute top-0 inset-x-0 p-5 flex items-center justify-between z-[210]">
                <span className="text-white/60 text-[13px] font-black tracking-widest">
                    {activePhotoIndex + 1} / {fotos.length}
                </span>
                <button
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white transition-colors"
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                >
                    <Plus size={24} className="rotate-45" />
                </button>
            </div>

            {/* Navigation Buttons */}
            <button
                className="absolute left-4 w-12 h-12 bg-white/5 hover:bg-white/10 backdrop-blur rounded-full flex items-center justify-center text-white transition-all active:scale-95 z-[210]"
                onClick={(e) => { e.stopPropagation(); onPrev(); }}
            >
                <ChevronRight className="rotate-180" size={24} />
            </button>
            <button
                className="absolute right-4 w-12 h-12 bg-white/5 hover:bg-white/10 backdrop-blur rounded-full flex items-center justify-center text-white transition-all active:scale-95 z-[210]"
                onClick={(e) => { e.stopPropagation(); onNext(); }}
            >
                <ChevronRight size={24} />
            </button>

            {/* Image Container */}
            <div
                className="relative w-full h-[70vh] flex items-center justify-center p-4 transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {(currentPhoto.startsWith('http') || currentPhoto.startsWith('/')) ? (
                    <div className="relative w-full h-full max-w-4xl animate-in zoom-in-95 duration-300">
                        <Image
                            src={resolveImageUrl(currentPhoto)}
                            alt={`Foto ${activePhotoIndex + 1}`}
                            fill
                            className="object-contain"
                            unoptimized
                            priority
                        />
                    </div>
                ) : (
                    <span className="text-9xl">{currentPhoto}</span>
                )}
            </div>
        </div>
    );
}
