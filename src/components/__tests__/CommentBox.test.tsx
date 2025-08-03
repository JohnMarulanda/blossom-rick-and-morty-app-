import { render, screen, fireEvent } from '@testing-library/react';
import { CommentBox } from '../CommentBox';
import { useComments } from '../../hooks/useComments';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// 🔧 Mock del hook personalizado para controlar el estado de los comentarios
vi.mock('../../hooks/useComments', () => ({
  useComments: vi.fn()
}));

describe('CommentBox', () => {
  const defaultProps = {
    characterId: '123'
  };

  beforeEach(() => {
    // Limpia cualquier llamada previa a los mocks antes de cada test
    vi.clearAllMocks();
  });

  // Verifica renderizado sin comentarios
  it('renders correctly with empty comments', () => {
    vi.mocked(useComments).mockReturnValue({
      comments: [],
      addComment: vi.fn(),
      deleteComment: vi.fn()
    });

    render(<CommentBox {...defaultProps} />);

    expect(screen.getByText('Comments')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Write a comment')).toBeInTheDocument();
    expect(screen.getByText('No comments yet')).toBeInTheDocument();
  });

  // Verifica renderizado con al menos un comentario
  it('renders existing comments', () => {
    vi.mocked(useComments).mockReturnValue({
      comments: [{
        id: '1',
        text: 'Test comment',
        characterId: '123',
        createdAt: '2024-01-01T12:00:00.000Z'
      }],
      addComment: vi.fn(),
      deleteComment: vi.fn()
    });

    render(<CommentBox {...defaultProps} />);

    expect(screen.getByText(/Test comment/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete comment/i })).toBeInTheDocument();
  });

  // Verifica que agregar comentario llama al callback con el texto correcto
  it('handles new comment submission', () => {
    const mockAddComment = vi.fn();
    vi.mocked(useComments).mockReturnValue({
      comments: [],
      addComment: mockAddComment,
      deleteComment: vi.fn()
    });

    render(<CommentBox {...defaultProps} />);

    const input = screen.getByPlaceholderText('Write a comment');
    fireEvent.change(input, { target: { value: 'New comment' } });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(mockAddComment).toHaveBeenCalledWith('New comment');
  });

  // Verifica eliminación de un comentario existente
  it('handles comment deletion', () => {
    const mockDeleteComment = vi.fn();
    vi.mocked(useComments).mockReturnValue({
      comments: [{
        id: '1',
        text: 'Test comment',
        characterId: '123',
        createdAt: '2024-01-01T12:00:00.000Z'
      }],
      addComment: vi.fn(),
      deleteComment: mockDeleteComment
    });

    render(<CommentBox {...defaultProps} />);

    const deleteButton = screen.getByRole('button', { name: /delete comment/i });
    fireEvent.click(deleteButton);

    expect(mockDeleteComment).toHaveBeenCalledWith('1');
  });

  // Verifica que no se permita enviar comentarios vacíos
  it('prevents submission of empty comments', () => {
    const mockAddComment = vi.fn();
    vi.mocked(useComments).mockReturnValue({
      comments: [],
      addComment: mockAddComment,
      deleteComment: vi.fn()
    });

    render(<CommentBox {...defaultProps} />);

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(mockAddComment).not.toHaveBeenCalled();
  });

  // Verifica el formateo de la fecha en español (dependiendo del locale configurado)
  it('formats date correctly in Spanish locale', () => {
    const testDate = new Date('2024-01-01T12:00:00.000Z');
    vi.mocked(useComments).mockReturnValue({
      comments: [{
        id: '1',
        text: 'Test comment',
        characterId: '123',
        createdAt: testDate.toISOString()
      }],
      addComment: vi.fn(),
      deleteComment: vi.fn()
    });

    render(<CommentBox {...defaultProps} />);

    // Verificamos que se muestre el mes "enero", asumiendo localización a español
    expect(screen.getByText(/enero/i)).toBeInTheDocument();
  });
});
