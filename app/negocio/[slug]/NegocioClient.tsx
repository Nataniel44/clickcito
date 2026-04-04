"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getNegocioById, getProductosByNegocio, getTransaccionesByCliente } from "@/app/firebase/db";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { CartSidebar } from "@/app/components/CartSidebar";
import { ProductDetailModal } from "@/app/components/ProductDetailModal";

// New Sub-components
import { BusinessHeader } from "./components/BusinessHeader";
import { BusinessMainInfo } from "./components/BusinessMainInfo";
import { ProductListSection } from "./components/ProductListSection";
import { BusinessDetailsSection } from "./components/BusinessDetailsSection";
import { StickyCartBar } from "./components/StickyCartBar";
import { PhotoLightbox } from "./components/PhotoLightbox";

// Emojis / colores por rubro
const RUBRO_EMOJI: Record<string, string> = {
    gastronomia: "🍔", construccion: "🧱", retail: "👗", servicios: "💇", educacion: "🎓", default: "🏪"
};
const RUBRO_GRADIENT: Record<string, string> = {
    gastronomia: "from-orange-600 via-amber-500 to-yellow-400",
    construccion: "from-emerald-600 via-teal-500 to-green-400",
    retail: "from-blue-600 via-indigo-500 to-violet-400",
    servicios: "from-purple-600 via-fuchsia-500 to-pink-400",
    educacion: "from-indigo-600 via-blue-500 to-cyan-400",
    default: "from-gray-700 via-gray-600 to-gray-500"
};
const RUBRO_ACCENT: Record<string, string> = {
    gastronomia: "bg-orange-600", construccion: "bg-emerald-600",
    retail: "bg-blue-600", servicios: "bg-purple-600", educacion: "bg-indigo-600", default: "bg-gray-700"
};

const DIAS_SEMANA = [
    { key: 'lunes', label: 'Lun' }, { key: 'martes', label: 'Mar' },
    { key: 'miercoles', label: 'Mié' }, { key: 'jueves', label: 'Jue' },
    { key: 'viernes', label: 'Vie' }, { key: 'sabado', label: 'Sáb' },
    { key: 'domingo', label: 'Dom' }
];

