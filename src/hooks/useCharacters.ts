import { useQuery } from '@apollo/client';
import { GET_CHARACTERS } from '../graphql/queris';

export type Character = {
  id: number;
  image: string;
  name: string;
  status: string;
  species: string;
  gender: string;
};

export const useCharacters = () => {
  const { loading, error, data } = useQuery<{ characters: { results: Character[] } }>(GET_CHARACTERS);
  return { loading, error, data };
};

export const sortedCharacters = (characters: Character[], sort: 'asc' | 'desc') => {
  return [...characters].sort((a, b) => {
    return sort === 'asc'
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });
};

