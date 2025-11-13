import { memo, useMemo } from "react";
import { useTheme } from "@/shared/hooks/useTheme";
import { useGetOrders } from "@/coquitos-features/orders/hooks/useGetOrders";
import { formatCurrency } from "@/coquitos-features/orders/helpers/format-currency";
import { GenericGridLoader } from "@/shared/components";
import type { Order } from "@/coquitos-features/orders/interfaces";

/**
 * Componente de tabla de últimas órdenes
 * Muestra las 5 órdenes más recientes completadas
 */
export const RecentOrdersTable = memo(() => {
  const { isDark } = useTheme();

  // Calcular fechas del día actual
  const todayDates = useMemo(() => {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    
    return {
      startDate: startOfDay,
      endDate: endOfDay,
    };
  }, []);

  // Obtener últimas órdenes completadas del día actual
  const { orders, isLoading } = useGetOrders({
    page: 1,
    limit: 5,
    status: "Completado",
    startDate: todayDates.startDate,
    endDate: todayDates.endDate,
  });

  // Formatear órdenes para la tabla
  const formattedOrders = useMemo(() => {
    return orders.map((order: Order) => {
      const customerName = order.customer
        ? `${order.customer.firstName} ${order.customer.lastName}`
        : "Cliente no disponible";

      const orderTime = order.createdAt
        ? new Date(order.createdAt).toLocaleTimeString("es-BO", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "N/A";

      return {
        id: order.orderNumber || order.id || "N/A",
        client: customerName,
        total: order.total,
        status: order.status || "Completado",
        time: orderTime,
      };
    });
  }, [orders]);

  if (isLoading) {
    return (
      <div
        className={`rounded-lg shadow-sm border ${
          isDark ? "bg-[#1E293B] border-[#334155]" : "bg-white border-gray-100"
        }`}
      >
        <div className={`p-6 border-b ${isDark ? "border-[#334155]" : "border-gray-100"}`}>
          <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
            Últimas Órdenes
          </h2>
        </div>
        <div className="p-6">
          <GenericGridLoader title="Cargando órdenes..." />
        </div>
      </div>
    );
  }

  if (formattedOrders.length === 0) {
    return (
      <div
        className={`rounded-lg shadow-sm border ${
          isDark ? "bg-[#1E293B] border-[#334155]" : "bg-white border-gray-100"
        }`}
      >
        <div className={`p-6 border-b ${isDark ? "border-[#334155]" : "border-gray-100"}`}>
          <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
            Últimas Órdenes
          </h2>
        </div>
        <div className="p-12 text-center">
          <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            No hay órdenes recientes
          </p>
        </div>
      </div>
    );
  }

  const getStatusBadgeClass = (status: string) => {
    const baseClasses = "inline-flex px-2 py-1 text-xs font-semibold rounded-full";
    
    switch (status) {
      case "Completado":
        return `${baseClasses} ${isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-800"}`;
      case "Pendiente":
        return `${baseClasses} ${isDark ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-100 text-yellow-800"}`;
      case "Cancelado":
        return `${baseClasses} ${isDark ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-800"}`;
      default:
        return `${baseClasses} ${isDark ? "bg-gray-500/20 text-gray-400" : "bg-gray-100 text-gray-800"}`;
    }
  };

  return (
    <div
      className={`rounded-lg shadow-sm border ${
        isDark ? "bg-[#1E293B] border-[#334155]" : "bg-white border-gray-100"
      }`}
    >
      <div className={`p-6 border-b ${isDark ? "border-[#334155]" : "border-gray-100"}`}>
        <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
          Últimas Órdenes
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
                ID Orden
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
          <tbody className={`divide-y ${isDark ? "divide-[#334155] bg-[#1E293B]" : "divide-gray-200 bg-white"}`}>
            {formattedOrders.map((order, index) => (
              <tr
                key={index}
                className={`transition-colors ${isDark ? "hover:bg-[#0F172A]" : "hover:bg-gray-50"}`}
              >
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  isDark ? "text-white" : "text-gray-900"
                }`}>
                  {order.id}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}>
                  {order.client}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}>
                  {order.time}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                  isDark ? "text-green-400" : "text-green-600"
                }`}>
                  {formatCurrency(order.total)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusBadgeClass(order.status)}>{order.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

