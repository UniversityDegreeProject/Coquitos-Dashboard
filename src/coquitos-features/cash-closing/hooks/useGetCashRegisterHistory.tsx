import { useQuery } from "@tanstack/react-query";
import { getCashRegisterHistory } from "../services/cash-register.service";
import { cashRegisterQueries } from "../const";
import type { GetCashRegisterHistoryParams, CashRegister } from "../interfaces";
import { useSocketEvent } from "@/lib/socket";

/**
 * Hook para obtener el historial de cierres de caja
 * Retorna lista paginada de cajas cerradas
 */
export const useGetCashRegisterHistory = (
  params: GetCashRegisterHistoryParams,
) => {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: [...cashRegisterQueries.allCashRegisters, "history", params],
    queryFn: () => getCashRegisterHistory(params),
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
  });

  // Socket real-time invalidación de historial
  useSocketEvent("cash-register:closed", cashRegisterQueries.allCashRegisters);

  return {
    cashRegisters: (data?.data ?? []) as CashRegister[],
    total: data?.total ?? 0,
    page: data?.page ?? 1,
    limit: data?.limit ?? 10,
    totalPages: data?.totalPages ?? 0,
    isLoading,
    isFetching,
    error,
  };
};
