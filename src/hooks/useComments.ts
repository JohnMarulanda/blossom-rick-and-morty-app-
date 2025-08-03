import { useState, useEffect } from 'react';

type Comment = {
  id: string;
  text: string;
  characterId: string;
  createdAt: string;
};

const COMMENTS_KEY = 'rickAndMorty_comments';

export const useComments = (characterId: string) => {
  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem(COMMENTS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
  }, [comments]);

  const addComment = (text: string) => {
    const MAX_COMMENT_LENGTH = 500;
    if (text.length > MAX_COMMENT_LENGTH) {
      throw new Error(`El comentario no puede exceder ${MAX_COMMENT_LENGTH} caracteres`);
    }
    
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

  const deleteComment = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  const getCharacterComments = () => {
    return comments.filter(comment => comment.characterId === characterId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  return {
    comments: getCharacterComments(),
    addComment,
    deleteComment
  };
};