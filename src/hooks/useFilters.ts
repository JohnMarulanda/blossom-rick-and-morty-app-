import { useState } from 'react';

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
}

export const useFilters = () => {
  const [search, setSearch] = useState('');
  const [characterFilter, setCharacterFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');

  const clearFilters = () => {
    setSearch('');
    setCharacterFilter('all');
    setStatusFilter('all');
    setSpeciesFilter('all');
    setGenderFilter('all');
  };

  const applyFilters = (characters: Character[], favorites: number[]) => {
    return characters.filter((character) => {
      // Filtrar por búsqueda de nombre
      const matchesSearch = search === '' || 
        character.name.toLowerCase().includes(search.toLowerCase());

      // Filtrar por tipo de personaje (all, starred, others)
      const matchesCharacterFilter = 
        characterFilter === 'all' ||
        (characterFilter === 'starred' && favorites.includes(character.id)) ||
        (characterFilter === 'others' && !favorites.includes(character.id));

      // Filtrar por estado
      const matchesStatus = statusFilter === 'all' || character.status === statusFilter;

      // Filtrar por especie
      const matchesSpecies = speciesFilter === 'all' || character.species === speciesFilter;

      // Filtrar por género
      const matchesGender = genderFilter === 'all' || character.gender === genderFilter;

      return matchesSearch && matchesCharacterFilter && matchesStatus && matchesSpecies && matchesGender;
    });
  };

  return {
    search,
    setSearch,
    characterFilter,
    setCharacterFilter,
    statusFilter,
    setStatusFilter,
    speciesFilter,
    setSpeciesFilter,
    genderFilter,
    setGenderFilter,
    clearFilters,
    applyFilters,
  };
};
