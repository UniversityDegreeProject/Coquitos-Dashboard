import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { productsQueries } from "../const";
import type { GetProductsResponse, SearchProductsParams } from "../interfaces";
import { getProducts } from "../services/product.service";

const defaultResponse: GetProductsResponse = {
  data : [],
  total : 0,
  page : 1,
  limit : 5,
  totalPages : 1,
  nextPage : null,
  previousPage : null,
}

/**
 * Hook para obtener todos los productos
 * Aplica filtro de stock bajo en el frontend si está activo
 */
export const useGetProducts = (params: SearchProductsParams) => {
  const useQueryProducts = useQuery({
    queryKey: productsQueries.productsWithFilters(params),
    queryFn: () => getProducts(params),
    placeholderData: keepPreviousData, // Mantiene datos anteriores durante refetch
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    retry: 2,
    retryDelay: 1000,
    enabled: true,
  });

  const responseData = useQueryProducts.data || defaultResponse;
  
  // Aplicar filtro de stock bajo en el frontend
  const filteredProducts = params.lowStock === true 
    ? responseData.data.filter(product => product.stock <= product.minStock && product.status !== 'SinStock')
    : responseData.data;

  return {
    ...useQueryProducts,
    products: filteredProducts,
    total: filteredProducts.length, // Total de productos filtrados
    page: responseData.page,
    limit: responseData.limit,
    totalPages: Math.ceil(filteredProducts.length / responseData.limit),
    nextPage: responseData.nextPage,
    previousPage: responseData.previousPage,
  };
};

