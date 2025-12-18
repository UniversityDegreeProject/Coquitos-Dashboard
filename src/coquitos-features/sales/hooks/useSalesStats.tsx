import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SearchSalesParams } from "../interfaces";
import { salesQueries } from "../const/sales-queries";
import { getSales } from "../services/sale.service";

export interface SalesStatsData {
  totalSalesCount: number;
  totalSalesAmount: number;
  completedSales: number;
  cashSales: number;
  cardSales: number;
  qrSales: number;
}

/**
 * Hook para obtener estadísticas globales de ventas
 */
export const useSalesStats = (
  filters: Pick<SearchSalesParams, "paymentMethod" | "status">,
  options?: { filterByToday?: boolean; startDate?: Date; endDate?: Date }
) => {
  const { filterByToday = false, startDate, endDate } = options || {};

  // Calcular fechas según los parámetros recibidos
  const dateRange = useMemo(() => {
    if (startDate && endDate) {
      return {
        startDate,
        endDate,
      };
    }

    if (filterByToday) {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      const day = today.getDate();

      const startOfDay = new Date(year, month, day, 0, 0, 0, 0);
      const endOfDay = new Date(year, month, day, 23, 59, 59, 999);

      return {
        startDate: startOfDay,
        endDate: endOfDay,
      };
    }

    return undefined;
  }, [filterByToday, startDate, endDate]);

  // Query key estable
  const queryKey = useMemo(() => {
    const key: unknown[] = [...salesQueries.allSales, "stats", filters];
    if (dateRange) {
      key.push(
        `startDate:${dateRange.startDate.toISOString()}`,
        `endDate:${dateRange.endDate.toISOString()}`
      );
    } else {
      key.push("all-dates");
    }
    return key;
  }, [filters, dateRange]);

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: async () => {
      const params: SearchSalesParams = {
        ...filters,
        page: 1,
        limit: 1000,
      };

      if (dateRange) {
        params.startDate = dateRange.startDate;
        params.endDate = dateRange.endDate;
      }

      const response = await getSales(params);
      return response;
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  // Calcular estadísticas
  const stats: SalesStatsData = useMemo(() => {
    if (!data?.data) {
      return {
        totalSalesCount: 0,
        totalSalesAmount: 0,
        completedSales: 0,
        cashSales: 0,
        cardSales: 0,
        qrSales: 0,
      };
    }

    const sales = data.data;

    return {
      totalSalesCount: data.total ?? 0,
      totalSalesAmount: sales.reduce((sum, sale) => sum + sale.total, 0),
      completedSales: sales.filter((sale) => sale.status === "Completado")
        .length,
      cashSales: sales.filter((sale) => sale.paymentMethod === "Efectivo")
        .length,
      cardSales: sales.filter((sale) => sale.paymentMethod === "Tarjeta")
        .length,
      qrSales: sales.filter((sale) => sale.paymentMethod === "QR").length,
    };
  }, [data]);

  return {
    stats,
    isLoading,
    isError,
  };
};
