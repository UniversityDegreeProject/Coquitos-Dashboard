import { type FieldValues, type Path, type Control, Controller } from 'react-hook-form';
import { type LucideIcon } from 'lucide-react';

interface LabelInputNumberProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  error?: string;
  type?: 'number';
  placeholder?: string;
  disabled?: boolean;
  icon?: LucideIcon;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export const LabelInputNumber = <T extends FieldValues>({
  label,
  name,
  control,
  error,
  type = 'number',
  placeholder,
  disabled = false,
  icon: Icon,
  required = false,
  min,
  max,
  step = 1,
  className = '',
}: LabelInputNumberProps<T>) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#275081] transition-colors" />
        )}
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value, ...field } }) => (
            <input
              {...field}
              id={name}
              type={type}
              value={value ?? ''}
              onChange={(e) => {
                const val = e.target.value;
                onChange(val === '' ? undefined : parseFloat(val));
              }}
              className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 rounded-xl border-2 ${
                error
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
                  : 'border-gray-200 focus:border-[#275081] focus:ring-[#275081]/10'
              } focus:ring-4 outline-none transition-all text-gray-800 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
              placeholder={placeholder}
              disabled={disabled}
              min={min}
              max={max}
              step={step}
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

