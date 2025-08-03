import { render, screen, fireEvent } from '@testing-library/react';
import { SearchField } from '../SearchField';
import { describe, it, expect, vi } from 'vitest';

describe('SearchField', () => {
  it('renders correctly with default props', () => {
    const onChange = vi.fn();
    render(<SearchField value="" onChange={onChange} />);
    
    expect(screen.getByPlaceholderText('Search or filter results')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open filters/i })).toBeInTheDocument();
  });

  it('handles input changes', () => {
    const onChange = vi.fn();
    render(<SearchField value="" onChange={onChange} />);
    
    const input = screen.getByPlaceholderText('Search or filter results');
    fireEvent.change(input, { target: { value: 'Rick' } });
    
    expect(onChange).toHaveBeenCalledWith('Rick');
  });

  it('handles filter button click', () => {
    const onFilterClick = vi.fn();
    render(<SearchField value="" onChange={vi.fn()} onFilterClick={onFilterClick} />);
    
    const filterButton = screen.getByRole('button', { name: /open filters/i });
    fireEvent.click(filterButton);
    
    expect(onFilterClick).toHaveBeenCalled();
  });

  it('shows different button styles when filters are open', () => {
    render(<SearchField value="" onChange={vi.fn()} isFiltersOpen={true} />);
    
    const filterButton = screen.getByRole('button', { name: /open filters/i });
    expect(filterButton).toHaveClass('bg-primary-100');
  });
});