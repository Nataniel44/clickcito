"use client";

import { MessageCircle, Phone, Zap, ArrowRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";

export function WhatsAppContact() {
    const phoneNumber = "543755246464";
    const message = encodeURIComponent("Hola, quiero contactarte desde tu web.");

    const ref = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => setIsInView(entry.isIntersecting));
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        const currentRef = ref.current;
        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, []);

    return (
        <section
            id="contacto"
            className="relative w-full flex justify-center py-24 overflow-hidden bg-gradient-to-b from-white via-green-50/30 to-white"
        >
            {/* Blobs decorativos */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-[blob1_20s_linear_infinite]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-[blob2_25s_linear_infinite]" />

            <div
                ref={ref}
                className={`relative z-10 w-full md:max-w-3xl mx-4 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
            >
                {/* Card principal */}
                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-green-100">
                    {/* Header con gradiente */}
                    <div className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 p-8 md:p-12 text-white overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
                        </div>

                        <div className="relative z-10 flex flex-col items-center text-center gap-4">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30 animate-[swing_2s_ease-in-out_infinite]">
                                <MessageCircle className="w-10 h-10" strokeWidth={2} />
                            </div>

                            <div>
                                <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
                                    ¿Listo para empezar?
                                </h2>
                                <p className="text-lg md:text-xl text-green-50">
                                    Hablemos de tu proyecto
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-8 md:p-12 space-y-8">
                        {/* Características */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { icon: Zap, text: "Respuesta rápida" },
                                { icon: Phone, text: "Contacto directo" },
                                { icon: MessageCircle, text: "Sin compromisos" },
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`flex flex-col items-center gap-2 p-4 bg-green-50 rounded-xl border border-green-100 transition-all duration-500 ${isInView
                                        ? "opacity-100 translate-y-0 delay-[200ms]"
                                        : "opacity-0 translate-y-5"
                                        }`}
                                >
                                    <item.icon className="w-6 h-6 text-green-600" strokeWidth={2} />
                                    <span className="text-sm font-medium text-gray-700">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Descripción */}
                        <p
                            className={`text-gray-600 text-center text-lg leading-relaxed transition-opacity duration-700 ${isInView ? "opacity-100 delay-[400ms]" : "opacity-0"
                                }`}
                        >
                            Enviame un mensaje directo por WhatsApp y conversemos sobre cómo puedo ayudarte a digitalizar tu negocio.
                        </p>

                        {/* Botón de WhatsApp */}
                        <div
                            className={`flex justify-center transition-all duration-700 ${isInView ? "opacity-100 scale-100 delay-[500ms]" : "opacity-0 scale-90"
                                }`}
                        >
                            <a
                                href={`https://wa.me/${phoneNumber}?text=${message}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative"
                            >
                                {/* Efecto de pulso */}
                                <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity animate-pulse" />

                                {/* Botón principal */}
                                <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-10 py-5 rounded-full shadow-lg flex items-center gap-3 transition-transform duration-300 group-hover:scale-105 active:scale-95">
                                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.004 2C6.486 2 2 6.486 2 12c0 2.118.555 4.094 1.516 5.81L2 22l4.426-1.489A9.963 9.963 0 0012.004 22c5.518 0 10.004-4.486 10.004-10S17.522 2 12.004 2zm5.39 14.805c-.194.545-1.088 1.041-1.514 1.103-.403.06-.895.086-1.985-.464-2.154-1.027-3.518-3.44-3.62-3.598-.103-.158-.837-1.195-.837-2.281s.856-1.64 1.154-1.757c.3-.118.655-.148.875-.148.218 0 .464.002.667.002.218 0 .498-.08.786.594.287.676.97 2.327 1.053 2.5.082.173.137.375.027.604-.108.227-.162.36-.324.564-.162.202-.344.453-.49.607-.145.155-.298.327-.13.644.167.316.742 1.23 1.593 1.985 1.097.983 2.016 1.195 2.345 1.331.328.137.52.115.71-.069.192-.184.827-.953 1.057-1.686.23-.734.23-1.363.162-1.486-.067-.123-.246-.198-.518-.35z" />
                                    </svg>
                                    <span className="text-lg">Enviar mensaje</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </a>
                        </div>

                        {/* Nota adicional */}
                        <p
                            className={`text-sm text-gray-500 text-center flex items-center justify-center gap-2 transition-opacity duration-700 ${isInView ? "opacity-100 delay-[600ms]" : "opacity-0"
                                }`}
                        >
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            Disponible para responder tus consultas
                        </p>
                    </div>
                </div>
            </div>

            {/* Keyframes */}
            <style jsx>{`
                @keyframes blob1 {
                    0%, 100% {
                        transform: scale(1) rotate(0deg);
                    }
                    50% {
                        transform: scale(1.2) rotate(90deg);
                    }
                }
                @keyframes blob2 {
                    0%, 100% {
                        transform: scale(1) rotate(0deg);
                    }
                    50% {
                        transform: scale(1.3) rotate(-90deg);
                    }
                }
                @keyframes swing {
                    0%, 100% {
                        transform: rotate(0deg) scale(1);
                    }
                    25% {
                        transform: rotate(10deg) scale(1.05);
                    }
                    75% {
                        transform: rotate(-10deg) scale(1.05);
                    }
                }
            `}</style>
        </section>
    );
}
