import { type FieldValues, type Path, type Control, Controller } from 'react-hook-form';
import { type LucideIcon } from 'lucide-react';

interface LabelInputStringProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  error?: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'search';
  placeholder?: string;
  disabled?: boolean;
  icon?: LucideIcon;
  required?: boolean;
  autoComplete?: string;
  className?: string;
}

export const LabelInputString = <T extends FieldValues>({
  label,
  name,
  control,
  error,
  type = 'text',
  placeholder,
  disabled = false,
  icon: Icon,
  required = false,
  autoComplete,
  className = '',
}: LabelInputStringProps<T>) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-600 transition-colors duration-200 z-10" />
        )}
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              id={name}
              type={type}
              className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3.5 rounded-xl border-2 bg-white/80 backdrop-blur-sm shadow-sm ${
                error
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 focus:shadow-red-100'
                  : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 focus:shadow-orange-100'
              } focus:ring-4 outline-none transition-all duration-200 text-gray-800 placeholder:text-gray-400 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50`}
              placeholder={placeholder}
              disabled={disabled}
              autoComplete={autoComplete}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? `${name}-error` : undefined}
            />
          )}
        />
      </div>
      {error && (
        <p id={`${name}-error`} className="text-red-600 text-xs mt-1 font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};