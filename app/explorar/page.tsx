"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { getAllNegocios, getProductosByNegocio } from "@/app/firebase/db";
import {
    Search, MapPin, Store, ShoppingBag, Clock,
    Star, ArrowRight, SlidersHorizontal, X,
    Utensils, Shirt, Scissors, Hammer, Package
} from "lucide-react";

// Configuración de rubros con íconos y colores
const RUBRO_CONFIG: Record<string, { label: string; icon: any; color: string; bgLight: string; emoji: string }> = {
    gastronomia: { label: "Gastronomía", icon: Utensils, color: "text-orange-600", bgLight: "bg-orange-50 border-orange-200", emoji: "🍔" },
    retail: { label: "Retail & Moda", icon: Shirt, color: "text-blue-600", bgLight: "bg-blue-50 border-blue-200", emoji: "👗" },
    servicios: { label: "Servicios", icon: Scissors, color: "text-purple-600", bgLight: "bg-purple-50 border-purple-200", emoji: "💇" },
    construccion: { label: "Materiales", icon: Hammer, color: "text-emerald-600", bgLight: "bg-emerald-50 border-emerald-200", emoji: "🪵" },
    default: { label: "Negocio", icon: Store, color: "text-gray-600", bgLight: "bg-gray-50 border-gray-200", emoji: "🏪" },
};

function getRubroConfig(rubro: string) {
    return RUBRO_CONFIG[rubro] || RUBRO_CONFIG.default;
}

