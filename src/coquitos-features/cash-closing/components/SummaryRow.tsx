import { memo } from "react";
import { useTheme } from "@/shared/hooks/useTheme";

interface SummaryRowProps {
  label: string;
  value: string | number;
  isBold?: boolean;
  isTotal?: boolean;
  valueColor?: string;
}

/**
 * Componente de fila reutilizable para resúmenes financieros
 * Puede ser usada tanto en DailySalesSummary como en FormCloseCashModal
 */
export const SummaryRow = memo(({ 
  label, 
  value, 
  isBold = false, 
  isTotal = false,
  valueColor 
}: SummaryRowProps) => {
  const { isDark } = useTheme();

  return (
    <div className={`flex justify-between items-center ${isTotal ? `border-t-2 pt-2 ${isDark ? 'border-[#334155]' : 'border-gray-200'} ${isBold ? 'font-bold text-base' : ''}` : ''}`}>
      <span className={`${isBold ? `font-bold ${isDark ? 'text-white' : 'text-gray-800'}` : isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {label}
      </span>
      <span className={`${isBold ? 'font-semibold' : ''} ${valueColor || (isDark ? 'text-white' : 'text-gray-800')}`}>
        {value}
      </span>
    </div>
  );
});

