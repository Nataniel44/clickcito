"use client";

import { Plus, ChevronRight } from "lucide-react";
import Image from "next/image";
import { resolveImageUrl } from "@/app/utils/imageUtils";
import { useState, useRef, useCallback } from "react";

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
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [touchDelta, setTouchDelta] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const minSwipeDistance = 30;

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        setTouchEnd(0);
        setTouchStart(e.targetTouches[0].clientX);
        setTouchDelta(0);
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        const currentTouch = e.targetTouches[0].clientX;
        const delta = currentTouch - touchStart;
        setTouchEnd(currentTouch);
        setTouchDelta(delta);
    }, [touchStart]);

    const handleTouchEnd = useCallback(() => {
        if (!touchEnd) {
            setTouchDelta(0);
            return;
        }

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            onNext();
        } else if (isRightSwipe) {
            onPrev();
        }

        setTouchDelta(0);
        setTouchStart(0);
        setTouchEnd(0);
    }, [touchStart, touchEnd, onNext, onPrev]);

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
                ref={containerRef}
                className="relative w-full h-[70vh] flex items-center justify-center p-4 transition-all duration-300 touch-pan-x"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                    transform: touchDelta !== 0 ? `translateX(${touchDelta * 0.3}px)` : undefined,
                    transition: touchDelta !== 0 ? 'none' : 'transform 0.3s ease-out'
                }}
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
