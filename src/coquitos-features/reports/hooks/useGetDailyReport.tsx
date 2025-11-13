import { useQuery } from "@tanstack/react-query";
import { reportsQueries } from "../const/reports-queries";
import { getDailyReport } from "../services/report.service";
import type { GetDailyReportParams } from "../interfaces";

/**
 * Hook para obtener el reporte diario
 * Retorna datos del reporte y estados de carga
 */
export const useGetDailyReport = (params: GetDailyReportParams, enabled: boolean = true) => {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: reportsQueries.dailyReport(params),
    queryFn: () => getDailyReport(params),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
  });

  return {
    report: data?.report,
    isLoading,
    isFetching,
    error,
    refetch,
  };
};

