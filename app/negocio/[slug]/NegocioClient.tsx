"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getNegocioById, getProductosByNegocio } from "@/app/firebase/db";
import { useCart } from "@/app/context/CartContext";
import { CartSidebar } from "@/app/components/CartSidebar";
import {
    MapPin, Clock, Plus, Minus, ArrowLeft,
    Star, MessageCircle, Share, Navigation, ShoppingBag,
    ChevronRight, CheckCircle2, Package, Truck, Check, Armchair
} from "lucide-react";
import Link from "next/link";

// Emoji / colores por rubro
const RUBRO_EMOJI: Record<string, string> = {
    gastronomia: "🍔", construccion: "🧱", retail: "👗", servicios: "💇", default: "🏪"
};
const RUBRO_GRADIENT: Record<string, string> = {
    gastronomia: "from-orange-600 via-amber-500 to-yellow-400",
    construccion: "from-emerald-600 via-teal-500 to-green-400",
    retail: "from-blue-600 via-indigo-500 to-violet-400",
    servicios: "from-purple-600 via-fuchsia-500 to-pink-400",
    default: "from-gray-700 via-gray-600 to-gray-500"
};
const RUBRO_ACCENT: Record<string, string> = {
    gastronomia: "bg-orange-600", construccion: "bg-emerald-600",
    retail: "bg-blue-600", servicios: "bg-purple-600", default: "bg-gray-700"
};

interface UnitInfo {
    unitLabel: string; unitLabelLong: string; priceLabel: string;
    qtyLabel: (n: number) => string; step: number; isFractional: boolean;
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

    if (duracion) return { unitLabel: 'turno', unitLabelLong: 'turnos', priceLabel: '/turno', qtyLabel: (n) => `${n} ${n === 1 ? 'turno' : 'turnos'}`, step: 1, isFractional: false };
    if (um) {
        const mapped = UNIT_MAP[um.toLowerCase()] || { short: um, long: um, priceTag: `/${um}` };
        return { unitLabel: mapped.short, unitLabelLong: mapped.long, priceLabel: mapped.priceTag, qtyLabel: (n) => `${n} ${mapped.short}`, step: fraccionado ? 0.5 : 1, isFractional: fraccionado };
    }
    if (talles) return { unitLabel: 'u', unitLabelLong: 'unidades', priceLabel: '/u', qtyLabel: (n) => `${n} ${n === 1 ? 'unidad' : 'unidades'}`, step: 1, isFractional: false };
    return { unitLabel: 'u', unitLabelLong: 'unidad', priceLabel: '', qtyLabel: (n) => `${n}`, step: 1, isFractional: false };
}

