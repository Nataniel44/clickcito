import React from "react";
import { X } from "lucide-react";

interface ModalHeaderProps {
    isEditing: boolean;
    onClose: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ isEditing, onClose }) => {
    return (
        <div className="flex justify-between items-start mb-6">
            <div>
                <h2 className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">
                    {isEditing ? "Editar Producto" : "Agregar Nuevo Producto"}
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">
                    {isEditing ? "Modifica los detalles de tu artículo." : "Completa los detalles de tu nuevo artículo."}
                </p>
            </div>
            <button
                onClick={onClose}
                className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
                <X size={20} />
            </button>
        </div>
    );
};
