import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ordersQueries } from "../const/orders-queries";
import { getOrders } from "../services/order.service";
import type { SearchOrdersParams } from "../interfaces";

/**
 * Hook para obtener órdenes con paginación y filtros
 * Retorna lista de órdenes, datos de paginación y estados de carga
 */
export const useGetOrders = (searchParams: SearchOrdersParams) => {
  // Serializar searchParams para el queryKey, especialmente las fechas
  const serializedParams = useMemo(() => {
    const serialized: Record<string, unknown> = {
      ...searchParams,
    };
    
    // Serializar fechas a strings ISO para evitar problemas de comparación
    if (searchParams.startDate instanceof Date) {
      const year = searchParams.startDate.getFullYear();
      const month = String(searchParams.startDate.getMonth() + 1).padStart(2, '0');
      const day = String(searchParams.startDate.getDate()).padStart(2, '0');
      serialized.startDate = `${year}-${month}-${day}`;
    }
    if (searchParams.endDate instanceof Date) {
      const year = searchParams.endDate.getFullYear();
      const month = String(searchParams.endDate.getMonth() + 1).padStart(2, '0');
      const day = String(searchParams.endDate.getDate()).padStart(2, '0');
      serialized.endDate = `${year}-${month}-${day}`;
    }
    
    return serialized;
  }, [searchParams]);

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: [...ordersQueries.allOrders, serializedParams],
    queryFn: () => getOrders(searchParams),
    staleTime: 0, // Refrescar inmediatamente cuando se invalida (mejor para órdenes recién creadas)
    refetchOnWindowFocus: false,
  });

  return {
    orders: data?.data ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? 1,
    limit: data?.limit ?? 10,
    totalPages: data?.totalPages ?? 0,
    nextPage: data?.nextPage,
    previousPage: data?.previousPage,
    isLoading,
    isFetching,
    error,
  };
};

