import { render, screen, fireEvent } from '@testing-library/react';
import { HeartButton } from '../HeartButton';
import { describe, it, expect, vi } from 'vitest';

describe('HeartButton', () => {
  const defaultProps = {
    characterId: 1,
    isFavorite: false,
    onToggle: vi.fn(),
  };

  it('renders correctly when not favorite', () => {
    render(<HeartButton {...defaultProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Add to favorites');
    expect(button.querySelector('svg')).toHaveClass('text-gray-400');
    expect(button.querySelector('svg')).not.toHaveClass('fill-secondary-600');
  });

  it('renders correctly when favorite', () => {
    render(<HeartButton {...defaultProps} isFavorite={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Remove from favorites');
    expect(button.querySelector('svg')).toHaveClass('fill-secondary-600');
    expect(button.querySelector('svg')).toHaveClass('text-secondary-600');
  });

  it('calls onToggle with character id when clicked', () => {
    const onToggle = vi.fn();
    render(<HeartButton {...defaultProps} onToggle={onToggle} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(onToggle).toHaveBeenCalledWith(defaultProps.characterId);
  });

  it('maintains proper styling after interaction', () => {
    render(<HeartButton {...defaultProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-100');
    expect(button).toHaveClass('rounded-full');
    expect(button).toHaveClass('transition-colors');
  });
});