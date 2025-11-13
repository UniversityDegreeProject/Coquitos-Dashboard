import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SearchOrdersParams } from "../interfaces";
import { ordersQueries } from "../const/orders-queries";
import { getOrders } from "../services/order.service";

export interface OrdersStatsData {
  totalOrders: number;
  totalSales: number;
  // pendingOrders: number;
  completedOrders: number;
  cashOrders: number;
  cardOrders: number;
  qrOrders: number;
}

/**
 * Hook para obtener estadísticas globales de órdenes
 * Hace una query separada que obtiene TODAS las órdenes (sin límite de paginación)
 * para calcular estadísticas precisas independientes de la página actual
 * 
 * Por defecto filtra por el día actual si no se especifican fechas
 */
export const useOrdersStats = (
  filters: Pick<SearchOrdersParams, 'paymentMethod' | 'status'>,
  options?: { filterByToday?: boolean }
) => {
  const { filterByToday = true } = options || {};

  // Calcular fechas del día actual si se requiere filtrar por hoy
  const todayDates = useMemo(() => {
    if (!filterByToday) return undefined;
    
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    
    return {
      startDate: startOfDay,
      endDate: endOfDay,
    };
  }, [filterByToday]);

  const { data, isLoading, isError } = useQuery({
    queryKey: [...ordersQueries.allOrders, 'stats', filters, todayDates],
    queryFn: async () => {
      const response = await getOrders({
        ...filters,
        ...(todayDates && {
          startDate: todayDates.startDate,
          endDate: todayDates.endDate,
        }),
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
        // pendingOrders: 0,
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
      // pendingOrders: orders.filter(order => order.status === 'Pendiente').length,
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

