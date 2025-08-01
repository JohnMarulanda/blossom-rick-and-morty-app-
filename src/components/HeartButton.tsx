import React from 'react';
import { Heart } from 'lucide-react';

interface HeartButtonProps {
  characterId: number;
  isFavorite: boolean;
  onToggle: (characterId: number) => void;
}

export const HeartButton: React.FC<HeartButtonProps> = ({ 
  characterId,
  isFavorite,
  onToggle
}) => {
  const handleClick = () => {
    onToggle(characterId);
  };

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={`w-5 h-5 ${isFavorite ? 'fill-secondary-600 text-secondary-600' : 'text-gray-400'}`}
      />
    </button>
  );
};