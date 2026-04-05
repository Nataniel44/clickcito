"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, ArrowUpRight, LogOut } from "lucide-react";
import { EXTERNAL_LINKS } from "./constants";
import { useSidebarItems } from "./useSidebarItems";

interface SidebarProps {
    user: any;
    activeTab: string;
    setActiveTab: (id: string) => void;
    isSidebarOpen: boolean;
    onClose: () => void;
    metrics: { pendientes: number };
    onLogout: () => void;
    loading: boolean;
    negocio?: any;
}

export function Sidebar({
    user,
    activeTab,
    setActiveTab,
    isSidebarOpen,
    onClose,
    metrics,
    onLogout,
    loading,
    negocio
}: SidebarProps) {
    const router = useRouter();
    const { mainItems, educationItems, isEducation } = useSidebarItems({ user, negocio });

    const handleNavigate = (id: string) => {
        setActiveTab(id);
        onClose();
    };

    const handleExternalLink = (path: string) => {
        router.push(path);
    };

    return (
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-zinc-800 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="flex flex-col h-full p-5">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-8">
                    <Link href="/" className="shrink-0">
                        <Image src="/log.png" alt="Logo" width={200} height={100} className="h-8 w-auto" />
                    </Link>
                    <button
                        onClick={onClose}
                        className="ml-auto lg:hidden p-1.5 bg-gray-100 dark:bg-zinc-800 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                    {/* Education Section */}
                    {isEducation && educationItems.length > 0 && (
                        <div>
                            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest px-3 mb-2">Centro de Formación</p>
                            <div className="space-y-0.5">
                                {educationItems.map(item => (
                                    <SidebarItem
                                        key={item.id}
                                        item={item}
                                        isActive={activeTab === item.id}
                                        onClick={() => handleNavigate(item.id)}
                                        activeColor="orange"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Main Management Section */}
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 mb-2">Gestión de Negocio</p>
                        <div className="space-y-0.5">
                            {mainItems.map(item => (
                                <SidebarItem
                                    key={item.id}
                                    item={item}
                                    isActive={activeTab === item.id}
                                    onClick={() => handleNavigate(item.id)}
                                    activeColor="orange"
                                    badge={item.id === "ordenes" && metrics.pendientes > 0 ? metrics.pendientes : undefined}
                                />
                            ))}
                        </div>
                    </div>

                    {/* External Links */}
                    <div className="pt-2 border-t border-gray-100 dark:border-zinc-800">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 mb-2">Navegación</p>
                        <div className="space-y-0.5">
                            {EXTERNAL_LINKS.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => handleExternalLink(item.path)}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-zinc-200 transition-all"
                                >
                                    <item.icon size={18} strokeWidth={2} />
                                    <span>{item.label}</span>
                                    <ArrowUpRight size={14} className="ml-auto opacity-30" />
                                </button>
                            ))}
                        </div>
                    </div>
                </nav>

                {/* User Footer */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                    {loading ? (
                        <div className="flex items-center gap-3 p-2 w-full animate-pulse">
                            <div className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-zinc-800 shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-2.5 bg-gray-200 dark:bg-zinc-800 rounded-full w-20" />
                                <div className="h-2 bg-gray-100 dark:bg-zinc-800/50 rounded-full w-12" />
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-zinc-800/50 rounded-xl mb-3">
                            <div className="w-9 h-9 rounded-lg bg-orange-100 dark:bg-orange-600/20 flex items-center justify-center text-orange-600 font-black text-sm shrink-0">
                                {user?.nombre?.charAt(0) || "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold truncate">{user?.nombre || "Mi Cuenta"}</p>
                                <p className="text-[10px] text-gray-400 truncate">{user?.id_negocio || "Sin Negocio"}</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut size={16} />
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </aside>
    );
}

interface SidebarItemProps {
    item: { id: string; icon: React.ElementType; label: string };
    isActive: boolean;
    onClick: () => void;
    activeColor?: string;
    badge?: number;
}

function SidebarItem({ item, isActive, onClick, activeColor = "orange", badge }: SidebarItemProps) {
    const activeClasses = {
        orange: "bg-orange-50 text-orange-600 dark:bg-orange-600/10 dark:text-orange-500",
        blue: "bg-blue-50 text-blue-600 dark:bg-blue-600/10 dark:text-blue-500",
    };

    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive
                    ? activeClasses[activeColor as keyof typeof activeClasses] || activeClasses.orange
                    : "text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-zinc-200"
            }`}
        >
            <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
            <span className="flex-1 text-left">{item.label}</span>
            {badge !== undefined && (
                <span className="bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full">
                    {badge}
                </span>
            )}
        </button>
    );
}
