import { useState, useEffect } from 'react';

const DELETED_CHARACTERS_KEY = 'rickAndMorty_deletedCharacters';

export const useSoftDelete = () => {
  const [deletedCharacters, setDeletedCharacters] = useState<number[]>(() => {
    const saved = localStorage.getItem(DELETED_CHARACTERS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(DELETED_CHARACTERS_KEY, JSON.stringify(deletedCharacters));
  }, [deletedCharacters]);

  const toggleDelete = (characterId: number) => {
    setDeletedCharacters(prev => {
      if (prev.includes(characterId)) {
        return prev.filter(id => id !== characterId);
      }
      return [...prev, characterId];
    });
  };

  const isDeleted = (characterId: number) => deletedCharacters.includes(characterId);

  const filterDeletedCharacters = <T extends { id: number }>(characters: T[]) => {
    return characters.filter(character => !deletedCharacters.includes(character.id));
  };

  return {
    toggleDelete,
    isDeleted,
    filterDeletedCharacters,
    deletedCharacters
  };
};