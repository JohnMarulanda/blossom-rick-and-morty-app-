import React from 'react'
import { useQuery } from '@apollo/client';
import { GET_CHARACTERS } from '../graphql/queris';

type Character = {
  id: number
  image: string
  name: string
  status: string
  species: string
  gender: string
}

export default function HomePage() {
  const { loading, error, data } = useQuery<{ characters: { results: Character[] } }>(GET_CHARACTERS);

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-center mt-4 text-red-600">Error: {error.message}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Rick and Morty list</h1>
      <h2 className="text-xs font-semibold text-gray-500 mb-4">
        STARRED CHARACTERS ({data?.characters.results.length ?? 0})
      </h2>
      <h2 className="text-xs font-semibold text-gray-500 mb-4">
        CHARACTERS ({data?.characters.results.length ?? 0})
      </h2>
      <ul className="list-none p-0">
        {data?.characters.results.map((character) => (
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