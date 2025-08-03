import { Outlet, useLocation } from 'react-router-dom';
import HomePage from '../pages/Home';
import { useEffect, useState } from 'react';

export default function MainLayout() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showDetail, setShowDetail] = useState(false);
  
  // Detectar si estamos en la ruta de un personaje específico
  const isCharacterRoute = location.pathname.includes('/character/');

  // Actualizar el estado de isMobile cuando cambia el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Actualizar showDetail cuando cambia la ruta
  useEffect(() => {
    setShowDetail(isCharacterRoute);
  }, [isCharacterRoute]);

  // Versión de escritorio (dos columnas)
  if (!isMobile) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
          <HomePage />
        </div>
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    );
  }

  // Versión móvil (una columna con navegación)
  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      {/* Mostrar solo el detalle del personaje o la página principal */}
      <div className={`h-full w-full transition-transform duration-300 ${showDetail ? 'translate-x-0' : 'translate-x-0'}`}>
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