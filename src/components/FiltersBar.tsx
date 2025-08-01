import { X } from 'lucide-react';

interface FiltersBarProps {
  isOpen: boolean;
  onClose: () => void;
  characterFilter: string;
  setCharacterFilter: (value: string) => void;
  speciesFilter: string;
  setSpeciesFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  genderFilter: string;
  setGenderFilter: (value: string) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export function FiltersBar({
  isOpen,
  onClose,
  characterFilter,
  setCharacterFilter,
  speciesFilter,
  setSpeciesFilter,
  statusFilter,
  setStatusFilter,
  genderFilter,
  setGenderFilter,
  onApplyFilters,
  onClearFilters,
}: FiltersBarProps) {
  if (!isOpen) return null;

  const characterOptions = [
    { value: 'all', label: 'All' },
    { value: 'starred', label: 'Starred' },
    { value: 'others', label: 'Others' },
  ];

  const speciesOptions = [
    { value: 'all', label: 'All' },
    { value: 'Human', label: 'Human' },
    { value: 'Alien', label: 'Alien' },
  ];

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'Alive', label: 'Alive' },
    { value: 'Dead', label: 'Dead' },
    { value: 'unknown', label: 'Unknown' },
  ];

  const genderOptions = [
    { value: 'all', label: 'All' },
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Genderless', label: 'Genderless' },
    { value: 'unknown', label: 'Unknown' },
  ];

  const FilterSection = ({ title, options, value, onChange }: {
    title: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
  }) => (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              value === option.value
                ? 'bg-primary-600 text-white'
                : 'bg-primary-100 text-primary-700 hover:bg-primary-600 hover:text-white'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          <FilterSection
            title="Character"
            options={characterOptions}
            value={characterFilter}
            onChange={setCharacterFilter}
          />
          
          <FilterSection
            title="Species"
            options={speciesOptions}
            value={speciesFilter}
            onChange={setSpeciesFilter}
          />
          
          <FilterSection
            title="Status"
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          
          <FilterSection
            title="Gender"
            options={genderOptions}
            value={genderFilter}
            onChange={setGenderFilter}
          />
        </div>
        
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
          <button
            onClick={onClearFilters}
            className="flex-1 px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
          >
            Limpiar
          </button>
          <button
            onClick={() => {
              onApplyFilters();
              onClose();
            }}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Filtrar
          </button>
        </div>
      </div>
    </div>
  );
}
