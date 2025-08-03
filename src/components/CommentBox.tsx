import { useState } from 'react';
import { Trash2, MessageCircleMore, Send } from 'lucide-react';
import { useComments } from '../hooks/useComments';

type CommentBoxProps = {
  characterId: string; // ID del personaje al que se asociarán los comentarios
};

/**
 * Componente que muestra una caja de comentarios interactiva.
 * Permite agregar, listar y eliminar comentarios relacionados con un personaje.
 */
export function CommentBox({ characterId }: CommentBoxProps) {
  const [newComment, setNewComment] = useState(''); // Comentario que el usuario está escribiendo
  const [error, setError] = useState('');           // Mensaje de error al agregar comentario
  const { comments, addComment, deleteComment } = useComments(characterId); // Hook personalizado

  // Maneja el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        addComment(newComment.trim()); // Intenta agregar comentario
        setNewComment('');
        setError('');
      } catch (err) {
        // Si hay error (ej. excede el límite de caracteres), lo muestra
        setError(err instanceof Error ? err.message : 'Error al agregar comentario');
      }
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-base font-semibold mb-4">Comments</h2>

      {/* Formulario de entrada de comentario */}
      <form onSubmit={handleSubmit} className="mb-6" role="form">
        <div className="flex gap-2 relative">
          <MessageCircleMore className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment"
            className="flex-1 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-600"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </form>

      {/* Mensaje de error si existe */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Lista de comentarios */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="text-gray-900">{comment.text}</p>
                <button
                  onClick={() => deleteComment(comment.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete comment"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="text-xs text-gray-500">
                {/* Fecha formateada */}
                {new Date(comment.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}