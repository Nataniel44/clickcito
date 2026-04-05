"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import {
    ShoppingBag, Menu, X, LogOut, LayoutDashboard,
    ChevronDown, LogIn, Shield, Store, User, ShieldCheck, Package
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useScrollDirection } from "./useScrollDirection";

// Role configuration
const ROLE_CONFIG = {
    admin_clickcito: {
        badge: "Admin",
        badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-600/20 dark:text-purple-400",
        avatarColor: "bg-purple-600",
        icon: ShieldCheck,
        canAccessDashboard: true,
        dropdownItems: [
            { href: "/dashboard", label: "Panel Admin", icon: ShieldCheck },
            { href: "/mis-pedidos", label: "Mis Compras", icon: Package },
        ],
        mobileButtonLabel: "Panel Admin",
    },
    admin: {
        badge: "Admin",
        badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-600/20 dark:text-purple-400",
        avatarColor: "bg-purple-600",
        icon: ShieldCheck,
        canAccessDashboard: true,
        dropdownItems: [
            { href: "/dashboard", label: "Panel Admin", icon: ShieldCheck },
            { href: "/mis-pedidos", label: "Mis Compras", icon: Package },
        ],
        mobileButtonLabel: "Panel Admin",
    },
    "dueño_negocio": {
        badge: "Dueño",
        badgeColor: "bg-orange-100 text-orange-700 dark:bg-orange-600/20 dark:text-orange-400",
        avatarColor: "bg-orange-600",
        icon: Store,
        canAccessDashboard: true,
        dropdownItems: [
            { href: "/dashboard", label: "Panel Control", icon: LayoutDashboard },
            { href: "/mis-pedidos", label: "Mis Compras", icon: Package },
        ],
        mobileButtonLabel: "Ir al Panel",
    },
    cliente_final: {
        badge: "Cliente",
        badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-600/20 dark:text-blue-400",
        avatarColor: "bg-blue-600",
        icon: User,
        canAccessDashboard: false,
        dropdownItems: [
            { href: "/mis-pedidos", label: "Mis Pedidos", icon: Package },
        ],
        mobileButtonLabel: "Mis Pedidos",
        mobileButtonHref: "/mis-pedidos",
    },
};

