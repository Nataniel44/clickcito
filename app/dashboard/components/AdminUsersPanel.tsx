"use client";

import React from "react";
import { Users, Plus, ExternalLink, Megaphone, Edit, Package, GraduationCap } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { BusinessEditorModal } from "./BusinessEditorModal";

export function AdminUsersPanel({
    isLoadingAdmin,
    adminDueños,
    adminNegocios,
    handleCrearNegocioParaUsuario,
    handleQuitarNegocio,
    handleAsignarNegocioExistente,
    handleManageProducts,
    handleManageAcademy,
    router,
    onRefresh,
    handleToggleVisibility
}: {
    isLoadingAdmin: boolean;
    adminDueños: any[];
    adminNegocios: any[];
    handleCrearNegocioParaUsuario: (d: any) => void;
    handleQuitarNegocio: (d: any) => void;
    handleAsignarNegocioExistente: (owner: any, idNegocio: string) => void;
    handleManageProducts: (n: any) => void;
    handleManageAcademy: (n: any) => void;
    router: any;
    onRefresh?: () => void;
    handleToggleVisibility?: (id: string, current: boolean) => void;
}) {
    const [selectedNegocio, setSelectedNegocio] = React.useState<any | null>(null);
    const [activeTab, setActiveTab] = React.useState<'dueños' | 'negocios'>('dueños');

    if (isLoadingAdmin) return <div className="text-center py-20 animate-pulse"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto" /></div>;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Tabs */}
            <div className="flex bg-white dark:bg-zinc-900 p-1.5 rounded-2xl border border-gray-100 dark:border-zinc-800 w-fit">
                <button
                    onClick={() => setActiveTab('dueños')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'dueños' ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                >
                    Gestión Dueños
                </button>
                <button
                    onClick={() => setActiveTab('negocios')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'negocios' ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                >
                    Todos los Negocios
                </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-6">
                <h3 className="text-xl font-black mb-6">
                    {activeTab === 'dueños' ? 'Gestión de Dueños de Negocios' : 'Todos los Negocios de la Plataforma'}
                </h3>

                <div className="overflow-x-auto text-wrap">
                    {activeTab === 'dueños' ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-zinc-800">
                                    <th className="py-4 font-black text-xs uppercase text-gray-400">Nombre / Email</th>
                                    <th className="py-4 font-black text-xs uppercase text-gray-400">Negocio Asignado</th>
                                    <th className="py-4 font-black text-xs uppercase text-gray-400">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {adminDueños.map((dueño) => {
                                    const negocioAsociado = adminNegocios.find(n => n.id === dueño.id_negocio);
                                    return (
                                        <tr key={dueño.uid} className="border-b border-gray-50 dark:border-zinc-800/50 last:border-0 hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors">
                                            <td className="py-4"><p className="font-bold text-sm">{dueño.nombre}</p><p className="text-xs text-gray-500">{dueño.email}</p></td>
                                            <td className="py-4">
                                                {dueño.id_negocio ? (
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-500 text-[10px] font-black px-2 py-1 rounded-full uppercase">
                                                                {negocioAsociado?.nombre || dueño.id_negocio}
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleQuitarNegocio(dueño)}
                                                            className="text-[9px] font-black text-red-500 uppercase hover:underline text-left w-fit"
                                                        >
                                                            Desvincular
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col gap-2">
                                                        <span className="text-[10px] font-black text-red-400 uppercase tracking-widest leading-none">Sin Negocio</span>
                                                        <select
                                                            className="text-[10px] bg-gray-50 max-w-48 dark:bg-zinc-800 border-none rounded-lg px-2 py-1 font-bold"
                                                            onChange={(e) => handleAsignarNegocioExistente(dueño, e.target.value)}
                                                            value=""
                                                        >
                                                            <option value="" disabled>Asignar existente...</option>
                                                            {adminNegocios.filter(n => !adminDueños.some(d => d.id_negocio === n.id)).map(n => (
                                                                <option key={n.id} value={n.id}>{n.nombre}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-2">
                                                    {!dueño.id_negocio && (
                                                        <button onClick={() => handleCrearNegocioParaUsuario(dueño)} className="px-4 py-2 bg-orange-600 text-white text-[10px] font-black rounded-xl hover:bg-orange-700 transition-all flex items-center gap-2">
                                                            <Plus size={14} /> Crear y Asignar
                                                        </button>
                                                    )}
                                                    {dueño.id_negocio && (
                                                        <>
                                                            <button onClick={() => setSelectedNegocio(negocioAsociado)} className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-xl transition-all" title="Editar Datos del Negocio">
                                                                <Edit size={16} />
                                                            </button>
                                                            <button onClick={() => handleManageProducts(negocioAsociado)} className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-all" title="Gestionar Productos">
                                                                <Package size={16} />
                                                            </button>
                                                            {(negocioAsociado?.rubro?.toLowerCase() === "educación" ||
                                                                negocioAsociado?.rubro?.toLowerCase() === "educacion" ||
                                                                negocioAsociado?.rubro?.toLowerCase() === "academia") && (
                                                                    <button
                                                                        onClick={() => handleManageAcademy(negocioAsociado)}
                                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all"
                                                                        title="Gestionar Academy"
                                                                    >
                                                                        <GraduationCap size={16} />
                                                                    </button>
                                                                )}
                                                            <button onClick={() => router.push(`/negocio/${dueño.id_negocio}`)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all" title="Ver catálogo">
                                                                <ExternalLink size={16} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {adminDueños.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="py-20 text-center"><EmptyState icon={Users} text="No hay dueños de negocio registrados" /></td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-zinc-800">
                                    <th className="py-4 font-black text-xs uppercase text-gray-400">Negocio / ID</th>
                                    <th className="py-4 font-black text-xs uppercase text-gray-400">Rubro</th>
                                    <th className="py-4 font-black text-xs uppercase text-gray-400 text-center">Estado / Visibilidad</th>
                                    <th className="py-4 font-black text-xs uppercase text-gray-400">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {adminNegocios.map((negocio) => (
                                    <tr key={negocio.id} className="border-b border-gray-50 dark:border-zinc-800/50 last:border-0 hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors">
                                        <td className="py-4">
                                            <p className="font-bold text-sm">{negocio.nombre}</p>
                                            <p className="text-[10px] text-gray-500 font-mono tracking-tighter">{negocio.id}</p>
                                        </td>
                                        <td className="py-4">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded-md">
                                                {negocio.rubro || 'General'}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex flex-col items-center gap-1.5">
                                                <button
                                                    onClick={() => handleToggleVisibility?.(negocio.id, negocio.activo !== false)}
                                                    className={`w-12 h-6 rounded-full p-1 transition-all ${negocio.activo !== false ? 'bg-orange-500' : 'bg-gray-300 dark:bg-zinc-700'}`}
                                                >
                                                    <div className={`w-4 h-4 bg-white rounded-full transition-all transform ${negocio.activo !== false ? 'translate-x-6' : 'translate-x-0'}`} />
                                                </button>
                                                <span className={`text-[9px] font-black uppercase tracking-widest ${negocio.activo !== false ? 'text-orange-600' : 'text-gray-400'}`}>
                                                    {negocio.activo !== false ? 'Visible (Activo)' : 'Pausado (Oculto)'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => setSelectedNegocio(negocio)} className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-xl transition-all" title="Editar Negocio">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleManageProducts(negocio)} className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-all" title="Gestionar Productos">
                                                    <Package size={16} />
                                                </button>
                                                <button onClick={() => router.push(`/negocio/${negocio.id}`)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all" title="Ver catálogo">
                                                    <ExternalLink size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {adminNegocios.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-20 text-center"><EmptyState icon={Package} text="No hay negocios registrados en el sistema" /></td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-white dark:bg-zinc-800 rounded-xl text-orange-600 shadow-sm"><Megaphone size={20} /></div>
                    <div>
                        <h4 className="font-black text-orange-800 dark:text-orange-500 mb-1">Nota de Administración</h4>
                        <p className="text-sm text-orange-700 dark:text-orange-400 leading-relaxed">
                            Desde este panel podés gestionar la relación entre usuarios y negocios. Podés desvincular un negocio de un usuario sin borrar el negocio, o asignar uno existente que no tenga dueño.
                        </p>
                    </div>
                </div>
            </div>

            {selectedNegocio && (
                <BusinessEditorModal
                    isOpen={!!selectedNegocio}
                    onClose={() => setSelectedNegocio(null)}
                    negocio={selectedNegocio}
                    onSuccess={onRefresh}
                />
            )}
        </div>
    );
}
