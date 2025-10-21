/**
 * Definición de query keys para TanStack Query
 * Siguiendo las mejores prácticas de estructura jerárquica
 */
export const useQuerys = {
  allProducts: ['products'] as const,
  productById: (id: string) => [useQuerys.allProducts, id] as const,
  searchProducts: (params: {
    search?: string;
    categoryId?: string;
    status?: 'Disponible' | 'SinStock' | 'Descontinuado';
    lowStock?: boolean;
    page?: number;
    limit?: number;
  }) => [useQuerys.allProducts, params] as const,
};

