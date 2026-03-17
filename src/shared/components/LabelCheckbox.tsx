import { type FieldValues, type Path, type Control, Controller } from 'react-hook-form';

interface LabelCheckboxProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  error?: string;
  disabled?: boolean;
  description?: string;
  className?: string;
}

export const LabelCheckbox = <T extends FieldValues>({
  label,
  name,
  control,
  error,
  disabled = false,
  description,
  className = '',
}: LabelCheckboxProps<T>) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <Controller
            name={name}
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <input
                {...field}
                id={name}
                type="checkbox"
                checked={!!value}
                onChange={(e) => onChange(e.target.checked)}
                className="w-5 h-5 rounded border border-gray-300 text-[#275081] focus:ring-2 ring-offset-1 focus:ring-[#275081]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                disabled={disabled}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? `${name}-error` : description ? `${name}-description` : undefined}
              />
            )}
          />
        </div>
        <div className="ml-3">
          <label htmlFor={name} className="text-sm font-medium text-gray-700 cursor-pointer">
            {label}
          </label>
          {description && (
            <p id={`${name}-description`} className="text-xs text-gray-500 mt-1">
              {description}
            </p>
          )}
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

