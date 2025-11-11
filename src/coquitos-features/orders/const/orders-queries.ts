import type { SearchOrdersParams } from "../interfaces";

/**
 * Definición de query keys para TanStack Query
 * Siguiendo las mejores prácticas de estructura jerárquica
 */
export const ordersQueries = {
  allOrders: ['orders'] as const,
  orderById: (id: string) => [...ordersQueries.allOrders, id] as const,
  ordersWithFilters: (params: SearchOrdersParams) => [...ordersQueries.allOrders, 'filters', params] as const,
};

