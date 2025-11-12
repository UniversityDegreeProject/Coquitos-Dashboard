import { useMemo } from "react";
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
  const { data, isLoading, isError } = useQuery({
    queryKey: [...ordersQueries.allOrders, 'stats', filters],
    queryFn: async () => {
      const response = await getOrders({
        ...filters,
        page: 1,
        limit: 100, 
      });
      return response;
    },
    staleTime: 30000, 
    refetchOnWindowFocus: false, 
  });

  // Calcular estadísticas con useMemo para evitar recálculos innecesarios
  const stats: OrdersStatsData = useMemo(() => {
    if (!data?.data) {
      return {
        totalOrders: 0,
        totalSales: 0,
        pendingOrders: 0,
        completedOrders: 0,
        cashOrders: 0,
        cardOrders: 0,
        qrOrders: 0,
      };
    }

    const orders = data.data;

    return {
      totalOrders: data.total ?? 0,
      totalSales: orders.reduce((sum, order) => sum + order.total, 0),
      pendingOrders: orders.filter(order => order.status === 'Pendiente').length,
      completedOrders: orders.filter(order => order.status === 'Completado').length,
      cashOrders: orders.filter(order => order.paymentMethod === 'Efectivo').length,
      cardOrders: orders.filter(order => order.paymentMethod === 'Tarjeta').length,
      qrOrders: orders.filter(order => order.paymentMethod === 'QR').length,
    };
  }, [data]);

  return {
    stats,
    isLoading,
    isError,
  };
};

