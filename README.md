Blossom - Rick and Morty App
Una aplicación React que consume la API GraphQL de Rick and Morty, permitiendo explorar personajes con funcionalidades avanzadas de búsqueda, filtrado y gestión de favoritos.

👉 Puedes visitar la página en: https://rickmortylist.vercel.app/

## 🚀 Características

- **Exploración de personajes**: Lista completa de personajes de Rick and Morty
- **Detalles individuales**: Información detallada de cada personaje
- **Sistema de favoritos**: Marca tus personajes favoritos con 💚
- **Filtros avanzados**: Filtra por estado, especie, género y nombre
- **Búsqueda inteligente**: Búsqueda en tiempo real
- **Soft delete**: Oculta personajes sin eliminarlos permanentemente
- **Ordenamiento**: Ordena alfabéticamente (A-Z / Z-A)
- **Comentarios**: Añade comentarios a diferentes personajes
- **Diseño responsivo**: Interfaz optimizada para todos los dispositivos

## 🛠️ Tecnologías

- **React 19** con TypeScript
- **Vite** para desarrollo rápido y build optimizado
- **Apollo Client** para gestión de **GraphQL**
- **React Router Dom** para navegación
- **TailwindCSS** para estilos
- **Lucide React** para iconos
- **Vitest** para testing

## 📋 Requisitos Previos

- Node.js 18.0 o superior
- npm o yarn

## ⚡ Instalación y Ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/JohnMarulanda/blossom-rick-and-morty-app-.git
cd blossom-rick-and-morty-app
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar en modo desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 4. Otros comandos disponibles

```bash
# Construcción para producción
npm run build

# Vista previa de la build
npm run preview

# Ejecutar linter
npm run lint

# Ejecutar tests
npm run test

# Ejecutar tests con coverage
npm run test:coverage
```

## 🌐 API, Datos y Configuración

