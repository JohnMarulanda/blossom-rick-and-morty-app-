import { useState } from 'react';
import { Trash2, RotateCcw } from 'lucide-react';

interface DeleteButtonProps {
  characterId: number;             // ID del personaje a eliminar/restaurar
  isDeleted: boolean;             // Estado actual del personaje (eliminado o no)
  onToggle: (id: number) => void; // Función que alterna el estado eliminado
}

/**
 * Componente que muestra un botón para "eliminar" o "restaurar" un personaje,
 * con confirmación si el personaje aún no ha sido eliminado.
 * 
 * - Muestra ícono de papelera si no está eliminado.
 * - Muestra ícono de restaurar si ya lo está.
 * - Al hacer clic en eliminar, solicita confirmación antes de ejecutar.
 */
export function DeleteButton({ characterId, isDeleted, onToggle }: DeleteButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false); // Controla la visibilidad del mensaje de confirmación

  // Maneja el clic inicial sobre el botón
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isDeleted) {
      setShowConfirm(true); // Si aún no está eliminado, pide confirmación
    } else {
      onToggle(characterId); // Si ya está eliminado, lo restaura directamente
    }
  };

  // Confirma la eliminación
  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle(characterId);
    setShowConfirm(false);
  };

  // Cancela la acción de eliminación
  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(false);
  };

  return (
    <div className="relative">
      {/* Botón principal con ícono dinámico */}
      <button
        onClick={handleClick}
        className={`p-1 rounded-full bg-gray-100 transition-colors ${
          isDeleted ? 'text-primary-600 hover:bg-gray-100' : 'text-gray-400 hover:bg-gray-100'
        }`}
        aria-label={isDeleted ? 'Restore character' : 'Delete character'}
      >
        {isDeleted ? (
          <RotateCcw className="w-5 h-5" />
        ) : (
          <Trash2 className="w-5 h-5" />
        )}
      </button>

      {/* Confirmación de eliminación (solo si no está eliminado aún) */}
      {showConfirm && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 w-64">
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to delete this character?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}