import { render, screen, fireEvent } from '@testing-library/react';
import { DeleteButton } from '../DeleteButton';
import { describe, it, expect, vi } from 'vitest';

describe('DeleteButton', () => {
  const defaultProps = {
    characterId: 1,
    isDeleted: false,
    onToggle: vi.fn()
  };

  it('renders correctly in non-deleted state', () => {
    render(<DeleteButton {...defaultProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Delete character');
    expect(button).toHaveClass('text-gray-400');
  });

  it('renders correctly in deleted state', () => {
    render(<DeleteButton {...defaultProps} isDeleted={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Restore character');
    expect(button).toHaveClass('text-primary-600');
  });

  it('shows confirmation dialog when clicking delete', () => {
    render(<DeleteButton {...defaultProps} />);
    
    const deleteButton = screen.getByRole('button');
    fireEvent.click(deleteButton);
    
    expect(screen.getByText('Are you sure you want to delete this character?')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('handles cancel in confirmation dialog', () => {
    const onToggle = vi.fn();
    render(<DeleteButton {...defaultProps} onToggle={onToggle} />);
    
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Cancel'));
    
    expect(onToggle).not.toHaveBeenCalled();
    expect(screen.queryByText('Are you sure you want to delete this character?')).not.toBeInTheDocument();
  });

  it('handles confirm in confirmation dialog', () => {
    const onToggle = vi.fn();
    render(<DeleteButton {...defaultProps} onToggle={onToggle} />);
    
    fireEvent.click(screen.getByRole('button'));

    fireEvent.click(screen.getByText('Delete'));
    
    expect(onToggle).toHaveBeenCalledWith(defaultProps.characterId);

    expect(screen.queryByText('Are you sure you want to delete this character?')).not.toBeInTheDocument();
  });

  it('restores character without confirmation when deleted', () => {
    const onToggle = vi.fn();
    render(<DeleteButton {...defaultProps} isDeleted={true} onToggle={onToggle} />);
    
    const restoreButton = screen.getByRole('button');
    fireEvent.click(restoreButton);
    
    expect(onToggle).toHaveBeenCalledWith(defaultProps.characterId);

    expect(screen.queryByText('Are you sure you want to delete this character?')).not.toBeInTheDocument();
  });
});