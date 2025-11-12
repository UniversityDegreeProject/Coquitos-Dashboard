import { useQuery } from "@tanstack/react-query";
import { ordersQueries } from "../const/orders-queries";
import { getOrders } from "../services/order.service";
import type { SearchOrdersParams } from "../interfaces";

/**
 * Hook para obtener órdenes con paginación y filtros
 * Retorna lista de órdenes, datos de paginación y estados de carga
 */
export const useGetOrders = (searchParams: SearchOrdersParams) => {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: [...ordersQueries.allOrders, searchParams],
    queryFn: () => getOrders(searchParams),
    staleTime: 1000 * 60 * 5, // 5 minutos
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

