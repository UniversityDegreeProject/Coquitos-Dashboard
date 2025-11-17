import { type FieldValues, type Path, type Control, Controller } from 'react-hook-form';
import { type LucideIcon } from 'lucide-react';
import { useTheme } from '@/shared/hooks/useTheme';

interface LabelTextareaProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  icon?: LucideIcon;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  className?: string;
}

export const LabelTextarea = <T extends FieldValues>({
  label,
  name,
  control,
  error,
  placeholder,
  disabled = false,
  icon: Icon,
  required = false,
  rows = 4,
  maxLength,
  className = '',
}: LabelTextareaProps<T>) => {
  const { isDark } = useTheme();

  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={name} className={`block text-sm font-medium ${isDark ? 'text-[#F8FAFC]' : 'text-gray-700'}`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative group">
        {Icon && (
          <Icon className={`absolute left-4 top-4 w-5 h-5 ${isDark ? 'text-[#94A3B8] group-focus-within:text-[#F59E0B]' : 'text-gray-400 group-focus-within:text-[#275081]'} transition-colors`} />
        )}
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              id={name}
              className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 rounded-xl border-2 ${
                error
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
                  : isDark
                  ? 'border-[#334155] focus:border-[#F59E0B] focus:ring-[#F59E0B]/10 bg-[#0F172A] text-[#F8FAFC]'
                  : 'border-gray-200 focus:border-[#275081] focus:ring-[#275081]/10 bg-white text-gray-800'
              } focus:ring-4 outline-none transition-all ${isDark ? 'placeholder:text-[#64748B]' : 'placeholder:text-gray-400'} disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'disabled:bg-[#1E293B]' : 'disabled:bg-gray-50'} resize-none`}
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              maxLength={maxLength}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? `${name}-error` : undefined}
            />
          )}
        />
      </div>
      {error && (
        <p id={`${name}-error`} className="text-red-600 text-xs mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

