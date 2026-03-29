"use client";

import React, { useState } from "react";
import { Eye, Package, Tag, Trash2, Plus, Edit, ArrowLeft, Store, LayoutGrid, List, ArrowUp, ArrowDown, Save, SlidersHorizontal } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { ProductModal } from "./ProductModal";
import { updateNegocio, updateProducto } from "@/app/firebase/db";
import toast from "react-hot-toast";
import Image from "next/image";

function CategoryOrderModal({ isOpen, onClose, orderedKeys, negocioId }: any) {
    const [localOrder, setLocalOrder] = useState<string[]>([]);

    React.useEffect(() => {
        if (isOpen) setLocalOrder(orderedKeys);
    }, [isOpen, orderedKeys]);

    if (!isOpen) return null;

    const moveUp = (idx: number) => {
        if (idx === 0) return;
        const newOrder = [...localOrder];
        [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
        setLocalOrder(newOrder);
    };

    const moveDown = (idx: number) => {
        if (idx === localOrder.length - 1) return;
        const newOrder = [...localOrder];
        [newOrder[idx + 1], newOrder[idx]] = [newOrder[idx], newOrder[idx + 1]];
        setLocalOrder(newOrder);
    };

    const handleSave = async () => {
        try {
            await updateNegocio(negocioId, { orden_categorias: localOrder });
            toast.success("Orden actualizado");
            onClose();
        } catch (e) {
            toast.error("Error al guardar");
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-[#FBFBFB] dark:bg-zinc-950 w-full max-w-sm rounded-[2rem] shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden animate-in zoom-in duration-300 p-6 flex flex-col max-h-[85vh]">
                <h3 className="font-black text-xl mb-4 flex items-center gap-2"><SlidersHorizontal className="text-orange-600" /> Ordenar Categorías</h3>
                <div className="space-y-2 mb-6 overflow-y-auto custom-scrollbar flex-1">
                    {localOrder.map((cat, i) => (
                        <div key={cat} className="flex items-center justify-between bg-white dark:bg-zinc-900 p-3 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                            <span className="font-bold text-sm truncate mr-2">{cat}</span>
                            <div className="flex gap-1 shrink-0">
                                <button onClick={() => moveUp(i)} disabled={i === 0} className="p-1.5 bg-gray-50 dark:bg-zinc-800 rounded-lg hover:text-orange-600 disabled:opacity-30 transition-colors"><ArrowUp size={14} /></button>
                                <button onClick={() => moveDown(i)} disabled={i === localOrder.length - 1} className="p-1.5 bg-gray-50 dark:bg-zinc-800 rounded-lg hover:text-orange-600 disabled:opacity-30 transition-colors"><ArrowDown size={14} /></button>
                            </div>
                        </div>
                    ))}
                    {localOrder.length === 0 && <p className="text-xs text-center text-gray-400 py-10 font-bold">No hay categorías para ordenar.</p>}
                </div>
                <div className="flex gap-2">
                    <button onClick={onClose} className="flex-1 py-3 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">Cancelar</button>
                    <button onClick={handleSave} className="flex-1 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 flex items-center justify-center gap-2 transition-colors"><Save size={16} /> Guardar</button>
                </div>
            </div>
        </div>
    );
}

function ProductOrderModal({ isOpen, onClose, lista, categoria }: any) {
    const [localOrder, setLocalOrder] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (isOpen) setLocalOrder(lista);
    }, [isOpen, lista]);

    if (!isOpen) return null;

    const moveUp = (idx: number) => {
        if (idx === 0) return;
        const newOrder = [...localOrder];
        [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
        setLocalOrder(newOrder);
    };

    const moveDown = (idx: number) => {
        if (idx === localOrder.length - 1) return;
        const newOrder = [...localOrder];
        [newOrder[idx + 1], newOrder[idx]] = [newOrder[idx], newOrder[idx + 1]];
        setLocalOrder(newOrder);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await Promise.all(
                localOrder.map((p, i) => updateProducto(p.id_producto, { orden: i }))
            );
            toast.success("Orden de productos actualizado");
            onClose();
        } catch (e) {
            toast.error("Error al guardar el orden");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-[#FBFBFB] dark:bg-zinc-950 w-full max-w-sm rounded-[2rem] shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden animate-in zoom-in duration-300 p-6 flex flex-col max-h-[85vh]">
                <h3 className="font-black text-xl mb-4 flex items-center gap-2"><SlidersHorizontal className="text-orange-600" /> Ordenar en {categoria}</h3>
                <div className="space-y-2 mb-6 overflow-y-auto custom-scrollbar flex-1">
                    {localOrder.map((p, i) => (
                        <div key={p.id_producto} className="flex items-center justify-between bg-white dark:bg-zinc-900 p-3 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                            <span className="font-bold text-sm truncate mr-2">{p.nombre_producto}</span>
                            <div className="flex gap-1 shrink-0">
                                <button onClick={() => moveUp(i)} disabled={i === 0} className="p-1.5 bg-gray-50 dark:bg-zinc-800 rounded-lg hover:text-orange-600 disabled:opacity-30 transition-colors"><ArrowUp size={14} /></button>
                                <button onClick={() => moveDown(i)} disabled={i === localOrder.length - 1} className="p-1.5 bg-gray-50 dark:bg-zinc-800 rounded-lg hover:text-orange-600 disabled:opacity-30 transition-colors"><ArrowDown size={14} /></button>
                            </div>
                        </div>
                    ))}
                    {localOrder.length === 0 && <p className="text-xs text-center text-gray-400 py-10 font-bold">No hay productos en esta categoría.</p>}
                </div>
                <div className="flex gap-2">
                    <button onClick={onClose} disabled={loading} className="flex-1 py-3 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">Cancelar</button>
                    <button onClick={handleSave} disabled={loading} className="flex-1 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 flex items-center justify-center gap-2 transition-colors">
                        {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}

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

    const productosAgrupados = React.useMemo(() => {
        const groups: Record<string, any[]> = {};
        productos.forEach(p => {
            let cat = p.categoria_producto || p.detalles_especificos?.tipo || "General";
            if (p.id_negocio === "elysrestobar" && p.categoria_producto && p.detalles_especificos?.tipo) {
                cat = `${p.categoria_producto} - ${p.detalles_especificos.tipo}`;
            }
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(p);
        });

        // Ordenar productos dentro de su categoría
        Object.keys(groups).forEach(cat => {
            groups[cat].sort((a, b) => {
                const orderA = a.orden ?? 9999;
                const orderB = b.orden ?? 9999;
                if (orderA !== orderB) return orderA - orderB;
                const nameA = a.nombre_producto || a.nombre || "";
                const nameB = b.nombre_producto || b.nombre || "";
                return nameA.localeCompare(nameB);
            });
        });

        return groups;
    }, [productos]);

    const [viewMode, setViewMode] = useState<"card" | "pill">("card");
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [productOrderModalState, setProductOrderModalState] = useState<{ isOpen: boolean, categoria: string, lista: any[] }>({ isOpen: false, categoria: "", lista: [] });
    const [selectedCategory, setSelectedCategory] = useState<string>("Todas");

    const orderedKeys = React.useMemo(() => {
        const agruped = Object.keys(productosAgrupados);
        const order = negocioData?.orden_categorias || [];
        agruped.sort((a, b) => {
            const idxA = order.indexOf(a);
            const idxB = order.indexOf(b);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return a.localeCompare(b);
        });
        return agruped;
    }, [productosAgrupados, negocioData?.orden_categorias]);

    const uniqueMainCats = Array.from(new Set(orderedKeys.map(k => k.includes(' - ') ? k.split(' - ')[0] : k)));
    const categoriesList = ["Todas", ...uniqueMainCats];

    const categoriesToRender = selectedCategory === "Todas"
        ? orderedKeys.map(k => [k, productosAgrupados[k]])
        : orderedKeys.filter(k => (k.includes(' - ') ? k.split(' - ')[0] : k) === selectedCategory).map(k => [k, productosAgrupados[k]]);

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
            <div className="flex items-center justify-between xl:block">
                <p className="text-sm text-gray-500 font-bold mb-2 xl:mb-4">{productos.length} productos en tu catálogo</p>
                <div className="flex gap-2">
                    <button onClick={() => setViewMode(v => v === "card" ? "pill" : "card")} className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 text-gray-500 hover:text-orange-600 rounded-xl transition-colors" title="Alternar Vista">
                        {viewMode === "card" ? <LayoutGrid size={16} /> : <List size={16} />}
                    </button>
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
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 flex-1">
                                {categoriesList.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-colors ${selectedCategory === cat
                                            ? 'bg-orange-600 text-white shadow-md'
                                            : 'bg-white dark:bg-zinc-900 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => setIsOrderModalOpen(true)} className="shrink-0 flex items-center gap-2 ml-4 px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 text-gray-500 hover:text-orange-600 rounded-xl transition-colors text-xs font-bold" title="Ordenar Categorías">
                                <SlidersHorizontal size={14} /> <span className="hidden sm:inline">Ordenar</span>
                            </button>
                        </div>

                        <div className="space-y-8">
                            {categoriesToRender.map(([categoria, lista]: any) => (
                                <div key={categoria} className="space-y-3">
                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2 sticky top-[60px] md:top-20 z-10 bg-[#f4f4f5]/90 dark:bg-zinc-950/90 backdrop-blur-md py-2 -mx-2 mb-2 rounded-lg flex justify-between items-center">
                                        <span>{categoria.includes(' - ') ? categoria.split(' - ')[1] : categoria} <span className="opacity-50">({lista.length})</span></span>
                                        <button onClick={() => setProductOrderModalState({ isOpen: true, categoria, lista })} className="text-orange-600 hover:text-orange-700 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-lg text-xs font-bold leading-none capitalize flex gap-1 items-center">
                                            <SlidersHorizontal size={12} /> Ordenar Productos
                                        </button>
                                    </h3>

                                    <div className={viewMode === "card" ? "space-y-3" : "flex flex-wrap gap-3"}>
                                        {lista.map((p: any) => (
                                            viewMode === "card" ? (
                                                <div key={p.id_producto} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-4 md:p-5 flex items-center gap-4 hover:shadow-md transition-shadow animate-in fade-in duration-300">
                                                    <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0 overflow-hidden relative">
                                                        {(p.imagen_url || p.imagen) ? (
                                                            <Image src={p.imagen_url || p.imagen} alt={p.nombre_producto} fill className="object-cover" />
                                                        ) : (
                                                            <Tag size={20} className="text-orange-600" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-sm truncate">{p.nombre_producto || p.nombre || "Sin nombre"}</h4>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-xs font-black text-orange-600">${Number(p.precio_base || p.precio || 0).toLocaleString('es-AR')}</span>
                                                            {p.detalles_especificos?.unidad_medida && (
                                                                <span className="text-[10px] font-bold text-gray-400">/{p.detalles_especificos.unidad_medida}</span>
                                                            )}
                                                            {p.detalles_especificos?.tipo && (
                                                                <span className="text-[10px] font-bold bg-gray-100 dark:bg-zinc-800 text-gray-500 px-2 py-0.5 rounded">{p.detalles_especificos.tipo}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1 shrink-0">
                                                        <button onClick={() => handleOpenEdit(p)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all" title="Editar producto">
                                                            <Edit size={16} />
                                                        </button>
                                                        <button onClick={() => handleDeleteProducto(p.id_producto)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all" title="Eliminar producto">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div key={p.id_producto} className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-full pl-4 pr-1.5 py-1.5 hover:shadow-md transition-shadow animate-in fade-in duration-300 w-fit">
                                                    <span className="font-bold text-xs truncate max-w-[150px]">{p.nombre_producto || p.nombre || "Sin nombre"}</span>
                                                    <span className="text-[10px] font-black text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-full">${Number(p.precio_base || p.precio || 0).toLocaleString('es-AR')}</span>
                                                    <div className="flex gap-0.5 ml-1 border-l pl-1.5 border-gray-100 dark:border-zinc-800">
                                                        <button onClick={() => handleOpenEdit(p)} className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors" title="Editar producto"><Edit size={12} /></button>
                                                        <button onClick={() => handleDeleteProducto(p.id_producto)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" title="Eliminar producto"><Trash2 size={12} /></button>
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
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

            <CategoryOrderModal
                isOpen={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
                orderedKeys={orderedKeys}
                negocioId={negocioData?.id || negocioData?.id_negocio || user?.id_negocio}
            />
            <ProductOrderModal
                isOpen={productOrderModalState.isOpen}
                onClose={() => setProductOrderModalState(s => ({ ...s, isOpen: false }))}
                categoria={productOrderModalState.categoria}
                lista={productOrderModalState.lista}
            />
        </div >
    );
}