La aplicación consume la **Rick and Morty GraphQL API** oficial:
- **Endpoint**: `https://rickandmortyapi.com/graphql`
- **Documentación GraphQL**: [rickandmortyapiGraphQL](https://rickandmortyapi.com/documentation/#graphql)
- **Documentación API**: [rickandmortyapi.com](https://rickandmortyapi.com/documentation)


### 1. Configuración de Apollo (`src/lib/apollo.t`)
```typescript
export const client = new ApolloClient({
  uri: 'https://rickandmortyapi.com/graphql',
  cache: new InMemoryCache(),
});
```


#### 2. Provider en la aplicación (`src/main.tsx`)
```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client';
import { client } from './lib/apollo.ts';
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)
```

### 📝 Queries GraphQL Utilizadas

#### 1. Obtener todos los personajes (`GET_CHARACTERS`)
```graphql
query GetCharacters {
  characters {
    results {
      id          # ID único del personaje
      image       # URL de la imagen del personaje
      name        # Nombre del personaje
      status      # Estado: "Alive", "Dead", "unknown"
      species     # Especie del personaje
      gender      # Género: "Male", "Female", "Genderless", "unknown"
    }
  }
}
```

**Respuesta esperada:**
```json
{
  "data": {
    "characters": {
      "results": [
        {
          "id": "1",
          "image": "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
          "name": "Rick Sanchez",
          "status": "Alive",
          "species": "Human",
          "gender": "Male"
        }
        // ... más personajes
      ]
    }
  }
}
```

#### 2. Obtener un personaje específico (`GET_CHARACTER`)
```graphql
query GetCharacter($id: ID!) {
  character(id: $id) {
    id
    image
    name
    status
    species
    gender
    origin {
      name        # Planeta/dimensión de origen
    }
    location {
      name        # Ubicación actual
    }
    episode {
      id          # ID del episodio
      name        # Nombre del episodio
      episode     # Código del episodio (ej: "S01E01")
    }
  }
}
```

**Variables requeridas:**
```typescript
{
  "id": "1" // ID del personaje como string
}
```

### 🔧 Implementación con Custom Hooks

#### Definición de tipos (`src/hooks/useCharacters.ts`)
```typescript
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
```

#### Hook para obtener todos los personajes
```typescript
export const useCharacters = () => {
  const { loading, error, data } = useQuery<{ 
    characters: { results: Character[] } 
  }>(GET_CHARACTERS);
  
  return { loading, error, data };
};
```

#### Hook para obtener un personaje específico
```typescript
export const useCharacter = (id: string) => {
  const { loading, error, data } = useQuery<{ 
    character: Character 
  }>(GET_CHARACTER, {
    variables: { id },
    skip: !id, // No ejecutar si no hay ID
  });
  
  return { loading, error, character: data?.character };
};
```

### 🎯 Uso Práctico en Componentes

#### Ejemplo: Lista de personajes (`src/pages/Home.tsx`)
```typescript
import { useCharacters } from '../hooks/useCharacters';

export default function HomePage() {
  const { loading, error, data } = useCharacters();

  // Manejo del estado de carga
  if (loading) return (
    <div className="flex flex-col items-center justify-center mt-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
      <p className="text-gray-600">Loading characters...</p>
    </div>
  );

  // Manejo de errores
  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <h3 className="text-red-800 font-semibold">Connection error</h3>
      <p className="text-red-700 text-sm">
        Unable to connect to the Rick and Morty API: {error.message}
      </p>
      <button onClick={() => window.location.reload()}>
        Retry
      </button>
    </div>
  );

  // Uso de los datos
  const characters = data?.characters.results || [];
  
  return (
    <div>
      {characters.map((character) => (
        <div key={character.id}>
          <img src={character.image} alt={character.name} />
          <h3>{character.name}</h3>
          <p>{character.species} - {character.status}</p>
        </div>
      ))}
    </div>
  );
}
```

#### Ejemplo: Detalle de personaje (`src/pages/CharacterPage.tsx`)
```typescript
import { useParams } from 'react-router-dom';
import { useCharacter } from '../hooks/useCharacters';

export default function CharacterPage() {
  const { id } = useParams<{ id: string }>();
  const { loading, error, character } = useCharacter(id || '');

  if (loading) return <div>Loading character...</div>;
  if (error || !character) return <div>Error: {error?.message}</div>;

  return (
    <div>
      <img src={character.image} alt={character.name} />
      <h1>{character.name}</h1>
      <p>Species: {character.species}</p>
      <p>Status: {character.status}</p>
      <p>Origin: {character.origin?.name}</p>
      <p>Location: {character.location?.name}</p>
      
      <h3>Episodes:</h3>
      <ul>
        {character.episode?.map((ep) => (
          <li key={ep.id}>
            {ep.episode} - {ep.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 🔄 Estados de la API

La aplicación maneja tres estados principales para cada consulta:

#### 1. **Loading State**
```typescript
if (loading) {
  return <div className="animate-spin rounded-full h-8 w-8 border-b-2"></div>;
}
```

#### 2. **Error State**
```typescript
if (error) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <h3>Error: {error.message}</h3>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );
}
```

#### 3. **Success State**
```typescript
// Los datos están disponibles en data
const characters = data?.characters.results || [];
```

### 📈 Estructura del esquema GraphQL
```graphql
type Character {
  id: ID!
  name: String!
  status: String! # "Alive" | "Dead" | "unknown"
  species: String!
  type: String!
  gender: String! # "Female" | "Male" | "Genderless" | "unknown"
  origin: Location!
  location: Location!
  image: String!
  episode: [Episode]!
  created: String!
}
```


### 🔗 Flujo Completo de Implementación

1. **ApolloProvider**: Se configura en `src/main.tsx` envolviendo toda la aplicación
2. **Queries**: Se definen en `src/graphql/queris.ts` usando la sintaxis gql
3. **Custom Hooks**: Se crean en `src/hooks/` para encapsular la lógica de datos
4. **Componentes**: Utilizan los hooks para obtener y mostrar datos
5. **Estados**: Loading, error y success se manejan de forma consistente

## 🎯 Funcionalidades de la Aplicación

### Navegación
- **Página Principal (`/`)**: Lista de todos los personajes
- **Página de Personaje (`/character/:id`)**: Detalles de un personaje específico

### Gestión de Personajes

#### Favoritos 💚
- Marca personajes como favoritos haciendo clic en el ícono de corazón
- Los favoritos aparecen en una sección separada al inicio de la lista
- Se mantienen en `localStorage` para persistencia

#### Filtros Avanzados 🔍
- **Por nombre**: Búsqueda en tiempo real
- **Por estado**: Alive, Dead, Unknown
- **Por especie**: Human, Alien, etc.
- **Por género**: Male, Female, Genderless, Unknown

#### Soft Delete 🗑️
- Oculta personajes sin eliminarlos permanentemente
- Sección colapsible para ver personajes "eliminados"
- Posibilidad de restaurar personajes eliminados

#### Ordenamiento 📊
- Orden alfabético ascendente (A-Z)
- Orden alfabético descendente (Z-A)

### Comentarios 💬
- Campo de texto en la página de cada personaje
- Lista de todos los comentarios ordenados por fecha
- Eliminar comentarios comentario

### Estados de la Aplicación

#### Loading
```tsx
// Indicador de carga con spinner
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
```

#### Error
- Manejo de errores de conexión a la API
- Botón de reintento automático
- Mensajes informativos para el usuario

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── CommentBox.tsx
│   ├── DeleteButton.tsx
│   ├── FiltersBar.tsx
│   ├── HeartButton.tsx
│   ├── SearchField.tsx
│   └── tests/           # Test de los Componentes reutilizables
│       ├── CommentBox.test.tsx
│       ├── DeleteButton.test.tsx
│       ├── FiltersBar.test.tsx
│       ├── HeartButton.test.tsx
│       ├── SearchField.test.tsx
├── hooks/              # Custom hooks
│   ├── useCharacters.ts
│   ├── useComments.ts
│   ├── useFavorites.ts
│   ├── useFilters.ts
│   └── useSoftDelete.ts
├── pages/              # Páginas principales
│   ├── CharacterPage.tsx
│   ├── DefaultCharacterView.tsx
│   └── Home.tsx
├── layouts/            # Layouts de página
│   ├── MainLayout.tsx
│   └── tests/
│       └── MainLayout.test.tsx # Test del Layout de página
├── graphql/            # Queries GraphQL
│   └── queris.ts
├── lib/                # Configuraciones
│   └── apollo.ts
└── test/              # Definicion de testing
    └── setup.ts
```

