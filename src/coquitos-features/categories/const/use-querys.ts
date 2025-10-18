/**
 * Definición de query keys para TanStack Query
 * Siguiendo las mejores prácticas de estructura jerárquica
 */
export const useQuerys = {
  allCategories: ['categories'] as const,
  categoryById: (id: string) => [useQuerys.allCategories, id] as const,
  searchCategories: (params: {
    search?: string;
    status?: 'Activo' | 'Inactivo';
  }) => [useQuerys.allCategories, params] as const,
}

