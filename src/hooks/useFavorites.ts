import { useState, useEffect } from 'react';
import type { Character } from './useCharacters';

const FAVORITES_KEY = 'rickAndMorty_favorites';
const FAVORITE_CHANGE_EVENT = 'favoriteChange';
const favoriteEventEmitter = new EventTarget();

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const handleFavoriteChange = (event: Event) => {
      const customEvent = event as CustomEvent<number[]>;
      setFavorites(customEvent.detail);
    };

    favoriteEventEmitter.addEventListener(FAVORITE_CHANGE_EVENT, handleFavoriteChange);

    return () => {
      favoriteEventEmitter.removeEventListener(FAVORITE_CHANGE_EVENT, handleFavoriteChange);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    const event = new CustomEvent(FAVORITE_CHANGE_EVENT, { detail: favorites });
    favoriteEventEmitter.dispatchEvent(event);
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