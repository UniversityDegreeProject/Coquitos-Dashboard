import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SearchSalesParams } from "../interfaces";
import { salesQueries } from "../const/sales-queries";
import { getSales } from "../services/sale.service";
import { useSocketEvent } from "@/lib/socket";
import { getTodayDateKey, getTodayRange } from "@/shared/helpers";

export interface SalesStatsData {
  totalSalesCount: number;
  totalSalesAmount: number;
  completedSales: number;
  cashSales: number;
  qrSales: number;
  cashTotal: number;
  qrTotal: number;
}

/**
 * Hook para obtener estadísticas globales de ventas
 */
export const useSalesStats = (
  filters: Pick<SearchSalesParams, "paymentMethod" | "status">,
  options?: {
    filterByToday?: boolean;
    startDate?: Date;
    endDate?: Date;
    userId?: string;
  },
) => {
  const { filterByToday = false, startDate, endDate, userId } = options || {};

  // Calcular fechas según los parámetros recibidos
  const todayKey = getTodayDateKey();

  const dateRange = useMemo(() => {
    if (startDate && endDate) {
      return {
        startDate,
        endDate,
      };
    }

    if (filterByToday) {
      return getTodayRange(todayKey);
    }

    return undefined;
  }, [filterByToday, startDate, endDate, todayKey]);

  // Query key estable
  const queryKey = useMemo(() => {
    const key: unknown[] = [...salesQueries.allSales, "stats", filters];
    if (userId) {
      key.push(`userId:${userId}`);
    }
    if (dateRange) {
      key.push(
        `startDate:${dateRange.startDate.toISOString()}`,
        `endDate:${dateRange.endDate.toISOString()}`,
      );
    } else {
      key.push("all-dates");
    }
    return key;
  }, [filters, dateRange, userId]);

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: async () => {
      const params: SearchSalesParams = {
        ...filters,
        page: 1,
        limit: 1000,
      };

      // Filtrar por usuario si se proporciona
      if (userId) {
        params.userId = userId;
      }

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

  // Socket real-time invalidación de estadísticas
  useSocketEvent("sale:created", salesQueries.allSales);

  // Calcular estadísticas
  const stats: SalesStatsData = useMemo(() => {
    if (!data?.data) {
      return {
        totalSalesCount: 0,
        totalSalesAmount: 0,
        completedSales: 0,
        cashSales: 0,
        qrSales: 0,
        cashTotal: 0,
        qrTotal: 0,
      };
    }

    const sales = data.data;

    // Filtrar ventas por método de pago
    const cashSalesData = sales.filter(
      (sale) => sale.paymentMethod === "Efectivo",
    );
    const qrSalesData = sales.filter((sale) => sale.paymentMethod === "QR");

    return {
      totalSalesCount: data.total ?? 0,
      totalSalesAmount: sales.reduce((sum, sale) => sum + sale.total, 0),
      completedSales: sales.filter((sale) => sale.status === "Completado")
        .length,
      cashSales: cashSalesData.length,
      qrSales: qrSalesData.length,
      cashTotal: cashSalesData.reduce((sum, sale) => sum + sale.total, 0),
      qrTotal: qrSalesData.reduce((sum, sale) => sum + sale.total, 0),
    };
  }, [data]);

  return {
    stats,
    isLoading,
    isError,
  };
};
