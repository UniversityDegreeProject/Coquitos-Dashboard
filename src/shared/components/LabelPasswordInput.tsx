import { useState } from 'react';
import { type FieldValues, type Path, type Control, Controller } from 'react-hook-form';
import { Eye, EyeOff, Lock } from 'lucide-react';

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
}: LabelPasswordInputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative group">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#275081] transition-colors" />
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              id={name}
              type={showPassword ? 'text' : 'password'}
              className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 ${
                error
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
                  : 'border-gray-200 focus:border-[#275081] focus:ring-[#275081]/10'
              } focus:ring-4 outline-none transition-all text-gray-800 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50`}
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
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#275081] transition-colors"
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          disabled={disabled}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      {error && (
        <p id={`${name}-error`} className="text-red-600 text-xs mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