function ProductCard({ prod, onAdd, accent, isAdded }: { prod: any; onAdd: (qty: number) => void; accent: string; isAdded?: boolean }) {
    const unitInfo = useMemo(() => resolveUnit(prod.detalles_especificos), [prod.detalles_especificos]);
    const [qty, setQty] = useState(unitInfo.step);
    const [animating, setAnimating] = useState(false);

    const handleAdd = () => {
        onAdd(qty);
        setAnimating(true);
        setTimeout(() => setAnimating(false), 1000);
        setQty(unitInfo.step);
    };

    return (
        <div className={`bg-white dark:bg-zinc-900 border ${isAdded ? 'border-orange-500/30' : 'border-gray-100 dark:border-zinc-800/70'} rounded-2xl p-4 flex items-center gap-4 transition-all hover:shadow-md hover:border-gray-200 dark:hover:border-zinc-700 group relative`}>
            {isAdded && (
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full z-10 animate-in fade-in zoom-in">
                    <Check size={8} strokeWidth={4} />
                    EN EL CARRITO
                </div>
            )}

            {/* Imagen con Aspect Ratio controlado */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-2xl shrink-0 relative overflow-hidden border border-gray-100 dark:border-zinc-800/60 shadow-sm">
                {prod.imagen_url ? (
                    <Image src={prod.imagen_url} alt={prod.nombre_producto || "Producto"} fill className="object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                ) : (
                    <span className="text-2xl opacity-70">🍽️</span>
                )}
            </div>

            {/* Info con mejor tipografía */}
            <div className="flex-1 min-w-0">
                <h3 className="text-[14px] sm:text-[15px] font-black text-gray-900 dark:text-white leading-tight mb-1">
                    {prod.nombre_producto}
                </h3>
                {prod.categorias && prod.categorias.length > 0 ? (
                    <div className="flex flex-wrap gap-1 mb-2">
                        {prod.categorias.slice(0, 2).map((tag: string, i: number) => (
                            <span key={i} className="text-[9px] font-black bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-500 rounded-md px-1.5 py-[2px] uppercase tracking-tighter">
                                {tag}
                            </span>
                        ))}
                    </div>
                ) : prod.descripcion ? (
                    <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-0.5 truncate leading-relaxed">{prod.descripcion}</p>
                ) : null}

                <div className="flex items-center gap-1.5">
                    <span className="text-[17px] font-black text-gray-900 dark:text-white">
                        ${Number(prod.precio_base).toLocaleString('es-AR')}
                    </span>
                    {unitInfo.priceLabel && (
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{unitInfo.priceLabel}</span>
                    )}
                </div>
            </div>

            {/* Actions con feedback visual */}
            <div className="shrink-0 flex flex-col items-end gap-2 sm:gap-3">
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800/50 rounded-xl p-1 border border-gray-200 dark:border-zinc-700/50">
                    <button
                        onClick={() => setQty(Math.max(unitInfo.step, +(qty - unitInfo.step).toFixed(1)))}
                        className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-white dark:hover:bg-zinc-700 transition-all active:scale-90"
                    >
                        <Minus size={13} />
                    </button>
                    <span className="text-[12px] font-black min-w-[24px] text-center text-gray-900 dark:text-white">
                        {qty}
                    </span>
                    <button
                        onClick={() => setQty(+(qty + unitInfo.step).toFixed(1))}
                        className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-white dark:hover:bg-zinc-700 transition-all active:scale-90"
                    >
                        <Plus size={13} />
                    </button>
                </div>
                <button
                    onClick={handleAdd}
                    className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-1.5 min-w-[90px] ${animating
                        ? "bg-green-500 text-white scale-105"
                        : isAdded
                            ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                            : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90"
                        }`}
                >
                    {animating ? <><Check size={12} strokeWidth={3} /> Añadido</> : isAdded ? "Sumar +" : "Agregar"}
                </button>
            </div>
        </div>
    );
}

export default function NegocioClient({ slug }: { slug: string }) {
    const router = useRouter();
    const [negocio, setNegocio] = useState<any>(null);
    const [productos, setProductos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const lastScrollY = useRef(0);
    const { addToCart, cart } = useCart();
    const headerRef = useRef<HTMLDivElement>(null);

    const fotos = negocio?.fotos || [];

    const handleNextPhoto = useCallback(() => {
        if (activePhotoIndex === null) return;
        setActivePhotoIndex((activePhotoIndex + 1) % fotos.length);
    }, [activePhotoIndex, fotos.length]);

    const handlePrevPhoto = useCallback(() => {
        if (activePhotoIndex === null) return;
        setActivePhotoIndex((activePhotoIndex - 1 + fotos.length) % fotos.length);
    }, [activePhotoIndex, fotos.length]);

    useEffect(() => {
        if (activePhotoIndex === null) return;
        const handleKeys = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") handleNextPhoto();
            if (e.key === "ArrowLeft") handlePrevPhoto();
            if (e.key === "Escape") setActivePhotoIndex(null);
        };
        window.addEventListener("keydown", handleKeys);
        return () => window.removeEventListener("keydown", handleKeys);
    }, [activePhotoIndex, handleNextPhoto, handlePrevPhoto]);

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
                window.scrollTo({ top: 0, behavior: 'instant' });
            }
        }
        fetchData();
    }, [slug]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsScrolled(currentScrollY > 140);

            // Lógica para detectar si el Navbar principal está visible
            if (currentScrollY < lastScrollY.current || currentScrollY < 100) {
                setIsNavbarVisible(true);
            } else {
                setIsNavbarVisible(false);
            }
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const productosPorTipo = useMemo(() => {
        const grupos: Record<string, any[]> = {};
        productos.forEach(p => {
            const tipo = p.detalles_especificos?.tipo || "general";
            if (!grupos[tipo]) grupos[tipo] = [];
            grupos[tipo].push(p);
        });
        return grupos;
    }, [productos]);

    const handleAddProduct = useCallback((prod: any, qty: number) => {
        addToCart({
            id_producto: prod.id_producto,
            id_negocio: prod.id_negocio || slug,
            nombre_producto: prod.nombre_producto,
            precio_unitario: Number(prod.precio_base),
            cantidad: qty,
            detalles_seleccionados: prod.detalles_especificos
        });
    }, [addToCart, slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] dark:bg-[#060606]">
                <div className="text-center">
                    <div className="relative w-14 h-14 mx-auto mb-5">
                        <div className="absolute inset-0 border-[3px] border-gray-100 dark:border-zinc-800 rounded-full" />
                        <div className="absolute inset-0 border-[3px] border-transparent border-t-orange-500 rounded-full animate-spin" />
                    </div>
                    <p className="text-[13px] font-bold text-gray-400 tracking-wide">Cargando catálogo...</p>
                </div>
            </div>
        );
    }

    if (!negocio) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFDFD] dark:bg-[#060606] px-6">
                <div className="text-7xl mb-6">🔍</div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Negocio no encontrado</h1>
                <p className="text-gray-400 mb-8 text-center text-sm">El comercio que buscás no existe o fue dado de baja.</p>
                <Link href="/explorar" className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-black rounded-2xl hover:scale-105 transition-transform text-sm">
                    Explorar Negocios
                </Link>
            </div>
        );
    }

    const rubro = negocio.rubro || "default";
    const gradient = RUBRO_GRADIENT[rubro] || RUBRO_GRADIENT.default;
    const accent = RUBRO_ACCENT[rubro] || RUBRO_ACCENT.default;
    const emoji = RUBRO_EMOJI[rubro] || RUBRO_EMOJI.default;
    const itemsInCart = cart.filter(c => c.id_negocio === slug).length;
    const cartTotal = cart.filter(c => c.id_negocio === slug).reduce((ac, c) => ac + (c.precio_unitario * c.cantidad), 0);

    const diasSemana = [
        { key: 'lunes', label: 'Lun' }, { key: 'martes', label: 'Mar' },
        { key: 'miercoles', label: 'Mié' }, { key: 'jueves', label: 'Jue' },
        { key: 'viernes', label: 'Vie' }, { key: 'sabado', label: 'Sáb' },
        { key: 'domingo', label: 'Dom' }
    ];
    let currentDayIndex = new Date().getDay();
    currentDayIndex = currentDayIndex === 0 ? 6 : currentDayIndex - 1;

    const logistica = negocio.configuracion_logistica || {};
    const rating = negocio.rating || null;

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try { await navigator.share({ title: negocio.nombre, text: `Mirá el catálogo de ${negocio.nombre} en Clickcito`, url }); } catch (err) { }
        } else {
            navigator.clipboard.writeText(url);
        }
    };

    const handleMaps = () => {
        if (!negocio.ubicacion) return;
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(negocio.ubicacion + ", Misiones, Argentina")}`, '_blank');
    };

    const handleWhatsapp = () => {
        const telefono = negocio.telefono || "5493755000000";
        const text = encodeURIComponent(`Hola ${negocio.nombre}, vengo desde Clickcito!`);
        window.open(`https://wa.me/${telefono.replace(/\D/g, '')}?text=${text}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-[#F6F6F6] dark:bg-[#060606] pb-32">

            {/* ── Fixed Top Bar (Compact): only visible on scroll ── */}
            <div className={`fixed inset-x-0 z-50 transition-all duration-500 ease-in-out ${isNavbarVisible ? "top-[75px]" : "top-0"} ${isScrolled ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                {/* Solid bar */}
                <div className="bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800/80 shadow-sm transition-colors duration-500">
                    <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all active:scale-95"
                        >
                            <ArrowLeft size={18} />
                        </button>

                        <div className="flex-1 flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg overflow-hidden relative bg-gray-100 dark:bg-zinc-800 shrink-0">
                                {negocio.logo_url
                                    ? <Image src={negocio.logo_url} fill className="object-cover" alt={negocio.nombre} unoptimized />
                                    : <span className="absolute inset-0 flex items-center justify-center">{emoji}</span>
                                }
                            </div>
                            <p className="text-[14px] font-black text-gray-900 dark:text-white truncate">{negocio.nombre}</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button onClick={handleShare} className="p-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all active:scale-95">
                                <Share size={16} />
                            </button>
                            <button onClick={handleWhatsapp} className="p-2.5 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-500 border border-green-100 dark:border-green-500/20 hover:bg-green-100 dark:hover:bg-green-500/20 transition-all active:scale-95">
                                <MessageCircle size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Hero Banner ── */}
            <div className={`relative w-full bg-gradient-to-br ${gradient} overflow-hidden`} style={{ minHeight: '250px', paddingTop: '64px' }}>
                {/* Floating Action Buttons in Hero - positioned below the main navbar */}
                <div className={`absolute top-[90px] inset-x-0 z-40 transition-opacity duration-300 ${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
                        <button
                            onClick={() => router.back()}
                            className="p-2.5 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-black/30 transition-all active:scale-95 shadow-md"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div className="flex items-center gap-2">
                            <button onClick={handleShare} className="p-2.5 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-black/30 transition-all active:scale-95 shadow-md">
                                <Share size={16} />
                            </button>
                            <button onClick={handleWhatsapp} className="p-2.5 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-black/30 transition-all active:scale-95 shadow-md">
                                <MessageCircle size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -top-10 -left-10 w-48 h-48 bg-black/5 rounded-full blur-2xl" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="max-w-3xl mx-auto flex items-end gap-3 sm:gap-4">
                        {/* Logo */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 shadow-xl relative overflow-hidden shrink-0">
                            {negocio.logo_url
                                ? <Image src={negocio.logo_url} fill className="object-cover" alt={negocio.nombre} unoptimized />
                                : <span className="absolute inset-0 flex items-center justify-center text-3xl">{emoji}</span>
                            }
                        </div>
                        <div className="flex-1 min-w-0 pb-0.5">
                            <div className="flex items-center gap-1.5 flex-wrap -mb-0.5">
                                <h1 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md">{negocio.nombre}</h1>
                                {negocio.verificado && <CheckCircle2 size={16} className="text-white/90 shrink-0" fill="currentColor" />}
                            </div>
                            <p className="text-white/80 text-[11px] sm:text-[12px] leading-tight line-clamp-1 italic">{negocio.rubro}</p>
                        </div>
                        {rating && rating.total_resenas > 0 && (
                            <div className="shrink-0 flex flex-col items-center bg-white/20 backdrop-blur-md rounded-xl px-3 py-2 border border-white/30 shadow-md">
                                <span className="text-[18px] font-black text-white leading-none">{Number(rating.promedio).toFixed(1)}</span>
                                <span className="text-amber-300 text-[10px]">★★★★★</span>
                                <span className="text-white/60 text-[9px] mt-0.5">{rating.total_resenas} votos</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-4 flex flex-col gap-4">

                {/* Quick Info Strip */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800/70 px-4 py-3">
                    <div className="flex items-center gap-4 flex-wrap justify-between text-[12px]">
                        {negocio.activo !== false && (
                            <div className="flex items-center gap-1.5 text-green-600 dark:text-green-500 font-bold">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                Abierto ahora
                            </div>
                        )}
                        {negocio.ubicacion && (
                            <button onClick={handleMaps} className="flex items-center gap-1.5 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
                                <MapPin size={13} />
                                <span className="truncate max-w-[180px]">{negocio.ubicacion}</span>
                            </button>
                        )}
                        {logistica.delivery_habilitado !== false && (
                            <div className="flex items-center gap-1.5 text-gray-500 dark:text-zinc-400 font-medium">
                                <Truck size={13} />
                                <span>{logistica.tiempo_aprox_delivery || "Delivery disponible"}</span>
                            </div>
                        )}
                        {logistica.mesa_habilitado && (
                            <div className="flex items-center gap-1.5 text-gray-500 dark:text-zinc-400 font-medium">
                                <Armchair size={13} />
                                <span>Mesa</span>
                            </div>
                        )}
                        <button onClick={handleWhatsapp} className="flex items-center gap-1.5 font-bold text-green-600 dark:text-green-500 ml-auto">
                            <MessageCircle size={13} fill="currentColor" strokeWidth={0} />
                            Consultar
                        </button>
                    </div>
                </div>

                {/* Galería de fotos */}
                {negocio.fotos && negocio.fotos.length > 0 && (
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800/70 p-3 shadow-sm">
                        <div className="flex items-center justify-between mb-2.5 px-1">
                            <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Galería</p>
                            <span className="text-[9px] font-bold text-gray-400">{negocio.fotos.length} fotos</span>
                        </div>
                        <div className="flex gap-2.5 overflow-x-auto no-scrollbar">
                            {negocio.fotos.map((src: string, i: number) => (
                                <div
                                    key={i}
                                    onClick={() => src.startsWith('http') && setActivePhotoIndex(i)}
                                    className="w-[94px] h-[94px] sm:w-[110px] sm:h-[110px] rounded-xl bg-gray-50 dark:bg-zinc-800 overflow-hidden shrink-0 relative cursor-pointer transition-all border border-gray-100 dark:border-zinc-700 active:opacity-70"
                                >
                                    {src.startsWith('http')
                                        ? <Image src={src} fill className="object-cover" alt={`Foto ${i + 1}`} unoptimized />
                                        : <span className="absolute inset-0 flex items-center justify-center text-3xl">{src}</span>
                                    }
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Catalog Label */}
                <div className="flex items-center justify-between px-1 mt-4">
                    <h2 className="text-[12px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <ShoppingBag size={14} className="opacity-40" />
                        Nuestro Menú
                    </h2>
                    {productos.length > 0 && (
                        <span className="text-[11px] font-black text-orange-600 dark:text-orange-500 bg-orange-500/5 px-2.5 py-1 rounded-full">{productos.length} variedades</span>
                    )}
                </div>

                {/* Products */}
                {productos.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {Object.entries(productosPorTipo).map(([tipo, prods]) => (
                            <div key={tipo}>
                                {Object.keys(productosPorTipo).length > 1 && (
                                    <div className="flex items-center gap-2 mb-3 px-1 mt-4">
                                        <h3 className="text-[15px] font-black text-gray-900 dark:text-white capitalize tracking-tight">{tipo}</h3>
                                        <span className="text-[10px] font-bold bg-gray-100 dark:bg-zinc-800/80 text-gray-400 px-2 py-0.5 rounded-md">{prods.length}</span>
                                    </div>
                                )}
                                <div className="flex flex-col gap-2.5">
                                    {prods.map((prod: any) => (
                                        <ProductCard
                                            key={prod.id_producto}
                                            prod={prod}
                                            accent={accent}
                                            onAdd={(qty) => handleAddProduct(prod, qty)}
                                            isAdded={cart.some(c => c.id_producto === prod.id_producto)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/70 rounded-2xl py-16 text-center shadow-sm">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">{emoji}</div>
                        <h3 className="text-base font-black text-gray-900 dark:text-white mb-1.5">Catálogo vacío</h3>
                        <p className="text-[13px] text-gray-400 font-medium">Este negocio aún no publicó productos.</p>
                        <button onClick={handleWhatsapp} className="mt-5 px-5 py-2.5 bg-green-500/10 text-green-600 dark:text-green-500 font-bold rounded-xl text-[13px] border border-green-500/20 flex items-center gap-2 mx-auto hover:bg-green-500/20 transition-colors">
                            <MessageCircle size={14} />
                            Consultá por WhatsApp
                        </button>
                    </div>
                )}

                {/* Info Section */}
                <div className="mt-8 mb-4 flex items-center px-1">
                    <h2 className="text-[12px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <MapPin size={14} className="opacity-40" />
                        Conocenos más
                    </h2>
                </div>

                {/* Action Buttons Row */}
                <div className="grid grid-cols-3 gap-2.5">
                    <button onClick={handleShare} className="flex flex-col items-center justify-center gap-1.5 py-4 px-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/70 rounded-2xl text-gray-500 dark:text-zinc-400 hover:border-gray-300 dark:hover:border-zinc-700 transition-all active:scale-95 shadow-sm">
                        <Share size={18} />
                        <span className="text-[10px] font-bold">Compartir</span>
                    </button>
                    <button onClick={handleMaps} className="flex flex-col items-center justify-center gap-1.5 py-4 px-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/70 rounded-2xl text-gray-500 dark:text-zinc-400 hover:border-gray-300 dark:hover:border-zinc-700 transition-all active:scale-95 shadow-sm">
                        <Navigation size={18} />
                        <span className="text-[10px] font-bold">Ver Maps</span>
                    </button>
                    <button onClick={handleWhatsapp} className="flex flex-col items-center justify-center gap-1.5 py-4 px-2 bg-green-50 dark:bg-green-500/10 border border-green-200/50 dark:border-green-500/20 rounded-2xl text-green-600 dark:text-green-500 hover:bg-green-100 dark:hover:bg-green-500/20 transition-all active:scale-95 shadow-sm">
                        <MessageCircle size={18} fill="currentColor" strokeWidth={0} />
                        <span className="text-[10px] font-bold">Chat WA</span>
                    </button>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">

                    {/* Horarios */}
                    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/70 rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-50 dark:border-zinc-800">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-600/10 flex items-center justify-center">
                                    <Clock size={14} className="text-orange-600" />
                                </div>
                                <span className="text-[13px] font-bold text-gray-900 dark:text-white">Horarios</span>
                            </div>
                            {negocio.activo !== false && (
                                <span className="text-[10px] text-green-600 dark:text-green-500 font-black flex items-center gap-1 bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-full border border-green-200/50 dark:border-green-500/20">
                                    <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" /> Abierto
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            {negocio.horarios ? diasSemana.map((dia, idx) => {
                                const horario = negocio.horarios[dia.key] || "Cerrado";
                                const isHoy = idx === currentDayIndex;
                                if (horario === "Cerrado" && !isHoy) return null;
                                return (
                                    <div key={dia.key} className={`flex justify-between items-center px-2.5 py-1.5 rounded-lg ${isHoy ? "bg-orange-50 dark:bg-orange-600/10 border border-orange-100 dark:border-orange-600/20" : ""}`}>
                                        <span className={`text-[12px] font-medium ${isHoy ? "text-orange-700 dark:text-orange-400 font-bold" : "text-gray-500 dark:text-zinc-400"}`}>
                                            {isHoy ? `Hoy (${dia.label})` : dia.label}
                                        </span>
                                        <span className={`text-[12px] ${horario === "Cerrado" ? "text-gray-400" : "font-bold text-gray-900 dark:text-white"}`}>
                                            {horario}
                                        </span>
                                    </div>
                                );
                            }) : (
                                <span className="text-[12px] text-gray-400 text-center py-2">Consultar disponibilidad</span>
                            )}
                        </div>
                    </div>

                    {/* Rating + Logística */}
                    <div className="flex flex-col gap-3.5">
                        {/* Rating */}
                        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/70 rounded-2xl p-4 shadow-sm">
                            {rating && rating.total_resenas > 0 ? (
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-center shrink-0">
                                        <span className="text-[30px] font-black text-gray-900 dark:text-white leading-none">{Number(rating.promedio).toFixed(1)}</span>
                                        <div className="text-amber-400 text-[11px] tracking-widest mt-1">★★★★★</div>
                                        <span className="text-[10px] text-gray-400 mt-0.5">{rating.total_resenas} votos</span>
                                    </div>
                                    <div className="flex-1 flex flex-col gap-1">
                                        {(rating.distribucion || [100, 0, 0, 0, 0]).map((pct: number, i: number) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <span className="text-[9px] text-gray-400 w-2 text-right font-bold">{5 - i}</span>
                                                <div className="flex-1 h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-amber-400 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="text-[11px] font-black text-orange-600 bg-orange-50 dark:bg-orange-600/10 px-3 py-2 rounded-xl shrink-0 border border-orange-100 dark:border-orange-600/20 hover:bg-orange-100 transition-colors">
                                        + Reseña
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
                                        <Star size={22} className="text-amber-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-bold text-gray-900 dark:text-white">Sin reseñas aún</p>
                                        <p className="text-[11px] text-gray-400 mt-0.5">¡Sé el primero en opinar!</p>
                                    </div>
                                    <button className="text-[11px] font-black text-orange-600 bg-orange-50 dark:bg-orange-600/10 px-3 py-2 rounded-xl border border-orange-100 dark:border-orange-600/20 whitespace-nowrap hover:bg-orange-100 transition-colors">
                                        + Reseña
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Logística */}
                        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/70 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                            <div className={`flex items-center gap-3 ${logistica.delivery_habilitado === false ? 'opacity-40' : ''}`}>
                                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                                    <Truck size={16} className="text-blue-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[12px] font-bold text-gray-900 dark:text-white">
                                        {logistica.delivery_habilitado !== false ? 'Delivery disponible' : 'Sin delivery'}
                                    </p>
                                    {logistica.delivery_habilitado !== false && (
                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                            {logistica.tiempo_aprox_delivery || 'Tiempo a consultar'}
                                            {logistica.precio_delivery ? ` · $${logistica.precio_delivery}` : ''}
                                        </p>
                                    )}
                                </div>
                                {logistica.delivery_gratis_desde && (
                                    <span className="text-[9px] font-black bg-green-50 dark:bg-green-500/10 text-green-600 border border-green-200/50 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                                        Gratis +${(logistica.delivery_gratis_desde / 1000).toFixed(0)}k
                                    </span>
                                )}
                            </div>
                            <div className={`flex items-center gap-3 ${logistica.takeaway_habilitado === false ? 'opacity-40' : ''}`}>
                                <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center shrink-0">
                                    <Package size={16} className="text-orange-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[12px] font-bold text-gray-900 dark:text-white">
                                        {logistica.takeaway_habilitado !== false ? 'Retiro en local' : 'Sin retiro en local'}
                                    </p>
                                    {logistica.takeaway_habilitado !== false && logistica.direccion_retiro_local && (
                                        <p className="text-[10px] text-gray-400 mt-0.5 truncate">{logistica.direccion_retiro_local}</p>
                                    )}
                                </div>
                            </div>
                            <div className="h-px bg-gray-50 dark:bg-zinc-800/80 w-full" />
                            <div className={`flex items-center gap-3 ${!logistica.mesa_habilitado ? 'opacity-40' : ''}`}>
                                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                                    <Armchair size={16} className="text-emerald-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[12px] font-bold text-gray-900 dark:text-white">
                                        {logistica.mesa_habilitado ? 'Pedido en Mesa' : 'Sin pedido en mesa'}
                                    </p>
                                    {logistica.mesa_habilitado && (
                                        <p className="text-[10px] text-gray-400 mt-0.5">Pedí desde tu mesa con el código QR</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Sticky Cart Bar ── */}
            {itemsInCart > 0 && (
                <div className="fixed bottom-0 inset-x-0 z-[100] px-4 pb-6 pt-4 bg-gradient-to-t from-[#F6F6F6] dark:from-[#060606] via-[#F6F6F6]/80 dark:via-[#060606]/80 to-transparent">
                    <div className="max-w-[720px] mx-auto bg-gray-900 dark:bg-white rounded-2xl px-5 py-4 flex items-center justify-between gap-4 shadow-2xl shadow-black/40 ring-1 ring-white/10 dark:ring-black/5 animate-in slide-in-from-bottom-5">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <ShoppingBag size={22} className="text-white dark:text-gray-900" />
                                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-orange-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                                    {itemsInCart}
                                </span>
                            </div>
                            <div>
                                <p className="text-[14px] font-black text-white dark:text-gray-900 leading-none">
                                    ${cartTotal.toLocaleString('es-AR')}
                                </p>
                                <p className="text-[10px] text-white/60 dark:text-gray-500 mt-0.5">
                                    {itemsInCart} {itemsInCart === 1 ? 'artículo' : 'artículos'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push('/checkout')}
                            className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-xl text-[13px] transition-all active:scale-95 shadow-lg shadow-orange-600/40"
                        >
                            Hacer pedido
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Photo Lightbox Carousel */}
            {activePhotoIndex !== null && (
                <div
                    className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center select-none"
                    onClick={() => setActivePhotoIndex(null)}
                >
                    {/* Header Controls */}
                    <div className="absolute top-0 inset-x-0 p-5 flex items-center justify-between z-[210]">
                        <span className="text-white/60 text-[13px] font-black tracking-widest">
                            {activePhotoIndex + 1} / {fotos.length}
                        </span>
                        <button
                            className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white transition-colors"
                            onClick={(e) => { e.stopPropagation(); setActivePhotoIndex(null); }}
                        >
                            <Plus size={24} className="rotate-45" />
                        </button>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        className="absolute left-4 w-12 h-12 bg-white/5 hover:bg-white/10 backdrop-blur rounded-full flex items-center justify-center text-white transition-all active:scale-95 z-[210]"
                        onClick={(e) => { e.stopPropagation(); handlePrevPhoto(); }}
                    >
                        <ChevronRight className="rotate-180" size={24} />
                    </button>
                    <button
                        className="absolute right-4 w-12 h-12 bg-white/5 hover:bg-white/10 backdrop-blur rounded-full flex items-center justify-center text-white transition-all active:scale-95 z-[210]"
                        onClick={(e) => { e.stopPropagation(); handleNextPhoto(); }}
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Image Container */}
                    <div
                        className="relative w-full h-[70vh] flex items-center justify-center p-4 transition-all duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {fotos[activePhotoIndex].startsWith('http') ? (
                            <div className="relative w-full h-full max-w-4xl animate-in zoom-in-95 duration-300">
                                <Image
                                    src={fotos[activePhotoIndex]}
                                    alt={`Foto ${activePhotoIndex + 1}`}
                                    fill
                                    className="object-contain"
                                    unoptimized
                                    priority
                                />
                            </div>
                        ) : (
                            <span className="text-9xl">{fotos[activePhotoIndex]}</span>
                        )}
                    </div>
                </div>
            )}

            <div className="hidden"><CartSidebar /></div>
        </div>
    );
}
