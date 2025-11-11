import { memo } from "react";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";

interface PaymentMethodRowProps {
  icon: LucideIcon;
  iconColor: string;
  label: string;
  value: string;
}

/**
 * Componente de fila para métodos de pago con ícono
 * Usado en DailySalesSummary y FormCloseCashModal
 */
export const PaymentMethodRow = memo(({ 
  icon: Icon, 
  iconColor, 
  label, 
  value 
}: PaymentMethodRowProps) => {
  const { isDark } = useTheme();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          {label}
        </span>
      </div>
      <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
        {value}
      </span>
    </div>
  );
});

