"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import {
    BookOpen, GraduationCap, PlayCircle, Clock,
    ArrowLeft, ExternalLink, Search, LayoutGrid, ArrowRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Course {
    id_producto: string;
    nombre_producto: string;
    link_acceso: string;
    nivel?: string;
    duracion?: string;
    vendedor: string;
    fecha_compra: any;
    imagen?: string;
}

export default function MisCursosPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [cursos, setCursos] = useState<Course[]>([]);
    const [loadingCursos, setLoadingCursos] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (!loading && !user) router.push("/login");
    }, [user, loading, router]);

    useEffect(() => {
        if (!user?.uid) return;

        const q = query(
            collection(db, "transacciones"),
            where("id_usuario", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const foundCursos: Course[] = [];
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                // Permitir ver si está en preparación, en camino o entregado
                const estadosValidos = ["en_preparacion", "en_camino", "entregado"];
                if (estadosValidos.includes(data.estado) && data.items) {
                    data.items.forEach((item: any) => {
                        const ds = item.detalles_seleccionados;
                        const um = ds?.unidad_medida?.toLowerCase();
                        const isEdu = ["curso", "clase", "modulo"].includes(um) || ds?.link_acceso;

                        if (isEdu) {
                            foundCursos.push({
                                id_producto: item.id_producto,
                                nombre_producto: item.nombre_producto,
                                link_acceso: ds?.link_acceso || "",
                                nivel: ds?.nivel,
                                duracion: ds?.duracion,
                                vendedor: data.negocio_nombre || "Institución",
                                fecha_compra: data.createdAt,
                                imagen: ds?.imagen_url || item.imagen_url
                            });
                        }
                    });
                }
            });
            // Eliminar duplicados si compró el mismo curso varias veces (aunque no debería)
            const uniqueCursos = foundCursos.filter((v, i, a) => a.findIndex(t => t.id_producto === v.id_producto) === i);
            setCursos(uniqueCursos);
            setLoadingCursos(false);
        });

        return () => unsubscribe();
    }, [user]);

    const filtered = cursos.filter(c =>
        c.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.vendedor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading || loadingCursos) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] dark:bg-[#0A0A0A]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Preparando tu aula...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0A0A0A] pt-28 pb-20 px-4">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2.5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl hover:scale-105 transition-all shadow-sm">
                            <ArrowLeft size={18} className="text-gray-900 dark:text-white" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Mis <span className="text-indigo-600">Aprendizajes.</span></h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">Has adquirido {cursos.length} formaciones</p>
                        </div>
                    </div>

                    <div className="relative group w-full md:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-500 transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="Buscar curso..."
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl outline-none focus:border-indigo-500/50 font-bold text-xs transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="text-center py-24 bg-white dark:bg-zinc-900 rounded-[3rem] border border-gray-100 dark:border-zinc-800 shadow-sm border-dashed">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <GraduationCap size={40} className="text-gray-200 dark:text-zinc-700" />
                        </div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-widest">Aún no hay cursos activos</h3>
                        <p className="text-[11px] text-gray-400 font-bold mt-2 max-w-xs mx-auto">Inscribite en nuevas formaciones para que aparezcan aquí una vez confirmado tu pago.</p>
                        <button onClick={() => router.push('/explorar')} className="mt-8 px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-black rounded-2xl text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl">Explorar Catálogo</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((curso) => (
                            <div key={curso.id_producto} className="group bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 overflow-hidden hover:border-indigo-500/30 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col">
                                {/* Thumbnail */}
                                <div className="relative aspect-video bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                                    {curso.imagen ? (
                                        <Image src={curso.imagen} fill className="object-cover group-hover:scale-110 transition-transform duration-700" alt={curso.nombre_producto} unoptimized />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/20">
                                            <BookOpen size={40} className="text-indigo-200 dark:text-indigo-900" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <PlayCircle size={48} className="text-white drop-shadow-lg" />
                                    </div>
                                    {curso.nivel && (
                                        <span className="absolute top-4 left-4 px-2.5 py-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-lg text-[9px] font-black uppercase tracking-tighter text-indigo-600 shadow-sm border border-indigo-100 dark:border-indigo-900/50">
                                            {curso.nivel}
                                        </span>
                                    )}
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{curso.vendedor}</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Activo</span>
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight mb-4 group-hover:text-indigo-600 transition-colors">{curso.nombre_producto}</h3>

                                    <div className="flex items-center gap-4 mb-6">
                                        {curso.duracion && (
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                                                <Clock size={14} className="text-gray-300" />
                                                {curso.duracion}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                                            <LayoutGrid size={14} className="text-gray-300" />
                                            Acceso de por vida
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        <Link
                                            href={`/cursos/${curso.id_producto}`}
                                            className="w-full py-4 bg-indigo-600 dark:bg-indigo-500 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
                                        >
                                            Entrar al Aula <ArrowRight size={16} strokeWidth={3} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Info Footer */}
                <div className="mt-20 pt-10 border-t border-gray-100 dark:border-zinc-900 text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Clickcito Educación &copy; 2026</p>
                </div>

            </div>
        </div>
    );
}
