"use client";

import React, { useState } from "react";
import { Eye, Package, Tag, Trash2, Plus, Edit, ArrowLeft, Store } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { ProductModal } from "./ProductModal";

export function ProductsPanel({
    productos,
    loadingProductos,
    handleDeleteProducto,
    router,
    user,
    negocioData,
    onStopManaging
}: {
    productos: any[];
    loadingProductos: boolean;
    handleDeleteProducto: (id: string, name?: string) => void;
    router: any;
    user: any;
    negocioData?: any;
    onStopManaging?: () => void;
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productoParaEditar, setProductoParaEditar] = useState<any | null>(null);

    const handleOpenAdd = () => {
        setProductoParaEditar(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (p: any) => {
        setProductoParaEditar(p);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {onStopManaging && (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-600 text-white rounded-lg"><Store size={20} /></div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-emerald-600 tracking-widest">Gestionando productos de</p>
                            <h3 className="text-sm font-black text-emerald-900 dark:text-emerald-400">{negocioData?.nombre}</h3>
                        </div>
                    </div>
                    <button
                        onClick={onStopManaging}
                        className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-black rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        <ArrowLeft size={14} /> Cerrar gestión
                    </button>
                </div>
            )}
            <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-500 font-bold">{productos.length} productos en tu catálogo</p>
                <div className="flex gap-2">
                    <button onClick={() => router.push(`/negocio/${negocioData?.id || negocioData?.id_negocio || user?.id_negocio}`)} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white text-xs font-black rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
                        <Eye size={14} /> Ver Catálogo
                    </button>
                    <button onClick={handleOpenAdd} className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black text-xs font-black rounded-xl hover:scale-105 transition-transform">
                        <Plus size={14} /> Agregar Producto
                    </button>
                </div>
            </div>

            {
                loadingProductos ? (
                    <div className="text-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto" /></div>
                ) : productos.length === 0 ? (
                    <EmptyState icon={Package} text="No tenés productos aún" sub="Empezá a agregar productos a tu catálogo ahora mismo." action={{ label: "Agregar Producto", onClick: handleOpenAdd }} />
                ) : (
                    <div className="space-y-3">
                        {productos.map(p => (
                            <div key={p.id_producto} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-4 md:p-5 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
                                    <Tag size={20} className="text-orange-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-sm truncate">{p.nombre_producto}</h4>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-xs font-black text-orange-600">${Number(p.precio_base).toLocaleString('es-AR')}</span>
                                        {p.detalles_especificos?.unidad_medida && (
                                            <span className="text-[10px] font-bold text-gray-400">/{p.detalles_especificos.unidad_medida}</span>
                                        )}
                                        {p.detalles_especificos?.tipo && (
                                            <span className="text-[10px] font-bold bg-gray-100 dark:bg-zinc-800 text-gray-500 px-2 py-0.5 rounded">{p.detalles_especificos.tipo}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => handleOpenEdit(p)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all" title="Editar producto">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => handleDeleteProducto(p.id_producto)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all" title="Eliminar producto">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={user}
                negocioData={negocioData}
                productoParaEditar={productoParaEditar}
            />
        </div >
    );
}
