import React from "react";

interface DescriptionSectionProps {
    formData: any;
    setFormData: (data: any) => void;
}

export const DescriptionSection: React.FC<DescriptionSectionProps> = ({
    formData,
    setFormData
}) => {
    return (
        <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 px-1">Descripción del Producto</label>
            <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium placeholder-gray-400 transition-all font-bold resize-none"
                placeholder="Describe los ingredientes, materiales o detalles clave..."
                rows={2}
            />
        </div>
    );
};
