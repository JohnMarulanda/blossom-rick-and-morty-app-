import { useState } from 'react';

// Interfaz que representa un personaje
interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
}

/**
 * Hook personalizado para gestionar filtros de búsqueda y atributos de personajes.
 * Permite separar filtros pendientes (aún no aplicados) y filtros ya aplicados.
 */
export const useFilters = () => {
  // Estado para búsqueda por nombre
  const [search, setSearch] = useState('');

  // Filtros pendientes (no aplicados aún)
  const [pendingCharacterFilter, setPendingCharacterFilter] = useState('all'); // 'all' | 'starred' | 'others'
  const [pendingStatusFilter, setPendingStatusFilter] = useState('all');
  const [pendingSpeciesFilter, setPendingSpeciesFilter] = useState('all');
  const [pendingGenderFilter, setPendingGenderFilter] = useState('all');

  // Filtros aplicados (usados en el filtrado real)
  const [appliedCharacterFilter, setAppliedCharacterFilter] = useState('all');
  const [appliedStatusFilter, setAppliedStatusFilter] = useState('all');
  const [appliedSpeciesFilter, setAppliedSpeciesFilter] = useState('all');
  const [appliedGenderFilter, setAppliedGenderFilter] = useState('all');

  // Indica si los filtros han sido aplicados o no
  const [filtersApplied, setFiltersApplied] = useState(false);

  /**
   * Restablece todos los filtros y búsqueda a su estado inicial.
   */
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
    setFiltersApplied(false);
  };

  /**
   * Aplica los filtros pendientes, pasando su estado a los filtros aplicados.
   */
  const applyPendingFilters = () => {
    setAppliedCharacterFilter(pendingCharacterFilter);
    setAppliedStatusFilter(pendingStatusFilter);
    setAppliedSpeciesFilter(pendingSpeciesFilter);
    setAppliedGenderFilter(pendingGenderFilter);
    setFiltersApplied(true);
  };

  /**
   * Retorna `true` si hay algún filtro pendiente diferente de 'all'.
   */
  const hasActiveFilters = () => {
    return (
      pendingCharacterFilter !== 'all' || 
      pendingStatusFilter !== 'all' || 
      pendingSpeciesFilter !== 'all' || 
      pendingGenderFilter !== 'all'
    );
  };

  /**
   * Aplica los filtros actuales (ya aplicados) a una lista de personajes.
   * También considera favoritos y búsqueda por nombre.
   * 
   * @param characters Lista completa de personajes
   * @param favorites Lista de IDs de personajes favoritos
   * @returns Lista filtrada según criterios activos
   */
  const filterCharacters = (characters: Character[], favorites: number[]) => {
    return characters.filter((character) => {
      const matchesSearch = search === '' || 
        character.name.toLowerCase().includes(search.toLowerCase());

      const matchesCharacterFilter = 
        appliedCharacterFilter === 'all' ||
        (appliedCharacterFilter === 'starred' && favorites.includes(character.id)) ||
        (appliedCharacterFilter === 'others' && !favorites.includes(character.id));

      const matchesStatus = 
        appliedStatusFilter === 'all' || 
        character.status === appliedStatusFilter;

      const matchesSpecies = 
        appliedSpeciesFilter === 'all' || 
        character.species === appliedSpeciesFilter;

      const matchesGender = 
        appliedGenderFilter === 'all' || 
        character.gender === appliedGenderFilter;

      // Solo se incluye si cumple con todos los criterios
      return (
        matchesSearch && 
        matchesCharacterFilter && 
        matchesStatus && 
        matchesSpecies && 
        matchesGender
      );
    });
  };

  // Valores y funciones que se exponen desde el hook
  return {
    // Búsqueda
    search,
    setSearch,

    // Filtros pendientes
    characterFilter: pendingCharacterFilter,
    setCharacterFilter: setPendingCharacterFilter,
    statusFilter: pendingStatusFilter,
    setStatusFilter: setPendingStatusFilter,
    speciesFilter: pendingSpeciesFilter,
    setSpeciesFilter: setPendingSpeciesFilter,
    genderFilter: pendingGenderFilter,
    setGenderFilter: setPendingGenderFilter,

    // Funciones
    clearFilters,
    applyFilters: filterCharacters,
    applyPendingFilters,
    hasActiveFilters,

    // Estado de aplicación
    filtersApplied,
    setFiltersApplied
  };
};