import { useQuery } from "@tanstack/react-query";
import type { SearchOrdersParams } from "../interfaces";
import { ordersQueries } from "../const/orders-queries";
import { getOrders } from "../services/order.service";

export interface OrdersStatsData {
  totalOrders: number;
  totalSales: number;
  pendingOrders: number;
  completedOrders: number;
  cashOrders: number;
  cardOrders: number;
  qrOrders: number;
}

/**
 * Hook para obtener estadísticas globales de órdenes
 * Hace una query separada que obtiene TODAS las órdenes (sin límite de paginación)
 * para calcular estadísticas precisas independientes de la página actual
 */
export const useOrdersStats = (filters: Pick<SearchOrdersParams, 'paymentMethod' | 'status'>) => {
  const { data, isLoading } = useQuery({
    queryKey: [...ordersQueries.allOrders, 'stats', filters],
    queryFn: async () => {
      // Obtener TODAS las órdenes con un límite muy alto para estadísticas
      const response = await getOrders({
        ...filters,
        page: 1,
        limit: 10000, // Límite alto para obtener todas las órdenes
      });
      return response;
    },
    staleTime: 30000, // Cache por 30 segundos
  });

  const stats: OrdersStatsData = {
    totalOrders: data?.total ?? 0,
    totalSales: data?.data.reduce((sum, order) => sum + order.total, 0) ?? 0,
    pendingOrders: data?.data.filter(order => order.status === 'Pendiente').length ?? 0,
    completedOrders: data?.data.filter(order => order.status === 'Completado').length ?? 0,
    cashOrders: data?.data.filter(order => order.paymentMethod === 'Efectivo').length ?? 0,
    cardOrders: data?.data.filter(order => order.paymentMethod === 'Tarjeta').length ?? 0,
    qrOrders: data?.data.filter(order => order.paymentMethod === 'QR').length ?? 0,
  };

  return {
    stats,
    isLoading,
  };
};

