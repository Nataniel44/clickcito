"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Runtime Error Captured:", error);
    }, [error]);

    const isNetworkError = error.message?.toLowerCase().includes("network") ||
        error.message?.toLowerCase().includes("fetch") ||
        !navigator.onLine;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFDFD] dark:bg-[#060606] px-6 text-center">
            <div className={`w-20 h-20 rounded-[2rem] ${isNetworkError ? 'bg-orange-500/10 text-orange-600' : 'bg-red-500/10 text-red-600'} flex items-center justify-center mb-8 shadow-inner`}>
                <AlertCircle size={40} />
            </div>

            <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight mb-3">
                {isNetworkError ? "¡Ups! Problemas de red" : "Algo salió mal"}
            </h1>

            <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm max-w-[320px] mb-10 leading-relaxed">
                {isNetworkError
                    ? "Parece que tu conexión a internet está fallando. Asegúrate de tener wifi o datos e intenta nuevamente."
                    : "Hemos tenido un error inesperado. Estamos trabajando para solucionarlo lo antes posible."
                }
            </p>

            <div className="flex flex-col w-full max-w-[280px] gap-3">
                <button
                    onClick={() => reset()}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                    <RefreshCcw size={18} />
                    Reintentar ahora
                </button>

                <Link
                    href="/"
                    className="w-full flex items-center justify-center gap-2 py-4 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 font-black rounded-2xl hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all border border-zinc-200/50 dark:border-zinc-800"
                >
                    <Home size={18} />
                    Volver al inicio
                </Link>
            </div>

            <footer className="mt-20">
                <p className="text-[10px] font-black text-zinc-300 dark:text-zinc-800 uppercase tracking-[0.4em]">Error Handler OS v1.0</p>
            </footer>
        </div>
    );
}
