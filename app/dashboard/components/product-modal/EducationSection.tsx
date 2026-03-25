import React from "react";
import {
    PlusCircle, Trash2, Layout, Video, BookOpen,
    FileText, Download, Paperclip, X
} from "lucide-react";

interface EducationSectionProps {
    formData: any;
    setFormData: (data: any) => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
    formData,
    setFormData
}) => {
    if (!["curso", "clase", "modulo"].includes(formData.unidad_medida)) return null;

    return (
        <div className="space-y-6 pt-4">
            {/* Objetivos y Recursos Generales */}
            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                <div>
                    <label className="block text-xs font-black text-orange-600 dark:text-orange-500 uppercase tracking-widest mb-1.5 px-1">Objetivos de Aprendizaje</label>
                    <textarea
                        value={formData.objetivos}
                        onChange={(e) => setFormData({ ...formData, objetivos: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium placeholder-gray-400 transition-all font-bold resize-none"
                        placeholder="Enumera lo que aprenderán (un objetivo por línea)"
                        rows={3}
                    />
                </div>
                <div>
                    <div className="flex items-center justify-between mb-2 px-1">
                        <label className="block text-xs font-black text-orange-600 dark:text-orange-500 uppercase tracking-widest">Materiales / Recursos</label>
                        <div className="relative">
                            <input
                                type="file"
                                id="resource-upload"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setFormData({
                                            ...formData,
                                            recursos: [...formData.recursos, { nombre: file.name, url: "", file }]
                                        });
                                    }
                                }}
                            />
                            <label
                                htmlFor="resource-upload"
                                className="cursor-pointer text-[10px] font-black bg-orange-600/10 text-orange-600 px-3 py-1.5 rounded-lg hover:bg-orange-600 hover:text-white transition-all flex items-center gap-1.5"
                            >
                                <Paperclip size={12} /> Adjuntar Archivo
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {formData.recursos.map((rec: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-3 rounded-2xl group">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-orange-600 shrink-0">
                                        <FileText size={16} />
                                    </div>
                                    <div className="text-xs font-bold truncate">
                                        <p className="truncate max-w-[150px]">{rec.nombre}</p>
                                        {rec.file && <span className="text-[9px] text-gray-400 font-medium">Pendiente de subida</span>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {rec.url && (
                                        <a href={rec.url} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-orange-600 transition-colors">
                                            <Download size={14} />
                                        </a>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newRecs = [...formData.recursos];
                                            newRecs.splice(idx, 1);
                                            setFormData({ ...formData, recursos: newRecs });
                                        }}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {formData.recursos.length === 0 && (
                            <p className="text-[10px] text-center text-gray-400 py-4 font-bold border-2 border-dashed border-gray-50 dark:border-zinc-800/50 rounded-2xl">No hay materiales adjuntos</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Estructura del Curso */}
            <div className="pt-6 border-t border-gray-100 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                    <label className="text-xs font-black text-orange-600 dark:text-orange-500 uppercase tracking-widest px-1 flex items-center gap-2">
                        <Layout size={14} /> Estructura del Curso
                    </label>
                    <button
                        type="button"
                        onClick={() => setFormData({
                            ...formData,
                            modulos: [...formData.modulos, { titulo: "", clases: [] }]
                        })}
                        className="text-[10px] font-black bg-orange-600 text-white px-3 py-1.5 rounded-xl hover:bg-orange-700 transition-all flex items-center gap-1.5 shadow-sm shadow-orange-600/20"
                    >
                        <PlusCircle size={12} /> Agregar Módulo
                    </button>
                </div>

                <div className="space-y-6">
                    {formData.modulos.map((modulo: any, mIdx: number) => (
                        <div key={mIdx} className="bg-gray-50/50 dark:bg-zinc-800/30 border border-gray-100 dark:border-zinc-800 rounded-3xl p-4 animate-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-600/20 flex items-center justify-center text-orange-600 font-black text-xs">
                                    {mIdx + 1}
                                </div>
                                <input
                                    type="text"
                                    value={modulo.titulo}
                                    onChange={(e) => {
                                        const newModulos = [...formData.modulos];
                                        newModulos[mIdx].titulo = e.target.value;
                                        setFormData({ ...formData, modulos: newModulos });
                                    }}
                                    className="flex-1 bg-transparent border-none focus:ring-0 font-black text-sm placeholder-gray-400 text-gray-900 dark:text-white"
                                    placeholder="Título del Módulo (Ej: Fundamentos)"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newModulos = [...formData.modulos];
                                        newModulos.splice(mIdx, 1);
                                        setFormData({ ...formData, modulos: newModulos });
                                    }}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="pl-11 space-y-3 relative">
                                <div className="absolute left-[20px] top-0 bottom-4 w-0.5 bg-gray-100 dark:bg-zinc-800" />

                                {modulo.clases.map((clase: any, cIdx: number) => (
                                    <div key={cIdx} className="relative p-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl group transition-all hover:shadow-md">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newModulos = [...formData.modulos];
                                                newModulos[mIdx].clases.splice(cIdx, 1);
                                                setFormData({ ...formData, modulos: newModulos });
                                            }}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                                        >
                                            <X size={12} />
                                        </button>

                                        <div className="grid grid-cols-1 gap-2">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2 flex-1">
                                                    {clase.tipo === "lectura" ? (
                                                        <BookOpen size={12} className="text-orange-600 opacity-50" />
                                                    ) : (
                                                        <Video size={12} className="text-orange-600 opacity-50" />
                                                    )}
                                                    <input
                                                        type="text"
                                                        value={clase.titulo}
                                                        onChange={(e) => {
                                                            const newModulos = [...formData.modulos];
                                                            newModulos[mIdx].clases[cIdx].titulo = e.target.value;
                                                            setFormData({ ...formData, modulos: newModulos });
                                                        }}
                                                        className="w-full bg-transparent border-none focus:ring-0 font-bold text-xs placeholder-gray-400 text-gray-900 dark:text-white"
                                                        placeholder="Título de la lección"
                                                    />
                                                </div>
                                                <div className="flex bg-gray-100 dark:bg-zinc-800 rounded-lg p-0.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newModulos = [...formData.modulos];
                                                            newModulos[mIdx].clases[cIdx].tipo = "video";
                                                            setFormData({ ...formData, modulos: newModulos });
                                                        }}
                                                        className={`px-2 py-1 rounded-md text-[8px] font-black transition-all ${clase.tipo !== "lectura" ? "bg-white dark:bg-zinc-700 shadow-sm text-orange-600" : "text-gray-400"}`}
                                                    >
                                                        VIDEO
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newModulos = [...formData.modulos];
                                                            newModulos[mIdx].clases[cIdx].tipo = "lectura";
                                                            setFormData({ ...formData, modulos: newModulos });
                                                        }}
                                                        className={`px-2 py-1 rounded-md text-[8px] font-black transition-all ${clase.tipo === "lectura" ? "bg-white dark:bg-zinc-700 shadow-sm text-orange-600" : "text-gray-400"}`}
                                                    >
                                                        TEXTO
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mt-1 bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-2 border border-gray-100 dark:border-zinc-800/50">
                                                {clase.tipo === "lectura" ? (
                                                    <textarea
                                                        value={clase.descripcion}
                                                        onChange={(e) => {
                                                            const newModulos = [...formData.modulos];
                                                            newModulos[mIdx].clases[cIdx].descripcion = e.target.value;
                                                            setFormData({ ...formData, modulos: newModulos });
                                                        }}
                                                        className="w-full bg-transparent border-none focus:ring-0 text-[10px] text-gray-700 dark:text-gray-300 placeholder-gray-300 min-h-[60px] resize-none"
                                                        placeholder="Escribe el contenido de lectura aquí..."
                                                    />
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={clase.video_url}
                                                        onChange={(e) => {
                                                            const newModulos = [...formData.modulos];
                                                            newModulos[mIdx].clases[cIdx].video_url = e.target.value;
                                                            setFormData({ ...formData, modulos: newModulos });
                                                        }}
                                                        className="w-full bg-transparent border-none focus:ring-0 text-[10px] text-gray-700 dark:text-gray-300 placeholder-gray-300"
                                                        placeholder="URL del Video (YouTube/Vimeo)"
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-3 pt-3 border-t border-gray-50 dark:border-zinc-800/50">
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Material Extra</label>
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        id={`lesson-resource-${mIdx}-${cIdx}`}
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const newModulos = [...formData.modulos];
                                                                newModulos[mIdx].clases[cIdx].recursos = [
                                                                    ...(newModulos[mIdx].clases[cIdx].recursos || []),
                                                                    { nombre: file.name, url: "", file }
                                                                ];
                                                                setFormData({ ...formData, modulos: newModulos });
                                                            }
                                                        }}
                                                    />
                                                    <label
                                                        htmlFor={`lesson-resource-${mIdx}-${cIdx}`}
                                                        className="cursor-pointer text-[9px] font-black bg-gray-50 dark:bg-zinc-900 text-gray-500 px-2 py-1 rounded-lg hover:bg-orange-500 hover:text-white transition-all flex items-center gap-1.5"
                                                    >
                                                        <Paperclip size={10} /> Adjuntar
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                {clase.recursos?.map((rec: any, rIdx: number) => (
                                                    <div key={rIdx} className="flex items-center justify-between bg-gray-50/50 dark:bg-zinc-800/20 p-2 rounded-xl border border-gray-100 dark:border-zinc-800">
                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                            <FileText size={12} className="text-orange-600 shrink-0" />
                                                            <span className="text-[10px] font-bold truncate max-w-[120px]">{rec.nombre}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newModulos = [...formData.modulos];
                                                                newModulos[mIdx].clases[cIdx].recursos.splice(rIdx, 1);
                                                                setFormData({ ...formData, modulos: newModulos });
                                                            }}
                                                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={() => {
                                        const newModulos = [...formData.modulos];
                                        newModulos[mIdx].clases.push({ titulo: "", video_url: "", descripcion: "", recursos: [] });
                                        setFormData({ ...formData, modulos: newModulos });
                                    }}
                                    className="w-full py-2.5 border border-dashed border-gray-200 dark:border-zinc-800 rounded-xl text-[10px] font-black text-gray-400 hover:border-orange-200 hover:text-orange-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <PlusCircle size={10} /> Agregar Lección
                                </button>
                            </div>
                        </div>
                    ))}

                    {formData.modulos.length === 0 && (
                        <div className="py-10 border-2 border-dashed border-gray-100 dark:border-zinc-800 rounded-[2rem] flex flex-col items-center justify-center text-center px-6">
                            <div className="w-12 h-12 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl flex items-center justify-center text-gray-300 mb-4">
                                <BookOpen size={24} />
                            </div>
                            <p className="text-xs font-bold text-gray-400 mb-4 text-pretty max-w-[200px]">No has agregado módulos. Divide tu curso en secciones lógicas.</p>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, modulos: [{ titulo: "", clases: [] }] })}
                                className="bg-orange-600/10 text-orange-600 text-[10px] font-black px-4 py-2 rounded-xl hover:bg-orange-600 hover:text-white transition-all"
                            >
                                Crear Primer Módulo
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
