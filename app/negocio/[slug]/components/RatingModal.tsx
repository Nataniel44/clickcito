"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import { submitResena } from "@/app/firebase/db";
import toast from "react-hot-toast";

interface RatingModalProps {
    idNegocio: string;
    negocioNombre: string;
    clienteId: string;
    clienteNombre: string;
    onClose: () => void;
    onSuccess: () => void;
}

export function RatingModal({ idNegocio, negocioNombre, clienteId, clienteNombre, onClose, onSuccess }: RatingModalProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comentario, setComentario] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const labels = ["Muy malo", "Malo", "Regular", "Bueno", "¡Excelente!"];

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Seleccioná una puntuación");
            return;
        }
        setSubmitting(true);
        try {
            await submitResena(idNegocio, {
                cliente_id: clienteId,
                cliente_nombre: clienteNombre,
                puntuacion: rating,
                comentario: comentario.trim() || undefined,
            });
            toast.success("¡Gracias por tu reseña!");
            onSuccess();
            onClose();
        } catch {
            toast.error("Error al enviar la reseña");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-t-3xl md:rounded-3xl shadow-2xl p-6 md:p-8 animate-in slide-in-from-bottom duration-300">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <X size={18} />
                </button>

                <div className="text-center mb-6">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">¿Cómo fue tu experiencia?</h3>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">{negocioNombre}</p>
                </div>

                <div className="flex items-center justify-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="transition-all duration-150 hover:scale-125 active:scale-90"
                        >
                            <Star
                                size={40}
                                strokeWidth={1.5}
                                className={`${
                                    star <= (hoverRating || rating)
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-gray-300 dark:text-zinc-700"
                                }`}
                            />
                        </button>
                    ))}
                </div>

                {rating > 0 && (
                    <p className="text-center text-sm font-bold text-amber-600 dark:text-amber-400 mb-4">
                        {labels[rating - 1]}
                    </p>
                )}

                <textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Contanos más sobre tu experiencia (opcional)"
                    className="w-full h-24 px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 resize-none mb-4"
                    maxLength={500}
                />

                <button
                    onClick={handleSubmit}
                    disabled={submitting || rating === 0}
                    className="w-full py-3.5 bg-orange-600 text-white font-black rounded-xl hover:bg-orange-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-600/20"
                >
                    {submitting ? "Enviando..." : "Enviar Reseña"}
                </button>
            </div>
        </div>
    );
}
