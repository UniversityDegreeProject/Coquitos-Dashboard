import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../services/use.service";
import { usersQueries } from "../const/users-queries";
import type { SearchUsersParams } from "../interfaces";

interface UserStatsData {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  adminsUsers: number;
  cashiersUsers: number;
}

/**
 * Hook para obtener estadísticas globales de usuarios
 * Hace una query separada que obtiene TODOS los usuarios (sin límite de paginación)
 * para calcular estadísticas precisas independientes de la página actual
 */
export const useUsersStats = (
  filters: Pick<SearchUsersParams, "search" | "role" | "status">
) => {
  const { data, isLoading } = useQuery({
    queryKey: [...usersQueries.allUsers, "stats", filters],
    queryFn: async () => {
      const response = await getUsers({
        ...filters,
        page: 1,
        limit: 10000, // Límite alto para obtener todos los usuarios
      });
      return response;
    },
    staleTime: 30000, // Cache por 30 segundos
  });

  const stats: UserStatsData = {
    totalUsers: data?.total ?? 0,
    activeUsers:
      data?.data.filter((user) => user.status === "Activo").length ?? 0,
    inactiveUsers:
      data?.data.filter(
        (user) => user.status === "Inactivo" || user.status === "Suspendido"
      ).length ?? 0,
    adminsUsers:
      data?.data.filter((user) => user.role === "Administrador").length ?? 0,
    cashiersUsers:
      data?.data.filter((user) => user.role === "Vendedor").length ?? 0,
  };

  return {
    stats,
    isLoading,
  };
};
