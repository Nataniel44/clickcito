"use client";

import React from "react";
import { Store, ShieldCheck, Globe, User, Edit, Mail, Eye, Settings, LayoutDashboard, Search, ChevronRight, ExternalLink, AlertTriangle, LogOut, Smartphone, Settings2 } from "lucide-react";
import Image from "next/image";
import { BusinessEditorModal } from "./BusinessEditorModal";

export function ConfigPanel({
    user,
    loadingOrdenes,
    isConfigEditing,
    setIsConfigEditing,
    configEditData,
    setConfigEditData,
    handleSaveConfig,
    isSavingConfig,
    handleLogout,
    router,
    negocioData,
    onRefresh
}: {
    user: any;
    loadingOrdenes: boolean;
    isConfigEditing: boolean;
    setIsConfigEditing: (b: boolean) => void;
    configEditData: any;
    setConfigEditData: (d: any) => void;
    handleSaveConfig: () => void;
    isSavingConfig: boolean;
    handleLogout: () => void;
    router: any;
    negocioData?: any;
    onRefresh?: () => void;
}) {
    const [isBusinessModalOpen, setIsBusinessModalOpen] = React.useState(false);

    if (loadingOrdenes) {
        return (
            <div className="space-y-6 animate-pulse max-w-4xl mx-auto">
                <div className="h-48 bg-gray-100 dark:bg-zinc-800 rounded-[2rem]" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-64 bg-gray-100 dark:bg-zinc-800 rounded-3xl" />
                    <div className="h-64 bg-gray-100 dark:bg-zinc-800 rounded-3xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 dark:from-indigo-900 dark:to-blue-900 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-md border-4 border-white/20 rounded-full flex items-center justify-center shadow-inner shrink-0 overflow-hidden relative">
                        {negocioData?.logo_url ? (
                            <Image src={negocioData.logo_url} fill className="object-cover" alt="Logo" />
                        ) : (
                            <Store size={40} className="text-white" />
                        )}
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-100 mb-3">
                            <ShieldCheck size={12} /> Cuenta Verificada
                        </div>
                        <h2 className="text-3xl font-black tracking-tight mb-1">{user?.nombre_negocio || user?.nombre || "Mi Negocio"}</h2>
                        <p className="text-indigo-100 font-medium text-sm flex items-center justify-center md:justify-start gap-2">
                            <Globe size={14} className="opacity-70" /> {typeof window !== "undefined" && window.location.host}/negocio/{user?.id_negocio}
                        </p>
                    </div>
                </div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-black text-lg flex items-center gap-2"><User size={20} className="text-indigo-500" /> Datos Admin</h3>
                        {!isConfigEditing && (
                            <button onClick={() => { setIsConfigEditing(true); setConfigEditData({ nombre: user?.nombre || "", nombre_negocio: user?.nombre_negocio || "" }); }} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1"><Edit size={14} /> Editar</button>
                        )}
                    </div>

                    {isConfigEditing ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div><label className="text-[10px] font-black text-gray-400 uppercase">Tu Nombre</label>
                                <input type="text" value={configEditData.nombre} onChange={(e) => setConfigEditData({ ...configEditData, nombre: e.target.value })} className="w-full mt-1 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20" /></div>
                            <div><label className="text-[10px] font-black text-gray-400 uppercase">Nombre Negocio</label>
                                <input type="text" value={configEditData.nombre_negocio} onChange={(e) => setConfigEditData({ ...configEditData, nombre_negocio: e.target.value })} className="w-full mt-1 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20" /></div>
                            <div className="flex gap-3 pt-2">
                                <button onClick={handleSaveConfig} disabled={isSavingConfig} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-black text-sm hover:bg-indigo-700 transition-all disabled:opacity-50">{isSavingConfig ? "Guardando..." : "Guardar"}</button>
                                <button onClick={() => setIsConfigEditing(false)} className="px-6 bg-gray-100 dark:bg-zinc-800 text-gray-500 py-3 rounded-xl font-black text-sm hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all">Cancelar</button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50">
                                <User size={18} className="text-gray-500" />
                                <div><p className="text-[10px] font-black text-gray-400 uppercase">Nombre</p><p className="font-bold text-sm text-gray-900 dark:text-white">{user?.nombre || "No especificado"}</p></div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50">
                                <Mail size={18} className="text-gray-500" />
                                <div><p className="text-[10px] font-black text-gray-400 uppercase">Email</p><p className="font-bold text-sm text-gray-900 dark:text-white">{user?.email || "No especificado"}</p></div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-6 shadow-sm">
                        <h3 className="font-black text-lg mb-6 flex items-center gap-2"><Settings size={20} className="text-gray-500" /> Accesos</h3>
                        <div className="space-y-3">
                            <button onClick={() => router.push(`/negocio/${user?.id_negocio}`)} className="w-full group flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 hover:border-orange-500 bg-white dark:bg-zinc-900 transition-all">
                                <div className="flex items-center gap-4"><Eye size={20} className="text-orange-600" /><div className="text-left"><p className="font-bold text-sm">Ver Catálogo</p><p className="text-xs text-gray-500">Vista clientes</p></div></div>
                                <ExternalLink size={16} className="text-gray-300" />
                            </button>
                            <button onClick={() => setIsBusinessModalOpen(true)} className="w-full group flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 hover:border-indigo-500 bg-white dark:bg-zinc-900 transition-all">
                                <div className="flex items-center gap-4"><Settings2 size={20} className="text-indigo-600" /><div className="text-left"><p className="font-bold text-sm">Editar Perfil Público</p><p className="text-xs text-gray-500">Horarios, Delivery, Info</p></div></div>
                                <ExternalLink size={16} className="text-gray-300" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-950/20 rounded-3xl border border-red-100 dark:border-red-900/30 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4"><AlertTriangle size={18} className="text-red-600" /><h3 className="font-black text-red-700 dark:text-red-500">Sesión</h3></div>
                        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-red-200 text-red-600 font-black text-sm hover:bg-red-500 hover:text-white transition-all"><LogOut size={18} /> Cerrar Sesión Segura</button>
                    </div>
                </div>
            </div>

            {isBusinessModalOpen && negocioData && user?.id_negocio && (
                <BusinessEditorModal
                    isOpen={isBusinessModalOpen}
                    onClose={() => setIsBusinessModalOpen(false)}
                    negocio={{ id: user.id_negocio, ...negocioData }}
                    onSuccess={onRefresh}
                />
            )}

            <div className="text-center pt-8 pb-4"><p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center justify-center gap-2"><Smartphone size={12} /> App Versión 1.0.0</p></div>
        </div>
    );
}
