"use client";

import { Search } from "lucide-react";

interface EmptyResultsProps {
    onClear: () => void;
}

export function EmptyResults({ onClear }: EmptyResultsProps) {
    return (
        <div className="py-24 text-center">
            <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Search size={32} className="text-gray-300 dark:text-zinc-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">No hay coincidencias</h3>
            <p className="text-gray-500 font-medium text-[15px]">Probá buscando con otros términos o rubros.</p>
            <button
                onClick={onClear}
                className="mt-6 px-6 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 rounded-xl font-medium text-sm hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
            >
                Ver todas las tiendas
            </button>
        </div>
    );
}
