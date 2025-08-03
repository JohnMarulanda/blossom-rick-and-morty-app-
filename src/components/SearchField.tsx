import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onFilterClick?: () => void;
  isFiltersOpen?: boolean;
}

export function SearchField({ value, onChange, onFilterClick, isFiltersOpen }: SearchFieldProps) {
  const sanitizeInput = (input: string): string => {
    // Sanitizar entrada para prevenir XSS
    return input
      .replace(/[<>]/g, '') // Remover caracteres HTML
      .replace(/javascript:/gi, '') // Remover protocolo javascript
      .replace(/data:/gi, '') // Remover protocolo data
      .replace(/on\w+=/gi, '') // Remover event handlers (onclick, onload, etc.)
      .trim()
      .slice(0, 100); // Limitar longitud a 100 caracteres
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    onChange(sanitizedValue);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 my-4">
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
        <button
          onClick={onFilterClick}
          className={`p-2 rounded-lg transition-colors  ${
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