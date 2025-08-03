import { useState, useEffect } from 'react';
import type { Character } from './useCharacters';

// Claves y eventos utilizados para almacenamiento y sincronización
const FAVORITES_KEY = 'rickAndMorty_favorites';
const FAVORITE_CHANGE_EVENT = 'favoriteChange';
const favoriteEventEmitter = new EventTarget();

/**
 * Hook personalizado para manejar personajes favoritos.
 * Permite alternar favoritos, verificar si un personaje es favorito,
 * filtrar una lista de personajes, y sincroniza cambios en múltiples componentes.
 */
export const useFavorites = () => {
  // Estado con la lista de IDs de personajes marcados como favoritos
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  /**
   * Sincroniza el estado de favoritos entre diferentes instancias del hook
   * utilizando un EventTarget personalizado.
   */
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

  /**
   * Guarda los favoritos en localStorage y emite un evento personalizado
   * para que otros componentes con el hook se sincronicen automáticamente.
   */
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    const event = new CustomEvent(FAVORITE_CHANGE_EVENT, { detail: favorites });
    favoriteEventEmitter.dispatchEvent(event);
  }, [favorites]);

  /**
   * Agrega o elimina un personaje de los favoritos.
   * @param characterId ID del personaje a alternar como favorito
   */
  const toggleFavorite = (characterId: number) => {
    setFavorites(prev => {
      if (prev.includes(characterId)) {
        // Si ya es favorito, lo elimina
        return prev.filter(id => id !== characterId);
      }
      // Si no es favorito, lo agrega
      return [...prev, characterId];
    });
  };

  /**
   * Verifica si un personaje está marcado como favorito.
   * @param characterId ID del personaje
   * @returns `true` si es favorito, `false` si no lo es
   */
  const isFavorite = (characterId: number) => favorites.includes(characterId);

  /**
   * Filtra una lista de personajes para devolver solo los favoritos.
   * @param characters Lista de personajes a filtrar
   * @returns Lista de personajes favoritos
   */
  const filterFavorites = (characters: Character[]) => {
    return characters.filter(character => favorites.includes(character.id));
  };

  // Exporta funciones y estado para ser usado en componentes
  return {
    favorites,
    toggleFavorite,
    isFavorite,
    filterFavorites
  };
};