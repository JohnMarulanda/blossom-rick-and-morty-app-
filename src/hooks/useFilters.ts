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
  
  const [pendingCharacterFilter, setPendingCharacterFilter] = useState('all');
  const [pendingStatusFilter, setPendingStatusFilter] = useState('all');
  const [pendingSpeciesFilter, setPendingSpeciesFilter] = useState('all');
  const [pendingGenderFilter, setPendingGenderFilter] = useState('all');
  
  const [appliedCharacterFilter, setAppliedCharacterFilter] = useState('all');
  const [appliedStatusFilter, setAppliedStatusFilter] = useState('all');
  const [appliedSpeciesFilter, setAppliedSpeciesFilter] = useState('all');
  const [appliedGenderFilter, setAppliedGenderFilter] = useState('all');

  const clearFilters = () => {
    setSearch('');
    setPendingCharacterFilter('all');
    setPendingStatusFilter('all');
    setPendingSpeciesFilter('all');
    setPendingGenderFilter('all');
    setAppliedCharacterFilter('all');
    setAppliedStatusFilter('all');
    setAppliedSpeciesFilter('all');
    setAppliedGenderFilter('all');
  };

  const applyPendingFilters = () => {
    setAppliedCharacterFilter(pendingCharacterFilter);
    setAppliedStatusFilter(pendingStatusFilter);
    setAppliedSpeciesFilter(pendingSpeciesFilter);
    setAppliedGenderFilter(pendingGenderFilter);
  };

  const hasActiveFilters = () => {
    return pendingCharacterFilter !== 'all' || 
           pendingStatusFilter !== 'all' || 
           pendingSpeciesFilter !== 'all' || 
           pendingGenderFilter !== 'all';
  };

  const filterCharacters = (characters: Character[], favorites: number[]) => {
    return characters.filter((character) => {
      const matchesSearch = search === '' || 
        character.name.toLowerCase().includes(search.toLowerCase());

      const matchesCharacterFilter = 
        appliedCharacterFilter === 'all' ||
        (appliedCharacterFilter === 'starred' && favorites.includes(character.id)) ||
        (appliedCharacterFilter === 'others' && !favorites.includes(character.id));

      const matchesStatus = appliedStatusFilter === 'all' || character.status === appliedStatusFilter;

      const matchesSpecies = appliedSpeciesFilter === 'all' || character.species === appliedSpeciesFilter;

      const matchesGender = appliedGenderFilter === 'all' || character.gender === appliedGenderFilter;

      return matchesSearch && matchesCharacterFilter && matchesStatus && matchesSpecies && matchesGender;
    });
  };

  return {
    search,
    setSearch,
    characterFilter: pendingCharacterFilter,
    setCharacterFilter: setPendingCharacterFilter,
    statusFilter: pendingStatusFilter,
    setStatusFilter: setPendingStatusFilter,
    speciesFilter: pendingSpeciesFilter,
    setSpeciesFilter: setPendingSpeciesFilter,
    genderFilter: pendingGenderFilter,
    setGenderFilter: setPendingGenderFilter,
    clearFilters,
    applyFilters: filterCharacters,
    applyPendingFilters,
    hasActiveFilters,
  };
};
