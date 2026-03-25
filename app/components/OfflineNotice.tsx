"use client";

import { useState, useEffect } from "react";
import { WifiOff, AlertTriangle, RefreshCcw } from "lucide-react";

export default function OfflineNotice() {
    const [isOffline, setIsOffline] = useState(false);
    const [showReconnect, setShowReconnect] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOffline(false);
            setShowReconnect(true);
            setTimeout(() => setShowReconnect(false), 3000);
        };
        const handleOffline = () => setIsOffline(true);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        // Check initial state
        if (!navigator.onLine) setIsOffline(true);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    if (isOffline) {
        return (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] animate-in slide-in-from-top-4 duration-500 max-w-[90%] w-full sm:w-auto">
                <div className="bg-red-500/95 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-red-400/50">
                    <WifiOff size={20} className="animate-pulse" />
                    <div className="flex flex-col">
                        <span className="text-[11px] font-black uppercase tracking-widest leading-none mb-1">Conexión perdida</span>
                        <span className="text-[13px] font-bold opacity-90 leading-tight">Revisá tu wifi. La app guardará tus cambios cuando vuelvas.</span>
                    </div>
                </div>
            </div>
        );
    }

    if (showReconnect) {
        return (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] animate-in slide-in-from-top-4 fade-out duration-1000 delay-[2000ms] max-w-[90%] w-full sm:w-auto">
                <div className="bg-emerald-500/95 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/50">
                    <RefreshCcw size={20} className="animate-spin" />
                    <div className="flex flex-col">
                        <span className="text-[11px] font-black uppercase tracking-widest leading-none mb-1">¡Online!</span>
                        <span className="text-[13px] font-bold opacity-90 leading-tight">Conexión restablecida con éxito.</span>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
