"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { getNegocioById, getProductosByNegocio } from "@/app/firebase/db";
import { useCart } from "@/app/context/CartContext";
import { CartSidebar } from "@/app/components/CartSidebar";
import {
    MapPin, Clock, Plus, Minus, ArrowLeft, Star,
    Truck, Store, Tag, Package, ChevronDown
} from "lucide-react";
import Link from "next/link";

// Emoji por rubro
const RUBRO_EMOJI: Record<string, string> = {
    gastronomia: "🍔", construccion: "🪵", retail: "👗", servicios: "💇", default: "🏪"
};
const RUBRO_GRADIENT: Record<string, string> = {
    gastronomia: "from-orange-600 via-amber-500 to-yellow-400",
    construccion: "from-emerald-600 via-teal-500 to-green-400",
    retail: "from-blue-600 via-indigo-500 to-violet-400",
    servicios: "from-purple-600 via-fuchsia-500 to-pink-400",
    default: "from-gray-700 via-gray-600 to-gray-500"
};

// ═══════════════════════════════════════════════════════════════
// SISTEMA INTELIGENTE DE UNIDADES
// Lee detalles_especificos y resuelve qué unidad mostrar
// ═══════════════════════════════════════════════════════════════
interface UnitInfo {
    unitLabel: string;       // "m²", "kg", "min", "u" 
    unitLabelLong: string;   // "metros²", "kilogramos", "minutos", "unidad"
    priceLabel: string;      // "/m²", "/kg", "/turno", ""
    qtyLabel: (n: number) => string; // "3 m²", "2 kg", "1 turno"
    step: number;            // incremento (0.5 para fraccionado, 1 default)
    isFractional: boolean;
}

const UNIT_MAP: Record<string, { short: string; long: string; priceTag: string }> = {
    'm²': { short: 'm²', long: 'metros²', priceTag: '/m²' },
    'metros': { short: 'm', long: 'metros', priceTag: '/m' },
    'kg': { short: 'kg', long: 'kilogramos', priceTag: '/kg' },
    'bolsa': { short: 'bolsa', long: 'bolsas', priceTag: '/bolsa' },
    'litro': { short: 'lt', long: 'litros', priceTag: '/lt' },
    'rollo': { short: 'rollo', long: 'rollos', priceTag: '/rollo' },
    'placa': { short: 'placa', long: 'placas', priceTag: '/placa' },
};

function resolveUnit(detalles: any): UnitInfo {
    if (!detalles || typeof detalles !== 'object') {
        return { unitLabel: 'u', unitLabelLong: 'unidad', priceLabel: '', qtyLabel: (n) => `${n}`, step: 1, isFractional: false };
    }

    const um = detalles.unidad_medida as string | undefined;
    const duracion = detalles.duracion as string | undefined;
    const talles = detalles.talles as string | undefined;
    const fraccionado = detalles.venta_fraccionada === true;

    // CASO 1: Servicios con duración (barbería, etc)
    if (duracion) {
        return {
            unitLabel: 'turno', unitLabelLong: 'turnos', priceLabel: '/turno',
            qtyLabel: (n) => `${n} ${n === 1 ? 'turno' : 'turnos'}`,
            step: 1, isFractional: false
        };
    }

    // CASO 2: Tiene unidad_medida explícita (madera, construcción, etc)
    if (um) {
        const mapped = UNIT_MAP[um.toLowerCase()] || { short: um, long: um, priceTag: `/${um}` };
        return {
            unitLabel: mapped.short, unitLabelLong: mapped.long, priceLabel: mapped.priceTag,
            qtyLabel: (n) => `${n} ${mapped.short}`,
            step: fraccionado ? 0.5 : 1,
            isFractional: fraccionado
        };
    }

    // CASO 3: Ropa con talles (unidades)
    if (talles) {
        return {
            unitLabel: 'u', unitLabelLong: 'unidades', priceLabel: '/u',
            qtyLabel: (n) => `${n} ${n === 1 ? 'unidad' : 'unidades'}`,
            step: 1, isFractional: false
        };
    }

    // CASO 4: Default (gastronomía, general)
    return {
        unitLabel: 'u', unitLabelLong: 'unidad', priceLabel: '',
        qtyLabel: (n) => `${n}`,
        step: 1, isFractional: false
    };
}

