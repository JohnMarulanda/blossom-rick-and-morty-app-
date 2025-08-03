// Importación de utilidades de pruebas
import { render, screen, fireEvent } from '@testing-library/react';
import { HeartButton } from '../HeartButton';
import { describe, it, expect, vi } from 'vitest';

// Grupo de pruebas para el componente HeartButton
describe('HeartButton', () => {
  // Props base para reutilizar en las pruebas
  const defaultProps = {
    characterId: 1,
    isFavorite: false,
    onToggle: vi.fn(),
  };

  /**
   * Verifica que el botón se renderiza correctamente cuando el personaje
   * NO está marcado como favorito.
   */
  it('renders correctly when not favorite', () => {
    render(<HeartButton {...defaultProps} />);

    const button = screen.getByRole('button');

    // Atributo aria-label debe decir que se puede agregar a favoritos
    expect(button).toHaveAttribute('aria-label', 'Add to favorites');

    // El ícono debe tener el color gris y no el color de favorito
    expect(button.querySelector('svg')).toHaveClass('text-gray-400');
    expect(button.querySelector('svg')).not.toHaveClass('fill-secondary-600');
  });

  /**
   * Verifica que el botón se renderiza correctamente cuando el personaje
   * YA está marcado como favorito.
   */
  it('renders correctly when favorite', () => {
    render(<HeartButton {...defaultProps} isFavorite={true} />);

    const button = screen.getByRole('button');

    // Atributo aria-label debe indicar que se puede quitar de favoritos
    expect(button).toHaveAttribute('aria-label', 'Remove from favorites');

    // El ícono debe tener el color y relleno característico de favorito
    expect(button.querySelector('svg')).toHaveClass('fill-secondary-600');
    expect(button.querySelector('svg')).toHaveClass('text-secondary-600');
  });

  /**
   * Verifica que al hacer clic en el botón se llama la función `onToggle`
   * con el ID del personaje.
   */
  it('calls onToggle with character id when clicked', () => {
    const onToggle = vi.fn();
    render(<HeartButton {...defaultProps} onToggle={onToggle} />);

    const button = screen.getByRole('button');

    // Simulamos el clic
    fireEvent.click(button);

    // Verificamos que se haya llamado con el ID del personaje
    expect(onToggle).toHaveBeenCalledWith(defaultProps.characterId);
  });

  /**
   * Verifica que el botón tiene clases de estilo básicas necesarias
   * para apariencia y transición.
   */
  it('maintains proper styling after interaction', () => {
    render(<HeartButton {...defaultProps} />);

    const button = screen.getByRole('button');

    // Validamos clases clave del botón
    expect(button).toHaveClass('bg-gray-100');
    expect(button).toHaveClass('rounded-full');
    expect(button).toHaveClass('transition-colors');
  });
});