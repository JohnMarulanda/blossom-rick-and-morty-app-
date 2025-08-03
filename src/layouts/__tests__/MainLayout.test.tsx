import { render, screen, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MainLayout from '../MainLayout';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../pages/Home', () => ({
  default: () => <div data-testid="mock-home">Home Page</div>
}));

describe('MainLayout', () => {
  const mockMatchMedia = (matches: boolean) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: matches ? 1024 : 600,
    });
    
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders desktop layout correctly', () => {
    mockMatchMedia(true);
    
    render(
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('mock-home')).toBeInTheDocument();
    const desktopLayout = document.querySelector('.flex.h-screen');
    expect(desktopLayout).toBeInTheDocument();
    expect(document.querySelector('.w-1\\/3')).toBeInTheDocument();
  });

  it('renders mobile layout correctly', () => {
    mockMatchMedia(false);
    
    render(
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('mock-home')).toBeInTheDocument();
    const mobileLayout = document.querySelector('.h-screen.bg-gray-50');
    expect(mobileLayout).toBeInTheDocument();
  });

  it('handles responsive layout changes', async () => {
    mockMatchMedia(true);
    const { rerender } = render(
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    );
    
    expect(document.querySelector('.w-1\\/3')).toBeInTheDocument();
    
    await act(async () => {
      mockMatchMedia(false);
      window.dispatchEvent(new Event('resize'));
    });

    await act(async () => {
      rerender(
        <BrowserRouter>
          <MainLayout />
        </BrowserRouter>
      );
    });
    
    expect(document.querySelector('.h-screen.overflow-hidden')).toBeInTheDocument();
  });
});