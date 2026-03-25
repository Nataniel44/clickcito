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
    );
};
