import { useQuery } from "@tanstack/react-query";
import { reportsQueries } from "../const/reports-queries";
import { getCustomersReport } from "../services/report.service";
import type { GetCustomersReportParams } from "../interfaces";
import { useSocketEvent } from "@/lib/socket";

/**
 * Hook para obtener el reporte de clientes
 * Retorna datos del reporte y estados de carga
 */
export const useGetCustomersReport = (
  params: GetCustomersReportParams,
  enabled: boolean = true,
) => {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: reportsQueries.customersReport(params),
    queryFn: () => getCustomersReport(params),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
  });

  // Socket real-time
  useSocketEvent("sale:created", reportsQueries.allReports);

  return {
    report: data?.report,
    isLoading,
    isFetching,
    error,
    refetch,
  };
};
