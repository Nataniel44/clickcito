"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FooterCTA() {
    return (
        <div className="mt-24 pt-20 border-t border-gray-100 dark:border-zinc-900 text-center pb-12 px-4">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">¿Tenés un negocio?</h2>
            <p className="text-gray-500 mb-10 max-w-lg mx-auto font-medium text-[15px]">
                Unite a la red de Clickcito y empezá a vender online hoy mismo. Es simple, rápido y gratis.
            </p>
            <Link href="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-[#D85A30] text-white font-semibold rounded-2xl shadow-lg shadow-orange-600/20 hover:scale-105 active:scale-95 transition-all text-[15px]">
                Crear mi Tienda Gratis <ArrowRight size={18} />
            </Link>
        </div>
    );
}
