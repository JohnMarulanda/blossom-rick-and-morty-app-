import React from 'react';
import { Heart } from 'lucide-react';

// Props esperadas por el componente
interface HeartButtonProps {
  characterId: number;                        // ID del personaje asociado al botón
  isFavorite: boolean;                        // Estado actual: si es favorito o no
  onToggle: (characterId: number) => void;    // Función para alternar el estado de favorito
}

/**
 * Botón de favorito con ícono de corazón.
 * Muestra un corazón lleno si el personaje es favorito, vacío si no.
 * Al hacer clic, ejecuta la función `onToggle` con el ID del personaje.
 */
export const HeartButton: React.FC<HeartButtonProps> = ({ 
  characterId,
  isFavorite,
  onToggle
}) => {

  // Maneja el clic sobre el botón, alternando el estado de favorito
  const handleClick = () => {
    onToggle(characterId);
  };

  return (
    <button
      onClick={handleClick}
      className="p-1 rounded-full bg-gray-100 transition-colors"
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {/* Ícono del corazón, relleno si es favorito */}
      <Heart
        className={`w-5 h-5 ${
          isFavorite 
            ? 'fill-secondary-600 text-secondary-600' 
            : 'text-gray-400'
        }`}
      />
    </button>
  );
};
