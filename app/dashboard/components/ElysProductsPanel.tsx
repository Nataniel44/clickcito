"use client";

import React, { useState, useMemo } from "react";
import {
    Plus, Edit, Trash2, Save, X, UtensilsCrossed,
    ArrowUp, ArrowDown, SlidersHorizontal, Image as ImageIcon, Package,
    PlusCircle, Check, ChevronDown, ChevronUp
} from "lucide-react";
import { updateProducto, deleteProducto, createProducto, updateNegocio } from "@/app/firebase/db";
import { uploadProductImageAction } from "@/app/actions/uploadAction";
import toast from "react-hot-toast";
import Image from "next/image";

const ELYS_NEGOCIO_ID = "elysrestobar";

const ELYS_CATEGORIAS: Record<string, string[]> = {
    Comidas: ["Entradas", "Papas", "Especialidades", "Ensaladas", "Sandwicheria", "Hamburguesas", "Pizzas", "Al Plato", "Para Compartir"],
    Bebidas: ["Sin Alcohol", "Cerveza Artesanal", "Cervezas en Botella", "Porrones", "Vinos blancos", "Vinos tintos", "Vinos espumantes"],
    Tragos: ["De Autor", "Clásicos", "Daiquiris", "Caipirinhas", "Shots", "Jarras", "Whiskys", "Sin Alcohol"],
};

const MAIN_CATS = Object.keys(ELYS_CATEGORIAS);

interface ElysOpcion {
    nombre: string;
    precio: number;
}

interface ElysExtraGrupo {
    titulo: string;
    tipo: "unica" | "multiple";
    obligatorio: boolean;
    opciones: ElysOpcion[];
}

interface ElysProducto {
    id_producto: string;
    nombre_producto: string;
    categoria_producto: string;
    detalles_especificos: { tipo: string; extras?: ElysExtraGrupo[] };
    categorias: string[];
    precio_base: number;
    descripcion: string;
    imagen: string;
    estado: string;
    opciones?: ElysOpcion[];
    orden?: number;
}

