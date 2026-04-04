"use client";

import { useState, useEffect, useRef, memo } from "react";
import { ArrowLeft, Share, MessageCircle } from "lucide-react";

export const ScrollableNavbar = memo(function ScrollableNavbar({
    onBack,
    onShare,
    onWhatsapp
}: {
    onBack: () => void;
    onShare: () => void;
    onWhatsapp: () => void;
}) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsScrolled(currentScrollY > 140);

            if (currentScrollY < lastScrollY.current || currentScrollY < 100) {
                setIsNavbarVisible(true);
            } else {
                setIsNavbarVisible(false);
            }
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className={`fixed inset-x-0 z-50 transition-all duration-500 ease-in-out ${isNavbarVisible ? "top-[75px]" : "top-0"} ${isScrolled ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
            <div className="bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800/80 shadow-sm transition-colors duration-500">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
                    <button
                        onClick={onBack}
                        className="p-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all active:scale-95"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <button onClick={onShare} className="p-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 hover:bg-gray-200 dark:hover:border-zinc-700 transition-all active:scale-95">
                        <Share size={16} />
                    </button>
                    <button onClick={onWhatsapp} className="p-2.5 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-500 border border-green-100 dark:border-green-500/20 hover:bg-green-100 dark:hover:bg-green-500/20 transition-all active:scale-95">
                        <MessageCircle size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
});
