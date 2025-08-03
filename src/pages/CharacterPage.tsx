import { useParams, useNavigate } from 'react-router-dom';
import { useCharacter } from '../hooks/useCharacters';
import { useFavorites } from '../hooks/useFavorites';
import { HeartButton } from '../components/HeartButton';
import { CommentBox } from '../components/CommentBox';
import { ArrowLeft } from 'lucide-react';

// Componente principal que muestra los detalles de un personaje
export default function CharacterPage() {
  // Obtiene el ID del personaje desde los parámetros de la URL
  const { id } = useParams<{ id: string }>();

  // Hook personalizado que obtiene los datos del personaje desde la API
  const { loading, error, character } = useCharacter(id || '');

  // Hook para gestionar favoritos (agregar/quitar)
  const { toggleFavorite, isFavorite } = useFavorites();

  // Hook para redirigir entre páginas
  const navigate = useNavigate();
  
  // Navega de vuelta a la página principal
  const handleGoBack = () => {
    navigate('/');
  };

  // Renderiza un estado de carga mientras se obtienen los datos
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading character...</p>
        </div>
      </div>
    );
  }

  // Renderiza un mensaje de error si falla la petición o el personaje no existe
  if (error || !character) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-red-800 font-semibold mb-2">Connection error</h3>
          <p className="text-red-700 text-sm mb-3">
            Unable to connect to Rick and Morty API to load character details
          </p>
          <p className="text-red-600 text-xs mb-4">
            Error technical: {error?.message || 'Character not found'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
          >
            Retry connection
          </button>
        </div>
      </div>
    );
  }

  // Renderiza los detalles del personaje
  return (
    <div className="px-4 md:px-24 relative">  
      {/* Botón para volver atrás (visible solo en dispositivos móviles) */}
      <button 
        onClick={handleGoBack}
        className="absolute top-4 left-4 p-2 rounded-full text-primary-600 hover:bg-primary-200 transition-colors md:hidden z-10 mb-2"
        aria-label="Volver a la lista de personajes"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Encabezado con imagen del personaje y botón de favorito */}
      <div className="flex flex-col items-start pb-4 pt-10">
        <div className="relative mb-3">
          <img
            src={character.image}
            alt={character.name}
            className="w-20 h-20 rounded-full object-cover shadow-lg"
          />
          <div className="absolute -bottom-1 -right-1">
            {/* Botón para agregar o quitar de favoritos */}
            <HeartButton
              characterId={character.id}
              isFavorite={isFavorite(character.id)}
              onToggle={toggleFavorite}
            />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{character.name}</h1>
      </div>

      {/* Información detallada del personaje */}
      <div className="bg-white rounded-lg mb-6">
        <div className="space-y-4">
          <div className="border-b border-gray-300 py-2">
            <dt className="text-sm font-medium text-gray-900 mb-1">Species</dt>
            <dd className="text-gray-500">{character.species}</dd>
          </div>
          <div className="border-b border-gray-300 py-2">
            <dt className="text-sm font-medium text-gray-900 mb-1">Status</dt>
            <dd className="text-gray-500">{character.status}</dd>
          </div>
          <div className="border-b border-gray-300 py-2">
            <dt className="text-sm font-medium text-gray-900 mb-1">Gender</dt>
            <dd className="text-gray-500">{character.gender}</dd>
          </div>
          <div className="border-b border-gray-300 py-2">
            <dt className="text-sm font-medium text-gray-900 mb-1">Origin</dt>
            <dd className="text-gray-500">{character.origin?.name || 'Unknown'}</dd>
          </div>
          <div className="border-b border-gray-300 py-2">
            <dt className="text-sm font-medium text-gray-900 mb-1">Location</dt>
            <dd className="text-gray-500">{character.location?.name || 'Unknown'}</dd>
          </div>
        </div>
      </div>

      {/* Sección para comentarios sobre el personaje */}
      <CommentBox characterId={id || ''} />
    </div>
  );
}