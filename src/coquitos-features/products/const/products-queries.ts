import type { SearchProductsParams } from "../interfaces";

/**
 * Definición de query keys para TanStack Query
 * Siguiendo las mejores prácticas de estructura jerárquica
 */
export const productsQueries = {
  allProducts: ['products'] as const,
  productById: (id: string) => [productsQueries.allProducts, id] as const,
  productsWithFilters: (params: SearchProductsParams) => [productsQueries.allProducts,'filters', params] as const,
};

