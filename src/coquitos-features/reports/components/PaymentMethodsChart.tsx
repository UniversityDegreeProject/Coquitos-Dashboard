import { useTheme } from "@/shared/hooks/useTheme";
import { formatCurrency, formatPercentage } from "@/shared/reports";
import type { SalesReport } from "../interfaces";

interface PaymentMethodsChartProps {
  report: SalesReport;
}

/**
 * Componente para mostrar el gráfico de métodos de pago
 */
export const PaymentMethodsChart = ({ report }: PaymentMethodsChartProps) => {
  const { isDark } = useTheme();

  const paymentMethods = [
    {
      method: "Efectivo",
      amount: report.salesByPaymentMethod.cash,
      percentage:
        report.totalSales > 0
          ? (report.salesByPaymentMethod.cash / report.totalSales) * 100
          : 0,
      color: "bg-green-500",
    },
    {
      method: "Tarjeta",
      amount: report.salesByPaymentMethod.card,
      percentage:
        report.totalSales > 0
          ? (report.salesByPaymentMethod.card / report.totalSales) * 100
          : 0,
      color: "bg-blue-500",
    },
    {
      method: "QR",
      amount: report.salesByPaymentMethod.qr,
      percentage:
        report.totalSales > 0
          ? (report.salesByPaymentMethod.qr / report.totalSales) * 100
          : 0,
      color: "bg-orange-500",
    },
  ].filter((item) => item.method !== "Tarjeta");

  return (
    <div
      className={`rounded-lg p-6 shadow-sm border ${
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
      }`}
    >
      <h2
        className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-800"}`}
      >
        Métodos de Pago
      </h2>
      <div className="space-y-4">
        {paymentMethods.map((method, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${method.color}`}></div>
              <span
                className={`font-medium ${isDark ? "text-gray-300" : "text-gray-800"}`}
              >
                {method.method}
              </span>
            </div>
            <div className="text-right">
              <p
                className={`font-semibold ${isDark ? "text-white" : "text-gray-800"}`}
              >
                {formatCurrency(method.amount)}
              </p>
              <p
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                {formatPercentage(method.percentage)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div
        className={`mt-4 pt-4 border-t ${isDark ? "border-slate-700" : "border-gray-200"}`}
      >
        <div className="flex justify-between items-center font-semibold text-lg">
          <span className={isDark ? "text-gray-300" : "text-gray-800"}>
            Total:
          </span>
          <span className="text-green-600">
            {formatCurrency(report.totalSales)}
          </span>
        </div>
      </div>
    </div>
  );
};
