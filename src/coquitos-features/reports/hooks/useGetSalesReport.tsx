import { useQuery } from "@tanstack/react-query";
import { reportsQueries } from "../const/reports-queries";
import { getSalesReport } from "../services/report.service";
import type { GetSalesReportParams } from "../interfaces";
import { useSocketEvent } from "@/lib/socket";

/**
 * Hook para obtener el reporte de ventas
 * Retorna datos del reporte y estados de carga
 */
export const useGetSalesReport = (
  params: GetSalesReportParams,
  enabled: boolean = true,
) => {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: reportsQueries.salesReport(params),
    queryFn: () => getSalesReport(params),
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
