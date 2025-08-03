// Importamos utilidades para renderizado y simulación de eventos
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchField } from '../SearchField';
import { describe, it, expect, vi } from 'vitest';

// Grupo de pruebas para el componente SearchField
describe('SearchField', () => {
  /**
   * Verifica que el componente se renderiza correctamente
   * con los props mínimos requeridos.
   */
  it('renders correctly with default props', () => {
    const onChange = vi.fn(); // función mock

    render(<SearchField value="" onChange={onChange} />);

    // Verificamos que el input esté presente con el placeholder correcto
    expect(screen.getByPlaceholderText('Search or filter results')).toBeInTheDocument();

    // Verificamos que el botón de filtros esté presente
    expect(screen.getByRole('button', { name: /open filters/i })).toBeInTheDocument();
  });

  /**
   * Simula un cambio en el input y verifica que se llame
   * la función onChange con el valor correcto.
   */
  it('handles input changes', () => {
    const onChange = vi.fn();

    render(<SearchField value="" onChange={onChange} />);

    const input = screen.getByPlaceholderText('Search or filter results');

    // Simulamos escribir "Rick" en el input
    fireEvent.change(input, { target: { value: 'Rick' } });

    // La función onChange debe ser llamada con "Rick"
    expect(onChange).toHaveBeenCalledWith('Rick');
  });

  /**
   * Verifica que se llama onFilterClick al hacer click en el botón
   * de filtros.
   */
  it('handles filter button click', () => {
    const onFilterClick = vi.fn();

    render(<SearchField value="" onChange={vi.fn()} onFilterClick={onFilterClick} />);

    const filterButton = screen.getByRole('button', { name: /open filters/i });

    // Simulamos clic en el botón de filtros
    fireEvent.click(filterButton);

    // Debe haberse llamado la función onFilterClick
    expect(onFilterClick).toHaveBeenCalled();
  });

  /**
   * Verifica que el botón de filtros tiene una clase especial
   * cuando `isFiltersOpen` es true.
   */
  it('shows different button styles when filters are open', () => {
    render(<SearchField value="" onChange={vi.fn()} isFiltersOpen={true} />);

    const filterButton = screen.getByRole('button', { name: /open filters/i });

    // Verificamos que se aplique una clase CSS que indica que los filtros están abiertos
    expect(filterButton).toHaveClass('bg-primary-100');
  });
});