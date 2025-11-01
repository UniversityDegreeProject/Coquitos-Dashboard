// * Library
import { type FieldValues, useForm, type Path, type Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, X } from 'lucide-react';
import { type LucideIcon } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { type z } from 'zod';

// * Components
import { LabelInputString, LabelSelect } from '@/shared/components';
import { useTheme } from '@/shared/hooks/useTheme';

// * Types
export interface SelectFilterConfig<T extends FieldValues> {
  name: Path<T>;
  label: string;
  options: { value: string | number; label: string }[];
  icon?: LucideIcon;
  placeholder?: string;
}

interface GenericSearchBarProps<T extends FieldValues> {
  schema: z.ZodType<T>;
  defaultValues: T;
  onSearchChange: (values: T) => void;
  selectFilters?: SelectFilterConfig<T>[];
  searchPlaceholder?: string;
  searchLabel?: string;
  searchFieldName?: Path<T>;
  className?: string;
  showActiveFilters?: boolean;
  clearFiltersLabel?: string;
}


export const GenericSearchBar = <T extends FieldValues>({
  schema,
  defaultValues,
  onSearchChange,
  selectFilters = [],
  searchPlaceholder = 'Buscar...',
  searchLabel = 'Búsqueda',
  searchFieldName = 'search' as Path<T>,
  className = '',
  showActiveFilters = false,
  clearFiltersLabel = 'Borrar filtros',
}: GenericSearchBarProps<T>) => {
  const { isDark } = useTheme();

  const form = useForm<T>({
    // @ts-expect-error - Incompatibilidad de tipos genéricos entre zodResolver y useForm
    resolver: zodResolver(schema),
    // @ts-expect-error - Incompatibilidad de tipos genéricos en defaultValues
    defaultValues: defaultValues,
    mode: 'onChange',
  });

  const { control, watch, reset } = form;
  
  // Type assertion para el control debido a limitaciones de tipos genéricos entre Zod y React Hook Form
  const typedControl = control as unknown as Control<T>;

  // Observar cambios en el formulario y notificar al padre
  useEffect(() => {
    const subscription = watch((values) => {
      onSearchChange(values as T);
    });
    return () => subscription.unsubscribe();
  }, [watch, onSearchChange]);

  // Obtener valores actuales del formulario
  const currentValues = watch();

  // Detectar si hay filtros activos
  const hasActiveFilters = useMemo(() => {
    if (!showActiveFilters) return false;
    
    // Verificar si hay búsqueda activa
    const searchField = searchFieldName as keyof T;
    const hasSearch = currentValues[searchField] && 
                     String(currentValues[searchField]).trim() !== '' &&
                     currentValues[searchField] !== defaultValues[searchField];
    
    // Verificar si hay filtros select activos
    const hasSelectFilters = selectFilters.some((filter) => {
      const filterValue = currentValues[filter.name as keyof T];
      const defaultValue = defaultValues[filter.name as keyof T];
      return filterValue && filterValue !== defaultValue && filterValue !== '';
    });

    return hasSearch || hasSelectFilters;
  }, [currentValues, defaultValues, selectFilters, searchFieldName, showActiveFilters]);

  // Obtener el label de un valor de filtro
  const getFilterLabel = (filterName: Path<T>, value: unknown): string => {
    const filter = selectFilters.find((f) => f.name === filterName);
    if (!filter) return String(value);
    
    const option = filter.options.find((opt) => String(opt.value) === String(value));
    return option ? option.label : String(value);
  };

  // Handler para limpiar filtros
  const handleClearFilters = () => {
    reset(defaultValues);
    // Notificar al padre que los filtros fueron limpiados
    onSearchChange(defaultValues);
  };

  return (
    <div
      className={`${
        isDark ? 'bg-[#1E293B]/50' : 'bg-white/50'
      } backdrop-blur-md rounded-2xl p-6 shadow-lg border ${
        isDark ? 'border-[#334155]/50' : 'border-white/50'
      } ${className}`}
    >
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
        selectFilters.length === 0 
          ? 'lg:grid-cols-1' 
          : selectFilters.length === 1 
          ? 'lg:grid-cols-2' 
          : 'lg:grid-cols-3'
      }`}>
        {/* Campo de búsqueda - Siempre presente */}
        <div>
          <LabelInputString
            label={searchLabel}
            name={searchFieldName}
            control={typedControl}
            type="search"
            placeholder={searchPlaceholder}
            icon={Search}
          />
        </div>

        {/* Filtros dinámicos tipo select */}
        {selectFilters.map((filter) => {

          return (
            <div key={filter.name}>
              <LabelSelect
                label={filter.label}
                name={filter.name}
                control={typedControl}
                options={filter.options}
                icon={filter.icon}
                placeholder={filter.placeholder}
              />
            </div>
          );
        })}
      </div>

      {/* Indicador de filtros activos */}
      {showActiveFilters && hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#334155]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {/* Búsqueda activa */}
              {currentValues[searchFieldName as keyof T] && 
               String(currentValues[searchFieldName as keyof T]).trim() !== '' &&
               currentValues[searchFieldName as keyof T] !== defaultValues[searchFieldName as keyof T] && (
                <span className={`${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
                  Buscando: <span className={`font-medium ${isDark ? 'text-[#F8FAFC]' : 'text-gray-800'}`}>
                    "{String(currentValues[searchFieldName as keyof T])}"
                  </span>
                </span>
              )}
              
              {/* Filtros select activos */}
              {selectFilters.map((filter) => {
                const filterValue = currentValues[filter.name as keyof T];
                const defaultValue = defaultValues[filter.name as keyof T];
                
                if (!filterValue || filterValue === defaultValue || filterValue === '') {
                  return null;
                }

                return (
                  <span key={filter.name} className={`${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
                    {filter.label}: <span className={`font-medium ${isDark ? 'text-[#F8FAFC]' : 'text-gray-800'}`}>
                      {getFilterLabel(filter.name, filterValue)}
                    </span>
                  </span>
                );
              })}
            </div>
            
            {/* Botón borrar filtros */}
            <button
              onClick={handleClearFilters}
              className={`flex items-center gap-1 text-sm ${isDark ? 'text-[#94A3B8] hover:text-[#F8FAFC]' : 'text-gray-600 hover:text-gray-800'} transition-colors`}
            >
              <X className="w-4 h-4" />
              <span>{clearFiltersLabel}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};