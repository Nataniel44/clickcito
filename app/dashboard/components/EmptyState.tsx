"use client";

import React from "react";

export function EmptyState({
    icon: Icon,
    text,
    sub,
    action
}: {
    icon: any;
    text: string;
    sub?: string;
    action?: { label: string; onClick: () => void }
}) {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-800 p-12 text-center">
            <Icon size={40} className="mx-auto text-gray-300 dark:text-zinc-700 mb-3" />
            <p className="font-black text-gray-400 dark:text-zinc-500">{text}</p>
            {sub && <p className="text-sm text-gray-400 mt-1">{sub}</p>}
            {action && (
                <button
                    onClick={action.onClick}
                    className="mt-6 px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-black font-black text-sm rounded-xl hover:scale-105 transition-transform"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}
