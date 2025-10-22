import { useQuery } from '@tanstack/react-query';
import { searchClients } from '../services/client.service';
import type { SearchClientsParams } from '../interfaces';

/**
 * Hook para buscar clientes con filtros
 */
export const useSearchClients = (params: SearchClientsParams) => {
  return useQuery({
    queryKey: ['clients', 'search', params],
    queryFn: () => searchClients(params),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};
