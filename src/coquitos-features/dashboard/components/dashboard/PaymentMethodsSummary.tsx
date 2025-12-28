import { memo, useMemo } from "react";
import { Banknote, CreditCard, Smartphone, TrendingUp } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { useSalesStats } from "@/coquitos-features/sales/hooks/useSalesStats";
import { formatCurrency } from "@/coquitos-features/sales/helpers/format-currency";
import { Loader2 } from "lucide-react";

interface PaymentMethodData {
  method: "Efectivo" | "Tarjeta" | "QR";
  count: number;
  total: number;
  percentage: number;
  icon: typeof Banknote;
  color: string;
  bgColor: string;
}

/**
 * Componente de resumen de métodos de pago
 * Muestra estadísticas visuales de los métodos de pago utilizados
 */
export const PaymentMethodsSummary = memo(() => {
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

  // Calcular totales por método de pago
  const paymentMethods = useMemo(() => {
    const totalSales = stats.cashSales + stats.cashSales + stats.qrSales;

    // Calcular porcentajes aproximados basados en cantidad de ventas
    const cashPercentage =
      totalSales > 0 ? (stats.cashSales / totalSales) * 100 : 0;
    const cardPercentage =
      totalSales > 0 ? (stats.cashSales / totalSales) * 100 : 0;
    const qrPercentage =
      totalSales > 0 ? (stats.qrSales / totalSales) * 100 : 0;

    // Estimar totales por método basado en porcentajes
    const estimatedCashTotal = stats.totalSalesAmount * (cashPercentage / 100);
    const estimatedCardTotal = stats.totalSalesAmount * (cardPercentage / 100);
    const estimatedQrTotal = stats.totalSalesAmount * (qrPercentage / 100);

    const methods: PaymentMethodData[] = [
      {
        method: "Efectivo",
        count: stats.cashSales,
        total: estimatedCashTotal,
        percentage: cashPercentage,
        icon: Banknote,
        color: isDark ? "text-green-400" : "text-green-600",
        bgColor: isDark ? "bg-green-500/10" : "bg-green-50",
      },
      {
        method: "Tarjeta",
        count: stats.cashSales,
        total: estimatedCardTotal,
        percentage: cardPercentage,
        icon: CreditCard,
        color: isDark ? "text-blue-400" : "text-blue-600",
        bgColor: isDark ? "bg-blue-500/10" : "bg-blue-50",
      },
      {
        method: "QR",
        count: stats.qrSales,
        total: estimatedQrTotal,
        percentage: qrPercentage,
        icon: Smartphone,
        color: isDark ? "text-purple-400" : "text-purple-600",
        bgColor: isDark ? "bg-purple-500/10" : "bg-purple-50",
      },
    ];

    return methods.filter((m) => m.count > 0);
  }, [stats, isDark]);

  if (isLoading) {
    return (
      <div
        className={`rounded-lg p-6 shadow-sm border ${
          isDark ? "bg-[#1E293B] border-[#334155]" : "bg-white border-gray-100"
        }`}
      >
        <h2
          className={`text-lg font-semibold mb-4 ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          Métodos de Pago
        </h2>
        <div className="h-64 flex items-center justify-center">
          <Loader2
            className={`w-8 h-8 animate-spin ${
              isDark ? "text-[#F59E0B]" : "text-[#275081]"
            }`}
          />
        </div>
      </div>
    );
  }

  if (paymentMethods.length === 0) {
    return (
      <div
        className={`rounded-lg p-6 shadow-sm border ${
          isDark ? "bg-[#1E293B] border-[#334155]" : "bg-white border-gray-100"
        }`}
      >
        <h2
          className={`text-lg font-semibold mb-4 ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          Métodos de Pago
        </h2>
        <div className="flex flex-col items-center justify-center py-12">
          <TrendingUp
            className={`w-12 h-12 mb-4 ${
              isDark ? "text-gray-600" : "text-gray-400"
            }`}
          />
          <p
            className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}
          >
            No hay datos de métodos de pago disponibles
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg p-6 shadow-sm border ${
        isDark ? "bg-[#1E293B] border-[#334155]" : "bg-white border-gray-100"
      }`}
    >
      <h2
        className={`text-lg font-semibold mb-6 ${
          isDark ? "text-white" : "text-gray-800"
        }`}
      >
        Métodos de Pago
      </h2>

      <div className="space-y-4">
        {paymentMethods.map((method, index) => (
          <div key={index} className="space-y-2">
            {/* Header del método */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${method.bgColor}`}>
                  <method.icon className={`w-5 h-5 ${method.color}`} />
                </div>
                <div>
                  <p
                    className={`font-semibold ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {method.method}
                  </p>
                  <p
                    className={`text-xs ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {method.count} {method.count === 1 ? "venta" : "ventas"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-lg ${method.color}`}>
                  {formatCurrency(method.total)}
                </p>
                <p
                  className={`text-xs ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {method.percentage.toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Barra de progreso */}
            <div
              className={`h-2 rounded-full overflow-hidden ${
                isDark ? "bg-[#0F172A]" : "bg-gray-200"
              }`}
            >
              <div
                className={`h-full transition-all duration-500 ${
                  method.method === "Efectivo"
                    ? isDark
                      ? "bg-gradient-to-r from-green-500 to-green-400"
                      : "bg-gradient-to-r from-green-500 to-green-400"
                    : method.method === "Tarjeta"
                    ? isDark
                      ? "bg-gradient-to-r from-blue-500 to-blue-400"
                      : "bg-gradient-to-r from-blue-500 to-blue-400"
                    : isDark
                    ? "bg-gradient-to-r from-purple-500 to-purple-400"
                    : "bg-gradient-to-r from-purple-500 to-purple-400"
                }`}
                style={{ width: `${method.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Resumen total */}
      {paymentMethods.length > 0 && (
        <div
          className={`mt-6 pt-4 border-t ${
            isDark ? "border-[#334155]" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <p
              className={`font-semibold ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              Total Recaudado
            </p>
            <p
              className={`font-bold text-xl ${
                isDark ? "text-[#F59E0B]" : "text-[#275081]"
              }`}
            >
              {formatCurrency(stats.totalSalesAmount)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
});
