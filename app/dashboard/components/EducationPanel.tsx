"use client";

import React, { useState } from "react";
import {
    Plus, Search, GraduationCap, Video, BookOpen,
    MoreVertical, Edit3, Trash2, Eye, ChevronRight,
    LayoutDashboard, FileText, Users, Download, Upload,
    ExternalLink
} from "lucide-react";
import Image from "next/image";
import { ProductModal } from "./ProductModal";

export function EducationPanel({
    productos,
    negocio,
    user,
    onStopManaging
}: {
    productos: any[];
    negocio: any;
    user: any;
    onStopManaging?: () => void;
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"resumen" | "cursos" | "recursos">("cursos");

    // Filtrar solo productos que sean cursos (rubro educacion o similar)
    const cursos = productos.filter(p =>
        p.detalles_especificos?.modulos ||
        p.detalles_especificos?.clases ||
        p.rubro?.toLowerCase().includes("educacion") ||
        (p.nombre || p.nombre_producto)?.toLowerCase().includes("curso") ||
        p.categoria?.toLowerCase().includes("curso") ||
        ["curso", "clase", "modulo"].includes(p.detalles_especificos?.unidad_medida)
    );

    const filteredCursos = cursos.filter(c => {
        const name = c.nombre || c.nombre_producto || "";
        return name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const totalLecciones = cursos.reduce((acc, c) => {
        const modulos = c.detalles_especificos?.modulos;
        if (modulos) {
            return acc + modulos.reduce((mAcc: number, m: any) => mAcc + (m.clases?.length || 0), 0);
        }
        return acc + (c.detalles_especificos?.clases?.length || 0);
    }, 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {onStopManaging && (
                <div className="bg-orange-600/10 border border-orange-600/20 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-600/20 shrink-0">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest leading-none mb-1">Modo Administrador</p>
                            <h4 className="text-base font-black dark:text-white leading-none">Gestionando Academy: <span className="text-orange-600 underline underline-offset-4 decoration-2">{negocio?.nombre || 'Negocio sin nombre'}</span></h4>
                        </div>
                    </div>
                    <button
                        onClick={onStopManaging}
                        className="w-full md:w-auto px-6 py-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 text-gray-900 dark:text-white text-[10px] font-black rounded-2xl hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all shadow-sm active:scale-95"
                    >
                        Terminar Gestión
                    </button>
                </div>
            )}
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black flex items-center gap-2">
                        <GraduationCap className="text-orange-600" size={28} />
                        Gestión Academy
                    </h2>
                    <p className="text-gray-500 text-sm font-medium">Panel integral de formación y contenido</p>
                </div>
                {activeTab === "cursos" && (
                    <button
                        onClick={() => { setSelectedCourse(null); setIsModalOpen(true); }}
                        className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-2xl font-bold transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-orange-600/20"
                    >
                        <Plus size={20} />
                        Crear Nuevo Curso
                    </button>
                )}
            </div>

            {/* Internal Tabs Navigation */}
            <div className="flex items-center gap-2 p-1.5 bg-gray-100/50 dark:bg-zinc-800/50 rounded-2xl w-fit">
                {[
                    { id: "resumen", label: "Resumen", icon: LayoutDashboard },
                    { id: "cursos", label: "Mis Cursos", icon: BookOpen },
                    { id: "recursos", label: "Material Extra", icon: FileText }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                            ? "bg-white dark:bg-zinc-900 text-orange-600 shadow-sm"
                            : "text-gray-500 hover:text-gray-900 dark:hover:text-zinc-300"
                            }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === "resumen" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-2 duration-500">
                    {/* Metrics moved/copied here but with more detail */}
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
                        <div className="w-14 h-14 bg-orange-50 dark:bg-orange-600/10 rounded-2xl flex items-center justify-center text-orange-600 mb-6 font-black">
                            <BookOpen size={28} />
                        </div>
                        <h3 className="text-4xl font-black mb-1">{cursos.length}</h3>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Cursos Publicados</p>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
                        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                            <Video size={28} />
                        </div>
                        <h3 className="text-4xl font-black mb-1">{totalLecciones}</h3>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Lecciones Totales</p>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
                        <div className="w-14 h-14 bg-green-50 dark:bg-green-600/10 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                            <Users size={28} />
                        </div>
                        <h3 className="text-4xl font-black mb-1">--</h3>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Alumnos Inscritos</p>
                    </div>

                    {/* Welcome Card */}
                    <div className="col-span-full bg-gradient-to-br from-orange-600 to-orange-500 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-orange-600/20">
                        <div className="relative z-10 max-w-2xl">
                            <h3 className="text-3xl font-black mb-4">Bienvenido a tu Centro de Formación</h3>
                            <p className="text-orange-50 text-lg font-medium leading-relaxed mb-8 opacity-90">
                                Desde aquí puedes gestionar todo tu ecosistema educativo. Crea cursos con múltiples módulos, sube material complementario y monitorea el progreso de tus alumnos.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button onClick={() => setActiveTab("cursos")} className="bg-white text-orange-600 px-8 py-3 rounded-2xl font-black text-sm hover:shadow-xl transition-all">
                                    Gestionar Cursos
                                </button>
                                <button onClick={() => setActiveTab("recursos")} className="bg-orange-700/30 text-white backdrop-blur-sm border border-white/20 px-8 py-3 rounded-2xl font-black text-sm hover:bg-orange-700/50 transition-all">
                                    Subir Material
                                </button>
                            </div>
                        </div>
                        <GraduationCap className="absolute -right-12 -bottom-12 text-white/10 w-80 h-80 -rotate-12" />
                    </div>
                </div>
            )}

            {activeTab === "cursos" && (
                <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
                    {/* Search and Filters */}
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar curso por nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl font-medium focus:ring-4 focus:ring-orange-600/10 focus:border-orange-600 outline-none transition-all shadow-sm"
                        />
                    </div>

                    {/* Courses List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCursos.map((curso) => (
                            <div
                                key={curso.id}
                                className="group bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                            >
                                {/* Course Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={curso.imagen_url || curso.imagen || "/placeholder-course.jpg"}
                                        alt={curso.nombre || curso.nombre_producto}
                                        fill
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    <div className="absolute top-4 right-4 bg-orange-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        {curso.categoria}
                                    </div>
                                </div>

                                {/* Course Info */}
                                <div className="p-6">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 line-clamp-1">
                                        {curso.nombre || curso.nombre_producto}
                                    </h3>
                                    <div className="flex items-center gap-4 text-gray-500 text-xs font-bold mb-6">
                                        <span className="flex items-center gap-1.5">
                                            <BookOpen size={14} />
                                            {curso.detalles_especificos?.modulos?.length || (curso.detalles_especificos?.clases?.length ? 1 : 0)} Módulos
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Video size={14} />
                                            {curso.detalles_especificos?.modulos
                                                ? curso.detalles_especificos.modulos.reduce((acc: number, m: any) => acc + (m.clases?.length || 0), 0)
                                                : (curso.detalles_especificos?.clases?.length || 0)} Clases
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <button
                                            onClick={() => { setSelectedCourse(curso); setIsModalOpen(true); }}
                                            className="flex-1 flex items-center justify-center gap-2 bg-gray-50 dark:bg-zinc-800/50 hover:bg-orange-50 dark:hover:bg-orange-600/10 hover:text-orange-600 py-3 rounded-2xl font-bold transition-all text-sm"
                                        >
                                            <Edit3 size={16} />
                                            Editar
                                        </button>
                                        <button
                                            className="w-12 h-12 flex items-center justify-center bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-2xl transition-all"
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredCursos.length === 0 && (
                            <div className="col-span-full py-20 bg-gray-50 dark:bg-zinc-800/20 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center px-6">
                                <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-gray-400 mb-6">
                                    <GraduationCap size={40} />
                                </div>
                                <h3 className="text-xl font-black mb-2">No hay cursos configurados</h3>
                                <p className="text-gray-500 text-sm max-w-xs mb-8">Comienza creando tu primer curso con módulos y lecciones interactivas.</p>
                                <button
                                    onClick={() => { setSelectedCourse(null); setIsModalOpen(true); }}
                                    className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-2xl font-bold transition-all"
                                >
                                    Crear mi primer curso
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === "recursos" && (
                <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
                    <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3rem] border border-gray-100 dark:border-zinc-800 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-600/10 rounded-full flex items-center justify-center text-blue-600 mb-6 font-black">
                            <FileText size={40} />
                        </div>
                        <h3 className="text-2xl font-black mb-2">Biblioteca de Recursos</h3>
                        <p className="text-gray-500 text-sm max-w-md mb-8">
                            Aquí puedes ver todos los archivos adjuntos a tus cursos y lecciones. Los alumnos podrán descargarlos directamente desde el aula.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {cursos.flatMap(curso => [
                            // Recursos generales del curso
                            ...(Array.isArray(curso.detalles_especificos?.recursos) ? curso.detalles_especificos.recursos.map((rec: any) => ({
                                ...rec,
                                origen: curso.nombre || curso.nombre_producto,
                                tipo_origen: "Curso"
                            })) : []),
                            // Recursos de cada lección
                            ...(curso.detalles_especificos?.modulos || []).flatMap((modulo: any) =>
                                (modulo.clases || []).flatMap((clase: any) =>
                                    (clase.recursos || []).map((rec: any) => ({
                                        ...rec,
                                        origen: `${curso.nombre || curso.nombre_producto} > ${clase.titulo}`,
                                        tipo_origen: "Lección"
                                    }))
                                )
                            )
                        ]).map((rec, idx) => (
                            <div key={idx} className="p-6 bg-gray-50 dark:bg-zinc-800/50 rounded-3xl border border-gray-100 dark:border-zinc-800 flex flex-col gap-4 group hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center ${rec.tipo_origen === "Lección" ? "text-orange-600" : "text-blue-600"} shadow-sm group-hover:scale-110 transition-transform`}>
                                        <FileText size={24} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black truncate">{rec.nombre}</p>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{rec.tipo_origen}: {rec.origen}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between border-t border-gray-100 dark:border-zinc-800 pt-4 mt-2">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Minio Storage</span>
                                    <a
                                        href={rec.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 rounded-xl text-[10px] font-black hover:scale-105 transition-all"
                                    >
                                        <Download size={14} /> DESCARGAR
                                    </a>
                                </div>
                            </div>
                        ))}

                        {cursos.every(c => !c.detalles_especificos?.recursos?.length && !c.detalles_especificos?.modulos?.some((m: any) => m.clases?.some((l: any) => l.recursos?.length))) && (
                            <div className="col-span-full py-20 text-center opacity-50">
                                <p className="text-sm font-bold text-gray-400">No hay recursos cargados aún.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isModalOpen && (
                <ProductModal
                    isOpen={isModalOpen}
                    onClose={() => { setIsModalOpen(false); setSelectedCourse(null); }}
                    productoParaEditar={selectedCourse}
                    negocioData={negocio}
                    user={user}
                />
            )}
        </div>
    );
}
