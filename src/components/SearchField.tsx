import { Search, SlidersHorizontal } from 'lucide-react';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onFilterClick?: () => void;
}

export function SearchField({ value, onChange, onFilterClick }: SearchFieldProps) {
  return (
    <div className="relative flex items-center gap-2 my-4">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar por nombre de personaje"
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary-600 text-sm"
        />
      </div>
      <button
        onClick={onFilterClick}
        className="p-2 rounded-lg text-white hover:bg-gray-200 transition-colors"
      >
        <SlidersHorizontal className="w-5 h-5 text-primary-600" />
      </button>
    </div>
  );
}