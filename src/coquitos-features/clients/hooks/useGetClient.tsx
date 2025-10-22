import { useQuery } from '@tanstack/react-query';
import { getClient } from '../services/client.service';

/**
 * Hook para obtener un cliente por ID
 */
export const useGetClient = (id: string) => {
  return useQuery({
    queryKey: ['client', id],
    queryFn: () => getClient(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
