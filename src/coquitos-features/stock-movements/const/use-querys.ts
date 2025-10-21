/**
 * Definición de query keys para TanStack Query
 * Siguiendo las mejores prácticas de estructura jerárquica
 */
export const useQuerys = {
  allStockMovements: ['stock-movements'] as const,
  stockMovementById: (id: string) => [useQuerys.allStockMovements, id] as const,
  searchStockMovements: (params: {
    search?: string;
    productId?: string;
    type?: 'Reabastecimiento' | 'Compra' | 'Venta' | 'Ajuste' | 'Devolucion' | 'Dañado';
    page?: number;
    limit?: number;
  }) => [useQuerys.allStockMovements, params] as const,
};

