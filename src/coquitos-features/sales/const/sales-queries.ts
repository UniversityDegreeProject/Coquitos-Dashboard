import type { SearchSalesParams } from "../interfaces";

/**
 * Definición de query keys para TanStack Query
 * Siguiendo las mejores prácticas de estructura jerárquica
 */
export const salesQueries = {
  allSales: ["sales"] as const,
  saleById: (id: string) => [...salesQueries.allSales, id] as const,
  salesWithFilters: (params: SearchSalesParams) =>
    [...salesQueries.allSales, "filters", params] as const,
};
