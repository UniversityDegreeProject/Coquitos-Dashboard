import { useQuery } from "@tanstack/react-query";
import { useQuerys } from "../const/use-querys";
import { getProducts } from "../services/product.service";

/**
 * Hook para obtener todos los productos
 */
export const useGetProducts = () => {
  const useQueryProducts = useQuery({
    queryKey: useQuerys.allProducts,
    queryFn: () => getProducts(),

    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    retry: 2,
    retryDelay: 1000,
    enabled: true,
  });

  return {
    ...useQueryProducts,
  };
};

