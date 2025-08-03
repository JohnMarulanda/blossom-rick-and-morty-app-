import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

// Props del componente SearchField
interface SearchFieldProps {
  value: string;                        // Valor actual del input
  onChange: (value: string) => void;    // Función que se llama al cambiar el input
  onFilterClick?: () => void;           // Función que se llama al hacer clic en el botón de filtros (opcional)
  isFiltersOpen?: boolean;              // Indica si el panel de filtros está abierto (opcional, usado para aplicar estilos)
}

/**
 * Componente de campo de búsqueda con ícono y botón de filtros.
 * Incluye sanitización básica de la entrada para prevenir XSS.
 */
export function SearchField({ value, onChange, onFilterClick, isFiltersOpen }: SearchFieldProps) {

  /**
   * Sanitiza la entrada del usuario para prevenir posibles ataques XSS
   * al evitar tags HTML, protocolos peligrosos y atributos de eventos.
   */
  const sanitizeInput = (input: string): string => {
    return input
      .replace(/[<>]/g, '')              // Elimina signos < y >
      .replace(/javascript:/gi, '')      // Remueve uso explícito de javascript:
      .replace(/data:/gi, '')            // Remueve data: (evita data URIs peligrosas)
      .replace(/on\w+=/gi, '')           // Elimina atributos como onclick=, onload=, etc.
      .trim()
      .slice(0, 100);                    // Limita a 100 caracteres
  };

  // Maneja los cambios en el input aplicando sanitización antes de propagar el valor
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    onChange(sanitizedValue);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 my-4">
        {/* Campo de búsqueda */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            placeholder="Search or filter results"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary-600 text-sm"
            maxLength={100}
          />
        </div>

        {/* Botón para abrir filtros */}
        <button
          onClick={onFilterClick}
          className={`p-2 rounded-lg transition-colors ${
            isFiltersOpen
              ? 'bg-primary-100'
              : 'hover:bg-primary-100'
          }`}
          aria-label="Open filters"
        >
          <SlidersHorizontal className="w-5 h-5 text-primary-600" />
        </button>
      </div>
    </div>
  );
}