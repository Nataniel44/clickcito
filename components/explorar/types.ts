import { Utensils, Shirt, Scissors, Hammer, Store } from "lucide-react";

export const RUBRO_CONFIG: Record<string, { label: string; icon: any; color: string; bg: string; shadow: string; dotColor: string; emoji: string }> = {
    gastronomia: { label: "Gastronomía", icon: Utensils, color: "text-orange-600", bg: "bg-orange-50", shadow: "shadow-orange-500/10", dotColor: "bg-[#D85A30]", emoji: "🍕" },
    retail: { label: "Moda y Tiendas", icon: Shirt, color: "text-blue-600", bg: "bg-blue-50", shadow: "shadow-blue-500/10", dotColor: "bg-[#378ADD]", emoji: "👕" },
    servicios: { label: "Servicios", icon: Scissors, color: "text-purple-600", bg: "bg-purple-50", shadow: "shadow-purple-500/10", dotColor: "bg-[#7F77DD]", emoji: "✂️" },
    construccion: { label: "Materiales", icon: Hammer, color: "text-emerald-600", bg: "bg-emerald-50", shadow: "shadow-emerald-500/10", dotColor: "bg-[#639922]", emoji: "🔨" },
    default: { label: "General", icon: Store, color: "text-gray-600", bg: "bg-gray-50", shadow: "shadow-gray-500/10", dotColor: "bg-gray-400", emoji: "🏪" },
};

export interface Negocio {
    id: string;
    nombre: string;
    rubro: string;
    logo_url?: string;
    horarios?: Record<string, string>;
    createdAt?: any;
    activo?: boolean;
    abierto_siempre?: boolean;
    rating?: {
        total_resenas: number;
        promedio: number;
    };
    categorias?: string[];
    telefono?: string;
    descripcion?: string;
    ubicacion?: string;
    coordenadas?: {
        lat: number;
        lng: number;
    };
    verificado?: boolean;
}
