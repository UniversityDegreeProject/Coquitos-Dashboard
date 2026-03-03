import {
  type FieldValues,
  type Path,
  type Control,
  Controller,
} from "react-hook-form";
import { type LucideIcon } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";

interface LabelInputStringProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  error?: string;
  inputMode?:
    | "text"
    | "numeric"
    | "decimal"
    | "tel"
    | "search"
    | "email"
    | "url";
  type?: "text" | "email" | "tel" | "url" | "search" | "date";
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
  type = "text",
  placeholder,
  disabled = false,
  icon: Icon,
  required = false,
  autoComplete,
  inputMode,
  className = "",
}: LabelInputStringProps<T>) => {
  const { isDark } = useTheme();

  return (
    <div className={`space-y-2 ${className}`}>
      <label
        htmlFor={name}
        className={`block text-sm font-semibold ${
          isDark ? "text-[#F8FAFC]" : "text-[#1F2937]"
        }`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative group">
        {Icon && (
          <Icon
            className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
              isDark
                ? "text-[#94A3B8] group-focus-within:text-[#F59E0B]"
                : "text-[#6B7280] group-focus-within:text-[#275081]"
            } transition-colors duration-200 z-10`}
          />
        )}
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              id={name}
              type={type}
              inputMode={inputMode}
              className={`w-full ${
                Icon ? "pl-12" : "pl-4"
              } pr-4 py-3.5 rounded-xl border ${
                isDark ? "bg-[#1E293B]" : "bg-white"
              } backdrop-blur-sm shadow-sm ${
                error
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/20 focus:shadow-red-100"
                  : isDark
                  ? "border-[#334155] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20 hover:border-[#64748B]"
                  : "border-[#E5E7EB] focus:border-[#275081] focus:ring-[#275081]/20 hover:border-[#E5E7EB]"
              } focus:ring-2 ring-offset-1 outline-none transition-all duration-200 ${
                isDark
                  ? "text-[#F8FAFC] placeholder:text-[#94A3B8]"
                  : "text-[#1F2937] placeholder:text-[#6B7280]"
              } disabled:opacity-50 disabled:cursor-not-allowed ${
                isDark ? "disabled:bg-[#1E293B]" : "disabled:bg-gray-50"
              }`}
              placeholder={placeholder}
              disabled={disabled}
              autoComplete={autoComplete}
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? `${name}-error` : undefined}
            />
          )}
        />
      </div>
      {error && (
        <p
          id={`${name}-error`}
          className="text-red-600 text-xs mt-1 font-medium"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};
