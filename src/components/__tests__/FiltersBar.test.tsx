import { render, screen, fireEvent } from '@testing-library/react';
import { FiltersBar } from '../FiltersBar';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('FiltersBar', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    characterFilter: 'all',
    setCharacterFilter: vi.fn(),
    speciesFilter: 'all',
    setSpeciesFilter: vi.fn(),
    statusFilter: 'all',
    setStatusFilter: vi.fn(),
    genderFilter: 'all',
    setGenderFilter: vi.fn(),
    onApplyFilters: vi.fn(),
    hasActiveFilters: false
  };

  beforeEach(() => {
    // Mock window.innerWidth para pruebas de responsive
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024 // Desktop por defecto
    });
  });

  it('does not render when closed', () => {
    render(<FiltersBar {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Filters')).not.toBeInTheDocument();
  });

  it('renders all filter sections when open', () => {
    render(<FiltersBar {...defaultProps} />);
    
    expect(screen.getByText('Character')).toBeInTheDocument();
    expect(screen.getByText('Specie')).toBeInTheDocument();
    expect(screen.getByText('State')).toBeInTheDocument();
    expect(screen.getByText('Gender')).toBeInTheDocument();
  });

  it('handles character filter selection', () => {
    const setCharacterFilter = vi.fn();
    render(<FiltersBar {...defaultProps} setCharacterFilter={setCharacterFilter} />);
    
    fireEvent.click(screen.getByText('Starred'));
    expect(setCharacterFilter).toHaveBeenCalledWith('starred');
  });

  it('handles species filter selection', () => {
    const setSpeciesFilter = vi.fn();
    render(<FiltersBar {...defaultProps} setSpeciesFilter={setSpeciesFilter} />);
    
    fireEvent.click(screen.getByText('Human'));
    expect(setSpeciesFilter).toHaveBeenCalledWith('Human');
  });

  it('handles status filter selection', () => {
    const setStatusFilter = vi.fn();
    render(<FiltersBar {...defaultProps} setStatusFilter={setStatusFilter} />);
    
    fireEvent.click(screen.getByText('Alive'));
    expect(setStatusFilter).toHaveBeenCalledWith('Alive');
  });

  it('handles gender filter selection', () => {
    const setGenderFilter = vi.fn();
    render(<FiltersBar {...defaultProps} setGenderFilter={setGenderFilter} />);
    
    fireEvent.click(screen.getByText('Male'));
    expect(setGenderFilter).toHaveBeenCalledWith('Male');
  });

  it('applies filters and closes on filter button click', () => {
    const onApplyFilters = vi.fn();
    const onClose = vi.fn();
    render(<FiltersBar {...defaultProps} onApplyFilters={onApplyFilters} onClose={onClose} />);
    
    fireEvent.click(screen.getByText('Filter'));
    
    expect(onApplyFilters).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('shows mobile layout on small screens', () => {
    // Simular pantalla móvil
    Object.defineProperty(window, 'innerWidth', {
      value: 375
    });

    render(<FiltersBar {...defaultProps} />);
    
    // Verificar elementos específicos del diseño móvil
    expect(screen.getByRole('button', { name: /volver a la lista de personajes/i })).toBeInTheDocument();
  });

  it('shows desktop layout on large screens', () => {
    // Simular pantalla de escritorio
    Object.defineProperty(window, 'innerWidth', {
      value: 1024
    });

    render(<FiltersBar {...defaultProps} />);
    
    // El botón de cerrar no tiene texto, buscamos por su ícono
    const closeButton = document.querySelector('button.absolute.right-4');
    expect(closeButton).toBeInTheDocument();
  });

  it('highlights active filters', () => {
    render(
      <FiltersBar
        {...defaultProps}
        characterFilter="starred"
        speciesFilter="Human"
        hasActiveFilters={true}
      />
    );
    
    const starredButton = screen.getByText('Starred');
    const humanButton = screen.getByText('Human');
    
    expect(starredButton.closest('button')).toHaveClass('bg-primary-100');
    expect(humanButton.closest('button')).toHaveClass('bg-primary-100');
  });
});