import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../services/category.service";
import { categoriesQueries } from "../const/categories-queries";
import type { SearchCategoriesParams } from "../interfaces";

interface CategoryStatsData {
  totalCategories: number;
  activeCategories: number;
  inactiveCategories: number;
}

/**
 * Hook para obtener estadísticas globales de categorías
 * Hace una query separada que obtiene TODOS las categorías (sin límite de paginación)
 * para calcular estadísticas precisas independientes de la página actual
 */
export const useCategoriesStats = (filters: Pick<SearchCategoriesParams, 'search' | 'status'>) => {
  const { data, isLoading } = useQuery({
    queryKey: [...categoriesQueries.allCategories, 'stats', filters],
    queryFn: async () => {
      // Obtener TODOS las categorías con un límite muy alto para estadísticas
      const response = await getCategories({
        ...filters,
        page: 1,
        limit: 10000, // Límite alto para obtener todas las categorías
      });
      return response;
    },
    staleTime: 30000, // Cache por 30 segundos
  });

  const stats: CategoryStatsData = {
    totalCategories: data?.total ?? 0,
    activeCategories: data?.data.filter(category => category.status === 'Activo').length ?? 0,
    inactiveCategories: data?.data.filter(category => category.status === 'Inactivo').length ?? 0,
  };

  return {
    stats,
    isLoading,
  };
};

