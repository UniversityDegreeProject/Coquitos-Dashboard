import { useQuery } from "@tanstack/react-query";
import { getCurrentCashRegister } from "../services/cash-register.service";
import { cashRegisterQueries } from "../const";
import type { CashRegister } from "../interfaces";
import { useSocketEvent } from "@/lib/socket";

/**
 * Hook para obtener la caja actualmente abierta de un usuario
 */
export const useGetCurrentCashRegister = (userId: string | undefined) => {
  const query = useQuery({
    queryKey: userId
      ? cashRegisterQueries.currentCashRegister(userId)
      : ["cash-register-disabled"],
    queryFn: async () => {
      if (!userId) return null;
      const response = await getCurrentCashRegister(userId);
      return response.cashRegister;
    },
    enabled: !!userId,
    staleTime: 1000 * 30 * 5, // 5 minutos
    retry: 1,
    refetchOnWindowFocus: true, // Refetch al volver a la pestaña
  });

  // Socket real-time invalidación de estado de caja
  useSocketEvent("cash-register:opened", cashRegisterQueries.allCashRegisters);
  useSocketEvent("cash-register:closed", cashRegisterQueries.allCashRegisters);

  return {
    cashRegister: query.data as CashRegister | null,
    isLoading: query.isLoading,
    error: query.error,
  };
};