export default function Navbar() {
    const pathname = usePathname();
    const { user, loading } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const { scrolled, visible } = useScrollDirection();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.href = "/";
        } catch (err) {
            console.error("Error al cerrar sesión:", err);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showDropdown && !e.target.closest('.user-dropdown')) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showDropdown]);

    // Hide Navbar on Dashboard or Checkout
    if (pathname.includes("/dashboard") || pathname.includes("/checkout")) return null;

    const userRole = user?.rol || null;
    const roleConfig = userRole ? ROLE_CONFIG[userRole] || ROLE_CONFIG.cliente_final : null;

    const menuItems = [
        { href: "/", label: "Inicio" },
        { href: "/explorar", label: "Explorar" },
        ...(user ? [{ href: "/mis-pedidos", label: "Mis Pedidos" }] : []),
        ...(userRole === "admin_clickcito" || userRole === "admin" ? [{ href: "/dashboard", label: "Panel Admin" }] : []),
        ...(userRole === "dueño_negocio" ? [{ href: "/dashboard", label: "Mi Negocio" }] : []),
    ];

    return (
        <>
            {/* Desktop Navbar */}
            <nav
                className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 ${visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
                    } ${scrolled
                        ? "py-3 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 shadow-lg"
                        : "py-5 bg-transparent"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <Image src="/log.png" alt="Logo" className="w-40" width={200} height={100} />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <div className="flex items-center gap-1 bg-gray-100/50 dark:bg-white/5 p-1 rounded-2xl border border-gray-200/50 dark:border-white/5">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${pathname === item.href
                                        ? "bg-white dark:bg-zinc-800 text-orange-600 shadow-sm"
                                        : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            {user && roleConfig ? (
                                <UserDropdown
                                    user={user}
                                    roleConfig={roleConfig}
                                    showDropdown={showDropdown}
                                    setShowDropdown={setShowDropdown}
                                    onLogout={handleLogout}
                                />
                            ) : loading ? (
                                <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-white/10 animate-pulse">
                                    <div className="flex items-center gap-2 p-1 pr-3 bg-white dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-700 w-32 h-10">
                                        <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-zinc-700" />
                                        <div className="flex flex-col gap-1">
                                            <div className="h-2 w-12 bg-gray-200 dark:bg-zinc-700 rounded-full" />
                                            <div className="h-1.5 w-8 bg-gray-100 dark:bg-zinc-700/50 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black font-black text-sm rounded-xl hover:scale-105 transition-transform"
                                >
                                    <LogIn size={18} />
                                    Ingresar
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2.5 bg-gray-100 dark:bg-zinc-800 rounded-xl text-gray-900 dark:text-white"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <MobileMenu
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                user={user}
                loading={loading}
                roleConfig={roleConfig}
                menuItems={menuItems}
                onLogout={handleLogout}
            />
        </>
    );
}

// Desktop User Dropdown Component
function UserDropdown({ user, roleConfig, showDropdown, setShowDropdown, onLogout }) {
    const Icon = roleConfig.icon;

    return (
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-white/10 animate-in fade-in duration-500">
            {roleConfig.canAccessDashboard && (
                <Link
                    href="/dashboard"
                    className="p-2.5 bg-gray-100 dark:bg-zinc-800 rounded-xl text-gray-600 dark:text-zinc-400 hover:text-orange-600 transition-colors"
                >
                    <LayoutDashboard size={20} />
                </Link>
            )}

            <div className="relative user-dropdown">
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 p-1 pr-3 bg-white dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-700 shadow-sm transition-all hover:border-orange-500"
                >
                    <div className={`w-8 h-8 rounded-lg ${roleConfig.avatarColor} flex items-center justify-center text-white font-black text-xs uppercase`}>
                        {user.nombre?.charAt(0) || "U"}
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-xs font-black dark:text-white leading-none">{user.nombre?.split(' ')[0] || "Mi Cuenta"}</span>
                        <span className={`text-[9px] font-black uppercase tracking-widest leading-none mt-0.5 px-1 rounded ${roleConfig.badgeColor}`}>
                            {roleConfig.badge}
                        </span>
                    </div>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                <div className={`absolute top-full right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-xl transition-all duration-300 overflow-hidden ${showDropdown
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-2 pointer-events-none'
                    }`}>
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
                        <p className="text-sm font-black truncate">{user.nombre || "Usuario"}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        {user.id_negocio && (
                            <p className="text-[10px] font-bold text-orange-600 mt-1">@{user.id_negocio}</p>
                        )}
                    </div>

                    <div className="p-2">
                        {roleConfig.dropdownItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setShowDropdown(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 dark:text-zinc-400 hover:bg-orange-50 dark:hover:bg-orange-600/10 hover:text-orange-600 transition-all"
                            >
                                <item.icon size={18} />
                                {item.label}
                            </Link>
                        ))}
                        <button
                            onClick={() => { setShowDropdown(false); onLogout(); }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                        >
                            <LogOut size={18} />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Mobile Menu Component
function MobileMenu({ isOpen, onClose, user, loading, roleConfig, menuItems, onLogout }) {
    return (
        <div
            className={`fixed inset-0 z-[110] md:hidden transition-all duration-500 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className={`absolute top-0 right-0 h-full w-[80%] bg-white dark:bg-zinc-900 shadow-2xl transition-transform duration-500 p-8 ${isOpen ? "translate-x-0" : "translate-x-full"
                }`}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-12">
                        <span className="text-2xl font-black italic">CLICK<span className="text-orange-600">CITO</span></span>
                        <button onClick={onClose} className="p-2.5 bg-gray-100 dark:bg-zinc-800 rounded-xl"><X size={24} /></button>
                    </div>

                    <div className="flex-1 space-y-4">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className="block px-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 text-xl font-black hover:bg-orange-50 dark:hover:bg-orange-600/10 hover:text-orange-600 transition-all"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-auto space-y-4">
                        {user && roleConfig ? (
                            <>
                                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl ${roleConfig.avatarColor} flex items-center justify-center text-white font-black text-xl`}>
                                        {user.nombre?.charAt(0) || "U"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-lg truncate">{user.nombre || "Mi Cuenta"}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${roleConfig.badgeColor}`}>
                                                {roleConfig.badge}
                                            </span>
                                            {user.id_negocio && (
                                                <span className="text-xs text-gray-500">@{user.id_negocio}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {(roleConfig.canAccessDashboard || roleConfig.mobileButtonHref) && (
                                    <Link
                                        href={roleConfig.mobileButtonHref || "/dashboard"}
                                        onClick={onClose}
                                        className="flex items-center justify-center gap-3 w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-black rounded-2xl shadow-lg"
                                    >
                                        <LayoutDashboard size={20} />
                                        {roleConfig.mobileButtonLabel}
                                    </Link>
                                )}

                                <button
                                    onClick={() => { onClose(); onLogout(); }}
                                    className="w-full py-4 text-red-500 font-black border border-red-100 dark:border-red-900/30 rounded-2xl"
                                >
                                    Cerrar Sesión
                                </button>
                            </>
                        ) : loading ? (
                            <div className="space-y-4 animate-pulse">
                                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-zinc-800" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded-full" />
                                        <div className="h-2 w-20 bg-gray-100 dark:bg-zinc-700 rounded-full" />
                                    </div>
                                </div>
                                <div className="h-14 w-full bg-gray-100 dark:bg-zinc-800 rounded-2xl" />
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                onClick={onClose}
                                className="flex items-center justify-center gap-3 w-full py-4 bg-orange-600 text-white font-black rounded-2xl shadow-lg shadow-orange-600/20"
                            >
                                <LogIn size={20} />
                                Iniciar Sesión
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
