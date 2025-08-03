import { X, ArrowLeft } from 'lucide-react';

interface FiltersBarProps {
  isOpen: boolean;                       // Si el panel está abierto o no
  onClose: () => void;                   // Función para cerrar el panel
  characterFilter: string;               // Filtro actual para personajes (ej. 'all', 'starred')
  setCharacterFilter: (value: string) => void;
  speciesFilter: string;                 // Filtro actual para especie
  setSpeciesFilter: (value: string) => void;
  statusFilter: string;                  // Filtro actual para estado
  setStatusFilter: (value: string) => void;
  genderFilter: string;                  // Filtro actual para género
  setGenderFilter: (value: string) => void;
  onApplyFilters: () => void;            // Función para aplicar los filtros seleccionados
  hasActiveFilters: boolean;             // Indica si hay filtros activos (para activar botón)
}

/**
 * Componente visual que presenta un panel lateral o emergente para aplicar filtros
 * sobre una lista de personajes. Es adaptable a escritorio y móvil.
 */
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
  hasActiveFilters,
}: FiltersBarProps) {
  // Si no está abierto, no renderiza nada
  if (!isOpen) return null;

  // Opciones disponibles para cada filtro
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

  /**
   * Subcomponente reutilizable para secciones de filtros
   */
  const FilterSection = ({
    title,
    options,
    value,
    onChange,
  }: {
    title: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
  }) => (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              value === option.value
                ? 'bg-primary-100 text-primary-600'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  const isMobile = window.innerWidth < 768;

  return (
    <div
      className={`bg-white z-50 ${
        isMobile
          ? 'fixed inset-0 overflow-y-auto'
          : 'relative rounded-lg shadow-lg border border-gray-200 mt-2'
      }`}
    >
      <div className="p-4">
        {/* Encabezado con botón para cerrar */}
        <div className="flex items-center justify-between mb-4 relative">
          <div className="flex items-center justify-center w-full relative">
            {isMobile && (
              <button
                onClick={onClose}
                className="absolute left-0 p-2 rounded-full text-primary-600 hover:bg-primary-200 transition-colors"
                aria-label="Volver a la lista de personajes"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="flex text-lg font-semibold text-gray-900">Filters</h2>
          </div>

          {!isMobile && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
              aria-label="Cerrar filtros"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Secciones de filtros */}
        <div className="space-y-4 mb-6">
          <FilterSection
            title="Character"
            options={characterOptions}
            value={characterFilter}
            onChange={setCharacterFilter}
          />
          <FilterSection
            title="Specie"
            options={speciesOptions}
            value={speciesFilter}
            onChange={setSpeciesFilter}
          />
          <FilterSection
            title="State"
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

        {/* Botón de aplicar filtros */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <div className="flex gap-3">
            <button
              onClick={() => {
                onApplyFilters();
                onClose();
              }}
              className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
                hasActiveFilters
                  ? 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 focus:ring-gray-200'
              }`}
            >
              Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
