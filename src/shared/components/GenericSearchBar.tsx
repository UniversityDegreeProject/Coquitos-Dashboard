// * Library
import { type FieldValues, useForm, type Path, type Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import { type LucideIcon } from 'lucide-react';
import { useEffect } from 'react';
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
}: GenericSearchBarProps<T>) => {
  const { isDark } = useTheme();

  const form = useForm<T>({
    // @ts-expect-error - Incompatibilidad de tipos genéricos entre zodResolver y useForm
    resolver: zodResolver(schema),
    // @ts-expect-error - Incompatibilidad de tipos genéricos en defaultValues
    defaultValues: defaultValues,
    mode: 'onChange',
  });

  const { control, watch } = form;
  
  // Type assertion para el control debido a limitaciones de tipos genéricos entre Zod y React Hook Form
  const typedControl = control as unknown as Control<T>;

  // Observar cambios en el formulario y notificar al padre
  useEffect(() => {
    const subscription = watch((values) => {
      onSearchChange(values as T);
    });
    return () => subscription.unsubscribe();
  }, [watch, onSearchChange]);

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
        {selectFilters.map((filter) => (
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
        ))}
      </div>
    </div>
  );
};