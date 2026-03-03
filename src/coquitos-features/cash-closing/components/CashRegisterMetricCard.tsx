import { memo } from "react";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";

interface CashRegisterMetricCardProps {
  icon: LucideIcon;
  iconBgColor: string;
  iconTextColor: string;
  label: string;
  value: string | number;
  valueColor?: string;
}

/**
 * Componente de tarjeta de métrica para la caja registradora
 * Muestra un ícono, label y valor con hover effect
 */
export const CashRegisterMetricCard = memo(({
  icon: Icon,
  iconBgColor,
  iconTextColor,
  label,
  value,
  valueColor,
}: CashRegisterMetricCardProps) => {
  const { isDark } = useTheme();

  return (
    <div className={`${isDark ? 'bg-[#0F172A] border-[#334155]' : 'bg-white border-gray-100'} rounded-xl p-4 border shadow-sm hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-xl ${iconBgColor}`}>
          <Icon className={`w-6 h-6 ${iconTextColor}`} />
        </div>
        <div>
          <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {label}
          </p>
          <p className={`text-lg font-bold ${valueColor || (isDark ? 'text-white' : 'text-gray-900')}`}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
});

