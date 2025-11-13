import { useQuery } from "@tanstack/react-query";
import { reportsQueries } from "../const/reports-queries";
import { getCashRegisterSummary } from "../services/report.service";
import type { GetCashRegisterSummaryParams } from "../interfaces";

/**
 * Hook para obtener el resumen de cierres de caja
 * Retorna datos del reporte y estados de carga
 */
export const useGetCashRegisterSummary = (params: GetCashRegisterSummaryParams, enabled: boolean = true) => {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: reportsQueries.cashRegisterSummary(params),
    queryFn: () => getCashRegisterSummary(params),
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

