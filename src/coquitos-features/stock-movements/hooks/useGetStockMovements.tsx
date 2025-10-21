import { useQuery } from "@tanstack/react-query";
import { getStockMovements } from "../services/stock-movement.service";
import { useQuerys } from "../const";

/**
 * Hook para obtener todos los movimientos de stock
 * Usa TanStack Query para caché y refetch automático
 */
export const useGetStockMovements = () => {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: useQuerys.allStockMovements,
    queryFn: getStockMovements,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: true,
  });

  return {
    stockMovements: data ?? [],
    isLoading,
    error,
    isError,
  };
};

