import { useState } from 'react'
import { useCharacters, sortedCharacters } from '../hooks/useCharacters';
import { useFavorites } from '../hooks/useFavorites';
import { useFilters } from '../hooks/useFilters';
import { ArrowUpAZ, ArrowDownAZ } from 'lucide-react';
import { HeartButton } from '../components/HeartButton';
import { SearchField } from '../components/SearchField';
import { FiltersBar } from '../components/FiltersBar';	

export default function HomePage() {
  const { loading, error, data } = useCharacters();
  const { toggleFavorite, isFavorite, favorites } = useFavorites();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  const {
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
  } = useFilters();

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-center mt-4 text-red-600">Error: {error.message}</p>;

  const allCharacters = data?.characters.results || [];
  const filteredCharacters = applyFilters(allCharacters, favorites);
  
  const starredCharacters = filteredCharacters.filter(char => isFavorite(char.id));
  const otherCharacters = filteredCharacters.filter(char => !isFavorite(char.id));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold pt-6">Rick and Morty list</h1>
      <SearchField
        value={search}
        onChange={setSearch}
        onFilterClick={() => setIsFiltersOpen(true)}
      />
      
      <FiltersBar
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        characterFilter={characterFilter}
        setCharacterFilter={setCharacterFilter}
        speciesFilter={speciesFilter}
        setSpeciesFilter={setSpeciesFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        genderFilter={genderFilter}
        setGenderFilter={setGenderFilter}
        onApplyFilters={() => {}}
        onClearFilters={clearFilters}
      />

      {starredCharacters.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 mb-4">
            STARRED CHARACTERS ({starredCharacters.length})
          </h2>
          <ul className="list-none p-0">
            {sortedCharacters(starredCharacters, sortOrder).map((character) => (
              <li key={character.id} className="flex items-center mb-4 border-b border-gray-300 pb-4">
                <img src={character.image} alt={character.name} width={32} height={32} className="rounded-full mr-4" />
                <div className="flex-grow">
                  <strong className="block text-sm">{character.name}</strong>
                  <div className="text-gray-500 text-sm">
                    {character.species} – {character.status} – {character.gender}
                  </div>
                </div>
                <HeartButton
                  characterId={character.id}
                  isFavorite={isFavorite(character.id)}
                  onToggle={toggleFavorite}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold text-gray-500">
          CHARACTERS ({otherCharacters.length})
        </h2>
        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          {sortOrder === 'asc' ? (
            <ArrowUpAZ className="w-4 h-4" />
          ) : (
            <ArrowDownAZ className="w-4 h-4" />
          )}
          <span className="text-xs">{sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</span>
        </button>
      </div>
      
      <ul className="list-none p-0">
        {sortedCharacters(otherCharacters, sortOrder).map((character) => (
          <li key={character.id} className="flex items-center mb-4 border-b border-gray-300 pb-4">
            <img src={character.image} alt={character.name} width={32} height={32} className="rounded-full mr-4" />
            <div className="flex-grow">
              <strong className="block text-sm">{character.name}</strong>
              <div className="text-gray-500 text-sm">
                {character.species} – {character.status} – {character.gender}
              </div>
            </div>
            <HeartButton
              characterId={character.id}
              isFavorite={isFavorite(character.id)}
              onToggle={toggleFavorite}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}