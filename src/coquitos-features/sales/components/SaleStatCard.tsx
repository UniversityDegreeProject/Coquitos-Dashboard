import { memo } from "react";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";

interface SaleStatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  valueColor?: string;
  valueSize?: "lg" | "xl" | "2xl";
}

/**
 * Componente reutilizable para mostrar una tarjeta de estadística de ventas
 * Diseño consistente con el resto de la aplicación
 */
export const SaleStatCard = memo(
  ({
    label,
    value,
    icon: Icon,
    iconColor,
    valueColor,
    valueSize = "2xl",
  }: SaleStatCardProps) => {
    const { colors, isDark } = useTheme();

    // Colores por defecto si no se especifican
    const defaultIconColor =
      iconColor || (isDark ? "text-[#F59E0B]" : "text-[#275081]");
    const defaultValueColor = valueColor || colors.text.primary;

    // Tamaño del texto del valor (mapeo explícito para Tailwind)
    const valueSizeMap = {
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
    };
    const valueSizeClass = `${valueSizeMap[valueSize]} font-bold ${defaultValueColor}`;

    return (
      <div
        className={`${
          isDark ? "bg-[#1E293B]" : "bg-white"
        } rounded-xl p-4 shadow-lg border ${
          isDark ? "border-[#334155]" : "border-gray-100"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className={`text-sm font-medium ${
                isDark ? "text-[#94A3B8]" : "text-gray-600"
              }`}
            >
              {label}
            </p>
            <p className={valueSizeClass}>{value}</p>
          </div>
          <Icon className={`w-8 h-8 ${defaultIconColor}`} />
        </div>
      </div>
    );
  }
);

SaleStatCard.displayName = "SaleStatCard";
