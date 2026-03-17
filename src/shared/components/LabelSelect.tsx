import { type FieldValues, type Path, type Control, Controller } from 'react-hook-form';
import { type LucideIcon } from 'lucide-react';
import { useTheme } from '@/shared/hooks/useTheme';

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
  const { isDark } = useTheme();
  
  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={name} className={`block text-sm font-semibold ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'}`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative group">
        {Icon && (
          <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'} group-focus-within:${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'} transition-colors duration-200 z-10`} />
        )}
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <select
              {...field}
              id={name}
              className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-10 py-3.5 rounded-xl border ${isDark ? 'bg-[#1E293B]' : 'bg-white'} shadow-sm ${
                error
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 focus:shadow-red-100'
                  : `${isDark ? 'border-[#334155] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20' : 'border-[#E5E7EB] focus:border-[#275081] focus:ring-[#275081]/20'}`
              } focus:ring-2 ring-offset-1 outline-none transition-colors duration-200 ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'} disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 appearance-none cursor-pointer hover:${isDark ? 'border-[#475569]' : 'border-[#D1D5DB]'}`}
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
          <svg className={`w-5 h-5 ${isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p id={`${name}-error`} className="text-red-600 text-xs mt-1 font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

