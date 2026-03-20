"use client";

import { Zap, Rocket } from "lucide-react";

export function PromoBanner() {
    return (
        <div className="bg-gradient-to-br from-[#D85A30] to-orange-500 rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden group shadow-lg shadow-orange-600/10 my-16 mx-2 sm:mx-0">
            <div className="relative z-10 max-w-xl space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-semibold tracking-wide">
                    <Zap size={14} fill="currentColor" /> ¡Envío directo!
                </span>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.1]">
                    Hacé tu pedido <br className="hidden sm:block" /> <span className="text-orange-100">en un Click.</span>
                </h2>
                <p className="text-orange-50/90 font-medium text-sm md:text-base max-w-md">
                    Sin comisiones extra. Comunicate directo con el comercio por WhatsApp.
                </p>
            </div>
            <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 opacity-[0.08] group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-1000">
                <Rocket size={320} />
            </div>
        </div>
    );
}
