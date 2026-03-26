import React from "react";
import { PlusCircle, Trash2 } from "lucide-react";

interface ExtrasSectionProps {
    formData: any;
    setFormData: (data: any) => void;
}

export const ExtrasSection: React.FC<ExtrasSectionProps> = ({
    formData,
    setFormData
}) => {
    return (
        <div className="pt-6 border-t border-gray-100 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-4 px-1">
                <label className="text-xs font-black text-orange-600 dark:text-orange-500 uppercase tracking-widest flex items-center gap-2">
                    <PlusCircle size={14} /> Adicionales / Extras
                </label>
                <button
                    type="button"
                    onClick={() => setFormData({
                        ...formData,
                        extras: [...formData.extras, { titulo: "", tipo: "unica", obligatorio: false, opciones: [{ nombre: "", precio: 0 }] }]
                    })}
                    className="text-[10px] font-black bg-orange-600 text-white px-3 py-1.5 rounded-xl hover:bg-orange-700 transition-all flex items-center gap-1.5 shadow-sm shadow-orange-600/20"
                >
                    <PlusCircle size={12} /> Agregar Grupo
                </button>
            </div>

            <div className="space-y-4">
                {formData.extras.map((extra: any, eIdx: number) => (
                    <div key={eIdx} className="bg-gray-50/50 dark:bg-zinc-800/30 border border-gray-100 dark:border-zinc-800 rounded-3xl p-4 animate-in fade-in duration-300">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={extra.titulo}
                                    onChange={(e) => {
                                        const newExtras = [...formData.extras];
                                        newExtras[eIdx].titulo = e.target.value;
                                        setFormData({ ...formData, extras: newExtras });
                                    }}
                                    className="flex-1 bg-transparent border-none focus:ring-0 font-black text-sm placeholder-gray-400 text-gray-900 dark:text-white"
                                    placeholder="Título del grupo (Ej: Elegí tu Salsa)"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newExtras = [...formData.extras];
                                        newExtras.splice(eIdx, 1);
                                        setFormData({ ...formData, extras: newExtras });
                                    }}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 px-1">
                                <div className="flex bg-gray-100 dark:bg-zinc-800 rounded-lg p-0.5">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newExtras = [...formData.extras];
                                            newExtras[eIdx].tipo = "unica";
                                            setFormData({ ...formData, extras: newExtras });
                                        }}
                                        className={`px-3 py-1.5 rounded-md text-[9px] font-black transition-all ${extra.tipo === "unica" ? "bg-white dark:bg-zinc-700 shadow-sm text-orange-600" : "text-gray-400"}`}
                                    >
                                        SELECCIÓN ÚNICA
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newExtras = [...formData.extras];
                                            newExtras[eIdx].tipo = "multiple";
                                            setFormData({ ...formData, extras: newExtras });
                                        }}
                                        className={`px-3 py-1.5 rounded-md text-[9px] font-black transition-all ${extra.tipo === "multiple" ? "bg-white dark:bg-zinc-700 shadow-sm text-orange-600" : "text-gray-400"}`}
                                    >
                                        MÚLTIPLE
                                    </button>
                                </div>

                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={extra.obligatorio}
                                        onChange={(e) => {
                                            const newExtras = [...formData.extras];
                                            newExtras[eIdx].obligatorio = e.target.checked;
                                            setFormData({ ...formData, extras: newExtras });
                                        }}
                                        className="w-3.5 h-3.5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                    />
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter group-hover:text-gray-600 transition-colors">
                                        Obligatorio
                                    </span>
                                </label>
                            </div>

                            <div className="space-y-2 mt-2">
                                {(extra.opciones || []).map((opc: any, oIdx: number) => (
                                    <div key={oIdx} className="flex gap-2 items-center bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-gray-100 dark:border-zinc-800 group shadow-sm">
                                        <input
                                            type="text"
                                            value={opc.nombre}
                                            onChange={(e) => {
                                                const newExtras = [...formData.extras];
                                                if (!newExtras[eIdx].opciones) newExtras[eIdx].opciones = [];
                                                newExtras[eIdx].opciones[oIdx].nombre = e.target.value;
                                                setFormData({ ...formData, extras: newExtras });
                                            }}
                                            className="flex-1 bg-transparent border-none focus:ring-0 font-bold text-xs min-w-0 text-gray-900 dark:text-white"
                                            placeholder="Nombre de la opción"
                                        />
                                        <div className="flex items-center gap-1 bg-gray-50 dark:bg-zinc-800 px-2 rounded-lg shrink-0">
                                            <span className="text-[10px] font-black text-gray-400">$</span>
                                            <input
                                                type="number"
                                                value={opc.precio}
                                                onChange={(e) => {
                                                    const newExtras = [...formData.extras];
                                                    if (!newExtras[eIdx].opciones) newExtras[eIdx].opciones = [];
                                                    newExtras[eIdx].opciones[oIdx].precio = parseFloat(e.target.value);
                                                    setFormData({ ...formData, extras: newExtras });
                                                }}
                                                className="w-16 bg-transparent border-none focus:ring-0 font-black text-xs p-1 text-gray-900 dark:text-white"
                                                placeholder="0"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newExtras = [...formData.extras];
                                                if (!newExtras[eIdx].opciones) newExtras[eIdx].opciones = [];
                                                newExtras[eIdx].opciones.splice(oIdx, 1);
                                                setFormData({ ...formData, extras: newExtras });
                                            }}
                                            className="p-1 px-2 text-gray-300 hover:text-red-500 transition-colors shrink-0"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newExtras = [...formData.extras];
                                        if (!newExtras[eIdx].opciones) newExtras[eIdx].opciones = [];
                                        newExtras[eIdx].opciones.push({ nombre: "", precio: 0 });
                                        setFormData({ ...formData, extras: newExtras });
                                    }}
                                    className="w-full py-2 border border-dashed border-gray-200 dark:border-zinc-800 rounded-xl text-[10px] font-black text-gray-400 hover:border-orange-200 hover:text-orange-600 transition-all flex items-center justify-center gap-2 mt-2"
                                >
                                    <PlusCircle size={10} /> Agregar Opción
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {formData.extras.length === 0 && (
                    <p className="text-[10px] text-center text-gray-400 py-6 border-2 border-dashed border-gray-50 dark:border-zinc-800/50 rounded-3xl font-bold">No hay modificadores para este producto</p>
                )}
            </div>
        </div>
    );
};

