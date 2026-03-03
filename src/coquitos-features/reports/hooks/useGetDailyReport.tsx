import { useQuery } from "@tanstack/react-query";
import { reportsQueries } from "../const/reports-queries";
import { getDailyReport } from "../services/report.service";
import type { GetDailyReportParams } from "../interfaces";
import { useSocketEvent } from "@/lib/socket";

/**
 * Hook para obtener el reporte diario
 * Retorna datos del reporte y estados de carga
 */
export const useGetDailyReport = (
  params: GetDailyReportParams,
  enabled: boolean = true,
) => {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: reportsQueries.dailyReport(params),
    queryFn: () => getDailyReport(params),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
  });

  // Socket real-time: el reporte diario cambia cuando se registran ventas o cierres de caja
  useSocketEvent("sale:created", reportsQueries.allReports);
  useSocketEvent("cash-register:closed", reportsQueries.allReports);

  return {
    report: data?.report,
    isLoading,
    isFetching,
    error,
    refetch,
  };
};
