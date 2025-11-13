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
  options?: { filterByToday?: boolean; startDate?: Date; endDate?: Date }
) => {
  const { filterByToday = false, startDate, endDate } = options || {};

  // Calcular fechas según los parámetros recibidos
  const dateRange = useMemo(() => {
    // Si hay fechas personalizadas explícitas, usarlas (tienen prioridad)
    if (startDate && endDate) {
      return {
        startDate,
        endDate,
      };
    }
    
    // Si se requiere filtrar por hoy y no hay fechas personalizadas
    if (filterByToday) {
      const today = new Date();
      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);
      
      return {
        startDate: startOfDay,
        endDate: endOfDay,
      };
    }
    
    // Si no hay filtro de fecha, retornar undefined para obtener todas las órdenes
    return undefined;
  }, [filterByToday, startDate, endDate]);

  // Query key estable - serializar fechas a strings para evitar problemas con objetos Date
  const queryKey = useMemo(() => {
    const key: unknown[] = [...ordersQueries.allOrders, 'stats', filters];
    if (dateRange) {
      // Serializar fechas a strings ISO para el queryKey
      key.push(
        `startDate:${dateRange.startDate.toISOString()}`,
        `endDate:${dateRange.endDate.toISOString()}`
      );
    } else {
      key.push('all-dates'); // Marcador para "todas las fechas"
    }
    return key;
  }, [filters, dateRange]);

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: async () => {
      // Obtener todas las órdenes para calcular stats precisos
      // Usar un límite alto para obtener todas las órdenes que coincidan con los filtros
      const params: SearchOrdersParams = {
        ...filters,
        page: 1,
        limit: 1000, // Aumentar límite para obtener más órdenes en stats
      };
      
      // Solo agregar fechas si dateRange está definido
      if (dateRange) {
        params.startDate = dateRange.startDate;
        params.endDate = dateRange.endDate;
      }
      
      const response = await getOrders(params);
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

