import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { productsQueries } from "../const";
import { getEffectiveStatus, isProductExpiringSoon } from "../helpers";
import type { GetProductsResponse, SearchProductsParams } from "../interfaces";
import { getProducts } from "../services/product.service";
import { useSocketEvent } from "@/lib/socket";

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
 * Estado, stock bajo y próximos a vencer se filtran en el frontend
 * (estado efectivo: stock=0 ⇒ SinStock)
 */
export const useGetProducts = (params: SearchProductsParams) => {
  const useQueryProducts = useQuery({
    queryKey: productsQueries.productsWithFilters(params),
    queryFn: () => getProducts(params),
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 30000,
  });

  useSocketEvent("product:created", productsQueries.allProducts);
  useSocketEvent("product:updated", productsQueries.allProducts);
  useSocketEvent("product:deleted", productsQueries.allProducts);
  useSocketEvent("product-batch:created", productsQueries.allProducts);
  useSocketEvent("product-batch:updated", productsQueries.allProducts);
  useSocketEvent("product-batch:deleted", productsQueries.allProducts);
  useSocketEvent("sale:created", productsQueries.allProducts);

  const responseData = useQueryProducts.data || defaultResponse;

  let filteredProducts = responseData.data;

  // Filtro por estado efectivo (Disponible / SinStock / Descontinuado)
  if (params.status && String(params.status).trim() !== "") {
    filteredProducts = filteredProducts.filter(
      (product) => getEffectiveStatus(product) === params.status,
    );
  }

  // Filtro de stock bajo
  if (params.lowStock === true) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.stock > 0 &&
        product.stock <= product.minStock &&
        getEffectiveStatus(product) !== "SinStock",
    );
  }

  // Filtro de productos próximos a vencer
  if (params.nearExpiration === true) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.stock > 0 &&
        getEffectiveStatus(product) !== "SinStock" &&
        isProductExpiringSoon(product),
    );
  }

  const filteredTotal = filteredProducts.length;

  return {
    ...useQueryProducts,
    products: filteredProducts,
    total: filteredTotal,
    page: responseData.page,
    limit: responseData.limit,
    totalPages: Math.max(1, Math.ceil(filteredTotal / responseData.limit)),
    nextPage: responseData.nextPage,
    previousPage: responseData.previousPage,
  };
};
