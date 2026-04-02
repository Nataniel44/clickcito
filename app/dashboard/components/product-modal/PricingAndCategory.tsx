import React from "react";

interface PricingAndCategoryProps {
    formData: any;
    setFormData: (data: any) => void;
    categoriasNativas: string[];
    creatingCategory: boolean;
    setCreatingCategory: (val: boolean) => void;
}

export const PricingAndCategory: React.FC<PricingAndCategoryProps> = ({
    formData,
    setFormData,
    categoriasNativas,
    creatingCategory,
    setCreatingCategory
}) => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 px-1">Precio Base *</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">$</span>
                        <input
                            type="number"
                            value={formData.precio_base}
                            onChange={(e) => setFormData({ ...formData, precio_base: e.target.value })}
                            className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium placeholder-gray-400 transition-all font-bold"
                            placeholder="0"
                            min="0"
                            required
                        />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1.5 px-1 pb-[1px]">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Categoría</label>
                        <button
                            type="button"
                            onClick={() => { setCreatingCategory(!creatingCategory); setFormData({ ...formData, tipo: "" }) }}
                            className="text-[10px] text-orange-600 dark:text-orange-500 font-bold hover:underline"
                        >
                            {creatingCategory || categoriasNativas.length === 0 ? "Elegir existente" : "+ Nueva de 0"}
                        </button>
                    </div>

                    {(!creatingCategory && categoriasNativas.length > 0) ? (
                        <select
                            value={formData.tipo}
                            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium transition-all font-bold appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTNhM2FmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBvbHlsaW5lIHBvaW50cz0iNiA5IDEyIDE1IDE4IDkiLz48L3N2Zz4=')] bg-no-repeat bg-[position:right_1rem_center] bg-[length:1.2em]"
                        >
                            <option value="">Seleccionar categoría...</option>
                            {categoriasNativas.map((c: string, idx: number) => (
                                <option key={idx} value={c}>{c}</option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type="text"
                            value={formData.tipo}
                            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium placeholder-gray-400 transition-all font-bold"
                            placeholder="Escribe el nombre de la categoría"
                        />
                    )}
                </div>
            </div>

            {/* TOGGLE DE SERVICIO - Movido aquí para mayor visibilidad */}
            <div
                onClick={() => setFormData({ ...formData, es_servicio: !formData.es_servicio })}
                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${formData.es_servicio
                        ? 'bg-orange-50 border-orange-200 dark:bg-orange-500/10 dark:border-orange-500/30'
                        : 'bg-gray-50 dark:bg-zinc-800/30 border-gray-100 dark:border-zinc-800'
                    }`}
            >
                <div className="relative flex items-center justify-center pointer-events-none">
                    <input
                        type="checkbox"
                        checked={formData.es_servicio || false}
                        readOnly
                        className="peer h-6 w-6 appearance-none rounded-lg border-2 border-gray-200 dark:border-zinc-700 checked:bg-orange-500 checked:border-orange-500 transition-all"
                    />
                    <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div className="flex flex-col flex-1">
                    <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Es un Servicio</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase leading-none mt-0.5">
                        {formData.es_servicio ? 'Habilitado como servicio (digital/online)' : 'Producto físico estándar'}
                    </span>
                </div>
            </div>
        </div>

    );
};
