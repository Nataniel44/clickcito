import React from "react";
import Image from "next/image";

interface BasicInfoSectionProps {
    formData: any;
    setFormData: (data: any) => void;
    imagePreview: string | null;
    setImageFile: (file: File | null) => void;
    setImagePreview: (url: string | null) => void;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
    formData,
    setFormData,
    imagePreview,
    setImageFile,
    setImagePreview
}) => {
    return (
        <div className="flex gap-4">
            <div className="shrink-0">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 px-1">Imagen</label>
                <div className="relative group w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-800 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-zinc-800/50 hover:border-orange-500 transition-colors">
                    {imagePreview ? (
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center text-gray-400 group-hover:text-orange-500 group-hover:scale-110 transition-all">
                            +
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setImageFile(file);
                                setImagePreview(URL.createObjectURL(file));
                            }
                        }}
                    />
                </div>
            </div>
            <div className="flex-1 space-y-4">
                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 px-1">Nombre del Producto *</label>
                    <input
                        type="text"
                        value={formData.nombre_producto}
                        onChange={(e) => setFormData({ ...formData, nombre_producto: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium placeholder-gray-400 transition-all font-bold"
                        placeholder="Ej: Hamburguesa Completa"
                        required
                    />
                </div>
                <div className="flex items-center gap-4 px-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-10 h-6 rounded-full transition-all duration-300 relative ${formData.disponible ? 'bg-green-500' : 'bg-gray-200 dark:bg-zinc-800'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${formData.disponible ? 'left-5' : 'left-1'}`} />
                        </div>
                        <input
                            type="checkbox"
                            checked={formData.disponible}
                            onChange={(e) => setFormData({ ...formData, disponible: e.target.checked })}
                            className="hidden"
                        />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter group-hover:text-gray-600 transition-colors">
                            {formData.disponible ? 'Disponible' : 'Agotado'}
                        </span>
                    </label>
                    <div className="flex-1">
                        <input
                            type="text"
                            value={formData.sku}
                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                            className="w-full px-3 py-1 bg-transparent border-b border-gray-100 dark:border-zinc-800 focus:border-orange-500 outline-none text-[10px] font-black placeholder-gray-300 tracking-widest"
                            placeholder="SKU / CÓDIGO"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
