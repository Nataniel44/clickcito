"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ArrowUpRight, LogOut } from "lucide-react";
import { BASE_SIDEBAR_ITEMS, EXTERNAL_LINKS, ADMIN_SIDEBAR_ITEMS, EDUCATION_SIDEBAR_ITEMS } from "./constants";

export function Sidebar({
    user,
    activeTab,
    setActiveTab,
    setIsSidebarOpen,
    isSidebarOpen,
    metrics,
    handleLogout,
    router,
    loading,
    negocio
}: {
    user: any;
    activeTab: string;
    setActiveTab: (id: string) => void;
    setIsSidebarOpen: (open: boolean) => void;
    isSidebarOpen: boolean;
    metrics: any;
    handleLogout: () => void;
    router: any;
    loading: boolean;
    negocio?: any;
}) {
    const isEducation = negocio?.rubro?.toLowerCase().includes("educacion") || negocio?.rubro?.toLowerCase().includes("academia");
    const isAdmin = user?.rol === "admin_clickcito" || user?.rol === "admin";
    const isElys = user?.id_negocio === "elysrestobar" || negocio?.id_negocio === "elysrestobar";

    const ALL_SIDEBAR_ITEMS = [
        ...BASE_SIDEBAR_ITEMS,
        ...(isAdmin ? ADMIN_SIDEBAR_ITEMS.filter(i => i.id !== "productos_elys") : []),
        ...(isAdmin || isElys ? ADMIN_SIDEBAR_ITEMS.filter(i => i.id === "productos_elys") : []),
    ];

    return (
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-zinc-800 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="flex flex-col h-full p-5">
                <div className="flex items-center gap-3 mb-10">
                    <Link href="/">
                        <Image src="/log.png" alt="Logo" width={200} height={100} />
                    </Link>
                    <button onClick={() => setIsSidebarOpen(false)} className="ml-auto lg:hidden p-1.5 bg-gray-100 dark:bg-zinc-800 rounded-lg"><X size={18} /></button>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
                    {/* Sección Academia (Solo educación) */}
                    {isEducation && (
                        <div className="mb-6 space-y-1">
                            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest px-4 mb-2">Centro de Formación</p>
                            {EDUCATION_SIDEBAR_ITEMS.map(item => (
                                <button key={item.id} onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === item.id
                                        ? "bg-orange-50 text-orange-600 dark:bg-orange-600/10 dark:text-orange-500"
                                        : "text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-zinc-200"
                                        }`}>
                                    <item.icon size={20} strokeWidth={2.5} />{item.label}
                                </button>
                            ))}
                        </div>
                    )}

                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 mb-2">Gestión de Negocio</p>
                    {ALL_SIDEBAR_ITEMS.map(item => (
                        <button key={item.id} onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === item.id
                                ? "bg-orange-50 text-orange-600 dark:bg-orange-600/10 dark:text-orange-500"
                                : "text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-zinc-200"
                                }`}>
                            <item.icon size={20} strokeWidth={2.5} />{item.label}
                            {item.id === "ordenes" && metrics.pendientes > 0 && (
                                <span className="ml-auto bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full">{metrics.pendientes}</span>
                            )}
                        </button>
                    ))}

                    <div className="pt-4 mt-4 border-t border-gray-100 dark:border-zinc-800">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 mb-2">Navegación</p>
                        {EXTERNAL_LINKS.map(item => (
                            <button key={item.id} onClick={() => router.push(item.path)}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-zinc-200 transition-all">
                                <item.icon size={20} strokeWidth={2.5} />{item.label}
                                <ArrowUpRight size={14} className="ml-auto opacity-30" />
                            </button>
                        ))}
                    </div>
                </nav>

                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-zinc-800">
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
                            <div className="w-9 h-9 rounded-lg bg-orange-100 dark:bg-orange-600/20 flex items-center justify-center text-orange-600 font-black text-sm">
                                {user?.nombre?.charAt(0) || "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold truncate">{user?.nombre || "Mi Cuenta"}</p>
                                <p className="text-[10px] text-gray-400 truncate">{user?.id_negocio || "Sin Negocio"}</p>
                            </div>
                        </div>
                    )}
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                        <LogOut size={16} /> Cerrar Sesión
                    </button>
                </div>
            </div>
        </aside>
    );
}
