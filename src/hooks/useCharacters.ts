import { useQuery } from '@apollo/client';
import { GET_CHARACTERS, GET_CHARACTER } from '../graphql/queris';

/**
 * Tipo que define la estructura de un personaje del API de Rick and Morty.
 */
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

/**
 * Hook personalizado que obtiene la lista de personajes mediante una consulta GraphQL.
 * Retorna el estado de carga, posibles errores, y los datos recibidos.
 */
export const useCharacters = () => {
  const { loading, error, data } = useQuery<{ characters: { results: Character[] } }>(GET_CHARACTERS);
  return { loading, error, data };
};

/**
 * Hook personalizado que obtiene un personaje específico por su ID.
 * Si no se proporciona ID, la consulta no se ejecuta (`skip: !id`).
 * Retorna el estado de carga, posibles errores, y los datos del personaje.
 */
export const useCharacter = (id: string) => {
  const { loading, error, data } = useQuery<{ character: Character }>(GET_CHARACTER, {
    variables: { id },
    skip: !id,
  });

  return { loading, error, character: data?.character };
};

/**
 * Función auxiliar que ordena un arreglo de personajes alfabéticamente por nombre.
 * Puede ordenar en orden ascendente ('asc') o descendente ('desc').
 */
export const sortedCharacters = (characters: Character[], sort: 'asc' | 'desc') => {
  return [...characters].sort((a, b) => {
    return sort === 'asc'
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });
};
