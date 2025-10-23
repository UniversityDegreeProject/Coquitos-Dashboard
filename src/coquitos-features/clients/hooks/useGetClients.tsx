import { useQuery } from '@tanstack/react-query';
import { getClients } from '../services/client.service';
import type { Client } from '../interfaces';

/**
 * Hook para obtener todos los clientes
 */
export const useGetClients = () => {
  const query = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    ...query,
    clients: query.data?.map(response => response.customer) as Client[] || [],
  };
};
