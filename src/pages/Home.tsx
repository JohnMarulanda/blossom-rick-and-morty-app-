import { useState } from 'react'
import { useCharacters, sortedCharacters } from '../hooks/useCharacters';
import { ArrowUpAZ, ArrowDownAZ } from 'lucide-react';

export default function HomePage() {
  const { loading, error, data } = useCharacters();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-center mt-4 text-red-600">Error: {error.message}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Rick and Morty list</h1>
      <h2 className="text-xs font-semibold text-gray-500 mb-4">
        STARRED CHARACTERS ({data?.characters.results.length ?? 0})
      </h2>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold text-gray-500">
          CHARACTERS ({data?.characters.results.length ?? 0})
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
        {sortedCharacters(data?.characters.results || [], sortOrder).map((character) => (
          <li key={character.id} className="flex items-center mb-4 border-b border-gray-300 pb-4">
            <img src={character.image} alt={character.name} width={32} height={32} className="rounded-full mr-4" />
            <div>
              <strong className="block text-sm">{character.name}</strong>
              <div className="text-gray-500 text-sm">
                {character.species} – {character.status} – {character.gender}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}