import { memo, useMemo } from "react";
import { TrendingUp, ShoppingBag, DollarSign } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { useSalesStats } from "@/coquitos-features/sales/hooks/useSalesStats";
import { formatCurrency } from "@/coquitos-features/sales/helpers/format-currency";

/**
 * Componente de tarjetas KPI del dashboard
 * Muestra: Ventas del Día, Órdenes del Día, Ticket Promedio, Clientes Nuevos
 */
export const KPICards = memo(() => {
  const { isDark } = useTheme();

  // Obtener estadísticas de ventas del día
  const { stats, isLoading } = useSalesStats(
    {
      paymentMethod: "",
      status: "",
    },
    {
      filterByToday: true, // Filtrar por el día actual en el dashboard
    }
  );

  // Calcular ticket promedio
  const averageTicket = useMemo(() => {
    if (stats.totalSalesCount === 0) return 0;
    return stats.totalSalesAmount / stats.totalSalesCount;
  }, [stats.totalSalesCount, stats.totalSalesAmount]);

  // KPIs a mostrar
  const kpis = useMemo(
    () => [
      {
        title: "Ventas del Día",
        value: formatCurrency(stats.totalSalesAmount),
        change: "",
        icon: DollarSign,
        color: "text-green-600",
        bgColor: isDark ? "bg-green-500/10" : "bg-green-50",
      },
      {
        title: "Ventas realizadas",
        value: stats.totalSalesCount.toString(),
        change: "",
        icon: ShoppingBag,
        color: "text-orange-600",
        bgColor: isDark ? "bg-orange-500/10" : "bg-orange-50",
      },
      {
        title: "Venta promedio",
        value: formatCurrency(averageTicket),
        change: "",
        icon: TrendingUp,
        color: "text-blue-600",
        bgColor: isDark ? "bg-blue-500/10" : "bg-blue-50",
      },
    ],
    [stats.totalSalesAmount, stats.totalSalesCount, averageTicket, isDark]
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`rounded-lg p-6 shadow-sm border ${
              isDark
                ? "bg-[#1E293B] border-[#334155]"
                : "bg-white border-gray-100"
            }`}
          >
            <div className="h-20 animate-pulse">
              <div
                className={`h-4 w-24 rounded ${
                  isDark ? "bg-gray-700" : "bg-gray-200"
                } mb-4`}
              />
              <div
                className={`h-8 w-32 rounded ${
                  isDark ? "bg-gray-700" : "bg-gray-200"
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kpis.map((kpi, index) => (
        <div
          key={index}
          className={`rounded-lg p-6 shadow-sm border transition-all duration-200 hover:shadow-md ${
            isDark
              ? "bg-[#1E293B] border-[#334155]"
              : "bg-white border-gray-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
              <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
            </div>
            <span className={`text-sm font-medium ${kpi.color}`}>
              {kpi.change}
            </span>
          </div>
          <div className="mt-4">
            <p
              className={`text-sm font-medium ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {kpi.title}
            </p>
            <p
              className={`text-2xl font-bold mt-1 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {kpi.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
});
