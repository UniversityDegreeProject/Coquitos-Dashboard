import { useQuery } from '@tanstack/react-query';
import { getClients } from '../services/client.service';

/**
 * Hook para obtener todos los clientes
 */
export const useGetClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
