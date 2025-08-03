// Importaciones necesarias para testear componentes React
import { render, screen, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MainLayout from '../MainLayout';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mockeamos el componente Home para evitar renderizar su implementación real
// Esto permite que las pruebas se enfoquen solo en MainLayout
vi.mock('../../pages/Home', () => ({
  default: () => <div data-testid="mock-home">Home Page</div>
}));

// Grupo de pruebas para el componente MainLayout
describe('MainLayout', () => {
  /**
   * Esta función simula el comportamiento de `matchMedia` y define el ancho de la ventana.
   * Permite probar cómo responde MainLayout en función del tamaño de pantalla (desktop o mobile).
   * 
   * @param matches - true para desktop, false para mobile
   */
  const mockMatchMedia = (matches: boolean) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: matches ? 1024 : 600, // desktop: 1024px, mobile: 600px
    });
    
    // Mock de matchMedia API para pruebas
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

  // Limpia mocks antes de cada prueba
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Prueba que verifica el layout en modo ESCRITORIO
   * - Se simula una pantalla ancha
   * - Se espera que se rendericen los elementos del layout de escritorio
   */
  it('renders desktop layout correctly', () => {
    mockMatchMedia(true); // Pantalla grande (desktop)
    
    render(
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    );
    
    // El componente Home mockeado debe estar presente
    expect(screen.getByTestId('mock-home')).toBeInTheDocument();

    // Se verifica que el layout de escritorio (pantalla dividida) esté presente
    const desktopLayout = document.querySelector('.flex.h-screen');
    expect(desktopLayout).toBeInTheDocument();

    // Se asegura que exista el contenedor lateral izquierdo
    expect(document.querySelector('.w-1\\/3')).toBeInTheDocument();
  });

  /**
   * Prueba que verifica el layout en modo MÓVIL
   * - Simula una pantalla pequeña
   * - Se espera que se renderice el layout móvil sin el sidebar
   */
  it('renders mobile layout correctly', () => {
    mockMatchMedia(false); // Pantalla pequeña (mobile)
    
    render(
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    );
    
    // Verifica que el componente Home esté presente
    expect(screen.getByTestId('mock-home')).toBeInTheDocument();

    // Se verifica que el layout móvil (pantalla completa) esté presente
    const mobileLayout = document.querySelector('.h-screen.bg-gray-50');
    expect(mobileLayout).toBeInTheDocument();
  });

  /**
   * Prueba que simula un cambio de tamaño de pantalla dinámico
   * - Inicia en escritorio, cambia a móvil y se re-renderiza
   * - Verifica que el layout se adapte correctamente
   */
  it('handles responsive layout changes', async () => {
    mockMatchMedia(true); // Iniciar como escritorio

    const { rerender } = render(
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    );
    
    // Asegura que se haya renderizado el layout de escritorio
    expect(document.querySelector('.w-1\\/3')).toBeInTheDocument();
    
    // Simula cambio a pantalla móvil (resize)
    await act(async () => {
      mockMatchMedia(false);
      window.dispatchEvent(new Event('resize'));
    });

    // Forzar un nuevo render tras el resize
    await act(async () => {
      rerender(
        <BrowserRouter>
          <MainLayout />
        </BrowserRouter>
      );
    });
    
    // Verifica que ahora se está usando el layout móvil
    expect(document.querySelector('.h-screen.overflow-hidden')).toBeInTheDocument();
  });
});