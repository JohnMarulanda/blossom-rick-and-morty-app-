import { useState, useEffect } from 'react';

// Clave usada para almacenar los personajes eliminados en el localStorage
const DELETED_CHARACTERS_KEY = 'rickAndMorty_deletedCharacters';

/**
 * Hook personalizado que permite "eliminar" personajes de forma lógica (soft delete).
 * Los personajes eliminados se almacenan en localStorage y pueden recuperarse o filtrarse.
 */
export const useSoftDelete = () => {
  // Estado que contiene los IDs de personajes eliminados lógicamente
  const [deletedCharacters, setDeletedCharacters] = useState<number[]>(() => {
    // Inicializa desde localStorage si existe información guardada
    const saved = localStorage.getItem(DELETED_CHARACTERS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // Efecto secundario: actualiza localStorage cada vez que cambia la lista de eliminados
  useEffect(() => {
    localStorage.setItem(DELETED_CHARACTERS_KEY, JSON.stringify(deletedCharacters));
  }, [deletedCharacters]);

  /**
   * Alterna el estado de eliminación lógica para un personaje dado.
   * Si ya está eliminado, lo restaura; si no lo está, lo elimina.
   * @param characterId ID del personaje a eliminar/restaurar
   */
  const toggleDelete = (characterId: number) => {
    setDeletedCharacters(prev => {
      if (prev.includes(characterId)) {
        // Si ya está eliminado, se quita de la lista
        return prev.filter(id => id !== characterId);
      }
      // Si no está eliminado, se agrega a la lista
      return [...prev, characterId];
    });
  };

  /**
   * Verifica si un personaje está marcado como eliminado.
   * @param characterId ID del personaje a verificar
   * @returns `true` si está eliminado, `false` en caso contrario
   */
  const isDeleted = (characterId: number) => deletedCharacters.includes(characterId);

  /**
   * Filtra una lista de personajes, removiendo aquellos que estén marcados como eliminados.
   * @param characters Lista de personajes a filtrar
   * @returns Lista sin personajes eliminados
   */
  const filterDeletedCharacters = <T extends { id: number }>(characters: T[]) => {
    return characters.filter(character => !deletedCharacters.includes(character.id));
  };

  // Devuelve las funciones y estado necesarios para utilizar el hook
  return {
    toggleDelete,              // Función para marcar o desmarcar como eliminado
    isDeleted,                 // Función para saber si un personaje está eliminado
    filterDeletedCharacters,  // Función para excluir eliminados de una lista
    deletedCharacters          // Lista actual de IDs eliminados
  };
};
