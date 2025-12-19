import { memo, useMemo } from "react";
import {
  ShoppingCart,
  CheckCircle,
  Coins,
  Banknote,
  CreditCard,
  Smartphone,
} from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { formatCurrency } from "../helpers";
import { SaleStatCard } from "./SaleStatCard";

interface SaleStatsProps {
  totalSalesCount: number;
  totalSalesAmount: number;
  completedSales: number;
  cashSales: number;
  cardSales: number;
  qrSales: number;
}

/**
 * Componente que muestra estadísticas de ventas
 * Grid de 4 columnas con métricas clave del negocio
 */
export const SaleStats = memo(
  ({
    totalSalesCount,
    totalSalesAmount,
    completedSales,
    cashSales,
    cardSales,
    qrSales,
  }: SaleStatsProps) => {
    const { isDark } = useTheme();

    // Calcular estadísticas adicionales
    const stats = useMemo(
      () => ({
        count: totalSalesCount,
        amount: totalSalesAmount,
        completed: completedSales,
        cash: cashSales,
        card: cardSales,
        qr: qrSales,
      }),
      [
        totalSalesCount,
        totalSalesAmount,
        completedSales,
        cashSales,
        cardSales,
        qrSales,
      ]
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Ventas (Cantidad) */}
        <SaleStatCard
          label="Total Ventas"
          value={stats.count}
          icon={ShoppingCart}
        />

        {/* Ingresos Totales */}
        <SaleStatCard
          label="Ingresos"
          value={formatCurrency(stats.amount)}
          icon={Coins}
          iconColor="text-green-600"
          valueColor="text-green-600"
          valueSize="lg"
        />

        {/* Ventas en Efectivo */}
        <SaleStatCard
          label="Efectivo"
          value={stats.cash}
          icon={Banknote}
          iconColor={isDark ? "text-green-500" : "text-green-600"}
        />

        {/* Ventas con Tarjeta */}
        <SaleStatCard
          label="Tarjeta"
          value={stats.card}
          icon={CreditCard}
          iconColor={isDark ? "text-blue-500" : "text-blue-600"}
        />

        {/* Ventas con QR */}
        <SaleStatCard
          label="QR"
          value={stats.qr}
          icon={Smartphone}
          iconColor={isDark ? "text-purple-500" : "text-purple-600"}
        />

        {/* Ventas Completadas */}
        <SaleStatCard
          label="Completadas"
          value={stats.completed}
          icon={CheckCircle}
          iconColor="text-blue-600"
          valueColor="text-blue-600"
        />
      </div>
    );
  }
);
