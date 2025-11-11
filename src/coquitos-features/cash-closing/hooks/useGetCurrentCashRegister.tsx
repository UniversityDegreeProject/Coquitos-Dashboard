import { useQuery } from "@tanstack/react-query";
import { getCurrentCashRegister } from "../services/cash-register.service";
import type { CashRegister } from "../interfaces";

/**
 * Hook para obtener la caja actualmente abierta de un usuario
 */
export const useGetCurrentCashRegister = (userId: string | undefined) => {
  const query = useQuery({
    queryKey: ['cash-register', 'current', userId],
    queryFn: async () => {
      if (!userId) return null;
      const response = await getCurrentCashRegister(userId);
      return response.cashRegister;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 1,
  });

  return {
    cashRegister: query.data as CashRegister | null,
    isLoading: query.isLoading,
    error: query.error,
  };
};

