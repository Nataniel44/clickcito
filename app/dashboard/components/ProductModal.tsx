"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Edit3 } from "lucide-react";
import { createProducto, updateProducto } from "@/app/firebase/db";
import { db } from "@/app/firebase/config";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import toast from "react-hot-toast";

export function ProductModal({
    isOpen,
    onClose,
    user,
    negocioData,
    productoParaEditar = null
}: {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    negocioData?: any;
    productoParaEditar?: any;
}) {
    const [loading, setLoading] = useState(false);
    const [creatingCategory, setCreatingCategory] = useState(false);
    const [formData, setFormData] = useState({
        nombre_producto: "",
        precio_base: "",
        tipo: "",
        unidad_medida: "u",
        venta_fraccionada: false,
        duracion: "",
        talles: "",
    });

    const isEditing = !!productoParaEditar;

    useEffect(() => {
        if (productoParaEditar) {
            setFormData({
                nombre_producto: productoParaEditar.nombre_producto || "",
                precio_base: productoParaEditar.precio_base?.toString() || "",
                tipo: productoParaEditar.detalles_especificos?.tipo || "",
                unidad_medida: productoParaEditar.detalles_especificos?.unidad_medida || "u",
                venta_fraccionada: productoParaEditar.detalles_especificos?.venta_fraccionada || false,
                duracion: productoParaEditar.detalles_especificos?.duracion || "",
                talles: productoParaEditar.detalles_especificos?.talles || "",
            });
            // If the category is not in the native categories, assume we are creating/using a custom one
            const cats = negocioData?.categorias || [];
            if (productoParaEditar.detalles_especificos?.tipo && !cats.includes(productoParaEditar.detalles_especificos.tipo)) {
                setCreatingCategory(true);
            } else {
                setCreatingCategory(false);
            }
        } else {
            setFormData({
                nombre_producto: "",
                precio_base: "",
                tipo: "",
                unidad_medida: "u",
                venta_fraccionada: false,
                duracion: "",
                talles: "",
            });
            setCreatingCategory(false);
        }
    }, [productoParaEditar, negocioData]);

    if (!isOpen) return null;

    const categoriasNativas = negocioData?.categorias || [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.nombre_producto || !formData.precio_base) {
            toast.error("Nombre y precio son obligatorios");
            return;
        }

        if (!user?.id_negocio) {
            toast.error("Error: No se encontró el negocio");
            return;
        }

        setLoading(true);
        try {
            const data = {
                nombre_producto: formData.nombre_producto,
                precio_base: Number(formData.precio_base),
                detalles_especificos: {
                    ...(formData.tipo && { tipo: formData.tipo }),
                    ...(formData.unidad_medida !== "u" && { unidad_medida: formData.unidad_medida }),
                    ...(formData.venta_fraccionada && { venta_fraccionada: formData.venta_fraccionada }),
                    ...(formData.duracion && { duracion: formData.duracion }),
                    ...(formData.talles && { talles: formData.talles }),
                }
            };

            if (isEditing) {
                await updateProducto(productoParaEditar.id_producto, data);
                toast.success("Producto actualizado con éxito");
            } else {
                await createProducto(user.id_negocio, data);
                toast.success("Producto agregado con éxito");
            }

            // Guardar o actualizar la categoría a nivel del Negocio si es nueva
            if (formData.tipo && !categoriasNativas.includes(formData.tipo)) {
                try {
                    const negRef = doc(db, "negocios", user.id_negocio);
                    await updateDoc(negRef, {
                        categorias: arrayUnion(formData.tipo)
                    });
                } catch (catErr) {
                    console.error("Error guardando categoría en el negocio", catErr);
                }
            }

            onClose();
        } catch (error) {
            console.error(error);
            toast.error(isEditing ? "Error al actualizar el producto" : "Error al agregar el producto");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-8 pb-8 max-h-[90vh] overflow-y-auto no-scrollbar">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-black tracking-tighter">
                                {isEditing ? "Editar Producto" : "Agregar Nuevo Producto"}
                            </h2>
                            <p className="text-sm font-medium text-gray-500 mt-1">
                                {isEditing ? "Modifica los detalles de tu artículo." : "Completa los detalles de tu nuevo artículo."}
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-xl text-gray-400 hover:text-gray-900 transition-colors"><X size={20} /></button>
                    </div>

                    <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 px-1">Nombre del Producto *</label>
                            <input
                                type="text"
                                value={formData.nombre_producto}
                                onChange={(e) => setFormData({ ...formData, nombre_producto: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium placeholder-gray-400 transition-all font-bold"
                                placeholder="Ej: Hamburguesa Completa"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 px-1">Precio Base *</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">$</span>
                                    <input
                                        type="number"
                                        value={formData.precio_base}
                                        onChange={(e) => setFormData({ ...formData, precio_base: e.target.value })}
                                        className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium placeholder-gray-400 transition-all font-bold"
                                        placeholder="0"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1.5 px-1 pb-[1px]">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Categoría</label>
                                    <button
                                        type="button"
                                        onClick={() => { setCreatingCategory(!creatingCategory); setFormData({ ...formData, tipo: "" }) }}
                                        className="text-[10px] text-orange-600 dark:text-orange-500 font-bold hover:underline"
                                    >
                                        {creatingCategory || categoriasNativas.length === 0 ? "Elegir existente" : "+ Nueva de 0"}
                                    </button>
                                </div>

                                {(!creatingCategory && categoriasNativas.length > 0) ? (
                                    <select
                                        value={formData.tipo}
                                        onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium transition-all font-bold appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTNhM2FmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBvbHlsaW5lIHBvaW50cz0iNiA5IDEyIDE1IDE4IDkiLz48L3N2Zz4=')] bg-no-repeat bg-[position:right_1rem_center] bg-[length:1.2em]"
                                    >
                                        <option value="">Seleccionar categoría...</option>
                                        {categoriasNativas.map((c: string, idx: number) => (
                                            <option key={idx} value={c}>{c}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        value={formData.tipo}
                                        onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium placeholder-gray-400 transition-all font-bold"
                                        placeholder="Escribe el nombre de la categoría"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 px-1">Unidad de Medida</label>
                                <select
                                    value={formData.unidad_medida}
                                    onChange={(e) => setFormData({ ...formData, unidad_medida: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium transition-all font-bold"
                                >
                                    <option value="u">Unidad (Por defecto)</option>
                                    <option value="kg">Kilogramos</option>
                                    <option value="litro">Litros</option>
                                    <option value="m²">Metros Cuadrados</option>
                                    <option value="metros">Metros Lineales</option>
                                    <option value="bolsa">Bolsa</option>
                                    <option value="rollo">Rollo</option>
                                    <option value="placa">Placa</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 px-1">Duración (Turnos)</label>
                                <input
                                    type="text"
                                    value={formData.duracion}
                                    onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium placeholder-gray-400 transition-all font-bold"
                                    placeholder="Ej: 30 min, 1 Hora"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 px-1">Talles (Info)</label>
                                <input
                                    type="text"
                                    value={formData.talles}
                                    onChange={(e) => setFormData({ ...formData, talles: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium placeholder-gray-400 transition-all font-bold"
                                    placeholder="Ej: S, M, L, XL"
                                />
                            </div>
                        </div>

                        <div className="pt-4 mt-4 border-t border-gray-100 dark:border-zinc-800 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 px-4 bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 font-black rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3 px-4 flex items-center justify-center gap-2 bg-orange-600 text-white font-black rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        {isEditing ? <Edit3 size={18} /> : <Save size={18} />}
                                        {isEditing ? "Actualizar Producto" : "Guardar Producto"}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