## 🧪 Testing

La aplicación incluye tests unitarios con **Vitest** y **Testing Library**:

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests en modo watch
npm run test -- --watch
```

### Componentes con Tests
- `CommentBox.test.tsx`
- `DeleteButton.test.tsx`
- `FiltersBar.test.tsx`
- `HeartButton.test.tsx`
- `SearchField.test.tsx`
- `MainLayout.test.tsx`

## 📱 Uso de la Aplicación

### 1. Lista de Personajes
- Al abrir la aplicación, verás todos los personajes de Rick and Morty
- Los personajes favoritos aparecen en la sección "STARRED CHARACTERS"
- El resto aparece en la sección "CHARACTERS"

### 2. Búsqueda y Filtros
- Usa la barra de búsqueda para encontrar personajes por nombre
- Haz clic en el ícono de filtro para acceder a filtros avanzados
- Aplica múltiples filtros simultáneamente

### 3. Interacciones
- **❤️ Favorito**: Haz clic para agregar/quitar de favoritos
- **🗑️ Eliminar**: Oculta el personaje (soft delete)
- **🔗 Ver detalles**: Haz clic en el personaje para ver información completa
- **💬 Comentarios**: Campo de texto en la página de cada personaje

### 4. Detalles del Personaje
- Información completa: origen, ubicación, episodios
- Navegación de regreso a la lista principal

## 🎨 Personalización

### Colores y Estilos
El proyecto usa **TailwindCSS** con colores personalizados:
- `primary-*`: Colores principales de la marca
- `secondary-*`: Colores secundarios



## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [Rick and Morty API](https://rickandmortyapi.com/) por proporcionar la API GraphQL
- [Blossom](https://www.blossom.net/) por la oportunidad de seguir creciendo


# ✅ Checklist de Evaluación - Frontend Developer (Rick & Morty App)

## 🔹 Tecnologías obligatorias

| Tecnología           | Requisito                         | Cumplido |
|----------------------|------------------------------------|----------|
| React 18             | Uso de React 18                    | ✅       |
| GraphQL              | Uso de la API GraphQL              | ✅       |
| React Router DOM     | Navegación entre vistas            | ✅       |
| TailwindCSS          | Estilizado con TailwindCSS         | ✅       |

---

## 🔹 Requisitos funcionales

| Funcionalidad                               | Descripción                                                             | Cumplido |
|---------------------------------------------|-------------------------------------------------------------------------|----------|
| Listado de personajes                       | Tarjetas con nombre, imagen y especie                                   | ✅       |
| Responsive                                   | Uso correcto de position, flex y grid                                   | ✅       |
| Ordenamiento A-Z / Z-A                      | Ordenar personajes por nombre                                           | ✅       |
| Detalles por personaje                      | Página individual con detalles usando React Router                      | ✅       |
| Favoritos                                   | Marcar personajes como favoritos                                        | ✅       |
| Comentarios                                 | Agregar comentarios a cada personaje                                    | ✅       |
| Apariencia visual / Usabilidad              | Diseño siguiendo mockups, coherente y usable                            | ✅       |

---

## 🔹 Requisitos opcionales (bonus)

| Funcionalidad opcional                      | Descripción                                                             | Cumplido |
|---------------------------------------------|-------------------------------------------------------------------------|----------|
| TypeScript                                  | Proyecto desarrollado con TypeScript                                    | ✅       |
| Soft delete                                 | Posibilidad de eliminar personajes de forma lógica (no permanente)      | ✅       |
| Búsqueda por estado                         | Filtro por estado (`Alive`, `Dead`, `Unknown`)                          | ✅       |
| Búsqueda por especie                        | Filtro por especie                                                      | ✅       |
| Búsqueda por género                         | Filtro por género                                                       | ✅       |
| Tests unitarios (mínimo 3)                  | Al menos 3 componentes o layouts con pruebas unitarias                  | ✅       |

---

## 🔹 Entregables

| Entregable                                  | Descripción                                                             | Cumplido |
|---------------------------------------------|-------------------------------------------------------------------------|----------|
| Repositorio público                         | Código fuente en GitHub                                                 | ✅       |
| README o Wiki                               | Instrucciones de ejecución y uso de la API                              | ✅       |

---

## 🔹 Criterios de evaluación

| Criterio                                     | Descripción                                                             | Cumplido |
|---------------------------------------------|-------------------------------------------------------------------------|----------|
| Cumplimiento general                        | Se cumplen los requisitos principales                                   | ✅       |
| Uso correcto de tecnologías                 | React 18, GraphQL, Router, TailwindCSS                                  | ✅       |
| Usabilidad y diseño                         | Aplicación usable y atractiva                                           | ✅       |
| Manejo de Git                               | Commits limpios, ramas, mensajes claros                                 | ✅       |
| Calidad de código                           | Legibilidad, estructura, reutilización                                  | ✅       |
| Calidad de estilos                          | Tailwind bien aplicado, componentes reutilizables, consistencia visual  | ✅       |

