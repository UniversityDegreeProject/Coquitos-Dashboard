import { useQuery } from "@tanstack/react-query";
import type { SearchClientsParams } from "../interfaces";
import { clientsQueries } from "../const/clients-queries";
import { getClients } from "../services/client.service";

interface ClientStatsData {
  totalClients: number;
  VIPClients: number;
  RegularClients: number;
  OcasionalClients: number;
}

/**
 * Hook para obtener estadísticas globales de clientes
 * Hace una query separada que obtiene TODOS los clientes (sin límite de paginación)
 * para calcular estadísticas precisas independientes de la página actual
 */
export const useClientsStats = (filters: Pick<SearchClientsParams, 'search' | 'type'>) => {
  const { data, isLoading } = useQuery({
    queryKey: [...clientsQueries.allClients, 'stats', filters],
    queryFn: async () => {
      // Obtener TODOS los clientes con un límite muy alto para estadísticas
      const response = await getClients({
        ...filters,
        page: 1,
        limit: 10000, // Límite alto para obtener todos los clientes
      });
      return response;
    },
    staleTime: 30000, // Cache por 30 segundos
  });

  const stats: ClientStatsData = {
    totalClients: data?.total ?? 0,
    VIPClients: data?.data.filter(client => client.type === 'VIP').length ?? 0,
    RegularClients: data?.data.filter(client => client.type === 'Regular').length ?? 0,
    OcasionalClients: data?.data.filter(client => client.type === 'Ocasional').length ?? 0,
  };

  return {
    stats,
    isLoading,
  };
};

