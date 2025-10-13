import { type FieldValues, type Path, type Control, Controller } from 'react-hook-form';
import { type LucideIcon } from 'lucide-react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface LabelSelectProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  options: SelectOption[];
  error?: string;
  disabled?: boolean;
  icon?: LucideIcon;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export const LabelSelect = <T extends FieldValues>({
  label,
  name,
  control,
  options,
  error,
  disabled = false,
  icon: Icon,
  required = false,
  placeholder = 'Selecciona una opción',
  className = '',
}: LabelSelectProps<T>) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#275081] transition-colors z-10" />
        )}
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <select
              {...field}
              id={name}
              className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-10 py-3 rounded-xl border-2 ${
                error
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
                  : 'border-gray-200 focus:border-[#275081] focus:ring-[#275081]/10'
              } focus:ring-4 outline-none transition-all text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 appearance-none bg-white cursor-pointer`}
              disabled={disabled}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? `${name}-error` : undefined}
            >
              <option value="">{placeholder}</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p id={`${name}-error`} className="text-red-600 text-xs mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

