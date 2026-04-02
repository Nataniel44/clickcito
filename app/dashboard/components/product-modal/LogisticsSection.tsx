import React from "react";

interface LogisticsSectionProps {
    formData: any;
    setFormData: (data: any) => void;
    negocioData?: any;
}

export const LogisticsSection: React.FC<LogisticsSectionProps> = ({
    formData,
    setFormData,
    negocioData
}) => {
    const isEducacion = negocioData?.rubro?.toLowerCase() === "educación" ||
        negocioData?.rubro?.toLowerCase() === "educacion" ||
        negocioData?.rubro?.toLowerCase() === "academia";

    return (
        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 px-1">Logística y Medidas</label>
            
            {/* Unidad de Medida */}
            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Unidad de Medida / Venta</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['Unidad', 'Kg', 'Gramos', 'Litro', 'Porción', 'Docena', 'Turno', 'Hora', 'Sesión', 'Día', 'Semana', 'Mes'].map((unit) => {
                        const isSelected = (formData.unidad_medida || 'Unidad') === unit;
                        return (
                            <button
                                key={unit}
                                type="button"
                                onClick={() => setFormData({
                                    ...formData,
                                    unidad_medida: unit
                                })}
                                className={`px-3 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-tight transition-all ${isSelected
                                    ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-500/20 scale-[1.02]'
                                    : 'bg-white dark:bg-zinc-800/50 border-gray-100 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 hover:border-orange-200'
                                    }`}
                            >
                                {unit}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className={`grid ${isEducacion ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                {isEducacion ? (
                    <>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 px-1">Nivel</label>
                            <select
                                value={formData.nivel || ""}
                                onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium transition-all font-bold"
                            >
                                <option value="">No aplica</option>
                                <option value="principiante">Principiante</option>
                                <option value="intermedio">Intermedio</option>
                                <option value="avanzado">Avanzado</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 px-1">Duración</label>
                            <input
                                type="text"
                                value={formData.duracion || ""}
                                onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium placeholder-gray-400 transition-all font-bold"
                                placeholder="Ej: 30 min, 1 Hora, 4 semanas"
                            />
                        </div>
                    </>
                ) : (
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 px-1">Talles / Otros (Info)</label>
                        <input
                            type="text"
                            value={formData.talles || ""}
                            onChange={(e) => setFormData({ ...formData, talles: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium placeholder-gray-400 transition-all font-bold"
                            placeholder="Ej: S, M, L, XL"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