// Componente: Tarjeta de Negocio
function BusinessCard({ negocio, productCount }: { negocio: any; productCount: number }) {
    const config = getRubroConfig(negocio.rubro || "default");
    const IconComponent = config.icon;

    return (
        <Link
            href={`/negocio/${negocio.id}`}
            className="group bg-white dark:bg-zinc-900 rounded-[2rem] border border-gray-100 dark:border-zinc-800 overflow-hidden hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-500 hover:-translate-y-1 flex flex-col"
        >
            {/* Banner */}
            <div className="relative h-36 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 overflow-hidden">
                <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${negocio.rubro === "gastronomia" ? "from-orange-500 to-amber-500" :
                    negocio.rubro === "retail" ? "from-blue-500 to-indigo-500" :
                        negocio.rubro === "servicios" ? "from-purple-500 to-pink-500" :
                            negocio.rubro === "construccion" ? "from-emerald-500 to-teal-500" :
                                "from-gray-500 to-gray-600"
                    }`} />
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Badge de rubro */}
                <div className={`absolute z-10 top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${config.bgLight} border`}>
                    <IconComponent size={14} className={config.color} />
                    <span className={config.color}>{config.label}</span>
                </div>

                {/* Indicador online */}
                {negocio.activo !== false && (
                    <div className="absolute z-10 top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-green-700 uppercase">Abierto</span>
                    </div>
                )}

                {/* Avatar grande */}
                <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 z-0">
                    <div className="w-20 h-20 rounded-2xl bg-white dark:bg-zinc-800 border-4 border-white dark:border-zinc-900 shadow-xl flex items-center justify-center text-3xl font-black text-gray-300 dark:text-zinc-600 group-hover:scale-110 transition-transform">
                        {negocio.logo_url ? (
                            <img src={negocio.logo_url} alt={negocio.nombre} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                            <span>{config.emoji}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="pt-14 px-6 pb-6 flex-1 flex flex-col">
                <div className="text-center mb-4">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors truncate">
                        {negocio.nombre}
                    </h3>
                    {negocio.descripcion && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2 font-medium">
                            {negocio.descripcion}
                        </p>
                    )}
                </div>

                {/* Meta info */}
                <div className="flex flex-wrap justify-center gap-3 mb-5">
                    {negocio.ubicacion && (
                        <span className="flex items-center gap-1 text-xs text-gray-500 font-bold">
                            <MapPin size={12} />
                            {negocio.ubicacion}
                        </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-gray-500 font-bold">
                        <Package size={12} />
                        {productCount} productos
                    </span>
                </div>

                {/* CTA */}
                <div className="mt-auto">
                    <div className="flex items-center justify-center gap-2 py-3 bg-gray-50 dark:bg-zinc-800 rounded-2xl text-sm font-black text-gray-900 dark:text-white group-hover:bg-orange-600 group-hover:text-white transition-all">
                        Ver catálogo
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </Link>
    );
}

// Componente: Chip de filtro
function FilterChip({ active, onClick, label, icon: Icon, count }: { active: boolean; onClick: () => void; label: string; icon?: any; count?: number }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black transition-all whitespace-nowrap ${active
                ? "bg-gray-900 dark:bg-white text-white dark:text-black shadow-lg"
                : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 border border-gray-200 dark:border-zinc-800 hover:border-gray-300"
                }`}
        >
            {Icon && <Icon size={16} />}
            {label}
            {count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? "bg-white/20" : "bg-gray-100 dark:bg-zinc-800"}`}>{count}</span>
            )}
        </button>
    );
}

// Página Principal
export default function ExplorarPage() {
    const [negocios, setNegocios] = useState<any[]>([]);
    const [productCounts, setProductCounts] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeRubro, setActiveRubro] = useState("todos");

    useEffect(() => {
        async function fetchNegocios() {
            try {
                const data = await getAllNegocios();
                setNegocios(data);

                // Obtener conteo de productos para cada negocio
                const counts: Record<string, number> = {};
                await Promise.all(
                    data.map(async (negocio: any) => {
                        try {
                            const productos = await getProductosByNegocio(negocio.id);
                            counts[negocio.id] = productos.length;
                        } catch {
                            counts[negocio.id] = 0;
                        }
                    })
                );
                setProductCounts(counts);
            } catch (error) {
                console.error("Error cargando negocios:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchNegocios();
    }, []);

    // Filtrar negocios
    const negociosFiltrados = useMemo(() => {
        return negocios.filter((negocio) => {
            const matchesSearch =
                negocio.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                negocio.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                negocio.ubicacion?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRubro = activeRubro === "todos" || negocio.rubro === activeRubro;
            return matchesSearch && matchesRubro;
        });
    }, [negocios, searchTerm, activeRubro]);

    // Conteo por rubro
    const rubroCounts = useMemo(() => {
        const counts: Record<string, number> = { todos: negocios.length };
        negocios.forEach(n => {
            const rubro = n.rubro || "default";
            counts[rubro] = (counts[rubro] || 0) + 1;
        });
        return counts;
    }, [negocios]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] dark:bg-[#0A0A0A]">
                <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-6">
                        <div className="absolute inset-0 border-4 border-gray-200 dark:border-zinc-800 rounded-full" />
                        <div className="absolute inset-0 border-4 border-transparent border-t-orange-500 rounded-full animate-spin" />
                    </div>
                    <p className="text-gray-500 font-black text-lg">Cargando negocios...</p>
                    <p className="text-gray-400 text-sm font-medium mt-1">Descubrí los comercios de tu zona</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0A0A0A] pt-24 pb-16">
            {/* Header */}
            <div className="px-6 mb-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2.5 bg-orange-600 rounded-xl shadow-lg shadow-orange-600/20">
                                    <Store className="text-white" size={24} />
                                </div>
                                <span className="text-sm font-black text-orange-600 uppercase tracking-[0.2em]">Explorar</span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                                Negocios <span className="text-gray-300 dark:text-zinc-600">cerca tuyo</span>
                            </h1>
                            <p className="text-gray-500 font-medium mt-2 text-lg">
                                {negocios.length} {negocios.length === 1 ? "negocio disponible" : "negocios disponibles"} en la plataforma
                            </p>
                        </div>
                    </div>

                    {/* Barra de búsqueda */}
                    <div className="relative mb-6">
                        <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, rubro o ubicación..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-12 py-4 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white font-bold placeholder:text-gray-400 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 shadow-sm text-lg transition-all"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-gray-100 dark:bg-zinc-800 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <X size={16} className="text-gray-500" />
                            </button>
                        )}
                    </div>

                    {/* Filtros por rubro */}
                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                        <FilterChip
                            active={activeRubro === "todos"}
                            onClick={() => setActiveRubro("todos")}
                            label="Todos"
                            icon={SlidersHorizontal}
                            count={rubroCounts.todos}
                        />
                        {Object.entries(RUBRO_CONFIG).filter(([key]) => key !== "default").map(([key, config]) => (
                            <FilterChip
                                key={key}
                                active={activeRubro === key}
                                onClick={() => setActiveRubro(key)}
                                label={config.label}
                                icon={config.icon}
                                count={rubroCounts[key] || 0}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid de Negocios */}
            <div className="px-6">
                <div className="max-w-6xl mx-auto">
                    {negociosFiltrados.length === 0 ? (
                        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-dashed border-gray-300 dark:border-zinc-800 p-16 text-center">
                            <div className="w-24 h-24 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Store size={48} className="text-gray-300 dark:text-zinc-600" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                                {searchTerm ? "Sin resultados" : "Aún no hay negocios en esta categoría"}
                            </h2>
                            <p className="text-gray-500 dark:text-zinc-400 text-lg font-medium">
                                {searchTerm
                                    ? `No encontramos negocios para "${searchTerm}". Probá con otra búsqueda.`
                                    : "Pronto se sumarán nuevos comercios a la plataforma."
                                }
                            </p>
                            {searchTerm && (
                                <button
                                    onClick={() => { setSearchTerm(""); setActiveRubro("todos"); }}
                                    className="mt-6 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-black rounded-2xl hover:scale-105 transition-transform"
                                >
                                    Limpiar búsqueda
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {negociosFiltrados.map((negocio) => (
                                <BusinessCard
                                    key={negocio.id}
                                    negocio={negocio}
                                    productCount={productCounts[negocio.id] || 0}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* CTA Bottom */}
            <div className="px-6 mt-16">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-950 rounded-[2.5rem] p-8 sm:p-12 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px]" />
                        <div className="relative">
                            <h2 className="text-3xl font-black text-white mb-3">
                                ¿Tenés un negocio? <span className="text-orange-500">Sumáte gratis</span>
                            </h2>
                            <p className="text-gray-400 font-medium text-lg mb-8 max-w-xl mx-auto">
                                Creá tu tienda digital en minutos y empezá a recibir pedidos de toda la zona.
                            </p>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-600/20 hover:scale-105 transition-transform"
                            >
                                <ShoppingBag size={20} />
                                Crear mi Tienda
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
