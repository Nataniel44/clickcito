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
            <div className={`grid ${isEducacion ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 px-1">Unidad de Medida</label>
                    <select
                        value={formData.unidad_medida}
                        onChange={(e) => setFormData({ ...formData, unidad_medida: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium transition-all font-bold"
                    >
                        <option value="u">Unidad (Por defecto)</option>
                        <option value="kg">Kilogramos</option>
                        <option value="litro">Litros</option>
                        <option value="m²">Metros Cuadrados</option>
                        <option value="metros">Metros Lineales</option>
                        <option value="bolsa">Bolsa</option>
                        <option value="rollo">Rollo</option>
                        <option value="placa">Placa</option>
                        {isEducacion && (
                            <>
                                <option value="curso">Curso</option>
                                <option value="clase">Clase</option>
                                <option value="modulo">Módulo</option>
                            </>
                        )}
                    </select>
                </div>
                {isEducacion && (
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 px-1">Duración (Ej: 4 semanas)</label>
                        <input
                            type="text"
                            value={formData.duracion}
                            onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium placeholder-gray-400 transition-all font-bold"
                            placeholder="Ej: 30 min, 1 Hora, 4 semanas"
                        />
                    </div>
                )}
            </div>

            <div className={`grid ${isEducacion ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                {isEducacion && (
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 px-1">Nivel (Educación)</label>
                        <select
                            value={formData.nivel}
                            onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium transition-all font-bold"
                        >
                            <option value="">No aplica</option>
                            <option value="principiante">Principiante</option>
                            <option value="intermedio">Intermedio</option>
                            <option value="avanzado">Avanzado</option>
                        </select>
                    </div>
                )}
                {!isEducacion && (
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 px-1">Talles / Otros (Info)</label>
                        <input
                            type="text"
                            value={formData.talles}
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
