import { memo, useMemo } from "react";
import { ShoppingCart, CheckCircle, /* Clock, */ Coins, Banknote, CreditCard, Smartphone } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { formatCurrency } from "../helpers";
import { OrderStatCard } from "./OrderStatCard";

interface OrderStatsProps {
  totalOrders: number;
  totalSales: number;
  // pendingOrders: number;
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
  // pendingOrders,
  completedOrders,
  cashOrders,
  cardOrders,
  qrOrders,
}: OrderStatsProps) => {
  const { isDark } = useTheme();

  // Calcular estadísticas adicionales
  const stats = useMemo(() => ({
    total: totalOrders,
    sales: totalSales,
    // pending: pendingOrders,
    completed: completedOrders,
    cash: cashOrders,
    card: cardOrders,
    qr: qrOrders,
  }), [totalOrders, totalSales, /* pendingOrders, */ completedOrders, cashOrders, cardOrders, qrOrders]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Órdenes */}
      <OrderStatCard
        label="Total Ventas"
        value={stats.total}
        icon={ShoppingCart}
      />

      {/* Ingresos Totales */}
      <OrderStatCard
        label="Ingresos"
        value={formatCurrency(stats.sales)}
        icon={Coins}
        iconColor="text-green-600"
        valueColor="text-green-600"
        valueSize="lg"
      />

      {/* Ventas Pendientes */}
      {/* <OrderStatCard
        label="Pendientes"
        value={stats.pending}
        icon={Clock}
        iconColor="text-orange-500"
        valueColor="text-orange-500"
      /> */}

      {/* Ventas en Efectivo */}
      <OrderStatCard
        label="Efectivo"
        value={stats.cash}
        icon={Banknote}
        iconColor={isDark ? 'text-green-500' : 'text-green-600'}
      />

      {/* Ventas con Tarjeta */}
      <OrderStatCard
        label="Tarjeta"
        value={stats.card}
        icon={CreditCard}
        iconColor={isDark ? 'text-blue-500' : 'text-blue-600'}
      />

      {/* Ventas con QR */}
      <OrderStatCard
        label="QR"
        value={stats.qr}
        icon={Smartphone}
        iconColor={isDark ? 'text-purple-500' : 'text-purple-600'}
      />
      
      {/* Ventas Completadas */}
      <OrderStatCard
        label="Completadas"
        value={stats.completed}
        icon={CheckCircle}
        iconColor="text-blue-600"
        valueColor="text-blue-600"
      />

    </div>
  );
});

