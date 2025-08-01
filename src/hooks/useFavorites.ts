import { useState, useEffect } from 'react';
import type { Character } from './useCharacters';

const FAVORITES_KEY = 'rickAndMorty_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (characterId: number) => {
    setFavorites(prev => {
      if (prev.includes(characterId)) {
        return prev.filter(id => id !== characterId);
      }
      return [...prev, characterId];
    });
  };

  const isFavorite = (characterId: number) => favorites.includes(characterId);

  const filterFavorites = (characters: Character[]) => {
    return characters.filter(character => favorites.includes(character.id));
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    filterFavorites
  };
};