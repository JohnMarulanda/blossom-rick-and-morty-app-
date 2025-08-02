import { gql } from '@apollo/client';

export const GET_CHARACTERS = gql`
  query GetCharacters {
    characters {
      results {
        id
        image
        name
        status
        species
        gender
      }
    }
  }
`;

export const GET_CHARACTER = gql`
  query GetCharacter($id: ID!) {
    character(id: $id) {
      id
      image
      name
      status
      species
      gender
      origin {
        name
      }
      location {
        name
      }
      episode {
        id
        name
        episode
      }
    }
  }
`;
