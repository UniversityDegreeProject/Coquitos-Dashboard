import { memo, useMemo } from "react";
import { ShoppingCart, CheckCircle, Clock, Coins, Banknote, CreditCard, Smartphone } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { formatCurrency } from "../helpers";

interface OrderStatsProps {
  totalOrders: number;
  totalSales: number;
  pendingOrders: number;
  completedOrders: number;
  cashOrders: number;
  cardOrders: number;
  qrOrders: number;
}

/**
 * Componente que muestra estadísticas de órdenes (ventas)
 * Grid de 4 columnas con métricas clave del negocio
 */
export const OrderStats = memo(({
  totalOrders,
  totalSales,
  pendingOrders,
  completedOrders,
  cashOrders,
  cardOrders,
  qrOrders,
}: OrderStatsProps) => {
  const { colors, isDark } = useTheme();

  // Calcular estadísticas adicionales
  const stats = useMemo(() => ({
    total: totalOrders,
    sales: totalSales,
    pending: pendingOrders,
    completed: completedOrders,
    cash: cashOrders,
    card: cardOrders,
    qr: qrOrders,
  }), [totalOrders, totalSales, pendingOrders, completedOrders, cashOrders, cardOrders, qrOrders]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Órdenes */}
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
              Total Ventas
            </p>
            <p className={`text-2xl font-bold ${colors.text.primary}`}>
              {stats.total}
            </p>
          </div>
          <ShoppingCart className={`w-8 h-8 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
        </div>
      </div>

      {/* Ingresos Totales */}
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
              Ingresos
            </p>
            <p className={`text-lg font-bold text-green-600`}>
              {formatCurrency(stats.sales)}
            </p>
          </div>
          <Coins className={`w-8 h-8 text-green-600`} />
        </div>
      </div>

      {/* Ventas Completadas */}
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
              Completadas
            </p>
            <p className={`text-2xl font-bold text-blue-600`}>
              {stats.completed}
            </p>
          </div>
          <CheckCircle className={`w-8 h-8 text-blue-600`} />
        </div>
      </div>

      {/* Ventas Pendientes */}
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
              Pendientes
            </p>
            <p className={`text-2xl font-bold text-orange-500`}>
              {stats.pending}
            </p>
          </div>
          <Clock className={`w-8 h-8 text-orange-500`} />
        </div>
      </div>

      {/* Ventas en Efectivo */}
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
              Efectivo
            </p>
            <p className={`text-2xl font-bold ${colors.text.primary}`}>
              {stats.cash}
            </p>
          </div>
          <Banknote className={`w-8 h-8 ${isDark ? 'text-green-500' : 'text-green-600'}`} />
        </div>
      </div>

      {/* Ventas con Tarjeta */}
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
              Tarjeta
            </p>
            <p className={`text-2xl font-bold ${colors.text.primary}`}>
              {stats.card}
            </p>
          </div>
          <CreditCard className={`w-8 h-8 ${isDark ? 'text-blue-500' : 'text-blue-600'}`} />
        </div>
      </div>

      {/* Ventas con QR */}
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl p-4 shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
              QR
            </p>
            <p className={`text-2xl font-bold ${colors.text.primary}`}>
              {stats.qr}
            </p>
          </div>
          <Smartphone className={`w-8 h-8 ${isDark ? 'text-purple-500' : 'text-purple-600'}`} />
        </div>
      </div>
    </div>
  );
});

