import { useQuery } from "@tanstack/react-query";
import { reportsQueries } from "../const/reports-queries";
import { getProductsReport } from "../services/report.service";
import type { GetProductsReportParams } from "../interfaces";
import { useSocketEvent } from "@/lib/socket";

/**
 * Hook para obtener el reporte de productos
 * Retorna datos del reporte y estados de carga
 */
export const useGetProductsReport = (
  params: GetProductsReportParams,
  enabled: boolean = true,
) => {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: reportsQueries.productsReport(params),
    queryFn: () => getProductsReport(params),
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
