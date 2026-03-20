export default function GlobalLoading() {
    return (
        <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none">
            {/* Barra de progreso superior - INMEDIATA */}
            <div className="h-1.5 w-full bg-orange-100 dark:bg-zinc-800 overflow-hidden">
                <div className="h-full bg-orange-600 animate-loading-bar origin-left"></div>
            </div>

            {/* Overlay sutil - CON RETRASO para no molestar en clicks rápidos */}
            <div className="fixed inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-[1px] flex items-center justify-center animate-delayed-fade-in pointer-events-auto">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-zinc-800 flex flex-col items-center gap-4">
                    <div className="relative w-12 h-12">
                        <div className="absolute inset-0 border-4 border-gray-100 dark:border-zinc-800 rounded-full" />
                        <div className="absolute inset-0 border-4 border-transparent border-t-orange-600 rounded-full animate-spin" />
                    </div>
                    <p className="text-gray-900 dark:text-white font-black text-xs uppercase tracking-widest animate-pulse">
                        Clickcito
                    </p>
                </div>
            </div>
        </div>
    )
}
