import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { productsQueries } from "../const";
import { isProductExpiringSoon } from "../helpers";
import type { GetProductsResponse, SearchProductsParams } from "../interfaces";
import { getProducts } from "../services/product.service";

const defaultResponse: GetProductsResponse = {
  data: [],
  total: 0,
  page: 1,
  limit: 5,
  totalPages: 1,
  nextPage: null,
  previousPage: null,
};

/**
 * Hook para obtener todos los productos
 * Aplica filtro de stock bajo en el frontend si está activo
 */
export const useGetProducts = (params: SearchProductsParams) => {
  const useQueryProducts = useQuery({
    queryKey: productsQueries.productsWithFilters(params),
    queryFn: () => getProducts(params),
    placeholderData: keepPreviousData,
    refetchOnMount: true,
  });

  const responseData = useQueryProducts.data || defaultResponse;

  // Aplicar filtros en el frontend
  let filteredProducts = responseData.data;

  // Filtro de stock bajo
  if (params.lowStock === true) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.stock > 0 &&
        product.stock <= product.minStock &&
        product.status !== "SinStock",
    );
  }

  // Filtro de productos próximos a vencer (incluye 4, 3, 2, 1 días y hoy)
  if (params.nearExpiration === true) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.stock > 0 &&
        product.status !== "SinStock" &&
        isProductExpiringSoon(product),
    );
  }

  return {
    ...useQueryProducts,
    products: filteredProducts,
    total: filteredProducts.length,
    page: responseData.page,
    limit: responseData.limit,
    totalPages: Math.ceil(responseData.total / responseData.limit),
    nextPage: responseData.nextPage,
    previousPage: responseData.previousPage,
  };
};