function ElysProductoModal({ isOpen, onClose, producto }: {
    isOpen: boolean;
    onClose: () => void;
    producto: Partial<ElysProducto> | null;
}) {
    const isEdit = !!producto?.id_producto;

    const [form, setForm] = useState<any>({
        nombre_producto: "",
        categoria_producto: "Comidas",
        tipo: "Entradas",
        precio_base: 0,
        descripcion: "",
        imagen: "",
        estado: "activo",
        opciones: [] as ElysOpcion[],
        extras: [] as ElysExtraGrupo[],
    });

    const [saving, setSaving] = useState(false);
    const [uploadingImg, setUploadingImg] = useState(false);
    const imgInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (isOpen && producto) {
            setForm({
                nombre_producto: producto.nombre_producto || "",
                categoria_producto: producto.categoria_producto || "Comidas",
                tipo: producto.detalles_especificos?.tipo || "Entradas",
                precio_base: producto.precio_base ?? 0,
                descripcion: producto.descripcion || "",
                imagen: producto.imagen || "",
                estado: producto.estado || "activo",
                opciones: (producto.opciones || []).map(o => ({ nombre: o.nombre, precio: o.precio })),
                extras: (() => {
                    const p = producto as any;
                    if (p.detalles_especificos?.extras?.length > 0) {
                        return p.detalles_especificos.extras.map((g: any) => ({
                            titulo: g.titulo || "",
                            tipo: g.tipo || "unica",
                            obligatorio: g.obligatorio || false,
                            opciones: (g.opciones || []).map((o: any) => ({ nombre: o.nombre, precio: o.precio })),
                        }));
                    }
                    if (p.opciones_extras?.length > 0) {
                        return [{ titulo: "Extras", tipo: "multiple", obligatorio: false, opciones: p.opciones_extras.map((e: any) => ({ nombre: e.nombre, precio: e.precio })) }];
                    }
                    const desc: string = producto.descripcion || "";
                    const salsaMatch = desc.match(/^Salsas?:\s*(.+)$/i);
                    if (salsaMatch) {
                        const nombres = salsaMatch[1].split(",").map((s: string) => s.trim()).filter(Boolean);
                        if (nombres.length > 0) {
                            return [{ titulo: "Salsas", tipo: "unica", obligatorio: false, opciones: nombres.map((n: string) => ({ nombre: n, precio: 0 })) }];
                        }
                    }
                    const guarnMatch = desc.match(/^Guarniciones?:\s*(.+)$/i);
                    if (guarnMatch) {
                        const nombres = guarnMatch[1].split(",").map((s: string) => s.trim()).filter(Boolean);
                        if (nombres.length > 0) {
                            return [{ titulo: "Guarniciones", tipo: "unica", obligatorio: false, opciones: nombres.map((n: string) => ({ nombre: n, precio: 0 })) }];
                        }
                    }
                    return [];
                })(),
            });
        } else if (isOpen && !producto) {
            setForm({ nombre_producto: "", categoria_producto: "Comidas", tipo: "Entradas", precio_base: 0, descripcion: "", imagen: "", estado: "activo", opciones: [], extras: [] });
        }
    }, [isOpen, producto]);

    if (!isOpen) return null;

    const tiposDisponibles = ELYS_CATEGORIAS[form.categoria_producto] || [];

    const handleCatChange = (cat: string) => {
        const firstTipo = ELYS_CATEGORIAS[cat]?.[0] || "";
        setForm((f: any) => ({ ...f, categoria_producto: cat, tipo: firstTipo }));
    };

    const addOpcion = () => setForm((f: any) => ({ ...f, opciones: [...f.opciones, { nombre: "", precio: 0 }] }));
    const removeOpcion = (i: number) => setForm((f: any) => ({ ...f, opciones: f.opciones.filter((_: any, idx: number) => idx !== i) }));
    const updateOpcion = (i: number, field: "nombre" | "precio", value: any) =>
        setForm((f: any) => ({ ...f, opciones: f.opciones.map((o: any, idx: number) => idx === i ? { ...o, [field]: field === "precio" ? Number(value) : value } : o) }));

    const addExtraGrupo = () => setForm((f: any) => ({ ...f, extras: [...f.extras, { titulo: "", tipo: "unica" as const, obligatorio: false, opciones: [{ nombre: "", precio: 0 }] }] }));
    const removeExtraGrupo = (eIdx: number) => setForm((f: any) => ({ ...f, extras: f.extras.filter((_: any, i: number) => i !== eIdx) }));
    const updateExtraGrupo = (eIdx: number, field: string, value: any) =>
        setForm((f: any) => ({ ...f, extras: f.extras.map((g: any, i: number) => i === eIdx ? { ...g, [field]: value } : g) }));
    const addExtraOpcion = (eIdx: number) =>
        setForm((f: any) => ({ ...f, extras: f.extras.map((g: any, i: number) => i === eIdx ? { ...g, opciones: [...g.opciones, { nombre: "", precio: 0 }] } : g) }));
    const removeExtraOpcion = (eIdx: number, oIdx: number) =>
        setForm((f: any) => ({ ...f, extras: f.extras.map((g: any, i: number) => i === eIdx ? { ...g, opciones: g.opciones.filter((_: any, j: number) => j !== oIdx) } : g) }));
    const updateExtraOpcion = (eIdx: number, oIdx: number, field: "nombre" | "precio", value: any) =>
        setForm((f: any) => ({ ...f, extras: f.extras.map((g: any, i: number) => i === eIdx ? { ...g, opciones: g.opciones.map((o: any, j: number) => j === oIdx ? { ...o, [field]: field === "precio" ? Number(value) : value } : o) } : g) }));

    const handleImageUpload = async (file: File) => {
        if (!file) return;
        setUploadingImg(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const url = await uploadProductImageAction(fd);
            setForm((f: any) => ({ ...f, imagen: url }));
            toast.success("Imagen subida");
        } catch {
            toast.error("Error al subir imagen");
        } finally {
            setUploadingImg(false);
        }
    };

    const handleSave = async () => {
        if (!form.nombre_producto.trim()) { toast.error("El nombre es obligatorio"); return; }
        setSaving(true);
        try {
            const cleanExtras = form.extras
                .filter((g: any) => g.titulo.trim())
                .map((g: any) => ({
                    titulo: g.titulo.trim(),
                    tipo: g.tipo,
                    obligatorio: g.obligatorio,
                    opciones: g.opciones.filter((o: any) => o.nombre.trim()),
                }))
                .filter((g: any) => g.opciones.length > 0);

            let descripcion = form.descripcion.trim();
            const hasSalsasExtra = cleanExtras.some((g: any) => g.titulo.toLowerCase() === "salsas");
            if (hasSalsasExtra && /^salsas?:\s*/i.test(descripcion)) {
                descripcion = descripcion.replace(/^salsas?:\s*.+$/i, "").trim();
            }
            const hasGuarnExtra = cleanExtras.some((g: any) => g.titulo.toLowerCase() === "guarniciones");
            if (hasGuarnExtra && /^guarniciones?:\s*/i.test(descripcion)) {
                descripcion = descripcion.replace(/^guarniciones?:\s*.+$/i, "").trim();
            }

            const data: any = {
                nombre_producto: form.nombre_producto.trim(),
                categoria_producto: form.categoria_producto,
                categorias: [form.categoria_producto, form.tipo],
                detalles_especificos: {
                    tipo: form.tipo,
                    ...(cleanExtras.length > 0 && { extras: cleanExtras }),
                },
                precio_base: form.opciones.length > 0 ? 0 : Number(form.precio_base),
                descripcion,
                imagen: form.imagen.trim(),
                estado: form.estado,
                opciones: form.opciones.length > 0 ? form.opciones.filter((o: any) => o.nombre.trim()) : [],
                opciones_extras: [],
            };
            if (isEdit && producto?.id_producto) {
                await updateProducto(producto.id_producto, data);
                toast.success("Producto actualizado");
            } else {
                await createProducto(ELYS_NEGOCIO_ID, data);
                toast.success("Producto creado");
            }
            onClose();
        } catch (e) {
            toast.error("Error al guardar");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            {/* ✅ Reemplazado animate-in zoom-in por transition nativa */}
            <div className="relative bg-white dark:bg-zinc-950 w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-zinc-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                            <UtensilsCrossed size={18} className="text-orange-600" />
                        </div>
                        <div>
                            <h3 className="font-black text-base">{isEdit ? "Editar Producto" : "Nuevo Producto"}</h3>
                            <p className="text-[11px] text-gray-400 font-medium">Elys Restobar</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 space-y-4 flex-1">
                    <div>
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Nombre del Producto *</label>
                        <input
                            value={form.nombre_producto}
                            onChange={e => setForm((f: any) => ({ ...f, nombre_producto: e.target.value }))}
                            placeholder="Ej: Entraña, Pizza Muzzarella..."
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Categoría</label>
                            <select
                                value={form.categoria_producto}
                                onChange={e => handleCatChange(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                {MAIN_CATS.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Tipo / Sub</label>
                            <select
                                value={form.tipo}
                                onChange={e => setForm((f: any) => ({ ...f, tipo: e.target.value }))}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                {tiposDisponibles.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                Opciones / Porciones
                                <span className="ml-2 font-normal normal-case text-gray-400">(si hay, el precio base = 0)</span>
                            </label>
                            <button onClick={addOpcion} className="flex items-center gap-1 text-[11px] font-black text-orange-600 hover:text-orange-700 bg-orange-50 dark:bg-orange-900/20 px-2.5 py-1 rounded-lg transition-colors">
                                <Plus size={12} /> Agregar
                            </button>
                        </div>
                        {form.opciones.length === 0 ? (
                            <div>
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Precio Base</label>
                                <input
                                    type="number"
                                    value={form.precio_base}
                                    onChange={e => setForm((f: any) => ({ ...f, precio_base: e.target.value }))}
                                    placeholder="0"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {form.opciones.map((op: ElysOpcion, i: number) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <input
                                            value={op.nombre}
                                            onChange={e => updateOpcion(i, "nombre", e.target.value)}
                                            placeholder="Ej: Para 2 personas"
                                            className="flex-1 px-3 py-2.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                        <input
                                            type="number"
                                            value={op.precio}
                                            onChange={e => updateOpcion(i, "precio", e.target.value)}
                                            placeholder="Precio"
                                            className="w-28 px-3 py-2.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                        <button onClick={() => removeOpcion(i)} className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Descripción</label>
                        <textarea
                            value={form.descripcion}
                            onChange={e => setForm((f: any) => ({ ...f, descripcion: e.target.value }))}
                            placeholder="Ej: Guarniciones: Papas fritas, Mandioca, Arroz especiado..."
                            rows={2}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                        />
                    </div>

                    <div>
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                            <ImageIcon size={12} className="inline mr-1" /> Imagen del Producto
                        </label>
                        <div
                            onClick={() => !uploadingImg && imgInputRef.current?.click()}
                            className={`relative flex items-center gap-4 p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${uploadingImg
                                ? 'border-orange-300 bg-orange-50 dark:bg-orange-900/10 cursor-wait'
                                : 'border-gray-200 dark:border-zinc-700 hover:border-orange-400 hover:bg-orange-50/40 dark:hover:bg-orange-900/10'
                                }`}
                        >
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 shrink-0 flex items-center justify-center">
                                {uploadingImg ? (
                                    <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                                ) : form.imagen ? (
                                    <Image width={80} height={80} src={"https://imagenes.elysrestobar.com" + form.imagen} alt="preview" className="w-full h-full object-cover"
                                        onError={e => { const img = e.target as HTMLImageElement; img.onerror = null; img.style.display = 'none'; }} />
                                ) : (
                                    <ImageIcon size={24} className="text-gray-300 dark:text-zinc-600" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                {uploadingImg ? (
                                    <p className="text-sm font-black text-orange-600">Subiendo a MinIO...</p>
                                ) : form.imagen ? (
                                    <>
                                        <p className="text-sm font-black text-gray-800 dark:text-white truncate">{form.imagen.split('/').pop()}</p>
                                        <p className="text-[11px] text-orange-600 font-bold mt-0.5">Clic para cambiar imagen</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm font-black text-gray-600 dark:text-gray-300">Subir imagen</p>
                                        <p className="text-[11px] text-gray-400 font-medium mt-0.5">JPG, PNG, WEBP — se sube a MinIO automáticamente</p>
                                    </>
                                )}
                            </div>
                            {form.imagen && !uploadingImg && (
                                <button type="button" onClick={e => { e.stopPropagation(); setForm((f: any) => ({ ...f, imagen: '' })); }}
                                    className="shrink-0 p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                        <input ref={imgInputRef} type="file" accept="image/*" className="hidden"
                            onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); e.target.value = ''; }} />
                    </div>

                    {/* Extras / Adicionales */}
                    <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-[11px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-1.5">
                                <PlusCircle size={13} /> Adicionales / Extras
                            </label>
                            <button type="button" onClick={addExtraGrupo}
                                className="text-[10px] font-black bg-orange-600 text-white px-2.5 py-1.5 rounded-lg hover:bg-orange-700 transition-all flex items-center gap-1.5">
                                <PlusCircle size={11} /> Grupo
                            </button>
                        </div>

                        {form.extras.length === 0 ? (
                            <p className="text-[10px] text-center text-gray-400 py-4 border-2 border-dashed border-gray-100 dark:border-zinc-800 rounded-2xl font-bold">
                                Sin adicionales
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {form.extras.map((grupo: ElysExtraGrupo, eIdx: number) => (
                                    <div key={eIdx} className="bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-3 space-y-2.5">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={grupo.titulo}
                                                onChange={e => updateExtraGrupo(eIdx, "titulo", e.target.value)}
                                                placeholder="Ej: Elegí tu salsa"
                                                className="flex-1 bg-transparent border-none focus:ring-0 font-black text-xs placeholder-gray-400 text-gray-900 dark:text-white"
                                            />
                                            <button type="button" onClick={() => removeExtraGrupo(eIdx)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                                                <Trash2 size={13} />
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 px-0.5">
                                            <div className="flex bg-gray-100 dark:bg-zinc-800 rounded-lg p-0.5">
                                                <button type="button" onClick={() => updateExtraGrupo(eIdx, "tipo", "unica")}
                                                    className={`px-2 py-1 rounded-md text-[8px] font-black transition-all ${grupo.tipo === "unica" ? "bg-white dark:bg-zinc-700 shadow-sm text-orange-600" : "text-gray-400"}`}>
                                                    ÚNICA
                                                </button>
                                                <button type="button" onClick={() => updateExtraGrupo(eIdx, "tipo", "multiple")}
                                                    className={`px-2 py-1 rounded-md text-[8px] font-black transition-all ${grupo.tipo === "multiple" ? "bg-white dark:bg-zinc-700 shadow-sm text-orange-600" : "text-gray-400"}`}>
                                                    MÚLTIPLE
                                                </button>
                                            </div>
                                            <label className="flex items-center gap-1.5 cursor-pointer">
                                                <input type="checkbox" checked={grupo.obligatorio}
                                                    onChange={e => updateExtraGrupo(eIdx, "obligatorio", e.target.checked)}
                                                    className="w-3 h-3 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                                                <span className="text-[9px] font-black text-gray-400 uppercase">Obligatorio</span>
                                            </label>
                                        </div>

                                        <div className="space-y-1.5">
                                            {grupo.opciones.map((op, oIdx) => (
                                                <div key={oIdx} className="flex gap-1.5 items-center">
                                                    <input type="text" value={op.nombre}
                                                        onChange={e => updateExtraOpcion(eIdx, oIdx, "nombre", e.target.value)}
                                                        placeholder="Nombre"
                                                        className="flex-1 px-2.5 py-2 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-lg text-[11px] font-bold focus:outline-none focus:ring-1 focus:ring-orange-500" />
                                                    <div className="flex items-center gap-0.5 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-lg px-2 py-2 shrink-0">
                                                        <span className="text-[9px] font-black text-gray-400">$</span>
                                                        <input type="number" value={op.precio}
                                                            onChange={e => updateExtraOpcion(eIdx, oIdx, "precio", e.target.value)}
                                                            placeholder="0"
                                                            className="w-14 bg-transparent border-none focus:ring-0 text-[11px] font-black p-0" />
                                                    </div>
                                                    <button type="button" onClick={() => removeExtraOpcion(eIdx, oIdx)}
                                                        className="p-1 text-gray-300 hover:text-red-500 transition-colors shrink-0">
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button type="button" onClick={() => addExtraOpcion(eIdx)}
                                                className="w-full py-1.5 border border-dashed border-gray-200 dark:border-zinc-700 rounded-lg text-[9px] font-black text-gray-400 hover:border-orange-300 hover:text-orange-600 transition-all flex items-center justify-center gap-1">
                                                <Plus size={10} /> Opción
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-700">
                        <span className="text-sm font-black">Estado</span>
                        <button
                            onClick={() => setForm((f: any) => ({ ...f, estado: f.estado === "activo" ? "inactivo" : "activo" }))}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.estado === "activo" ? "bg-green-500" : "bg-gray-300 dark:bg-zinc-600"}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${form.estado === "activo" ? "translate-x-6" : "translate-x-1"}`} />
                        </button>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 dark:border-zinc-800 shrink-0 flex gap-3">
                    <button onClick={onClose} disabled={saving} className="flex-1 py-3 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
                        Cancelar
                    </button>
                    <button onClick={handleSave} disabled={saving} className="flex-1 py-3.5 bg-orange-600 text-white font-black rounded-xl hover:bg-orange-700 flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
                        {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                        {isEdit ? "Actualizar" : "Crear Producto"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function OrdenModal({ isOpen, onClose, keys, negocioId }: { isOpen: boolean; onClose: () => void; keys: string[]; negocioId: string }) {
    const [local, setLocal] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);
    React.useEffect(() => { if (isOpen) setLocal(keys); }, [isOpen, keys]);
    if (!isOpen) return null;
    const move = (i: number, dir: -1 | 1) => setLocal(prev => { const n = [...prev];[n[i], n[i + dir]] = [n[i + dir], n[i]]; return n; });
    const handleSave = async () => {
        setSaving(true);
        try { await updateNegocio(negocioId, { orden_categorias: local }); toast.success("Orden guardado"); onClose(); }
        catch { toast.error("Error al guardar"); }
        finally { setSaving(false); }
    };
    return (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            {/* ✅ Removido animate-in zoom-in */}
            <div className="relative bg-white dark:bg-zinc-950 w-full max-w-sm rounded-3xl shadow-2xl border border-gray-100 dark:border-zinc-800 p-6 flex flex-col max-h-[80vh]">
                <h3 className="font-black text-lg mb-4 flex items-center gap-2"><SlidersHorizontal className="text-orange-600" /> Ordenar Categorías</h3>
                <div className="space-y-2 flex-1 overflow-y-auto mb-4">
                    {local.map((cat, i) => (
                        <div key={cat} className="flex items-center justify-between bg-gray-50 dark:bg-zinc-900 p-3 rounded-xl border border-gray-100 dark:border-zinc-800">
                            <span className="font-bold text-sm truncate mr-2">
                                {cat.includes(' - ') ? cat.split(' - ')[1] : cat}
                                <span className="text-[10px] text-gray-400 font-medium ml-1">({cat.split(' - ')[0]})</span>
                            </span>
                            <div className="flex gap-1 shrink-0">
                                <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1.5 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-lg hover:text-orange-600 disabled:opacity-30 transition-colors"><ArrowUp size={13} /></button>
                                <button onClick={() => move(i, 1)} disabled={i === local.length - 1} className="p-1.5 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-lg hover:text-orange-600 disabled:opacity-30 transition-colors"><ArrowDown size={13} /></button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <button onClick={onClose} className="flex-1 py-3 bg-gray-100 dark:bg-zinc-800 font-bold rounded-xl text-sm">Cancelar</button>
                    <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-orange-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2">
                        {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />} Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}

export function ElysProductsPanel({ productos, loadingProductos, negocioData }: {
    productos: any[];
    loadingProductos: boolean;
    negocioData: any;
}) {
    const [modalState, setModalState] = useState<{ open: boolean; producto: Partial<ElysProducto> | null }>({ open: false, producto: null });
    const [ordenModal, setOrdenModal] = useState(false);
    const [selectedMainCat, setSelectedMainCat] = useState<string>("Todas");
    const [selectedSubCat, setSelectedSubCat] = useState<string>("Todas");
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

    const toggleSection = (key: string) => {
        setExpandedSections(prev => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };

    const grouped = useMemo(() => {
        const g: Record<string, any[]> = {};
        productos.forEach(p => {
            const key = p.categoria_producto && p.detalles_especificos?.tipo
                ? `${p.categoria_producto} - ${p.detalles_especificos.tipo}`
                : p.categoria_producto || "General";
            if (!g[key]) g[key] = [];
            g[key].push(p);
        });
        Object.keys(g).forEach(k => {
            g[k].sort((a, b) => {
                const oa = a.orden ?? 9999, ob = b.orden ?? 9999;
                if (oa !== ob) return oa - ob;
                return (a.nombre_producto || "").localeCompare(b.nombre_producto || "");
            });
        });
        return g;
    }, [productos]);

    const orderedKeys = useMemo(() => {
        const keys = Object.keys(grouped);
        const order: string[] = negocioData?.orden_categorias || [];
        return keys.sort((a, b) => {
            const ia = order.indexOf(a), ib = order.indexOf(b);
            if (ia !== -1 && ib !== -1) return ia - ib;
            if (ia !== -1) return -1;
            if (ib !== -1) return 1;
            return a.localeCompare(b);
        });
    }, [grouped, negocioData?.orden_categorias]);

    const mainCats = useMemo(() => {
        return ["Todas", ...Array.from(new Set(orderedKeys.map(k => k.includes(' - ') ? k.split(' - ')[0] : k)))];
    }, [orderedKeys]);

    const subCats = useMemo(() => {
        if (selectedMainCat === "Todas") return ["Todas"];
        const subs = orderedKeys
            .filter(k => (k.includes(' - ') ? k.split(' - ')[0] : k) === selectedMainCat)
            .map(k => k.includes(' - ') ? k.split(' - ')[1] : k);
        return ["Todas", ...subs];
    }, [selectedMainCat, orderedKeys]);

    const keysToRender = useMemo(() => {
        if (selectedMainCat === "Todas") return orderedKeys;
        return orderedKeys.filter(k => {
            const main = k.includes(' - ') ? k.split(' - ')[0] : k;
            const sub = k.includes(' - ') ? k.split(' - ')[1] : k;
            if (main !== selectedMainCat) return false;
            if (selectedSubCat === "Todas") return true;
            return sub === selectedSubCat;
        });
    }, [orderedKeys, selectedMainCat, selectedSubCat]);

    const handleDelete = async (id: string) => {
        try {
            await deleteProducto(id);
            toast.success("Producto eliminado");
        } catch { toast.error("Error al eliminar"); }
        finally { setConfirmDelete(null); }
    };

    // ✅ Skeleton nativo con solo animate-pulse
    if (loadingProductos) return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-200 to-amber-200 dark:from-orange-900/40 dark:to-amber-900/40 rounded-2xl p-5 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/40 rounded-2xl" />
                    <div className="space-y-2">
                        <div className="h-2 w-16 bg-white/60 rounded-full" />
                        <div className="h-5 w-32 bg-white/60 rounded-full" />
                        <div className="h-2 w-24 bg-white/40 rounded-full" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="h-9 w-24 bg-white/40 rounded-xl" />
                    <div className="h-9 w-32 bg-white/40 rounded-xl" />
                </div>
            </div>

            <div className="flex gap-2">
                {[64, 72, 80, 60].map((w, i) => (
                    <div key={i} style={{ width: w }} className="h-8 bg-gray-200 dark:bg-zinc-800 rounded-full animate-pulse" />
                ))}
            </div>

            {[4, 3].map((count, si) => (
                <div key={si} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden shadow-sm">
                    <div className="px-5 py-3.5 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/30 flex items-center gap-2">
                        <div className="h-5 w-14 bg-orange-100 dark:bg-orange-900/30 rounded-full animate-pulse" />
                        <div className="h-4 w-20 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse" />
                        <div className="h-5 w-6 bg-gray-100 dark:bg-zinc-800 rounded-full animate-pulse" />
                    </div>
                    {Array.from({ length: count }).map((_, pi) => (
                        <div key={pi} className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-50 dark:border-zinc-800 last:border-0">
                            <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-zinc-700 shrink-0 animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3.5 w-36 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse" />
                                <div className="h-2.5 w-52 bg-gray-100 dark:bg-zinc-800 rounded animate-pulse" />
                                <div className="h-2.5 w-16 bg-orange-100 dark:bg-orange-900/20 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );

    return (
        // ✅ Removido animate-in fade-in slide-in-from-bottom-4
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-600 to-amber-500 rounded-2xl p-5 flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <UtensilsCrossed size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Panel Exclusivo</p>
                        <h2 className="text-xl font-black">Elys Restobar</h2>
                        <p className="text-[11px] opacity-70 font-medium">{productos.length} productos en {orderedKeys.length} secciones</p>
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                    <button onClick={() => setOrdenModal(true)} className="flex items-center gap-2 px-3.5 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-bold transition-colors">
                        <SlidersHorizontal size={14} /> Ordenar
                    </button>
                    <button onClick={() => setModalState({ open: true, producto: null })} className="flex items-center gap-2 px-3.5 py-2 bg-white text-orange-600 rounded-xl text-sm font-black hover:bg-orange-50 transition-colors">
                        <Plus size={14} /> Nuevo Producto
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {mainCats.map(cat => (
                        <button key={cat} onClick={() => { setSelectedMainCat(cat); setSelectedSubCat("Todas"); }}
                            className={`shrink-0 px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all ${selectedMainCat === cat
                                ? 'bg-orange-600 text-white shadow-md'
                                : 'bg-white dark:bg-zinc-900 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-zinc-800 hover:border-orange-300'
                                }`}>
                            {cat}
                        </button>
                    ))}
                </div>
                {selectedMainCat !== "Todas" && subCats.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1 pl-2">
                        {subCats.map(sub => (
                            <button key={sub} onClick={() => setSelectedSubCat(sub)}
                                className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${selectedSubCat === sub
                                    ? 'bg-amber-500 text-white shadow-sm'
                                    : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-800/30 hover:bg-amber-100'
                                    }`}>
                                {sub}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {keysToRender.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-16 text-center border border-gray-100 dark:border-zinc-800">
                    <Package size={40} className="mx-auto text-gray-200 dark:text-zinc-700 mb-3" />
                    <p className="font-black text-gray-400">No hay productos en esta sección</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {keysToRender.map((key, keyIdx) => {
                        const lista = grouped[key];
                        const [mainCat, subCat] = key.includes(' - ') ? key.split(' - ') : [key, key];
                        const isExpanded = expandedSections.size === 0 ? keyIdx === 0 : expandedSections.has(key);
                        return (
                            <div key={key} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden shadow-sm">
                                <button onClick={() => toggleSection(key)} className="w-full px-5 py-3.5 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-800/30 hover:bg-gray-100/60 dark:hover:bg-zinc-800/50 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-full">{mainCat}</span>
                                        <h4 className="font-black text-sm text-gray-900 dark:text-white">{subCat !== mainCat ? subCat : mainCat}</h4>
                                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">{lista.length}</span>
                                    </div>
                                    {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                                </button>
                                {isExpanded && <div className="divide-y divide-gray-50 dark:divide-zinc-800">
                                    {lista.map((p: any) => (
                                        <div key={p.id_producto} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 shrink-0">
                                                {p.imagen ? (
                                                    <Image src={"https://imagenes.elysrestobar.com" + p.imagen} alt={p.nombre_producto} width={48} height={48} className="w-full h-full object-cover"
                                                        onError={e => { const img = e.target as HTMLImageElement; img.onerror = null; img.style.display = 'none'; }} />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-zinc-600"><UtensilsCrossed size={16} /></div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="font-black text-sm text-gray-900 dark:text-white truncate">{p.nombre_producto}</p>
                                                    {p.estado === "inactivo" && (
                                                        <span className="text-[10px] font-black bg-red-50 dark:bg-red-900/20 text-red-500 px-2 py-0.5 rounded-full">Inactivo</span>
                                                    )}
                                                </div>
                                                {p.descripcion && <p className="text-[11px] text-gray-400 font-medium truncate">{p.descripcion}</p>}
                                                <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                                                    {p.opciones && p.opciones.length > 0 ? (
                                                        p.opciones.map((op: ElysOpcion, i: number) => (
                                                            <span key={i} className="text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">
                                                                {op.nombre}: ${op.precio.toLocaleString('es-AR')}
                                                            </span>
                                                        ))
                                                    ) : p.precio_base > 0 ? (
                                                        <p className="text-[12px] font-black text-orange-600">${Number(p.precio_base).toLocaleString('es-AR')}</p>
                                                    ) : null}
                                                    {(() => {
                                                        const desc: string = p.descripcion || "";
                                                        const salsaMatch = desc.match(/^Salsas?:\s*(.+)$/i);
                                                        if (salsaMatch) {
                                                            return salsaMatch[1].split(",").map((s: string) => s.trim()).filter(Boolean).map((salsa: string, i: number) => (
                                                                <span key={`salsa-${i}`} className="text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">
                                                                    {salsa}
                                                                </span>
                                                            ));
                                                        }
                                                        const guarnMatch = desc.match(/^Guarniciones?:\s*(.+)$/i);
                                                        if (guarnMatch) {
                                                            return guarnMatch[1].split(",").map((s: string) => s.trim()).filter(Boolean).map((g: string, i: number) => (
                                                                <span key={`guarn-${i}`} className="text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">
                                                                    {g}
                                                                </span>
                                                            ));
                                                        }
                                                        return null;
                                                    })()}
                                                    {(p.detalles_especificos?.extras?.length > 0 || p.opciones_extras?.length > 0) && (
                                                        <>
                                                            {p.detalles_especificos?.extras?.flatMap((g: any) => g.opciones || []).map((o: any, i: number) => (
                                                                <span key={`de-${i}`} className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                                                                    + {o.nombre}: ${Number(o.precio).toLocaleString('es-AR')}
                                                                </span>
                                                            ))}
                                                            {p.opciones_extras?.map((o: any, i: number) => (
                                                                <span key={`oe-${i}`} className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                                                                    + {o.nombre}: ${Number(o.precio).toLocaleString('es-AR')}
                                                                </span>
                                                            ))}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => setModalState({ open: true, producto: p })}
                                                    className="p-2 text-gray-400 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                                                    <Edit size={14} />
                                                </button>
                                                <button onClick={() => setConfirmDelete(p.id_producto)}
                                                    className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>}
                            </div>
                        );
                    })}
                </div>
            )}

            <ElysProductoModal isOpen={modalState.open} onClose={() => setModalState({ open: false, producto: null })} producto={modalState.producto} />
            <OrdenModal isOpen={ordenModal} onClose={() => setOrdenModal(false)} keys={orderedKeys} negocioId={ELYS_NEGOCIO_ID} />

            {confirmDelete && (
                <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
                    {/* ✅ Removido animate-in zoom-in */}
                    <div className="relative bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl border border-gray-100 dark:border-zinc-800 p-6 w-full max-w-sm">
                        <div className="text-center">
                            <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={22} className="text-red-500" />
                            </div>
                            <h3 className="font-black text-base mb-1">¿Eliminar producto?</h3>
                            <p className="text-sm text-gray-400 font-medium mb-6">Esta acción no se puede deshacer.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-3 bg-gray-100 dark:bg-zinc-800 font-bold rounded-xl text-sm">Cancelar</button>
                                <button onClick={() => handleDelete(confirmDelete)} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl text-sm hover:bg-red-600 transition-colors">Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}