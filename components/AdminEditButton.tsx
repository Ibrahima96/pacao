import React from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';

interface AdminEditButtonProps {
    onEdit?: () => void;
    onDelete?: () => void;
    onAdd?: () => void;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
    label?: string;
}

export const AdminEditButton: React.FC<AdminEditButtonProps> = ({
    onEdit,
    onDelete,
    onAdd,
    position = 'top-right',
    label
}) => {
    const positionClasses = {
        'top-right': 'top-2 right-2',
        'top-left': 'top-2 left-2',
        'bottom-right': 'bottom-2 right-2',
        'bottom-left': 'bottom-2 left-2',
        'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    };

    return (
        <div className={`absolute ${positionClasses[position]} z-20 flex gap-1`}>
            {label && (
                <div className="bg-blue-600 text-white px-2 py-1 rounded text-[10px] font-mono uppercase opacity-80">
                    {label}
                </div>
            )}
            {onAdd && (
                <button
                    onClick={(e) => { e.stopPropagation(); onAdd(); }}
                    className="p-1.5 bg-green-600 hover:bg-green-500 text-white rounded shadow-lg transition-all hover:scale-110"
                    title="Ajouter"
                >
                    <Plus className="w-3 h-3" />
                </button>
            )}
            {onEdit && (
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded shadow-lg transition-all hover:scale-110"
                    title="Modifier"
                >
                    <Edit className="w-3 h-3" />
                </button>
            )}
            {onDelete && (
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="p-1.5 bg-red-600 hover:bg-red-500 text-white rounded shadow-lg transition-all hover:scale-110"
                    title="Supprimer"
                >
                    <Trash2 className="w-3 h-3" />
                </button>
            )}
        </div>
    );
};
