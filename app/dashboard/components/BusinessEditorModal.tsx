"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Store, Clock, Truck, Info, CheckCircle2, Upload, ImageIcon, Loader2, Globe, MapPin, Star, Settings2, CreditCard } from "lucide-react";
import Image from "next/image";
import { updateNegocio } from "@/app/firebase/db";
import { uploadLogoAction, uploadProductImageAction } from "@/app/actions/uploadAction";
import toast from "react-hot-toast";
import { compressImage } from "@/lib/compressImage";

const DAYS = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

export function BusinessEditorModal({
    isOpen,
    onClose,
    negocio,
    onSuccess
}: {
    isOpen: boolean;
    onClose: () => void;
    negocio: any;
    onSuccess?: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("general");
    const [formData, setFormData] = useState<any>(null);

    useEffect(() => {
        if (negocio) {
            setFormData({
                nombre: negocio.nombre || "",
                rubro: negocio.rubro || "gastronomia",
                categoria_principal: negocio.categoria_principal || "gastronomia",
                descripcion: negocio.descripcion || "",
                ubicacion: negocio.ubicacion || "",
                telefono: negocio.telefono || "",
                activo: negocio.activo ?? true,
                abierto_siempre: negocio.abierto_siempre ?? false,
                logo_url: negocio.logo_url || "",
                horarios: negocio.horarios || {
                    lunes: "Cerrado", martes: "Cerrado", miercoles: "Cerrado", jueves: "Cerrado",
                    viernes: "Cerrado", sabado: "Cerrado", domingo: "Cerrado"
                },
                configuracion_logistica: {
                    delivery_habilitado: negocio.configuracion_logistica?.delivery_habilitado ?? true,
                    takeaway_habilitado: negocio.configuracion_logistica?.takeaway_habilitado ?? true,
                    mesa_habilitado: negocio.configuracion_logistica?.mesa_habilitado ?? false,
                    // Nuevas opciones para educación
                    online_habilitado: negocio.configuracion_logistica?.online_habilitado ?? false,
                    presencial_habilitado: negocio.configuracion_logistica?.presencial_habilitado ?? false,
                    digital_habilitado: negocio.configuracion_logistica?.digital_habilitado ?? false,
                    servicio_habilitado: negocio.configuracion_logistica?.servicio_habilitado ?? false,
                    precio_delivery: negocio.configuracion_logistica?.precio_delivery ?? 0,
                    delivery_gratis_desde: negocio.configuracion_logistica?.delivery_gratis_desde ?? 0,
                    tiempo_aprox_delivery: negocio.configuracion_logistica?.tiempo_aprox_delivery ?? "",
                    direccion_retiro_local: negocio.configuracion_logistica?.direccion_retiro_local ?? ""
                },
                mercado_pago: {
                    habilitado: negocio.mercado_pago?.habilitado ?? false,
                    public_key: negocio.mercado_pago?.public_key || "",
                    access_token: negocio.mercado_pago?.access_token || ""
                },
                fotos: negocio.fotos || []
            });
        }
    }, [negocio]);

    if (!isOpen || !formData) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Construimos un payload explícito con solo los campos necesarios del negocio
            // Esto evita que campos ocultos o metadatos de Firebase (id, createdAt, etc.) rompan las reglas de seguridad
            const safePayload = {
                nombre: formData.nombre || "",
                rubro: formData.rubro || "gastronomia",
                descripcion: formData.descripcion || "",
                ubicacion: formData.ubicacion || "",
                telefono: formData.telefono || "",
                activo: formData.activo ?? true,
                abierto_siempre: formData.abierto_siempre ?? false,
                logo_url: formData.logo_url || "",
                fotos: formData.fotos || [],
                horarios: formData.horarios,
                configuracion_logistica: formData.configuracion_logistica,
                mercado_pago: formData.mercado_pago
            };

            await updateNegocio(negocio.id, safePayload);
            toast.success("Negocio actualizado correctamente");
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Error al actualizar el negocio");
        } finally {
            setLoading(false);
        }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const loadingToast = toast.loading("Subiendo logo...");
        try {
            const compressed = await compressImage(file);
            const formDataUpload = new FormData();
            formDataUpload.append("file", compressed);
            const url = await uploadLogoAction(formDataUpload);
            setFormData({ ...formData, logo_url: url });
            toast.success("Logo subido!", { id: loadingToast });
        } catch (error) {
            console.error(error);
            toast.error("Error al subir imagen a Minio", { id: loadingToast });
        }
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const loadingToast = toast.loading("Subiendo a galería...");
        try {
            const compressed = await compressImage(file);
            const formDataUpload = new FormData();
            formDataUpload.append("file", compressed);
            // Reutilizamos el de productos o creamos uno para galeria?
            // Según uploadAction.ts, uploadProductImageAction sube a "productos". 
            // Quizás convenga agregar uno general en uploadAction.ts
            const url = await uploadProductImageAction(formDataUpload);
            setFormData({
                ...formData,
                fotos: [...(formData.fotos || []), url]
            });
            toast.success("Foto añadida!", { id: loadingToast });
        } catch (error) {
            console.error(error);
            toast.error("Error al subir a galería", { id: loadingToast });
        }
    };

    const removePhoto = (index: number) => {
        const newFotos = [...formData.fotos];
        newFotos.splice(index, 1);
        setFormData({ ...formData, fotos: newFotos });
    };

    const updateLogistics = (field: string, value: any) => {
        setFormData({
            ...formData,
            configuracion_logistica: {
                ...formData.configuracion_logistica,
                [field]: value
            }
        });
    };

    const updateHorario = (day: string, value: string) => {
        setFormData({
            ...formData,
            horarios: {
                ...formData.horarios,
                [day]: value
            }
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-[#FBFBFB] dark:bg-zinc-950 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col h-[85vh]">
                    {/* Header */}
                    <div className="p-8 pb-4 flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-black tracking-tighter flex items-center gap-2">
                                <Store className="text-orange-500" /> Editar Negocio
                            </h2>
                            <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-widest">ID: {negocio.id}</p>
                        </div>
                        <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-zinc-900 rounded-xl text-gray-400 hover:text-gray-900 transition-colors"><X size={20} /></button>
                    </div>

                    {/* Tabs */}
                    <div className="px-8 flex gap-4 border-b border-gray-100 dark:border-zinc-900">
                        {["general", "horarios", "logistica", "pagos", "fotos"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? "text-orange-600" : "text-gray-400 hover:text-gray-600"
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-600 rounded-full" />}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                        <form id="business-edit-form" onSubmit={handleSubmit} className="space-y-6">
                            {activeTab === "general" && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 px-1">Nombre Comercial</label>
                                            <input type="text" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500/20" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 px-1">Rubro</label>
                                            <select value={formData.rubro} onChange={e => setFormData({ ...formData, rubro: e.target.value })} className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500/20">
                                                <option value="gastronomia">Gastronomía</option>
                                                <option value="retail">Retail / Tienda</option>
                                                <option value="servicios">Servicios</option>
                                                <option value="educacion">Educación</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 px-1">Logo del Negocio</label>
                                        <div className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[2rem] shadow-sm">
                                            {formData.logo_url ? (
                                                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-800 shadow-inner shrink-0">
                                                    <Image
                                                        src={formData.logo_url}
                                                        fill
                                                        className="object-cover"
                                                        alt="Logo preview"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-zinc-700">
                                                    <ImageIcon size={24} />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-2">Sube una imagen cuadrada (PNG/JPG)</p>
                                                <label className="cursor-pointer group">
                                                    <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-zinc-800 hover:bg-orange-500 hover:text-white transition-all rounded-xl text-xs font-black uppercase tracking-widest border border-gray-100 dark:border-zinc-700 group-hover:border-transparent">
                                                        <Upload size={14} /> Seleccionar Imagen
                                                    </div>
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 px-1">Descripción corta</label>
                                        <textarea value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} rows={3} className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500/20" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 px-1">Ubicación / Dirección</label>
                                            <input type="text" value={formData.ubicacion} onChange={e => setFormData({ ...formData, ubicacion: e.target.value })} className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl text-sm font-bold" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 px-1">WhatsApp (con 549...)</label>
                                            <input type="text" value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value })} className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl text-sm font-bold" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-2xl border border-orange-100 dark:border-orange-900/30">
                                        <input type="checkbox" id="negocio-activo" checked={formData.activo} onChange={e => setFormData({ ...formData, activo: e.target.checked })} className="w-5 h-5 accent-orange-600" />
                                        <label htmlFor="negocio-activo" className="text-sm font-black text-orange-900 dark:text-orange-400">Negocio Visible en el Explorador</label>
                                    </div>
                                </div>
                            )}

                            {activeTab === "horarios" && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                        <p className="text-xs font-bold text-gray-500 px-1 flex items-center gap-2"><Clock size={14} /> Configurá los rangos horarios (Ej: 09:00 - 18:00) o poné &quot;Cerrado&quot;.</p>
                                        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 rounded-xl">
                                            <input
                                                type="checkbox"
                                                id="abierto-siempre"
                                                checked={formData.abierto_siempre}
                                                onChange={e => setFormData({ ...formData, abierto_siempre: e.target.checked })}
                                                className="w-4 h-4 accent-emerald-600 cursor-pointer"
                                            />
                                            <label htmlFor="abierto-siempre" className="text-[11px] font-black text-emerald-900 dark:text-emerald-400 cursor-pointer uppercase tracking-tight">Abierto Siempre</label>
                                        </div>
                                    </div>
                                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 transition-opacity duration-300 ${formData.abierto_siempre ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                                        {DAYS.map(day => (
                                            <div key={day} className="flex items-center justify-between gap-4 p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-50 dark:border-zinc-800 shadow-sm">
                                                <label className="text-[10px] font-black uppercase text-gray-400 w-20">{day}</label>
                                                <input
                                                    type="text"
                                                    value={formData.horarios[day]}
                                                    onChange={e => updateHorario(day, e.target.value)}
                                                    className={`flex-1 text-right bg-transparent border-none text-xs font-black focus:ring-0 ${formData.horarios[day] === "Cerrado" ? "text-red-400" : "text-emerald-500"}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === "logistica" && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => updateLogistics("delivery_habilitado", !formData.configuracion_logistica.delivery_habilitado)}
                                            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${formData.configuracion_logistica.delivery_habilitado ? "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800" : "bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800"}`}
                                        >
                                            <Truck className={formData.configuracion_logistica.delivery_habilitado ? "text-orange-600" : "text-gray-400"} />
                                            <span className="text-xs font-black uppercase tracking-widest">Delivery</span>
                                            <span className="text-[10px] font-bold text-gray-500">{formData.configuracion_logistica.delivery_habilitado ? "Activado" : "Desactivado"}</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => updateLogistics("takeaway_habilitado", !formData.configuracion_logistica.takeaway_habilitado)}
                                            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${formData.configuracion_logistica.takeaway_habilitado ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800" : "bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800"}`}
                                        >
                                            <Info className={formData.configuracion_logistica.takeaway_habilitado ? "text-blue-600" : "text-gray-400"} />
                                            <span className="text-xs font-black uppercase tracking-widest">Retiro Local</span>
                                            <span className="text-[10px] font-bold text-gray-500">{formData.configuracion_logistica.takeaway_habilitado ? "Activado" : "Desactivado"}</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => updateLogistics("mesa_habilitado", !formData.configuracion_logistica.mesa_habilitado)}
                                            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${formData.configuracion_logistica.mesa_habilitado ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800" : "bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800"}`}
                                        >
                                            <Store className={formData.configuracion_logistica.mesa_habilitado ? "text-emerald-600" : "text-gray-400"} />
                                            <span className="text-xs font-black uppercase tracking-widest">En Mesa</span>
                                            <span className="text-[10px] font-bold text-gray-500">{formData.configuracion_logistica.mesa_habilitado ? "Activado" : "Desactivado"}</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => updateLogistics("servicio_habilitado", !formData.configuracion_logistica.servicio_habilitado)}
                                            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${formData.configuracion_logistica.servicio_habilitado ? "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800" : "bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800"}`}
                                        >
                                            <Settings2 className={formData.configuracion_logistica.servicio_habilitado ? "text-purple-600" : "text-gray-400"} />
                                            <span className="text-xs font-black uppercase tracking-widest">Servicio</span>
                                            <span className="text-[10px] font-bold text-gray-500">{formData.configuracion_logistica.servicio_habilitado ? "Activado" : "Desactivado"}</span>
                                        </button>
                                    </div>

                                    {/* Nuevas logísticas de Educación */}
                                    <div className="pt-6 border-t border-gray-50 dark:border-zinc-800">
                                        <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-4 flex items-center gap-2 px-1">
                                            <Star size={12} fill="currentColor" /> Formatos Educativos
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => updateLogistics("online_habilitado", !formData.configuracion_logistica.online_habilitado)}
                                                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${formData.configuracion_logistica.online_habilitado ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800" : "bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800"}`}
                                            >
                                                <Globe className={formData.configuracion_logistica.online_habilitado ? "text-indigo-600" : "text-gray-400"} />
                                                <span className="text-xs font-black uppercase tracking-widest text-center">En Vivo / Online</span>
                                                <span className="text-[10px] font-bold text-gray-500">{formData.configuracion_logistica.online_habilitado ? "Activado" : "Desactivado"}</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => updateLogistics("presencial_habilitado", !formData.configuracion_logistica.presencial_habilitado)}
                                                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${formData.configuracion_logistica.presencial_habilitado ? "bg-cyan-50 border-cyan-200 dark:bg-cyan-900/20 dark:border-cyan-800" : "bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800"}`}
                                            >
                                                <MapPin className={formData.configuracion_logistica.presencial_habilitado ? "text-cyan-600" : "text-gray-400"} />
                                                <span className="text-xs font-black uppercase tracking-widest text-center">Presencial</span>
                                                <span className="text-[10px] font-bold text-gray-500">{formData.configuracion_logistica.presencial_habilitado ? "Activado" : "Desactivado"}</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => updateLogistics("digital_habilitado", !formData.configuracion_logistica.digital_habilitado)}
                                                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${formData.configuracion_logistica.digital_habilitado ? "bg-violet-50 border-violet-200 dark:bg-violet-900/20 dark:border-violet-800" : "bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800"}`}
                                            >
                                                <ImageIcon className={formData.configuracion_logistica.digital_habilitado ? "text-violet-600" : "text-gray-400"} />
                                                <span className="text-xs font-black uppercase tracking-widest text-center">Material Digital</span>
                                                <span className="text-[10px] font-bold text-gray-500">{formData.configuracion_logistica.digital_habilitado ? "Activado" : "Desactivado"}</span>
                                            </button>
                                        </div>
                                    </div>

                                    {formData.configuracion_logistica.delivery_habilitado && (
                                        <div className="space-y-4 p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 animate-in fade-in zoom-in duration-300">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 px-1">Costo Delivery ($)</label>
                                                    <input type="number" value={formData.configuracion_logistica.precio_delivery} onChange={e => updateLogistics("precio_delivery", Number(e.target.value))} className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl text-sm font-bold" />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 px-1">Tiempo aprox (min)</label>
                                                    <input type="text" value={formData.configuracion_logistica.tiempo_aprox_delivery} onChange={e => updateLogistics("tiempo_aprox_delivery", e.target.value)} placeholder="Ej: 30-45 min" className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl text-sm font-bold" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 px-1">Envío gratis desde ($)</label>
                                                <input type="number" value={formData.configuracion_logistica.delivery_gratis_desde} onChange={e => updateLogistics("delivery_gratis_desde", Number(e.target.value))} className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl text-sm font-bold" />
                                            </div>
                                        </div>
                                    )}

                                    {formData.configuracion_logistica.takeaway_habilitado && (
                                        <div className="space-y-4 p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 animate-in fade-in zoom-in duration-300">
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 px-1">Dirección de Retiro</label>
                                                <input type="text" value={formData.configuracion_logistica.direccion_retiro_local} onChange={e => updateLogistics("direccion_retiro_local", e.target.value)} placeholder="Ej: Calle Falsa 123" className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl text-sm font-bold" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "pagos" && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                            <CreditCard className="text-blue-500" size={18} /> Mercado Pago
                                        </h3>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Cobra con tu propia cuenta de Mercado Pago</p>
                                    </div>

                                    <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-3xl p-6 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <input 
                                                type="checkbox" 
                                                id="mp-enabled" 
                                                checked={formData.mercado_pago.habilitado} 
                                                onChange={e => setFormData({ ...formData, mercado_pago: { ...formData.mercado_pago, habilitado: e.target.checked } })}
                                                className="w-5 h-5 accent-blue-600"
                                            />
                                            <label htmlFor="mp-enabled" className="text-sm font-black text-blue-900 dark:text-blue-400">Activar Pago con Mercado Pago</label>
                                        </div>

                                        <div className={`space-y-4 transition-all ${formData.mercado_pago.habilitado ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 px-1">Public Key</label>
                                                <input 
                                                    type="text" 
                                                    value={formData.mercado_pago.public_key} 
                                                    onChange={e => setFormData({ ...formData, mercado_pago: { ...formData.mercado_pago, public_key: e.target.value } })}
                                                    placeholder="APP_USR-..."
                                                    className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-2xl text-sm font-mono"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 px-1">Access Token</label>
                                                <input 
                                                    type="password" 
                                                    value={formData.mercado_pago.access_token} 
                                                    onChange={e => setFormData({ ...formData, mercado_pago: { ...formData.mercado_pago, access_token: e.target.value } })}
                                                    placeholder="APP_USR-..."
                                                    className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-2xl text-sm font-mono"
                                                />
                                            </div>
                                            <div className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-700">
                                                <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
                                                <p className="text-[10px] font-bold text-gray-500 leading-relaxed">
                                                    Obtené tus credenciales de Producción en <a href="https://www.mercadopago.com.ar/developers/panel" target="_blank" className="text-blue-600 underline">Mercado Pago Developers</a>. 
                                                    Asegurate de usar las de **Producción** para recibir pagos reales.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "fotos" && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex items-center justify-between px-1">
                                        <div className="flex flex-col">
                                            <h3 className="text-sm font-black uppercase tracking-widest">Galería de Fotos</h3>
                                            <p className="text-[10px] font-bold text-gray-500">Estas fotos aparecerán en el carrusel de tu negocio.</p>
                                        </div>
                                        <label className="cursor-pointer">
                                            <div className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 hover:scale-105 transition-transform">
                                                <Upload size={14} /> Añadir Foto
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleGalleryUpload} />
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {formData.fotos?.map((foto: string, idx: number) => (
                                            <div key={idx} className="group relative aspect-square rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm">
                                                <Image
                                                    src={foto}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    alt={`Galería ${idx}`}
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removePhoto(idx)}
                                                        className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                                                    >
                                                        <X size={16} className="stroke-[3]" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {(!formData.fotos || formData.fotos.length === 0) && (
                                            <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 dark:border-zinc-800 rounded-[2.5rem] text-gray-400">
                                                <ImageIcon size={40} className="mb-4 opacity-20" />
                                                <p className="text-xs font-black uppercase tracking-widest opacity-40">No hay fotos en la galería</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="p-8 border-t border-gray-100 dark:border-zinc-900 flex gap-4 bg-gray-50/50 dark:bg-zinc-900/50">
                        <button onClick={onClose} className="flex-1 py-4 px-6 bg-white dark:bg-zinc-800 text-gray-500 font-black rounded-2xl border border-gray-100 dark:border-zinc-700 hover:bg-gray-50 transition-all">Cancelar</button>
                        <button
                            type="submit"
                            form="business-edit-form"
                            disabled={loading}
                            className="flex-[2] py-4 px-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-2xl shadow-xl shadow-gray-900/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black rounded-full animate-spin" /> : <><CheckCircle2 size={18} /> Guardar Cambios</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
