// Importamos herramientas de prueba
import { render, screen, fireEvent } from '@testing-library/react';
import { DeleteButton } from '../DeleteButton';
import { describe, it, expect, vi } from 'vitest';

// Agrupamos las pruebas bajo el nombre del componente
describe('DeleteButton', () => {
  // Props base reutilizables
  const defaultProps = {
    characterId: 1,
    isDeleted: false,
    onToggle: vi.fn()
  };

  // Verifica que se renderiza correctamente cuando el personaje NO está eliminado
  it('renders correctly in non-deleted state', () => {
    render(<DeleteButton {...defaultProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Delete character');
    expect(button).toHaveClass('text-gray-400'); // estilo apagado típico del botón neutral
  });

  // Verifica que se renderiza correctamente cuando el personaje SÍ está eliminado
  it('renders correctly in deleted state', () => {
    render(<DeleteButton {...defaultProps} isDeleted={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Restore character');
    expect(button).toHaveClass('text-primary-600'); // estilo llamativo para acción inversa
  });

  // Verifica que al hacer clic en el botón, se muestra el diálogo de confirmación al intentar eliminar
  it('shows confirmation dialog when clicking delete', () => {
    render(<DeleteButton {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(screen.getByText('Are you sure you want to delete this character?')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  // Verifica que al hacer clic en "Cancel" en el diálogo de confirmación, no se llama onToggle y el modal desaparece
  it('handles cancel in confirmation dialog', () => {
    const onToggle = vi.fn();
    render(<DeleteButton {...defaultProps} onToggle={onToggle} />);
    
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Cancel'));
    
    expect(onToggle).not.toHaveBeenCalled();
    expect(screen.queryByText('Are you sure you want to delete this character?')).not.toBeInTheDocument();
  });

  // Si se confirma la eliminación, se llama onToggle y se cierra el modal
  it('handles confirm in confirmation dialog', () => {
    const onToggle = vi.fn();
    render(<DeleteButton {...defaultProps} onToggle={onToggle} />);
    
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Delete'));
    
    expect(onToggle).toHaveBeenCalledWith(defaultProps.characterId);
    expect(screen.queryByText('Are you sure you want to delete this character?')).not.toBeInTheDocument();
  });

  // Si el personaje ya está eliminado, restaurarlo no requiere confirmación
  it('restores character without confirmation when deleted', () => {
    const onToggle = vi.fn();
    render(<DeleteButton {...defaultProps} isDeleted={true} onToggle={onToggle} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(onToggle).toHaveBeenCalledWith(defaultProps.characterId);
    expect(screen.queryByText('Are you sure you want to delete this character?')).not.toBeInTheDocument();
  });
});
