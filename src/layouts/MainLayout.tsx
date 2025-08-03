import { Outlet, useLocation } from 'react-router-dom';
import HomePage from '../pages/Home';
import { useEffect, useState } from 'react';

/**
 * MainLayout es el componente raíz de diseño de la app.
 * Divide la vista en dos versiones: escritorio (con sidebar y detalle) y móvil (vista única con navegación condicional).
 */
export default function MainLayout() {
  const location = useLocation();

  // Detecta si la ventana actual es considerada "móvil" (menos de 768px)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Estado que determina si se debe mostrar la vista de detalle en móvil
  const [showDetail, setShowDetail] = useState(false);

  // Identifica si la ruta actual es una página de detalle de personaje
  const isCharacterRoute = location.pathname.includes('/character/');

  // Actualiza `isMobile` si el tamaño de la ventana cambia
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cuando cambia la ruta, evalúa si estamos en una página de detalle
  useEffect(() => {
    setShowDetail(isCharacterRoute);
  }, [isCharacterRoute]);

  // VISTA DE ESCRITORIO: pantalla dividida
  if (!isMobile) {
    return (
      <div className="flex h-screen bg-gray-50">
        {/* Panel izquierdo: lista de personajes */}
        <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
          <HomePage />
        </div>
        {/* Panel derecho: detalle del personaje */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    );
  }

  // VISTA MÓVIL: pantalla única, muestra Home o Detalle según ruta
  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      <div
        className={`h-full w-full transition-transform duration-300 ${
          showDetail ? 'translate-x-0' : 'translate-x-0'
        }`}
      >
        {/* Renderiza vista condicional según `showDetail` */}
        {showDetail ? (
          <div className="h-full overflow-y-auto">
            <Outlet />
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
            <HomePage />
          </div>
        )}
      </div>
    </div>
  );
}