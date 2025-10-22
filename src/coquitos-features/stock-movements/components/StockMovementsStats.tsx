import { useTheme } from "@/shared/hooks/useTheme";
import type { StockMovementResponse } from "../interfaces";

interface StockMovementsStatsProps {
  movements: StockMovementResponse[];
}

/**
 * Estadísticas rápidas de movimientos de stock
 */
export const StockMovementsStats = ({ movements }: StockMovementsStatsProps) => {
  const { colors, isDark } = useTheme();

  const stats = {
    total: movements.length,
    reabastecimientos: movements.filter(m => m.type === 'Reabastecimiento').length,
    ventas: movements.filter(m => m.type === 'Venta').length,
    ajustes: movements.filter(m => m.type === 'Ajuste').length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
        <p className={`text-sm ${colors.text.muted}`}>Total Movimientos</p>
        <p className={`text-2xl font-bold ${colors.text.primary}`}>
          {stats.total}
        </p>
      </div>
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
        <p className={`text-sm ${colors.text.muted}`}>Reabastecimientos</p>
        <p className={`text-2xl font-bold text-blue-600 dark:text-blue-400`}>
          {stats.reabastecimientos}
        </p>
      </div>
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
        <p className={`text-sm ${colors.text.muted}`}>Ventas</p>
        <p className={`text-2xl font-bold text-purple-600 dark:text-purple-400`}>
          {stats.ventas}
        </p>
      </div>
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
        <p className={`text-sm ${colors.text.muted}`}>Ajustes</p>
        <p className={`text-2xl font-bold text-yellow-600 dark:text-yellow-400`}>
          {stats.ajustes}
        </p>
      </div>
    </div>
  );
};