export default function NegocioClient({ slug }: { slug: string }) {
    const router = useRouter();
    const [negocio, setNegocio] = useState<any>(null);
    const [productos, setProductos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [purchasedProducts, setPurchasedProducts] = useState<Record<string, any>>({});
    const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    // ScrollSpy States
    const [activeCategory, setActiveCategory] = useState<string>("");
    const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const categoryNavRef = useRef<HTMLDivElement>(null);

    const { addToCart, cart, clearCart } = useCart();

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

                    // Buscar compras del usuario para este negocio
                    if (user?.uid) {
                        try {
                            const trans = await getTransaccionesByCliente(user.uid);
                            const activeMap: Record<string, any> = {};
                            const estadosAcceso = ["en_preparacion", "en_camino", "entregado"];

                            trans.forEach((t: any) => {
                                if (estadosAcceso.includes(t.estado) && t.items) {
                                    t.items.forEach((item: any) => {
                                        if (item.detalles_seleccionados?.link_acceso) {
                                            activeMap[item.id_producto] = item.detalles_seleccionados;
                                        }
                                    });
                                }
                            });
                            setPurchasedProducts(activeMap);
                        } catch (err) {
                            console.error("Error al cargar compras previas:", err);
                        }
                    }
                }
            } catch (error) {
                console.error("Error cargando el catálogo:", error);
            } finally {
                setLoading(false);
                window.scrollTo({ top: 0, behavior: 'instant' });
            }
        }
        fetchData();
    }, [slug, user?.uid]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 140);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const productosPorTipo = useMemo(() => {
        const grupos: Record<string, any[]> = {};
        productos.forEach(p => {
            let tipo = p.categoria_producto || p.categorias?.[0] || p.detalles_especificos?.tipo || "General";
            if (p.id_negocio === "elysrestobar" && p.categoria_producto && p.detalles_especificos?.tipo) {
                tipo = `${p.categoria_producto} - ${p.detalles_especificos.tipo}`;
            }
            if (!grupos[tipo]) grupos[tipo] = [];
            grupos[tipo].push(p);
        });
        return grupos;
    }, [productos]);

    const categoriasOrdenadas = useMemo(() => {
        const agruped = Object.keys(productosPorTipo);
        const order = negocio?.orden_categorias || [];
        agruped.sort((a, b) => {
            const idxA = order.indexOf(a);
            const idxB = order.indexOf(b);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return a.localeCompare(b);
        });
        return agruped;
    }, [productosPorTipo, negocio?.orden_categorias]);

    useEffect(() => {
        if (categoriasOrdenadas.length > 0 && !activeCategory) {
            setActiveCategory(categoriasOrdenadas[0]);
        }
    }, [categoriasOrdenadas, activeCategory]);

    const isAutoScrolling = useRef(false);
    const activeCategoryRef = useRef(activeCategory);
    useEffect(() => { activeCategoryRef.current = activeCategory; }, [activeCategory]);

    // Scroll-based category detection (replaces IntersectionObserver)
    useEffect(() => {
        if (Object.keys(categoryRefs.current).length === 0) return;

        const handleCategoryScroll = () => {
            if (isAutoScrolling.current) return;

            const scrollY = window.scrollY;
            // Offset: compact header (64px) + sticky bar (~52px) ≈ 116-120px when scrolled
            // When not scrolled: main navbar (75px) + compact header area + bar ≈ 195px
            const stickyOffset = scrollY > 140 ? 120 : 195;

            let closest = "";
            let closestDist = Infinity;

            for (const tipo of categoriasOrdenadas) {
                const el = categoryRefs.current[tipo];
                if (!el) continue;
                const rect = el.getBoundingClientRect();
                const dist = rect.top - stickyOffset;
                // We want the section whose top is just above or at the sticky bar
                if (dist <= 20 && Math.abs(dist) < closestDist) {
                    closest = tipo;
                    closestDist = Math.abs(dist);
                }
            }

            // If no section is above the bar, pick the first one (user scrolled back to top)
            if (!closest && categoriasOrdenadas.length > 0) {
                const first = categoryRefs.current[categoriasOrdenadas[0]];
                if (first && first.getBoundingClientRect().top > stickyOffset) {
                    closest = categoriasOrdenadas[0];
                }
            }

            if (closest && closest !== activeCategoryRef.current) {
                activeCategoryRef.current = closest;
                setActiveCategory(closest);
            }
        };

        window.addEventListener("scroll", handleCategoryScroll, { passive: true });
        // Run once on mount
        handleCategoryScroll();

        return () => window.removeEventListener("scroll", handleCategoryScroll);
    }, [categoriasOrdenadas, productosPorTipo]);

    const scrollToCategory = (tipo: string) => {
        const element = categoryRefs.current[tipo];
        if (element) {
            isAutoScrolling.current = true;
            setActiveCategory(tipo);
            const rect = element.getBoundingClientRect();
            const scrollY = window.scrollY;
            // Offset matches the sticky bar position: compact header (64px) + category bar (~52px) + gap
            const offset = 120;
            const targetY = rect.top + scrollY - offset;
            window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });

            setTimeout(() => {
                isAutoScrolling.current = false;
            }, 600);
        }
    };

    const isOpen = useMemo(() => {
        if (!negocio) return false;
        if (negocio.activo === false) return false;
        if (negocio.abierto_siempre) return true;
        if (!negocio.horarios || Object.keys(negocio.horarios).length === 0) return true;

        const ahora = new Date();
        const currentDayIndex = ahora.getDay() === 0 ? 6 : ahora.getDay() - 1;
        const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
        const todayKey = diasSemana[currentDayIndex];
        const todaysHours = negocio.horarios?.[todayKey] || "Cerrado";

        if (todaysHours === "Cerrado") return false;

        const currentTime = ahora.getHours() * 60 + ahora.getMinutes();
        const spans = todaysHours.split(',').map((s: string) => s.trim());

        for (const span of spans) {
            const times = span.split(/[-a]/).map((t: string) => t.trim());
            if (times.length < 2) continue;

            const [startH, startM] = times[0].split(':').map(Number);
            let [endH, endM] = times[1].split(':').map(Number);

            if (isNaN(startH) || isNaN(endH)) continue;

            const startTotal = startH * 60 + (startM || 0);
            let endTotal = endH * 60 + (endM || 0);

            if (endTotal <= startTotal) endTotal += 1440;

            if (currentTime >= startTotal && currentTime < endTotal) return true;
        }

        return false;
    }, [negocio]);

    const handleAddProduct = useCallback((prod: any, qty: number, extras: any[] = []) => {
        if (!isOpen) {
            alert("Este negocio está cerrado actualmente y no acepta pedidos.");
            return;
        }
        addToCart({
            id_producto: prod.id_producto,
            id_negocio: prod.id_negocio || slug,
            nombre_producto: prod.nombre_producto,
            precio_unitario: Number(prod.precio_base) + extras.reduce((acc, group) => acc + group.seleccion.reduce((sAcc: number, s: any) => sAcc + s.precio, 0), 0),
            cantidad: qty,
            es_servicio: prod.es_servicio || false,
            detalles_seleccionados: {
                ...prod.detalles_especificos,
                extras_seleccionados: extras
            }
        });
    }, [addToCart, slug, isOpen]);

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

    const isAdmin = user?.rol === 'admin_clickcito';
    const isOwner = user?.uid && negocio?.admin_uid === user.uid;
    const canViewInactive = isAdmin || isOwner;

    if (!negocio || (negocio.activo === false && !canViewInactive)) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFDFD] dark:bg-[#060606] px-6">
                <div className="text-7xl mb-6">{negocio ? "🔒" : "🔍"}</div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                    {negocio ? "Negocio temporalmente cerrado" : "Negocio no encontrado"}
                </h1>
                <p className="text-gray-400 mb-8 text-center text-sm">
                    {negocio
                        ? "Este comercio ha pausado su visibilidad por el momento. Volvé más tarde."
                        : "El comercio que buscás no existe o fue dado de baja."}
                </p>
                <Link href="/explorar" className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-black rounded-2xl hover:scale-105 transition-transform text-sm">
                    Explorar Otros Negocios
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

    let currentDayIndex = new Date().getDay();
    currentDayIndex = currentDayIndex === 0 ? 6 : currentDayIndex - 1;

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
        <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#060606] selection:bg-orange-500/10 transition-colors duration-500">
            {/* Header / Hero */}
            <BusinessHeader
                negocio={negocio}
                gradient={gradient}
                emoji={emoji}
                isScrolled={isScrolled}
                onBack={() => router.back()}
                onShare={handleShare}
                onWhatsapp={handleWhatsapp}
            />

            {/* Main Content */}
            <main className="max-w-3xl mx-auto px-4 pb-32 pt-4">
                <div className="relative -mt-6 z-10 space-y-4">
                    <BusinessMainInfo
                        negocio={negocio}
                        isOpen={isOpen}
                        emoji={emoji}
                        onMaps={handleMaps}
                        onWhatsapp={handleWhatsapp}
                        onPhotoClick={setActivePhotoIndex}
                    />

                    {/* Catálogo Section */}
                    <ProductListSection
                        productos={productos}
                        productosPorTipo={productosPorTipo}
                        categoriasOrdenadas={categoriasOrdenadas}
                        activeCategory={activeCategory}
                        accent={accent}
                        emoji={emoji}
                        isOpen={isOpen}
                        purchasedProducts={purchasedProducts}
                        cart={cart.filter(c => c.id_negocio === slug)}
                        negocio={negocio}
                        onAddProduct={handleAddProduct}
                        onOpenDetail={setSelectedProduct}
                        onScrollToCategory={scrollToCategory}
                        categoryNavRef={categoryNavRef}
                        categoryRefs={categoryRefs}
                    />

                    {/* Info Adicional Section */}
                    <BusinessDetailsSection
                        negocio={negocio}
                        isOpen={isOpen}
                        onShare={handleShare}
                        onMaps={handleMaps}
                        onWhatsapp={handleWhatsapp}
                        diasSemana={DIAS_SEMANA}
                        currentDayIndex={currentDayIndex}
                    />
                </div>
            </main>

            {/* Floating Shopping Bar */}
            <StickyCartBar
                itemsInCart={itemsInCart}
                cartTotal={cartTotal}
                accent={accent}
                isOpen={isOpen}
                onContinue={() => router.push('/checkout')}
                onClear={clearCart}
            />

            {/* Lightbox / Modals */}
            {activePhotoIndex !== null && negocio.fotos && (
                <PhotoLightbox
                    activePhotoIndex={activePhotoIndex}
                    fotos={negocio.fotos.filter((f: string) => f.startsWith('http') || f.startsWith('/'))}
                    onClose={() => setActivePhotoIndex(null)}
                    onNext={handleNextPhoto}
                    onPrev={handlePrevPhoto}
                />
            )}

            {selectedProduct && (
                <ProductDetailModal
                    isOpen={!!selectedProduct}
                    isOpenBusiness={isOpen}
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onAddToCart={(qty, extras) => handleAddProduct(selectedProduct, qty, extras)}
                    accent={accent}
                />
            )}

            <CartSidebar />
        </div>
    );
}
