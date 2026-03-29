import {
    LayoutDashboard, Search, ShoppingBag, Package, Users, Megaphone, BarChart3, Settings, ShieldCheck, Globe,
    Clock, PackageCheck, Send, CheckCircle2, XCircle, History, GraduationCap, UtensilsCrossed
} from "lucide-react";

export const BASE_SIDEBAR_ITEMS = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "ordenes", icon: ShoppingBag, label: "Órdenes" },
    { id: "productos", icon: Package, label: "Mis Productos" },
    { id: "clientes", icon: Users, label: "Clientes" },
    { id: "marketing", icon: Megaphone, label: "Marketing & QR" },
    { id: "estadisticas", icon: BarChart3, label: "Estadísticas" },
    { id: "auditoria", icon: History, label: "Auditoría" },
    { id: "configuracion", icon: Settings, label: "Configuración" },
];

export const EDUCATION_SIDEBAR_ITEMS = [
    { id: "academy", icon: GraduationCap, label: "Gestión Academy" },
];

export const EXTERNAL_LINKS = [
    { id: "home", icon: Globe, label: "Ir al Inicio", path: "/" },
    { id: "explorar", icon: Search, label: "Explorar Locales", path: "/explorar" },
];

export const ADMIN_SIDEBAR_ITEMS = [
    { id: "admin_usuarios", icon: ShieldCheck, label: "Panel Admin" },
    { id: "productos_elys", icon: UtensilsCrossed, label: "Productos Elys" },
];

export const STATUS_CONFIG: Record<string, { color: string; icon: any; label: string }> = {
    pendiente: { color: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300", icon: Clock, label: "Pendiente" },
    en_preparacion: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300", icon: PackageCheck, label: "Preparando" },
    en_camino: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300", icon: Send, label: "En camino" },
    entregado: { color: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300", icon: CheckCircle2, label: "Entregado" },
    cancelado: { color: "bg-gray-200 text-gray-800 dark:bg-zinc-800 dark:text-gray-400", icon: XCircle, label: "Cancelado" },
};