// Keys internas que NO se muestran como tags visibles
const INTERNAL_KEYS = ['tipo', 'unidad_medida', 'venta_fraccionada'];

// Componente: Card de Producto Premium
function ProductCard({ prod, onAdd }: { prod: any; onAdd: (qty: number) => void }) {
    const unitInfo = useMemo(() => resolveUnit(prod.detalles_especificos), [prod.detalles_especificos]);
    const [qty, setQty] = useState(unitInfo.step);
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        onAdd(qty);
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
        setQty(unitInfo.step);
    };

    // Filtrar detalles: quitar claves internas, dejar las visualmente útiles
    const displayDetails = useMemo(() => {
        if (!prod.detalles_especificos || typeof prod.detalles_especificos !== 'object') return [];
        return Object.entries(prod.detalles_especificos)
            .filter(([k]) => !INTERNAL_KEYS.includes(k))
            .slice(0, 4);
    }, [prod.detalles_especificos]);

    const tipo = prod.detalles_especificos?.tipo || null;
    const duracion = prod.detalles_especificos?.duracion || null;

    return (
        <div className="group bg-white dark:bg-zinc-900 rounded-2xl md:rounded-[1.5rem] border border-gray-100 dark:border-zinc-800 overflow-hidden hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-500 md:hover:-translate-y-0.5 flex flex-row md:flex-col">
            {/* Top color bar - desktop only */}
            <div className="hidden md:block h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Mobile: compact horizontal layout | Desktop: vertical card */}
            <div className="p-4 md:p-5 flex flex-row md:flex-col flex-1 gap-3 md:gap-0">
                {/* Info section */}
                <div className="flex-1 min-w-0 flex flex-col">
                    {/* Title + Price */}
                    <div className="flex items-start justify-between gap-2 mb-1 md:mb-3">
                        <div className="flex-1 min-w-0">
                            {tipo && (
                                <span className="hidden md:inline-block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-1">{tipo}</span>
                            )}
                            <h3 className="font-black text-sm md:text-base text-gray-900 dark:text-white leading-tight group-hover:text-orange-600 transition-colors">
                                {prod.nombre_producto}
                            </h3>
                        </div>
                        <div className="shrink-0 flex flex-col items-end">
                            <span className="text-base md:text-xl font-black text-gray-900 dark:text-white">
                                ${Number(prod.precio_base).toLocaleString('es-AR')}
                            </span>
                            {unitInfo.priceLabel && (
                                <span className="text-[9px] md:text-[10px] font-bold text-orange-500 uppercase">{unitInfo.priceLabel}</span>
                            )}
                        </div>
                    </div>

                    {/* Duration badge for services */}
                    {duracion && (
                        <div className="flex items-center gap-1.5 mb-1 md:mb-3">
                            <Clock size={12} className="text-purple-500" />
                            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">{duracion}</span>
                        </div>
                    )}

                    {/* Tags - hidden on mobile, shown on desktop */}
                    {displayDetails.length > 0 && (
                        <div className="hidden md:flex flex-wrap gap-1.5 mb-4">
                            {displayDetails.map(([key, val]) => (
                                <span key={key} className="inline-flex items-center gap-1 text-[11px] font-bold bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 px-2.5 py-1 rounded-lg border border-gray-100 dark:border-zinc-700">
                                    <Tag size={10} className="text-gray-400" />
                                    {key === 'duracion' ? `⏱ ${String(val)}` : String(val)}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Spacer - desktop only */}
                    <div className="hidden md:block flex-1" />

                    {/* Actions row */}
                    <div className="flex items-center gap-2 mt-2 md:mt-4">
                        {/* Qty Selector */}
                        <div className="flex items-center bg-gray-50 dark:bg-zinc-800 rounded-lg md:rounded-xl border border-gray-100 dark:border-zinc-700 overflow-hidden">
                            <button
                                onClick={() => setQty(Math.max(unitInfo.step, +(qty - unitInfo.step).toFixed(1)))}
                                className="p-1.5 md:p-2 text-gray-400 hover:text-orange-600 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                            >
                                <Minus size={14} className="md:hidden" />
                                <Minus size={16} className="hidden md:block" />
                            </button>
                            <span className="px-1.5 md:px-2 text-xs md:text-sm font-black text-gray-900 dark:text-white min-w-[2.5rem] md:min-w-[3.5rem] text-center">
                                {unitInfo.qtyLabel(qty)}
                            </span>
                            <button
                                onClick={() => setQty(+(qty + unitInfo.step).toFixed(1))}
                                className="p-1.5 md:p-2 text-gray-400 hover:text-orange-600 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                            >
                                <Plus size={14} className="md:hidden" />
                                <Plus size={16} className="hidden md:block" />
                            </button>
                        </div>

                        {/* Add Button */}
                        <button
                            onClick={handleAdd}
                            className={`flex-1 flex items-center justify-center gap-1.5 md:gap-2 py-2 md:py-2.5 rounded-lg md:rounded-xl font-black text-xs md:text-sm transition-all duration-300 ${added
                                ? "bg-green-500 text-white scale-[0.97]"
                                : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-orange-600 dark:hover:bg-orange-500 dark:hover:text-white active:scale-[0.97]"
                                }`}
                        >
                            {added ? (
                                <>✓ Listo</>
                            ) : (
                                <>
                                    <Plus size={14} className="md:hidden" />
                                    <Plus size={16} className="hidden md:block" />
                                    Agregar
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Página principal del negocio
export default function NegocioCatalogoPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params?.slug as string;

    const [negocio, setNegocio] = useState<any>(null);
    const [productos, setProductos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart, cart, cartTotal } = useCart();

    useEffect(() => {
        async function fetchData() {
            if (!slug) return;
            try {
                const dataNegocio = await getNegocioById(slug);
                if (dataNegocio) {
                    setNegocio(dataNegocio);
                    const dataProductos = await getProductosByNegocio(slug);
                    setProductos(dataProductos);
                }
            } catch (error) {
                console.error("Error cargando el catálogo:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [slug]);

    // Agrupar productos por tipo
    const productosPorTipo = useMemo(() => {
        const grupos: Record<string, any[]> = {};
        productos.forEach(p => {
            const tipo = p.detalles_especificos?.tipo || "general";
            if (!grupos[tipo]) grupos[tipo] = [];
            grupos[tipo].push(p);
        });
        return grupos;
    }, [productos]);

    const handleAddProduct = (prod: any, qty: number) => {
        addToCart({
            id_producto: prod.id_producto,
            id_negocio: prod.id_negocio || slug,
            nombre_producto: prod.nombre_producto,
            precio_unitario: Number(prod.precio_base),
            cantidad: qty,
            detalles_seleccionados: prod.detalles_especificos
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#0A0A0A]">
                <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-6">
                        <div className="absolute inset-0 border-4 border-gray-200 dark:border-zinc-800 rounded-full" />
                        <div className="absolute inset-0 border-4 border-transparent border-t-orange-500 rounded-full animate-spin" />
                    </div>
                    <p className="text-gray-400 font-black">Cargando catálogo...</p>
                </div>
            </div>
        );
    }

    if (!negocio) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA] dark:bg-[#0A0A0A] px-6">
                <div className="text-8xl mb-6">🔍</div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Negocio no encontrado</h1>
                <p className="text-gray-500 mb-8 text-center">El comercio que buscás no existe o fue dado de baja.</p>
                <Link href="/explorar" className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-black rounded-2xl hover:scale-105 transition-transform">
                    Explorar Negocios
                </Link>
            </div>
        );
    }

    const rubro = negocio.rubro || "default";
    const gradient = RUBRO_GRADIENT[rubro] || RUBRO_GRADIENT.default;
    const emoji = RUBRO_EMOJI[rubro] || RUBRO_EMOJI.default;
    const itemsInCart = cart.filter(c => c.id_negocio === slug).length;

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A]">
            {/* ═══════════════════ HERO IMMERSIVO ═══════════════════ */}
            <div className={`relative bg-gradient-to-br ${gradient} pt-20 pb-28 overflow-hidden`}>
                {/* Decoraciones */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-[80px]" />

                {/* Back button */}
                <div className="relative z-20 max-w-6xl mx-auto px-6 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-white/80 hover:text-white font-bold text-sm bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl transition-all"
                    >
                        <ArrowLeft size={18} /> Volver
                    </button>
                </div>

                {/* Info del negocio */}
                <div className="relative z-20 max-w-6xl mx-auto px-6 text-center">
                    <div className="w-24 h-24 mx-auto mb-5 bg-white/20 backdrop-blur-xl rounded-3xl border-2 border-white/30 shadow-2xl flex items-center justify-center text-5xl">
                        {emoji}
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-3 drop-shadow-lg">
                        {negocio.nombre}
                    </h1>
                    {negocio.descripcion && (
                        <p className="text-white/80 font-medium text-lg max-w-xl mx-auto mb-5">{negocio.descripcion}</p>
                    )}

                    {/* Info chips */}
                    <div className="flex flex-wrap justify-center gap-3">
                        {negocio.ubicacion && (
                            <span className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-sm font-bold text-white border border-white/20">
                                <MapPin size={14} /> {negocio.ubicacion}
                            </span>
                        )}
                        <span className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-sm font-bold text-white border border-white/20">
                            <Package size={14} /> {productos.length} productos
                        </span>
                        {negocio.activo !== false && (
                            <span className="flex items-center gap-2 px-4 py-2 bg-green-500/20 backdrop-blur-sm rounded-full text-sm font-bold text-white border border-green-400/30">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Abierto ahora
                            </span>
                        )}
                        {negocio.configuracion_logistica?.delivery_habilitado && (
                            <span className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-sm font-bold text-white border border-white/20">
                                <Truck size={14} /> Delivery
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* ═══════════════════ CONTENIDO ═══════════════════ */}
            <main className="relative z-10 max-w-6xl mx-auto px-3 sm:px-6 -mt-16 pb-36">
                {/* Header de sección con wave */}
                <div className="bg-white dark:bg-zinc-900 rounded-t-[2rem] border border-gray-100 dark:border-zinc-800 border-b-0 px-6 pt-8 pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Catálogo</h2>
                            <p className="text-sm text-gray-500 font-medium mt-0.5">{productos.length} artículos disponibles</p>
                        </div>
                        {Object.keys(productosPorTipo).length > 1 && (
                            <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 bg-gray-50 dark:bg-zinc-800 px-3 py-1.5 rounded-full">
                                {Object.keys(productosPorTipo).length} categorías
                            </span>
                        )}
                    </div>
                </div>

                {productos.length > 0 ? (
                    <div className="bg-white dark:bg-zinc-900 rounded-b-[2rem] border border-gray-100 dark:border-zinc-800 border-t-0 px-4 pt-5 sm:px-6 pb-8">
                        {Object.entries(productosPorTipo).map(([tipo, prods], idx) => (
                            <div key={tipo} className={idx > 0 ? "mt-10" : "mt-4"}>
                                {Object.keys(productosPorTipo).length > 1 && (
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                                            <Store size={16} className="text-orange-600" />
                                        </div>
                                        <h3 className="text-lg font-black text-gray-900 dark:text-white capitalize">{tipo}</h3>
                                        <span className="text-xs font-bold text-gray-400 bg-gray-50 dark:bg-zinc-800 px-2 py-1 rounded-full">{prods.length}</span>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                                    {prods.map((prod: any) => (
                                        <ProductCard
                                            key={prod.id_producto}
                                            prod={prod}
                                            onAdd={(qty) => handleAddProduct(prod, qty)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-zinc-900 rounded-b-[2rem] border border-gray-100 dark:border-zinc-800 border-t-0 px-6 py-20 text-center">
                        <div className="text-7xl mb-5">{emoji}</div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Catálogo vacío</h3>
                        <p className="text-gray-500 font-medium">Este negocio aún no ha publicado productos.</p>
                    </div>
                )}
            </main>

            {/* ═══════════════════ BARRA FLOTANTE DEL CARRITO ═══════════════════ */}
            {itemsInCart > 0 && (
                <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pointer-events-none">
                    <div className="max-w-lg mx-auto pointer-events-auto">
                        <CartSidebar />
                    </div>
                </div>
            )}
            {itemsInCart === 0 && <CartSidebar />}
        </div>
    );
}
