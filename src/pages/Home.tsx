import { useState } from 'react'
import { Link } from 'react-router-dom';
import { useCharacters, sortedCharacters } from '../hooks/useCharacters';
import { useFavorites } from '../hooks/useFavorites';
import { useFilters } from '../hooks/useFilters';
import { useSoftDelete } from '../hooks/useSoftDelete';
import { ArrowUpAZ, ArrowDownAZ } from 'lucide-react';
import { HeartButton } from '../components/HeartButton';
import { SearchField } from '../components/SearchField';
import { FiltersBar } from '../components/FiltersBar';
import { DeleteButton } from '../components/DeleteButton';	

export default function HomePage() {
  const { loading, error, data } = useCharacters();
  const { toggleFavorite, isFavorite, favorites } = useFavorites();
  const { toggleDelete, isDeleted, filterDeletedCharacters } = useSoftDelete();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  
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
    applyFilters,
    applyPendingFilters,
    hasActiveFilters,
  } = useFilters();

  if (loading) return (
    <div className="flex flex-col items-center justify-center mt-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
      <p className="text-gray-600">Loading characters...</p>
    </div>
  );
  
  if (error) return (
    <div className="flex flex-col items-center justify-center mt-8 p-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
        <h3 className="text-red-800 font-semibold mb-2">Connection error</h3>
        <p className="text-red-700 text-sm mb-3">
        Unable to connect to the Rick and Morty API.  
          This may be due to temporary server issues.
        </p>
        <p className="text-red-600 text-xs">
          Technical error: {error.message}
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

  const allCharacters = data?.characters.results || [];
  const nonDeletedCharacters = filterDeletedCharacters(allCharacters);
  const filteredCharacters = applyFilters(nonDeletedCharacters, favorites);
  
  const starredCharacters = filteredCharacters.filter(char => isFavorite(char.id));
  const deletedCharacters = allCharacters.filter(char => isDeleted(char.id));
  const otherCharacters = filteredCharacters.filter(char => !isFavorite(char.id));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold pt-6">Rick and Morty list</h1>

      <SearchField
        value={search}
        onChange={setSearch}
        onFilterClick={() => setIsFiltersOpen(true)}
        isFiltersOpen={isFiltersOpen}
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
        onApplyFilters={applyPendingFilters}
        hasActiveFilters={hasActiveFilters()}
      />

<div className="flex justify-between gap-2 mb-4">
        {hasActiveFilters() && (
          <div className="text-xs font-medium text-blue-600">
            {filteredCharacters.length} Results
          </div>
        )}
        {hasActiveFilters() && (
          <div className="px-2 py-1 rounded-3xl bg-secondary-600 bg-opacity-30 text-green-700 text-xs font-medium">
            {Object.values([characterFilter, statusFilter, speciesFilter, genderFilter]).filter(f => f !== 'all').length} Filter
          </div>
        )}
      </div>

      {starredCharacters.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 mb-4">
            STARRED CHARACTERS ({starredCharacters.length})
          </h2>
          <ul className="list-none p-0">
            {sortedCharacters(starredCharacters, sortOrder).map((character) => (
              <li key={character.id} className="mb-4 border-b border-gray-300 pb-4">
                <div className="flex items-center">
                  <Link 
                    to={`/character/${character.id}`}
                    className="flex items-center flex-grow hover:bg-primary-100 p-2 rounded-lg transition-colors"
                  >
                    <img src={character.image} alt={character.name} width={32} height={32} className="rounded-full mr-4" />
                    <div className="flex-grow">
                      <strong className="block text-sm">{character.name}</strong>
                      <div className="text-gray-500 text-sm">
                        {character.species}
                      </div>
                    </div>
                  <div className="flex items-center gap-2">
                    <HeartButton
                      characterId={character.id}
                      isFavorite={isFavorite(character.id)}
                      onToggle={toggleFavorite}
                    />
                    <DeleteButton
                      characterId={character.id}
                      isDeleted={isDeleted(character.id)}
                      onToggle={toggleDelete}
                    />
                  </div>
                  </Link>
                </div>
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
          <li key={character.id} className="mb-4 border-b border-gray-300 pb-4">
            <div className="flex items-center">
              <Link 
                to={`/character/${character.id}`}
                className="flex items-center flex-grow hover:bg-primary-100 p-2 rounded-lg transition-colors"
              >
                <img src={character.image} alt={character.name} width={32} height={32} className="rounded-full mr-4" />
                <div className="flex-grow">
                  <strong className="block text-sm">{character.name}</strong>
                  <div className="text-gray-500 text-sm">
                    {character.species}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <HeartButton
                    characterId={character.id}
                    isFavorite={isFavorite(character.id)}
                    onToggle={toggleFavorite}
                  />
                  <DeleteButton
                    characterId={character.id}
                    isDeleted={isDeleted(character.id)}
                    onToggle={toggleDelete}
                  />
                </div>
              </Link>
            </div>
          </li>
          ))}
       </ul>

      {deletedCharacters.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-gray-500">
              DELETED CHARACTERS ({deletedCharacters.length})
            </h2>
            <button
              onClick={() => setShowDeleted(!showDeleted)}
              className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              <span className="text-xs font-medium text-gray-500">{showDeleted ? 'Hide' : 'Show'}</span>
              <svg
                className={`w-4 h-4 transition-transform ${showDeleted ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {showDeleted && (
            <ul className="list-none p-0">
              {deletedCharacters.map((character) => (
                <li key={character.id} className="mb-4 border-b border-gray-300 pb-4">
                  <div className="flex items-center">
                    <Link 
                      to={`/character/${character.id}`}
                      className="flex items-center flex-grow hover:bg-primary-100 p-2 rounded-lg transition-colors"
                    >
                      <img src={character.image} alt={character.name} width={32} height={32} className="rounded-full mr-4" />
                      <div className="flex-grow">
                        <strong className="block text-sm">{character.name}</strong>
                        <div className="text-gray-500 text-sm">
                          {character.species}
                        </div>
                      </div>
                        <DeleteButton
                          characterId={character.id}
                          isDeleted={isDeleted(character.id)}
                          onToggle={toggleDelete}
                        />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}