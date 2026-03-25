"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Edit3, PlusCircle } from "lucide-react";
import { createProducto, updateProducto } from "@/app/firebase/db";
import { db } from "@/app/firebase/config";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import toast from "react-hot-toast";
import { uploadProductImageAction, uploadFileAction } from "@/app/actions/uploadAction";
import Image from "next/image";

// Import sub-components
import { ModalHeader } from "./product-modal/ModalHeader";
import { BasicInfoSection } from "./product-modal/BasicInfoSection";
import { DescriptionSection } from "./product-modal/DescriptionSection";
import { PricingAndCategory } from "./product-modal/PricingAndCategory";
import { LogisticsSection } from "./product-modal/LogisticsSection";
import { EducationSection } from "./product-modal/EducationSection";
import { ExtrasSection } from "./product-modal/ExtrasSection";

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
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        nombre_producto: "",
        precio_base: "",
        tipo: "",
        unidad_medida: "u",
        venta_fraccionada: false,
        duracion: "",
        talles: "",
        imagen_url: "",
        nivel: "",
        modulos: [] as {
            titulo: string;
            clases: {
                titulo: string;
                video_url: string;
                descripcion: string;
                tipo?: "video" | "lectura";
                recursos: { nombre: string, url: string, file?: File }[];
            }[]
        }[],
        objetivos: "",
        recursos: [] as { nombre: string, url: string, file?: File }[],
        extras: [] as {
            titulo: string;
            tipo: "unica" | "multiple";
            obligatorio: boolean;
            opciones: { nombre: string, precio: number }[];
        }[],
        descripcion: "",
        disponible: true,
        sku: "",
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
                imagen_url: productoParaEditar.imagen_url || productoParaEditar.imagen || "",
                nivel: productoParaEditar.detalles_especificos?.nivel || "",
                modulos: (productoParaEditar.detalles_especificos?.modulos || (productoParaEditar.detalles_especificos?.clases ? [{ titulo: "Módulo Principal", clases: productoParaEditar.detalles_especificos.clases }] : [])).map((m: any) => ({
                    ...m,
                    clases: (m.clases || []).map((c: any) => ({
                        ...c,
                        recursos: c.recursos || []
                    }))
                })),
                objetivos: productoParaEditar.detalles_especificos?.objetivos || "",
                recursos: Array.isArray(productoParaEditar.detalles_especificos?.recursos)
                    ? productoParaEditar.detalles_especificos.recursos
                    : (productoParaEditar.detalles_especificos?.recursos ? [{ nombre: "Material Adicional", url: productoParaEditar.detalles_especificos.recursos }] : []),
                extras: productoParaEditar.detalles_especificos?.extras || [],
                descripcion: productoParaEditar.descripcion || "",
                disponible: productoParaEditar.detalles_especificos?.disponible !== undefined ? productoParaEditar.detalles_especificos.disponible : true,
                sku: productoParaEditar.detalles_especificos?.sku || "",
            });
            setImagePreview(productoParaEditar.imagen_url || productoParaEditar.imagen || null);
            setImageFile(null);
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
                imagen_url: "",
                nivel: "",
                modulos: [],
                objetivos: "",
                recursos: [],
                extras: [],
                descripcion: "",
                disponible: true,
                sku: "",
            });
            setImagePreview(null);
            setImageFile(null);
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

        const targetNegocioId = negocioData?.id || user?.id_negocio;
        if (!targetNegocioId) {
            toast.error("Error: No se encontró el negocio");
            return;
        }

        setLoading(true);
        try {
            let uploadedUrl = formData.imagen_url;
            if (imageFile) {
                const uploadFormData = new FormData();
                uploadFormData.append("file", imageFile);
                uploadedUrl = await uploadProductImageAction(uploadFormData);
            }

            const finalRecursos = await Promise.all(
                formData.recursos.map(async (rec) => {
                    if (rec.file) {
                        const recFormData = new FormData();
                        recFormData.append("file", rec.file);
                        const url = await uploadFileAction(recFormData);
                        return { nombre: rec.nombre, url };
                    }
                    return { nombre: rec.nombre, url: rec.url };
                })
            );

            const finalModulos = await Promise.all(
                formData.modulos.map(async (modulo) => ({
                    ...modulo,
                    clases: await Promise.all(
                        modulo.clases.map(async (clase) => ({
                            ...clase,
                            recursos: await Promise.all(
                                (clase.recursos || []).map(async (rec) => {
                                    if (rec.file) {
                                        const recFormData = new FormData();
                                        recFormData.append("file", rec.file);
                                        const url = await uploadFileAction(recFormData);
                                        return { nombre: rec.nombre, url };
                                    }
                                    return { nombre: rec.nombre, url: rec.url };
                                })
                            )
                        }))
                    )
                }))
            );

            const data = {
                nombre_producto: formData.nombre_producto,
                precio_base: Number(formData.precio_base),
                imagen_url: uploadedUrl,
                detalles_especificos: {
                    ...(formData.tipo && { tipo: formData.tipo }),
                    ...(formData.unidad_medida !== "u" && { unidad_medida: formData.unidad_medida }),
                    ...(formData.venta_fraccionada && { venta_fraccionada: formData.venta_fraccionada }),
                    ...(formData.duracion && { duracion: formData.duracion }),
                    ...(formData.talles && { talles: formData.talles }),
                    ...(formData.nivel && { nivel: formData.nivel }),
                    ...(finalModulos.length > 0 && { modulos: finalModulos }),
                    ...(formData.objetivos && { objetivos: formData.objetivos }),
                    ...(finalRecursos.length > 0 && { recursos: finalRecursos }),
                    ...(formData.extras.length > 0 && { extras: formData.extras }),
                    disponible: formData.disponible,
                    ...(formData.sku && { sku: formData.sku }),
                },
                descripcion: formData.descripcion,
            };

            if (isEditing) {
                await updateProducto(productoParaEditar.id_producto, data);
                toast.success("Producto actualizado con éxito");
            } else {
                await createProducto(targetNegocioId, data);
                toast.success("Producto agregado con éxito");
            }

            if (formData.tipo && !categoriasNativas.includes(formData.tipo)) {
                try {
                    const negRef = doc(db, "negocios", targetNegocioId);
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
                    <ModalHeader isEditing={isEditing} onClose={onClose} />

                    <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
                        <BasicInfoSection
                            formData={formData}
                            setFormData={setFormData}
                            imagePreview={imagePreview}
                            setImageFile={setImageFile}
                            setImagePreview={setImagePreview}
                        />

                        <DescriptionSection
                            formData={formData}
                            setFormData={setFormData}
                        />

                        <PricingAndCategory
                            formData={formData}
                            setFormData={setFormData}
                            categoriasNativas={categoriasNativas}
                            creatingCategory={creatingCategory}
                            setCreatingCategory={setCreatingCategory}
                        />

                        <LogisticsSection
                            formData={formData}
                            setFormData={setFormData}
                            negocioData={negocioData}
                        />

                        {(negocioData?.rubro?.toLowerCase() === "educación" ||
                            negocioData?.rubro?.toLowerCase() === "educacion" ||
                            negocioData?.rubro?.toLowerCase() === "academia") && (
                                <EducationSection
                                    formData={formData}
                                    setFormData={setFormData}
                                />
                            )}

                        <ExtrasSection
                            formData={formData}
                            setFormData={setFormData}
                        />

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
