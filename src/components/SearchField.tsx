import { Search, SlidersHorizontal } from 'lucide-react';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onFilterClick?: () => void;
  isFiltersOpen?: boolean;
}

export function SearchField({ value, onChange, onFilterClick, isFiltersOpen }: SearchFieldProps) {
  return (
    <div className="relative">
      <div className="flex items-center gap-2 my-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search or filter results"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary-600 text-sm"
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