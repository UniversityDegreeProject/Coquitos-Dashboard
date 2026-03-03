import { memo } from "react";
import { Clock, ShoppingCart, TrendingUp, CheckCircle } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { formatTime, formatCurrency } from "../helpers";
import type { CashRegister } from "../interfaces";
import { CashRegisterEmptyState } from "./CashRegisterEmptyState";
import { CashRegisterMetricCard } from "./CashRegisterMetricCard";

interface CashRegisterCurrentStatusProps {
  cashRegister: CashRegister | null;
}

/**
 * Componente que muestra el estado actual de la caja abierta
 * Turno iniciado, órdenes procesadas, ventas acumuladas
 */
export const CashRegisterCurrentStatus = memo(({ cashRegister }: CashRegisterCurrentStatusProps) => {
  const { isDark } = useTheme();

  if (!cashRegister || cashRegister.status === "Cerrado") {
    return <CashRegisterEmptyState />;
  }

  return (
    <div className={`${isDark ? 'bg-gradient-to-br from-emerald-900/20 via-[#1E293B] to-emerald-900/20 border-emerald-500/30' : 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-emerald-200'} rounded-2xl p-6 shadow-md border`}>
      {/* Header con status */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Estado Actual de la Caja
        </h2>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="font-bold text-green-600 text-sm">Operativa</span>
        </div>
      </div>

      {/* Grid de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CashRegisterMetricCard
          icon={Clock}
          iconBgColor={isDark ? 'bg-blue-500/20' : 'bg-blue-50'}
          iconTextColor={isDark ? 'text-blue-400' : 'text-blue-600'}
          label="Turno Iniciado"
          value={formatTime(cashRegister.openedAt)}
        />

        <CashRegisterMetricCard
          icon={ShoppingCart}
          iconBgColor={isDark ? 'bg-purple-500/20' : 'bg-purple-50'}
          iconTextColor={isDark ? 'text-purple-400' : 'text-purple-600'}
          label="Órdenes Procesadas"
          value={cashRegister.totalOrders}
        />

        <CashRegisterMetricCard
          icon={TrendingUp}
          iconBgColor={isDark ? 'bg-green-500/20' : 'bg-green-50'}
          iconTextColor={isDark ? 'text-green-400' : 'text-green-600'}
          label="Ventas Acumuladas"
          value={formatCurrency(cashRegister.totalSales)}
          valueColor="text-green-600"
        />
      </div>
    </div>
  );
});

