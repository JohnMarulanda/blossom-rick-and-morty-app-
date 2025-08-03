// Importaciones necesarias para testing
import { render, screen, fireEvent } from '@testing-library/react';
import { FiltersBar } from '../FiltersBar';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Grupo de pruebas para el componente FiltersBar
describe('FiltersBar', () => {
  // Props base reutilizables
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
    // Simula el tamaño de pantalla de escritorio antes de cada test
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024
    });
  });

  // Verifica que no se renderiza cuando está cerrado
  it('does not render when closed', () => {
    render(<FiltersBar {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Filters')).not.toBeInTheDocument();
  });

  // Renderiza correctamente todas las secciones de filtro
  it('renders all filter sections when open', () => {
    render(<FiltersBar {...defaultProps} />);
    expect(screen.getByText('Character')).toBeInTheDocument();
    expect(screen.getByText('Specie')).toBeInTheDocument();
    expect(screen.getByText('State')).toBeInTheDocument();
    expect(screen.getByText('Gender')).toBeInTheDocument();
  });

  // Cambia el filtro de personaje correctamente
  it('handles character filter selection', () => {
    const setCharacterFilter = vi.fn();
    render(<FiltersBar {...defaultProps} setCharacterFilter={setCharacterFilter} />);
    fireEvent.click(screen.getByText('Starred'));
    expect(setCharacterFilter).toHaveBeenCalledWith('starred');
  });

  // Cambia el filtro de especie correctamente
  it('handles species filter selection', () => {
    const setSpeciesFilter = vi.fn();
    render(<FiltersBar {...defaultProps} setSpeciesFilter={setSpeciesFilter} />);
    fireEvent.click(screen.getByText('Human'));
    expect(setSpeciesFilter).toHaveBeenCalledWith('Human');
  });

  // Cambia el filtro de estado correctamente
  it('handles status filter selection', () => {
    const setStatusFilter = vi.fn();
    render(<FiltersBar {...defaultProps} setStatusFilter={setStatusFilter} />);
    fireEvent.click(screen.getByText('Alive'));
    expect(setStatusFilter).toHaveBeenCalledWith('Alive');
  });

  // Cambia el filtro de género correctamente
  it('handles gender filter selection', () => {
    const setGenderFilter = vi.fn();
    render(<FiltersBar {...defaultProps} setGenderFilter={setGenderFilter} />);
    fireEvent.click(screen.getByText('Male'));
    expect(setGenderFilter).toHaveBeenCalledWith('Male');
  });

  // Aplica los filtros y cierra la barra al hacer clic en "Filter"
  it('applies filters and closes on filter button click', () => {
    const onApplyFilters = vi.fn();
    const onClose = vi.fn();
    render(<FiltersBar {...defaultProps} onApplyFilters={onApplyFilters} onClose={onClose} />);
    fireEvent.click(screen.getByText('Filter'));
    expect(onApplyFilters).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  // Muestra el diseño móvil cuando el ancho es pequeño
  it('shows mobile layout on small screens', () => {
    Object.defineProperty(window, 'innerWidth', {
      value: 375
    });
    render(<FiltersBar {...defaultProps} />);
    expect(
      screen.getByRole('button', { name: /volver a la lista de personajes/i })
    ).toBeInTheDocument();
  });

  // Muestra el diseño de escritorio cuando el ancho es grande
  it('shows desktop layout on large screens', () => {
    Object.defineProperty(window, 'innerWidth', {
      value: 1024
    });
    render(<FiltersBar {...defaultProps} />);
    const closeButton = document.querySelector('button.absolute.right-4');
    expect(closeButton).toBeInTheDocument();
  });

  // Resalta los botones de filtros activos con una clase especial
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
