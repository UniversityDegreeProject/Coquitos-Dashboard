import { useQuery } from "@tanstack/react-query";
import { useQuerys } from "../const/use-querys";
import { searchProducts } from "../services/product.service";
import type { SearchProductsParams } from "../interfaces";

/**
 * Hook para buscar productos con filtros avanzados
 */
export const useSearchProducts = (params: SearchProductsParams) => {
  const useSearchProductsQuery = useQuery({
    queryKey: useQuerys.searchProducts(params.search, params.categoryId, params.status),
    queryFn: () => searchProducts(params),

    staleTime: 1000 * 60 * 2, // 2 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 2,
    retryDelay: 1000,
    enabled: true,
  });

  return {
    ...useSearchProductsQuery,
  };
};

