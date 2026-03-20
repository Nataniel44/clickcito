"use client";

import React, { useEffect, useState } from "react";
import { getActivityLogs } from "@/app/firebase/db";
import { History, Search } from "lucide-react";

export function ActivityLogPanel({ user }: { user: any }) {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.id_negocio) {
            setLoading(false);
            return;
        }

        getActivityLogs(user.id_negocio)
            .then(data => {
                const sorted = data.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
                setLogs(sorted);
            })
            .catch(err => console.error("Error loading logs", err))
            .finally(() => setLoading(false));
    }, [user]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white flex items-center justify-center">
                        <History size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Registro de Auditoría</h2>
                        <p className="text-sm text-gray-500 font-medium">{logs.length} acciones registradas</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto" />
                    </div>
                ) : logs.length === 0 ? (
                    <div className="p-16 text-center">
                        <History size={48} className="mx-auto text-gray-200 dark:text-zinc-800 mb-4" />
                        <h3 className="font-black text-gray-400 dark:text-zinc-500 text-lg">No hay actividad registrada</h3>
                        <p className="text-sm text-gray-400 mt-1">Acá podrás ver quién cambia los estados y pagos.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 dark:divide-zinc-800/60 max-h-[70vh] overflow-y-auto no-scrollbar">
                        {logs.map((log: any) => (
                            <div key={log.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                                <div className="flex flex-col min-w-0 flex-1">
                                    <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">{log.accion}</h4>
                                    <p className="text-xs font-medium text-gray-500 truncate mt-0.5">{log.detalles}</p>
                                </div>
                                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 dark:bg-orange-600/10 px-2.5 py-1 rounded-md mb-0 sm:mb-1">{log.usuario_email}</span>
                                    <span className="text-[10px] font-bold text-gray-400 mt-1">
                                        {log.createdAt ? new Date(log.createdAt.seconds * 1000).toLocaleString('es-AR') : "Recién"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
