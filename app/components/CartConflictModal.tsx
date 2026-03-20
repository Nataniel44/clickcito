"use client";

import { useCart } from "@/app/context/CartContext";
import { AlertCircle, ShoppingBag, Trash2, X } from "lucide-react";

export default function CartConflictModal() {
    const { pendingItem, setPendingItem, confirmNewBusiness } = useCart();

    if (!pendingItem) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={() => setPendingItem(null)}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden animate-in zoom-in slide-in-from-bottom-10 duration-500">
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="text-orange-600" size={32} />
                    </div>

                    <h3 className="text-xl font-black mb-3 tracking-tight">¿Cambiar de local?</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-8">
                        Ya tenés productos de otro local en tu carrito.
                        Si continuas, se vaciará el carrito actual para agregar este producto.
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={confirmNewBusiness}
                            className="w-full py-4 bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                        >
                            <Trash2 size={18} /> Vaciar y Agregar
                        </button>

                        <button
                            onClick={() => setPendingItem(null)}
                            className="w-full py-4 bg-gray-50 dark:bg-zinc-800 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 dark:hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"
                        >
                            <X size={18} /> Cancelar
                        </button>
                    </div>
                </div>

                {/* Info del producto pendiente */}
                <div className="bg-orange-50 dark:bg-zinc-800/50 p-4 border-t border-orange-100 dark:border-zinc-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-white dark:bg-zinc-800 rounded-lg flex items-center justify-center text-orange-600">
                        <ShoppingBag size={16} />
                    </div>
                    <div className="flex-1 text-left">
                        <p className="text-[10px] font-black text-orange-600/60 uppercase">Nuevo Producto</p>
                        <p className="text-xs font-black truncate">{pendingItem.nombre_producto}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
