import { useState } from 'react';
import { type FieldValues, type Path, type Control, Controller } from 'react-hook-form';
import { Eye, EyeOff, Lock, type LucideIcon } from 'lucide-react';
import { useTheme } from '@/shared/hooks/useTheme';

interface LabelPasswordInputProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  className?: string;
  icon?: LucideIcon
}

export const LabelPasswordInput = <T extends FieldValues>({
  label,
  name,
  control,
  error,
  placeholder = '••••••••',
  disabled = false,
  required = false,
  autoComplete = 'current-password',
  className = '',
  icon: Icon = Lock,
}: LabelPasswordInputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const { isDark } = useTheme();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={name} className={`block text-sm font-semibold ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'}`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative group">
        <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'} group-focus-within:${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'} transition-colors duration-200 z-10`} />
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              id={name}
              type={showPassword ? 'text' : 'password'}
              className={`w-full pl-12 pr-12 py-3.5 rounded-xl border ${isDark ? 'bg-[#1E293B]' : 'bg-white'} shadow-sm ${
                error
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 focus:shadow-red-100'
                  : `${isDark ? 'border-[#334155] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20' : 'border-[#E5E7EB] focus:border-[#275081] focus:ring-[#275081]/20'}`
              } focus:ring-2 ring-offset-1 outline-none transition-all duration-200 ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'} placeholder:${isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'} hover:${isDark ? 'border-[#475569]' : 'border-[#D1D5DB]'} disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50`}
              placeholder={placeholder}
              disabled={disabled}
              autoComplete={autoComplete}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? `${name}-error` : undefined}
            />
          )}
        />
        <button
          type="button"
          onClick={handleTogglePassword}
          className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-[#94A3B8] hover:text-[#F59E0B] hover:bg-[#F59E0B]/10' : 'text-[#6B7280] hover:text-[#275081] hover:bg-[#275081]/10'} transition-colors duration-200 p-1 rounded-md`}
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          disabled={disabled}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      {error && (
        <p id={`${name}-error`} className="text-red-600 text-xs mt-1 font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

