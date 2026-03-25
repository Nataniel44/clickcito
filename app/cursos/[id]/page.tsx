"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductoById, getTransaccionesByCliente } from "@/app/firebase/db";
import { useAuth } from "@/app/context/AuthContext";
import {
    ChevronLeft, Play, FileText, CheckCircle2,
    Lock, Menu, X, ArrowRight, GraduationCap, Download, Paperclip
} from "lucide-react";
import Link from "next/link";

export default function ClassroomPage() {
    const { id } = useParams();
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const [activeLessonIdx, setActiveLessonIdx] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        async function checkAccessAndLoad() {
            if (authLoading) return;
            if (!user) {
                // router.push("/login"); // Comentado para permitir ver estructura si no hay login
                setLoading(false);
                return;
            }

            try {
                // 1. Cargar el producto
                const product = await getProductoById(id as string);
                if (!product) {
                    setLoading(false);
                    return;
                }
                setCourse(product);

                // 2. Verificar compra del usuario
                const trans = await getTransaccionesByCliente(user.uid);
                const hasPurchased = trans.some((t: any) =>
                    ["en_preparacion", "en_camino", "entregado"].includes(t.estado) &&
                    t.items?.some((item: any) => item.id_producto === id)
                );

                setHasAccess(hasPurchased);
            } catch (err) {
                console.error("Error loading classroom:", err);
            } finally {
                setLoading(false);
            }
        }
        checkAccessAndLoad();
    }, [id, user, authLoading]);

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mb-6 border border-zinc-800">
                    <X className="text-zinc-600" size={40} />
                </div>
                <h1 className="text-2xl font-black text-white mb-2">Curso no encontrado</h1>
                <Link href="/cursos" className="text-indigo-400 font-bold hover:underline">Volver a mis cursos</Link>
            </div>
        );
    }

    if (!hasAccess) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mb-6 border border-indigo-500/20">
                    <Lock className="text-indigo-500" size={40} />
                </div>
                <h1 className="text-2xl font-black text-white mb-2">Sin acceso al contenido</h1>
                <p className="text-zinc-400 max-w-sm mb-8 font-medium">Debes adquirir este curso para poder ver las lecciones y el material exclusivo.</p>
                <Link href={`/explorar`} className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20">
                    Explorar Cursos
                </Link>
            </div>
        );
    }

    const modulos = course.detalles_especificos?.modulos || [];
    const legacyLessons = course.detalles_especificos?.clases || [];

    // Normalizar a estructura de módulos
    const allModulos = modulos.length > 0
        ? modulos
        : (legacyLessons.length > 0 ? [{ titulo: "Contenido del Curso", clases: legacyLessons }] : []);

    const flatLessons = allModulos.flatMap((m: any) => m.clases);
    const currentLesson = flatLessons[activeLessonIdx];

    // Helper para extraer ID de video (YouTube)
    const getEmbedUrl = (url: string) => {
        if (!url) return "";
        let videoId = "";
        if (url.includes("youtube.com/watch?v=")) videoId = url.split("v=")[1]?.split("&")[0];
        else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1]?.split("?")[0];

        if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        return url; // Fallback
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col md:flex-row overflow-hidden pt-[72px] md:pt-[88px]">
            {/* Sidebar Navigation */}
            <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0'} fixed md:relative z-50 w-[85vw] md:w-96 h-[calc(100vh-72px)] md:h-[calc(100vh-88px)] bg-zinc-950/50 backdrop-blur-xl border-r border-zinc-800 transition-all duration-300 flex flex-col shadow-2xl`}>
                <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/20">
                            <GraduationCap size={20} className="text-white" />
                        </div>
                        <h2 className="font-black text-lg tracking-tighter leading-tight truncate max-w-[200px]">
                            {course.nombre_producto}
                        </h2>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 text-zinc-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-4">
                    {allModulos.length > 0 ? (
                        allModulos.map((modulo: any, mIdx: number) => (
                            <div key={mIdx} className="space-y-1">
                                <div className="px-3 py-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500/50">
                                        Módulo {mIdx + 1}: {modulo.titulo}
                                    </p>
                                </div>
                                {modulo.clases.map((lesson: any, cIdx: number) => {
                                    // Calcular índice global para comparación
                                    const globalIdx = allModulos.slice(0, mIdx).reduce((acc: number, m: any) => acc + m.clases.length, 0) + cIdx;

                                    return (
                                        <button
                                            key={cIdx}
                                            onClick={() => setActiveLessonIdx(globalIdx)}
                                            className={`w-full p-4 rounded-2xl flex items-start gap-4 text-left transition-all group ${activeLessonIdx === globalIdx
                                                ? 'bg-orange-600/10 border border-orange-500/20'
                                                : 'hover:bg-white/5 border border-transparent'
                                                }`}
                                        >
                                            <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 transition-colors ${activeLessonIdx === globalIdx ? 'bg-orange-600 text-white' : 'bg-zinc-900 text-zinc-600 group-hover:text-zinc-400'
                                                }`}>
                                                {lesson.tipo === "lectura" || (!lesson.video_url && lesson.tipo !== "video") ? <FileText size={14} /> : <Play size={14} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className={`text-sm font-bold truncate ${activeLessonIdx === globalIdx ? 'text-orange-400' : 'text-zinc-300'}`}>
                                                    {lesson.titulo || `Clase ${cIdx + 1}`}
                                                </h3>
                                                <p className="text-[10px] text-zinc-500 font-medium mt-1 truncate">
                                                    {lesson.tipo === "lectura" ? 'Material de lectura' : (lesson.video_url ? 'Video Clase' : 'Sin contenido')}
                                                </p>
                                            </div>
                                            {activeLessonIdx === globalIdx && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse mt-3" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center bg-zinc-900/50 rounded-3xl border border-zinc-800/50 mx-3">
                            <p className="text-xs text-zinc-500 font-medium">No hay contenido cargado en este curso.</p>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-zinc-900">
                    <Link href="/cursos" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                        <ChevronLeft size={14} /> Volver al Dashboard
                    </Link>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 h-[calc(100vh-72px)] md:h-[calc(100vh-88px)] flex flex-col bg-black relative">
                {/* Mobile Header */}
                <div className="md:hidden p-4 flex items-center justify-between border-b border-zinc-900 bg-zinc-950">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 text-zinc-400">
                        <Menu size={20} />
                    </button>
                    <span className="font-bold text-sm truncate px-4">{course.nombre_producto}</span>
                    <div className="w-10" />
                </div>

                {/* Content Scroll Area */}
                <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
                    {currentLesson?.video_url ? (
                        <div className="w-full aspect-video bg-zinc-900 relative">
                            {currentLesson.video_url.includes("youtube") || currentLesson.video_url.includes("youtu.be") ? (
                                <iframe
                                    src={getEmbedUrl(currentLesson.video_url)}
                                    className="absolute inset-0 w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 p-8 text-center">
                                    <Play size={48} className="mb-4 text-zinc-800" />
                                    <p className="text-sm font-bold">Link de video no compatible o privado</p>
                                    <p className="text-xs mt-2">{currentLesson.video_url}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="w-full min-h-[40vh] bg-gradient-to-br from-orange-900/20 to-zinc-950 flex flex-col items-center justify-center border-b border-zinc-900 p-12 text-center">
                            <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center mb-6 border border-orange-500/20 shadow-2xl shadow-orange-500/10">
                                <FileText size={40} className="text-orange-500 animate-pulse" />
                            </div>
                            <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">Contenido de Lectura</h3>
                            <p className="text-zinc-400 text-lg max-w-lg font-medium leading-relaxed">
                                Esta lección consiste en material escrito. Explora los detalles y recursos debajo para completar esta clase.
                            </p>
                        </div>
                    )}

                    {/* Lesson Details Area */}
                    <div className="p-8 md:p-12 max-w-4xl mx-auto w-full">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                            <div>
                                <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-widest mb-3">
                                    <span className="bg-orange-500/10 px-2 py-0.5 rounded text-[10px]">Lección {activeLessonIdx + 1}</span>
                                    {currentLesson?.video_url ? "Video Clase" : "Material de lectura"}
                                </div>
                                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-none mb-4">
                                    {currentLesson?.titulo || "Selecciona una lección"}
                                </h1>
                                <p className="text-zinc-400 text-lg font-medium leading-relaxed max-w-2xl">
                                    {currentLesson?.descripcion || "Prepara tus apuntes y presta atención a esta clase."}
                                </p>
                            </div>

                            {activeLessonIdx < flatLessons.length - 1 && (
                                <button
                                    onClick={() => setActiveLessonIdx(activeLessonIdx + 1)}
                                    className="shrink-0 flex items-center gap-3 bg-white text-black px-6 py-4 rounded-2xl font-black hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 active:scale-95 group"
                                >
                                    Siguiente Clase <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            )}
                        </div>

                        {/* Additional Content / Resources */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12 border-t border-zinc-900">
                            {/* Objetivos */}
                            <div className="p-6 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl">
                                <h4 className="text-sm font-black text-white mb-2 flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-green-500" /> Objetivos de aprendizaje
                                </h4>
                                <ul className="text-xs text-zinc-500 space-y-2 font-medium">
                                    {course?.detalles_especificos?.objetivos ? (
                                        course.detalles_especificos.objetivos.split('\n').filter((o: string) => o.trim()).map((obj: string, i: number) => (
                                            <li key={i}>• {obj.trim()}</li>
                                        ))
                                    ) : (
                                        <>
                                            <li>• Comprender los fundamentos del tema</li>
                                            <li>• Aplicar los conceptos en casos prácticos</li>
                                            <li>• Resolver dudas comunes del módulo</li>
                                        </>
                                    )}
                                </ul>
                            </div>

                            {/* Recursos de la LECCIÓN */}
                            <div className="p-6 bg-orange-500/5 border border-orange-500/10 rounded-3xl">
                                <h4 className="text-sm font-black text-orange-400 mb-2 flex items-center gap-2">
                                    <Paperclip size={16} /> Material de esta clase
                                </h4>
                                <div className="space-y-2">
                                    {currentLesson?.recursos && currentLesson.recursos.length > 0 ? (
                                        currentLesson.recursos.map((rec: any, i: number) => (
                                            <a
                                                key={i}
                                                href={rec.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-2xl group hover:bg-orange-500/10 hover:border-orange-500/20 transition-all"
                                            >
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-orange-400 group-hover:text-orange-500 shrink-0 transition-colors">
                                                        <FileText size={14} />
                                                    </div>
                                                    <span className="text-[11px] text-zinc-400 group-hover:text-white font-bold truncate transition-colors">
                                                        {rec.nombre}
                                                    </span>
                                                </div>
                                                <Download size={14} className="text-zinc-600 group-hover:text-orange-500 shrink-0 transition-colors" />
                                            </a>
                                        ))
                                    ) : (
                                        <p className="text-[10px] text-orange-400/60 font-medium">Esta lección no incluye material extra.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Recursos Generales del Curso */}
                        <div className="mt-6 p-6 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl">
                            <h4 className="text-sm font-black text-white mb-4 flex items-center gap-2">
                                <FileText size={16} className="text-zinc-500" /> Recursos Generales del Curso
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {Array.isArray(course.detalles_especificos?.recursos) && course.detalles_especificos.recursos.length > 0 ? (
                                    course.detalles_especificos.recursos.map((rec: any, i: number) => (
                                        <a
                                            key={i}
                                            href={rec.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-2xl group hover:bg-indigo-500/10 hover:border-indigo-500/20 transition-all"
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-indigo-400 shrink-0 transition-colors">
                                                    <FileText size={14} />
                                                </div>
                                                <span className="text-[11px] text-zinc-400 group-hover:text-white font-bold truncate transition-colors">
                                                    {rec.nombre}
                                                </span>
                                            </div>
                                            <Download size={14} className="text-zinc-600 group-hover:text-indigo-500 shrink-0 transition-colors" />
                                        </a>
                                    ))
                                ) : (
                                    <p className="text-[10px] text-zinc-500 font-medium col-span-2">No hay recursos generales adicionales.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .shadow-text {
                    filter: drop-shadow(0 0 20px rgba(249, 115, 22, 0.2));
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
