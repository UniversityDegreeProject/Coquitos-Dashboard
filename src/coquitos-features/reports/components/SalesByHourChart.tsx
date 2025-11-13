import { useTheme } from "@/shared/hooks/useTheme";
import { formatCurrency } from "@/shared/reports";
import type { SalesReport } from "../interfaces";

interface SalesByHourChartProps {
  report: SalesReport;
}

/**
 * Componente para mostrar el gráfico de ventas por hora
 */
export const SalesByHourChart = ({ report }: SalesByHourChartProps) => {
  const { isDark } = useTheme();

  const maxSales = Math.max(...report.salesByHour.map((h) => h.total), 1);

  // Filtrar solo horas con ventas o mostrar todas si hay muchas horas con datos
  const hoursWithSales = report.salesByHour.filter((h) => h.total > 0);
  const displayHours = hoursWithSales.length > 0 ? hoursWithSales : report.salesByHour;

  return (
    <div
      className={`rounded-lg p-6 shadow-sm border ${
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
      }`}
    >
      <h2 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-800"}`}>
        Ventas por Hora
      </h2>
      <div className="overflow-x-auto">
        <div className="h-64 flex items-end justify-between space-x-1 min-w-max px-2">
          {displayHours.map((hour, index) => {
            const height = maxSales > 0 ? (hour.total / maxSales) * 200 : 0;
            return (
              <div key={index} className="flex flex-col items-center min-w-[60px]">
                <div className="flex flex-col items-center mb-2">
                  <span className={`text-xs whitespace-nowrap ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {formatCurrency(hour.total)}
                  </span>
                </div>
                <div
                  className="w-full bg-gradient-to-t from-orange-400 to-orange-300 rounded-t-sm transition-all duration-300 hover:from-orange-500 hover:to-orange-400"
                  style={{ height: `${height}px`, minHeight: hour.total > 0 ? "4px" : "0px" }}
                  title={`${hour.hour}:00 - ${formatCurrency(hour.total)}`}
                ></div>
                <span className={`text-xs mt-2 whitespace-nowrap ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {hour.hour}:00
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

