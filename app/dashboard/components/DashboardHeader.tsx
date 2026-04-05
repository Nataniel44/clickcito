"use client";

import React from "react";
import { Menu } from "lucide-react";
import { NotificationsDropdown } from "./NotificationsDropdown";

interface DashboardHeaderProps {
    tabLabel: string;
    loading: boolean;
    user: any;
    isSidebarOpen: boolean;
    onToggleSidebar: () => void;
    ordenes: any[];
    pendientes: number;
    selectedOrder: any | null;
    onSelectOrder: (order: any) => void;
    onCambiarEstado: (id: string, estado: string) => void;
    onVerOrdenes: () => void;
}

export function DashboardHeader({
    tabLabel,
    loading,
    user,
    isSidebarOpen,
    onToggleSidebar,
    ordenes,
    pendientes,
    selectedOrder,
    onSelectOrder,
    onCambiarEstado,
    onVerOrdenes,
}: DashboardHeaderProps) {
    return (
        <header className="sticky top-0 z-40 bg-[#F8F8F8]/80 dark:bg-[#0A0A0A]/80 backdrop-blur-lg -mx-4 px-4 py-4 mb-6 md:-mx-8 md:px-8 md:py-6 md:mb-8 border-b border-gray-100 dark:border-zinc-800 lg:static lg:bg-transparent lg:backdrop-blur-none lg:border-none lg:p-0 lg:m-0 lg:mb-10 flex items-center justify-between">
            {/* Left: Menu Toggle + Title */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onToggleSidebar}
                    className="lg:hidden p-2 bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm active:scale-95 transition-all"
                >
                    <Menu size={20} />
                </button>
                <div>
                    {loading ? (
                        <div className="h-3 w-24 bg-gray-100 dark:bg-zinc-800 rounded-full animate-pulse mb-1" />
                    ) : (
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                            {user?.id_negocio || "Panel"}
                        </p>
                    )}
                    <h1 className="text-xl md:text-3xl font-black tracking-tight">{tabLabel}</h1>
                </div>
            </div>

            {/* Right: Notifications */}
            <NotificationsDropdown
                ordenes={ordenes}
                pendientes={pendientes}
                selectedOrder={selectedOrder}
                onSelectOrder={onSelectOrder}
                onCambiarEstado={onCambiarEstado}
                onVerOrdenes={onVerOrdenes}
            />
        </header>
    );
}
