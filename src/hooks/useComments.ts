import { useState, useEffect } from 'react';

// Tipo de datos para un comentario individual
type Comment = {
  id: string;          // ID único del comentario (UUID)
  text: string;        // Texto del comentario
  characterId: string; // ID del personaje al que pertenece el comentario
  createdAt: string;   // Fecha de creación (ISO string)
};

// Clave usada para guardar los comentarios en localStorage
const COMMENTS_KEY = 'rickAndMorty_comments';

/**
 * Hook personalizado para gestionar comentarios asociados a un personaje.
 * 
 * @param characterId ID del personaje sobre el que se están gestionando comentarios
 * @returns Funciones y datos relacionados con los comentarios del personaje
 */
export const useComments = (characterId: string) => {
  // Estado global de todos los comentarios almacenados
  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem(COMMENTS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // Sincroniza el estado con localStorage cada vez que cambia la lista de comentarios
  useEffect(() => {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
  }, [comments]);

  /**
   * Agrega un nuevo comentario asociado al personaje.
   * El texto se sanitiza para prevenir XSS básico.
   * 
   * @param text Contenido del comentario
   * @throws Error si el comentario excede los 500 caracteres
   */
  const addComment = (text: string) => {
    const MAX_COMMENT_LENGTH = 500;

    if (text.length > MAX_COMMENT_LENGTH) {
      throw new Error(`El comentario no puede exceder ${MAX_COMMENT_LENGTH} caracteres`);
    }

    // Sanitización básica contra inyecciones de HTML (XSS)
    const sanitizedText = text
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');

    const newComment: Comment = {
      id: crypto.randomUUID(),
      text: sanitizedText,
      characterId,
      createdAt: new Date().toISOString()
    };

    setComments(prev => [...prev, newComment]);
  };

  /**
   * Elimina un comentario por su ID.
   * 
   * @param commentId ID del comentario a eliminar
   */
  const deleteComment = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  /**
   * Obtiene los comentarios del personaje actual ordenados por fecha (más recientes primero).
   */
  const getCharacterComments = () => {
    return comments
      .filter(comment => comment.characterId === characterId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  // Devuelve solo los comentarios del personaje actual y funciones asociadas
  return {
    comments: getCharacterComments(), // Lista de comentarios del personaje
    addComment,                       // Función para agregar uno nuevo
    deleteComment                     // Función para eliminar comentarios
  };
};