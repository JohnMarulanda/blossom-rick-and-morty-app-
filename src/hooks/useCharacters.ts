import { useQuery } from '@apollo/client';
import { GET_CHARACTERS, GET_CHARACTER } from '../graphql/queris';

export type Character = {
  id: number;
  image: string;
  name: string;
  status: string;
  species: string;
  gender: string;
  origin?: {
    name: string;
  };
  location?: {
    name: string;
  };
  episode?: {
    id: string;
    name: string;
    episode: string;
  }[];
};

export const useCharacters = () => {
  const { loading, error, data } = useQuery<{ characters: { results: Character[] } }>(GET_CHARACTERS);
  return { loading, error, data };
};

export const useCharacter = (id: string) => {
  const { loading, error, data } = useQuery<{ character: Character }>(GET_CHARACTER, {
    variables: { id },
    skip: !id,
  });
  
  return { loading, error, character: data?.character };
};

export const sortedCharacters = (characters: Character[], sort: 'asc' | 'desc') => {
  return [...characters].sort((a, b) => {
    return sort === 'asc'
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });
};

