import { memo, useMemo } from "react";
import { useTheme } from "@/shared/hooks/useTheme";
import { useGetSales } from "@/coquitos-features/sales/hooks/useGetSales";
import { formatCurrency } from "@/coquitos-features/sales/helpers/format-currency";
import { GenericGridLoader } from "@/shared/components";
import type { Sale } from "@/coquitos-features/sales/interfaces";
import { getTodayDateKey, getTodayRange } from "@/shared/helpers";

/**
 * Componente de tabla de últimas ventas
 * Muestra las 5 ventas más recientes completadas
 */
export const RecentSalesTable = memo(() => {
  const { isDark } = useTheme();

  const todayKey = getTodayDateKey();

  // Calcular fechas del día actual usando componentes locales para evitar problemas de zona horaria
  const todayDates = useMemo(() => {
    return getTodayRange(todayKey);
  }, [todayKey]);

  // Obtener últimas ventas completadas del día actual
  const { sales, isLoading } = useGetSales({
    page: 1,
    limit: 5,
    status: "Completado",
    startDate: todayDates.startDate,
    endDate: todayDates.endDate,
  });

  // Formatear ventas para la tabla
  const formattedSales = useMemo(() => {
    return sales.map((sale: Sale) => {
      const customerName = sale.customer
        ? `${sale.customer.firstName} ${sale.customer.lastName}`
        : "Cliente no disponible";

      const saleTime = sale.createdAt
        ? new Date(sale.createdAt).toLocaleTimeString("es-BO", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "N/A";

      return {
        id: sale.saleNumber || sale.id || "N/A",
        client: customerName,
        total: sale.total,
        status: sale.status || "Completado",
        time: saleTime,
      };
    });
  }, [sales]);

  if (isLoading) {
    return (
      <div
        className={`rounded-lg shadow-sm border ${
          isDark ? "bg-[#1E293B] border-[#334155]" : "bg-white border-gray-100"
        }`}
      >
        <div
          className={`p-6 border-b ${
            isDark ? "border-[#334155]" : "border-gray-100"
          }`}
        >
          <h2
            className={`text-lg font-semibold ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            Últimas Ventas
          </h2>
        </div>
        <div className="p-6">
          <GenericGridLoader title="Cargando ventas..." />
        </div>
      </div>
    );
  }

  if (formattedSales.length === 0) {
    return (
      <div
        className={`rounded-lg shadow-sm border ${
          isDark ? "bg-[#1E293B] border-[#334155]" : "bg-white border-gray-100"
        }`}
      >
        <div
          className={`p-6 border-b ${
            isDark ? "border-[#334155]" : "border-gray-100"
          }`}
        >
          <h2
            className={`text-lg font-semibold ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            Últimas Ventas
          </h2>
        </div>
        <div className="p-12 text-center">
          <p
            className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}
          >
            No hay ventas recientes
          </p>
        </div>
      </div>
    );
  }

  const getStatusBadgeClass = (status: string) => {
    const baseClasses =
      "inline-flex px-2 py-1 text-xs font-semibold rounded-full";

    switch (status) {
      case "Completado":
        return `${baseClasses} ${
          isDark
            ? "bg-green-500/20 text-green-400"
            : "bg-green-100 text-green-800"
        }`;
      case "Pendiente":
        return `${baseClasses} ${
          isDark
            ? "bg-yellow-500/20 text-yellow-400"
            : "bg-yellow-100 text-yellow-800"
        }`;
      case "Cancelado":
        return `${baseClasses} ${
          isDark ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-800"
        }`;
      default:
        return `${baseClasses} ${
          isDark ? "bg-gray-500/20 text-gray-400" : "bg-gray-100 text-gray-800"
        }`;
    }
  };

  return (
    <div
      className={`rounded-lg shadow-sm border ${
        isDark ? "bg-[#1E293B] border-[#334155]" : "bg-white border-gray-100"
      }`}
    >
      <div
        className={`p-6 border-b ${
          isDark ? "border-[#334155]" : "border-gray-100"
        }`}
      >
        <h2
          className={`text-lg font-semibold ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          Últimas Ventas
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={isDark ? "bg-[#0F172A]" : "bg-gray-50"}>
            <tr>
              <th
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                ID Venta
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Cliente
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Hora
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Total
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Estado
              </th>
            </tr>
          </thead>
          <tbody
            className={`divide-y ${
              isDark
                ? "divide-[#334155] bg-[#1E293B]"
                : "divide-gray-200 bg-white"
            }`}
          >
            {formattedSales.map((sale, index) => (
              <tr
                key={index}
                className={`transition-colors ${
                  isDark ? "hover:bg-[#0F172A]" : "hover:bg-gray-50"
                }`}
              >
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {sale.id}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {sale.client}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {sale.time}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                    isDark ? "text-green-400" : "text-green-600"
                  }`}
                >
                  {formatCurrency(sale.total)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusBadgeClass(sale.status)}>
                    {sale.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
