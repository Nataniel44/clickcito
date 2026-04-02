"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { createTransaccion, getNegocioById } from "@/app/firebase/db";
import { createPreferenceAction } from "@/app/actions/mercadopago";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import {
    MapPin, Phone, MessageSquare, CreditCard,
    ChevronRight, ArrowLeft, ShieldCheck, Truck,
    DollarSign, ShoppingBag, Store, Armchair,
    Check, Plus, Clock, Wallet, QrCode, Banknote, Globe
} from "lucide-react";

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [negocioInfo, setNegocioInfo] = useState<any>(null);
    const [entregaMetodo, setEntregaMetodo] = useState<"delivery" | "retiro" | "mesa" | "online" | "presencial" | "digital" | "servicio">("delivery");
    const [metodoPago, setMetodoPago] = useState<"efectivo" | "transferencia" | "mercadopago">("efectivo");

    // Form States
    const [direccion, setDireccion] = useState("");
    const [telefono, setTelefono] = useState("");
    const [nombreCliente, setNombreCliente] = useState("");
    const [nroMesa, setNroMesa] = useState("");
    const [notas, setNotas] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch business info
    useEffect(() => {
        if (cart.length > 0 && !negocioInfo) {
            getNegocioById(cart[0].id_negocio).then((data: any) => {
                if (data) {
                    setNegocioInfo(data);
                    // Set default delivery method based on availability
                    const logistica = data.configuracion_logistica;
                    if (logistica) {
                        if (logistica.delivery_habilitado && !isSoloServicios) setEntregaMetodo("delivery");
                        else if (logistica.servicio_habilitado) setEntregaMetodo("servicio");
                        else if (logistica.online_habilitado) setEntregaMetodo("online");
                        else if (logistica.presencial_habilitado) setEntregaMetodo("presencial");
                        else if (logistica.digital_habilitado) setEntregaMetodo("digital");
                        else if (logistica.takeaway_habilitado && !isSoloServicios) setEntregaMetodo("retiro");
                        else if (logistica.mesa_habilitado && !isSoloServicios) setEntregaMetodo("mesa");
                    }
                }
            });
        }
    }, [cart, negocioInfo]);

    const isEdu = negocioInfo?.rubro === "educacion";
    const accentColor = isEdu ? "indigo" : "orange";
    const accentText = isEdu ? "text-indigo-600" : "text-orange-600";
    const accentBg = isEdu ? "bg-indigo-600" : "bg-orange-600";
    const accentBorder = isEdu ? "border-indigo-500" : "border-orange-500";
    const accentRingo = isEdu ? "focus:ring-indigo-500" : "focus:ring-orange-500";

    const isOpen = useMemo(() => {
        if (!negocioInfo) return false;
        if (negocioInfo.abierto_siempre) return true;
        if (!negocioInfo.horarios || Object.keys(negocioInfo.horarios).length === 0) return true;
        const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
        const now = new Date();
        const diaActual = dias[now.getDay()];
        const diaAyer = dias[(now.getDay() + 6) % 7];
        const minutosActuales = now.getHours() * 60 + now.getMinutes();

        const parseHora = (str: string) => {
            if (!str || str.toLowerCase() === 'cerrado') return null;
            const parts = str.split('-');
            if (parts.length < 2) return null;
            const [apertura, cierre] = parts.map(s => s.trim());
            const [hA, mA] = apertura.split(':').map(Number);
            const [hC, mC] = cierre.split(':').map(Number);
            if (isNaN(hA) || isNaN(mA) || isNaN(hC) || isNaN(mC)) return null;
            return { start: hA * 60 + mA, end: hC * 60 + mC };
        };

        const hoy = parseHora(negocioInfo.horarios[diaActual]);
        const ayer = parseHora(negocioInfo.horarios[diaAyer]);

        if (ayer && ayer.end < ayer.start && minutosActuales <= ayer.end) return true;
        if (hoy && hoy.end < hoy.start && minutosActuales >= hoy.start) return true;
        if (hoy && hoy.end >= hoy.start && minutosActuales >= hoy.start && minutosActuales <= hoy.end) return true;

        return false;
    }, [negocioInfo]);

    if (authLoading) return <div className="h-screen flex items-center justify-center bg-white dark:bg-black"><div className={`animate-spin rounded-full h-10 w-10 border-b-2 ${isEdu ? 'border-indigo-500' : 'border-orange-500'}`} /></div>;

    if (cart.length === 0) {
        return (
            <div className="h-screen flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-black">
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] shadow-xl text-center max-w-sm border border-gray-100 dark:border-zinc-800">
                    <ShoppingBag className={`${isEdu ? 'text-indigo-500' : 'text-orange-500'} mx-auto mb-4`} size={48} />
                    <h2 className="text-xl font-black mb-1">Carrito Vacío</h2>
                    <p className="text-gray-400 text-xs mb-6 font-medium">No hay nada para pedir aún.</p>
                    <button onClick={() => router.push("/")} className={`w-full py-3 ${isEdu ? 'bg-indigo-600' : 'bg-orange-600'} text-white font-black rounded-xl text-sm`}>Explorar Tienda</button>
                </div>
            </div>
        );
    }

    const isSoloServicios = cart.every(item => item.es_servicio);

    const availableMethods = [
        { id: 'delivery', label: 'Envío', icon: Truck, enabled: (negocioInfo?.configuracion_logistica?.delivery_habilitado ?? true) && !isSoloServicios },
        { id: 'servicio', label: 'Servicio', icon: Clock, enabled: (negocioInfo?.configuracion_logistica?.servicio_habilitado ?? false) || (isSoloServicios && (negocioInfo?.configuracion_logistica?.servicio_habilitado ?? true)) },
        { id: 'online', label: 'Online', icon: Globe, enabled: (negocioInfo?.configuracion_logistica?.online_habilitado ?? false) || (isSoloServicios && (negocioInfo?.configuracion_logistica?.online_habilitado ?? true)) },
        { id: 'presencial', label: 'Presencial', icon: MapPin, enabled: (negocioInfo?.configuracion_logistica?.presencial_habilitado ?? false) || (isSoloServicios && (negocioInfo?.configuracion_logistica?.presencial_habilitado ?? true)) },
        { id: 'digital', label: 'Digital', icon: Store, enabled: (negocioInfo?.configuracion_logistica?.digital_habilitado ?? false) || (isSoloServicios && (negocioInfo?.configuracion_logistica?.digital_habilitado ?? true)) },
        { id: 'retiro', label: 'Retiro', icon: Store, enabled: (negocioInfo?.configuracion_logistica?.takeaway_habilitado ?? true) && !isSoloServicios },
        { id: 'mesa', label: 'Mesa', icon: Armchair, enabled: (negocioInfo?.configuracion_logistica?.mesa_habilitado ?? false) && !isSoloServicios }
    ].filter(m => m.enabled);

    const handleConfirmarPedido = async () => {
        if (cart.length === 0) return;

        // Validation
        if (entregaMetodo === "delivery" && (!direccion || !telefono)) {
            toast.error("Datos de envío incompletos");
            return;
        }
        if ((entregaMetodo === "retiro" || entregaMetodo === "online" || entregaMetodo === "presencial" || entregaMetodo === "digital" || entregaMetodo === "servicio") && (!nombreCliente || !telefono)) {
            toast.error("Datos de contacto incompletos");
            return;
        }
        if (entregaMetodo === "mesa" && (!nroMesa || !nombreCliente)) {
            toast.error("Datos de mesa incompletos");
            return;
        }

        if (!isOpen) {
            toast.error("El negocio está cerrado en este momento");
            return;
        }

        setIsSubmitting(true);
        try {
            const idNegocio = cart[0].id_negocio;

            const sanitizedCart = cart.map((item) => {
                const { cartItemId: _, ...cleanItem } = item;
                return Object.fromEntries(
                    Object.entries(cleanItem).filter(([key, v]) => v !== undefined)
                );
            });

            const metadata = {
                tipo_entrega: entregaMetodo,
                metodo_pago: metodoPago,
                cliente_nombre: nombreCliente || user?.nombre || "Cliente",
                cliente_telefono: telefono || "",
                direccion_envio: entregaMetodo === "delivery" ? direccion : `Entrega: ${entregaMetodo}`,
                nro_mesa: nroMesa || "",
                notas_cliente: notas || "",
                negocio_nombre: negocioInfo?.nombre || "Negocio",
                total_pagado: cartTotal,
                estado_pago: metodoPago === 'mercadopago' ? 'pendiente' : 'acordar'
            };

            const isOnline = typeof window !== "undefined" ? navigator.onLine : true;

            // Si es Mercado Pago, primero generamos la preferencia
            if (metodoPago === 'mercadopago') {
                if (!negocioInfo?.mercado_pago?.access_token) {
                    throw new Error("Este negocio no tiene configurado Mercado Pago correctamente.");
                }

                const preference = await createPreferenceAction(
                    sanitizedCart, 
                    negocioInfo.mercado_pago.access_token,
                    negocioInfo.nombre || "Pedido"
                );

                if (preference.init_point) {
                    // Guardamos la transacción con referencia al pago
                    await createTransaccion(idNegocio, user?.uid || "anonimo", sanitizedCart, {
                        ...metadata,
                        mercado_pago_id: preference.id
                    });

                    toast.success("Redirigiendo a Mercado Pago...");
                    clearCart();
                    window.location.href = preference.init_point;
                    return;
                }
            }

            await createTransaccion(idNegocio, user?.uid || "anonimo", sanitizedCart, metadata);

            if (isOnline) {
                toast.success("¡Pedido enviado! 🚀");
            } else {
                toast.success("¡Pedido guardado! Se enviará automáticamente al recuperar conexión 📶", {
                    duration: 5000,
                    icon: '📡'
                });
            }
            clearCart();
            router.push("/mis-pedidos");
        } catch (error: any) {
            console.error("Error al enviar pedido:", error);
            toast.error(error.message || "Error al enviar pedido");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] dark:bg-black pb-32">
            {/* ── Header ── */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-900 px-4 py-4 flex items-center justify-between">
                <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-gray-50 dark:bg-zinc-900 flex items-center justify-center text-gray-500">
                    <ArrowLeft size={20} />
                </button>
                <div className="text-center">
                    <h1 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-zinc-100">Finalizar Pedido</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{negocioInfo?.nombre || 'Cargando...'}</p>
                </div>
                <div className="w-10 h-10" />
            </div>

            <main className="max-w-xl mx-auto p-4 space-y-4">
                {/* ── Progress Loader ── */}
                <div className="flex justify-between items-center px-2">
                    <div className={`flex items-center gap-1.5 px-3 py-1 ${isEdu ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' : 'bg-orange-500/10 text-orange-600 border-orange-500/20'} rounded-full border`}>
                        <div className={`w-1.5 h-1.5 ${isEdu ? 'bg-indigo-600' : 'bg-orange-600'} rounded-full animate-pulse`} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Paso: Logística y Pago</span>
                    </div>
                </div>

                {/* ── Logística Section ── */}
                <div className="bg-white dark:bg-zinc-950 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-zinc-900 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50/50 dark:bg-zinc-900/30 border-b border-gray-100 dark:border-zinc-900 flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg ${isEdu ? 'bg-indigo-500/10 text-indigo-600' : 'bg-orange-500/10 text-orange-600'} flex items-center justify-center`}>
                            {entregaMetodo === 'delivery' ? <Truck size={16} /> : (entregaMetodo === 'online' || entregaMetodo === 'servicio') ? <Globe size={16} /> : <MapPin size={16} />}
                        </div>
                        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Método de entrega</h3>
                    </div>
                    <div className="p-5">
                        <div className={`grid gap-2 mb-6 grid-cols-3 sm:grid-cols-3`}>
                            {availableMethods.map((met) => (
                                <button
                                    key={met.id}
                                    onClick={() => setEntregaMetodo(met.id as any)}
                                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all active:scale-95 ${entregaMetodo === met.id
                                        ? `${accentBorder} ${isEdu ? 'bg-indigo-50/50 dark:bg-indigo-500/10 text-indigo-600' : 'bg-orange-50/50 dark:bg-orange-500/10 text-orange-600'}`
                                        : 'border-gray-100 dark:border-zinc-900 bg-gray-50/50 dark:bg-zinc-900/50 text-gray-400'}`}
                                >
                                    <met.icon size={20} className={entregaMetodo === met.id ? 'animate-bounce' : ''} />
                                    <span className="text-[10px] font-black uppercase text-center">{met.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* ── Dynamic Forms ── */}
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            {entregaMetodo === 'delivery' && (
                                <>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Dirección de entrega</label>
                                        <div className="relative">
                                            <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                value={direccion}
                                                onChange={(e) => setDireccion(e.target.value)}
                                                placeholder="Ej: Av. Mitre 1450, piso 3 B"
                                                className={`w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-100/50 dark:bg-zinc-900/50 border-none outline-none font-bold text-[13px] text-gray-900 dark:text-white focus:ring-2 ${accentRingo} focus:bg-white dark:focus:bg-zinc-900 placeholder:text-gray-400`}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tu nombre</label>
                                            <input
                                                type="text"
                                                value={nombreCliente}
                                                onChange={(e) => setNombreCliente(e.target.value)}
                                                placeholder="Tu nombre"
                                                className={`w-full px-4 py-4 rounded-2xl bg-gray-100/50 dark:bg-zinc-900/50 border-none outline-none font-bold text-[13px] text-gray-900 dark:text-white focus:ring-2 ${accentRingo} focus:bg-white dark:focus:bg-zinc-900 placeholder:text-gray-400`}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp</label>
                                            <div className="relative">
                                                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    value={telefono}
                                                    onChange={(e) => setTelefono(e.target.value)}
                                                    placeholder="+54 376..."
                                                    className={`w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-100/50 dark:bg-zinc-900/50 border-none outline-none font-bold text-[13px] text-gray-900 dark:text-white focus:ring-2 ${accentRingo} focus:bg-white dark:focus:bg-zinc-900 placeholder:text-gray-400`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            {(entregaMetodo === 'retiro' || entregaMetodo === 'online' || entregaMetodo === 'presencial' || entregaMetodo === 'digital' || entregaMetodo === 'servicio') && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    {(entregaMetodo === 'retiro' || entregaMetodo === 'presencial') && (
                                        <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800/80 flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 flex items-center justify-center text-xl shrink-0">📍</div>
                                            <div>
                                                <p className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-tight">{entregaMetodo === 'retiro' ? 'Retiro en Local' : 'Asistir a Sede'}</p>
                                                <p className="text-[13px] font-bold text-gray-500 dark:text-zinc-400 mt-0.5">{negocioInfo?.ubicacion || "Consulte dirección por WhatsApp"}</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{isEdu ? 'Nombre del Alumno' : '¿A nombre de quién?'}</label>
                                            <input
                                                type="text"
                                                value={nombreCliente}
                                                onChange={(e) => setNombreCliente(e.target.value)}
                                                placeholder="Ej: Juan Pérez"
                                                className={`w-full px-4 py-4 rounded-2xl bg-gray-100/50 dark:bg-zinc-900/50 border-none outline-none font-bold text-[13px] text-gray-900 dark:text-white focus:ring-2 ${accentRingo} focus:bg-white dark:focus:bg-zinc-900 placeholder:text-gray-400`}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp de contacto</label>
                                            <input
                                                type="tel"
                                                value={telefono}
                                                onChange={(e) => setTelefono(e.target.value)}
                                                placeholder="+54 376..."
                                                className={`w-full px-4 py-4 rounded-2xl bg-gray-100/50 dark:bg-zinc-900/50 border-none outline-none font-bold text-[13px] text-gray-900 dark:text-white focus:ring-2 ${accentRingo} focus:bg-white dark:focus:bg-zinc-900 placeholder:text-gray-400`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {entregaMetodo === 'mesa' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Número de Mesa</label>
                                        <div className="relative">
                                            <Armchair size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="number"
                                                value={nroMesa}
                                                onChange={(e) => setNroMesa(e.target.value)}
                                                placeholder="Ej: 5"
                                                className={`w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-100/50 dark:bg-zinc-900/50 border-none outline-none font-bold text-[13px] text-gray-900 dark:text-white focus:ring-2 ${accentRingo} focus:bg-white dark:focus:bg-zinc-900 placeholder:text-gray-400`}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tu nombre</label>
                                        <input
                                            type="text"
                                            value={nombreCliente}
                                            onChange={(e) => setNombreCliente(e.target.value)}
                                            placeholder="Tu nombre"
                                            className={`w-full px-4 py-4 rounded-2xl bg-gray-100/50 dark:bg-zinc-900/50 border-none outline-none font-bold text-[13px] text-gray-900 dark:text-white focus:ring-2 ${accentRingo} focus:bg-white dark:focus:bg-zinc-900 placeholder:text-gray-400`}
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="space-y-1.5 pt-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nota al negocio (opcional)</label>
                                <div className="relative">
                                    <MessageSquare size={16} className="absolute left-4 top-4 text-gray-400" />
                                    <textarea
                                        rows={2}
                                        value={notas}
                                        onChange={(e) => setNotas(e.target.value)}
                                        placeholder="Sin cebolla, piso 2..."
                                        className={`w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-100/50 dark:bg-zinc-900/50 border-none outline-none font-bold text-[13px] text-gray-900 dark:text-white focus:ring-2 ${accentRingo} focus:bg-white dark:focus:bg-zinc-900 placeholder:text-gray-400 resize-none`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-4 border-t border-gray-50 dark:border-zinc-900/30">
                            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50/50 dark:bg-zinc-900/50 rounded-2xl border border-gray-100 dark:border-zinc-900/50 text-gray-500">
                                <Clock size={16} />
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold uppercase tracking-wider opacity-60">Tiempo estimado</span>
                                    <span className="text-[13px] font-black text-gray-900 dark:text-white">
                                        {entregaMetodo === 'delivery' ? (negocioInfo?.configuracion_logistica?.tiempo_aprox_delivery || '30-40 min') :
                                            entregaMetodo === 'retiro' ? '15-20 min' : 'Servicio en Mesa'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50/50 dark:bg-zinc-900/50 rounded-2xl border border-gray-100 dark:border-zinc-900/50 text-gray-500">
                                <MapPin size={16} />
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold uppercase tracking-wider opacity-60">Costo Envío</span>
                                    <span className="text-[13px] font-black text-green-600">
                                        {entregaMetodo === 'delivery' ? 'Calculado por zona' : 'GRATIS'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Payment Section ── */}
                <div className="bg-white dark:bg-zinc-950 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-zinc-900 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50/50 dark:bg-zinc-900/30 border-b border-gray-100 dark:border-zinc-900 flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg ${isEdu ? 'bg-indigo-500/10 text-indigo-600' : 'bg-orange-500/10 text-orange-600'} flex items-center justify-center`}>
                            <CreditCard size={16} />
                        </div>
                        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Método de pago</h3>
                    </div>
                    <div className="p-5 space-y-2">
                        {[
                            { id: 'efectivo', label: 'Efectivo', sub: 'Pagás al recibir su pedido', icon: Banknote, color: 'text-green-500' },
                            { id: 'transferencia', label: 'Transferencia', sub: 'Alias / CVU del negocio', icon: Wallet, color: 'text-blue-500' },
                            ...(negocioInfo?.mercado_pago?.habilitado ? [
                                { id: 'mercadopago', label: 'Mercado Pago', sub: 'Link de pago sin comisión', icon: QrCode, color: 'text-sky-500' }
                            ] : [])
                        ].map((pago) => (
                            <button
                                key={pago.id}
                                onClick={() => setMetodoPago(pago.id as any)}
                                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all active:scale-[0.98] ${metodoPago === pago.id
                                    ? (isEdu ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-500/5' : 'border-orange-500 bg-orange-50/20 dark:bg-orange-500/5')
                                    : 'border-gray-100 dark:border-zinc-900 bg-gray-50/50 dark:bg-zinc-900/50'}`}
                            >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${metodoPago === pago.id ? (isEdu ? 'border-indigo-500' : 'border-orange-500') : 'border-gray-200 dark:border-zinc-800'}`}>
                                    {metodoPago === pago.id && <div className={`w-3 h-3 rounded-full ${isEdu ? 'bg-indigo-500' : 'bg-orange-500'} animate-in zoom-in`} />}
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-[13px] font-black text-gray-900 dark:text-white">{pago.label}</p>
                                    <p className="text-[11px] text-gray-400 font-bold uppercase">{pago.sub}</p>
                                </div>
                                <div className={`text-xl ${pago.color}`}><pago.icon size={22} /></div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Summary Section ── */}
                <div className="bg-white dark:bg-zinc-950 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-zinc-900 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50/50 dark:bg-zinc-900/30 border-b border-gray-100 dark:border-zinc-900 flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg ${isEdu ? 'bg-indigo-500/10 text-indigo-600' : 'bg-orange-500/10 text-orange-600'} flex items-center justify-center`}>
                            <Plus size={16} />
                        </div>
                        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Resumen</h3>
                    </div>
                    <div className="p-5 space-y-4">
                        {/* List of items */}
                        <div className="space-y-3 pb-3 border-b border-gray-50 dark:border-zinc-900/30">
                            {cart.map((item) => (
                                <div key={item.cartItemId} className="flex justify-between items-start gap-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-black text-gray-900 dark:text-white truncate">
                                            {item.nombre_producto}
                                        </p>
                                        <p className="text-[11px] font-bold text-gray-400">
                                            x{item.cantidad} · ${item.precio_unitario.toLocaleString()} c/u
                                        </p>
                                        {/* Extras in checkout */}
                                        {item.detalles_seleccionados?.extras_seleccionados?.length > 0 && (
                                            <div className="mt-1 flex flex-wrap gap-1">
                                                {item.detalles_seleccionados.extras_seleccionados.flatMap((g: any) => g.seleccion).map((s: any, idx: number) => (
                                                    <span key={idx} className="text-[9px] font-black bg-gray-50 dark:bg-zinc-900 text-gray-500 px-1.5 py-0.5 rounded border border-gray-100 dark:border-zinc-800">
                                                        {s.nombre}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[13px] font-black text-gray-900 dark:text-white shrink-0">
                                        ${(item.precio_unitario * item.cantidad).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-[13px] font-bold text-gray-400 italic">Subtotal ({cart.length} items)</span>
                                <span className="text-[13px] font-black text-gray-900 dark:text-white">${cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[13px] font-bold text-gray-400 italic">Costo de envío</span>
                                <span className="px-3 py-1 bg-green-500/10 text-green-600 text-[10px] font-black rounded-full uppercase">Gratis</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[13px] font-bold text-gray-400 italic">Descuentos</span>
                                <span className="text-[13px] font-black text-green-600">-$0</span>
                            </div>
                            <div className="pt-3 border-t border-gray-50 dark:border-zinc-900/30 flex justify-between items-center">
                                <span className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Total</span>
                                <span className={`text-2xl font-black ${isEdu ? 'text-indigo-600' : 'text-orange-600'}`}>${cartTotal.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {!isOpen && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-200/50 dark:border-red-500/20 rounded-2xl text-red-600 dark:text-red-500 animate-in slide-in-from-top-2">
                        <Clock size={16} />
                        <span className="text-[11px] font-black uppercase tracking-tight">El negocio cerró. No se pueden procesar pedidos por ahora.</span>
                    </div>
                )}

                <div className="flex items-center justify-center gap-2 py-4">
                    <ShieldCheck size={14} className="text-gray-400" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Tus datos están protegidos · Transacción segura</span>
                </div>
            </main>

            {/* ── Sticky Footer ── */}
            <footer className="fixed bottom-0 inset-x-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-t border-gray-100 dark:border-zinc-900 p-4 z-50">
                <div className="max-w-xl mx-auto flex items-center gap-4">
                    <div className="flex-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest -mb-1">Total a pagar</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">${cartTotal.toLocaleString()}</p>
                    </div>
                    <button
                        onClick={handleConfirmarPedido}
                        disabled={isSubmitting || !isOpen}
                        className={`flex-[1.5] py-4 font-black rounded-2xl flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all outline-none text-sm uppercase tracking-tight ${!isOpen
                            ? "bg-gray-100 dark:bg-zinc-800 text-gray-400 cursor-not-allowed shadow-none"
                            : `${accentBg} hover:opacity-90 text-white shadow-${accentColor}-600/20`
                            }`}
                    >
                        {isSubmitting ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : (
                            <>{isEdu ? 'Inscribirse Ahora' : 'Confirmar Pedido'} <ChevronRight size={18} /></>
                        )}
                    </button>
                </div>
            </footer>
        </div>
    );
}
