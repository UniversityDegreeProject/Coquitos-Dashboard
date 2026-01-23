import { useQuery } from "@tanstack/react-query";
import { reportsQueries } from "../const/reports-queries";
import { getSellersReport } from "../services/report.service";
import type { GetSellersReportParams } from "@/shared/reports";

/**
 * Hook para obtener el reporte de vendedores
 * Retorna datos del reporte y estados de carga
 */
export const useGetSellersReport = (
  params: GetSellersReportParams,
  enabled: boolean = true,
) => {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: reportsQueries.sellersReport(params),
    queryFn: () => getSellersReport(params),
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
