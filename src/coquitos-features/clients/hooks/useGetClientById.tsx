import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getClientById } from '../services/client.service';
import { clientsQueries } from '../const';

/**
 * Hook para obtener un cliente por ID
 */
export const useGetClientById = (id: string) => {
  const useGetClientById = useQuery({
    queryKey: [clientsQueries.clientById(id)],
    queryFn: () => getClientById(id),
    placeholderData: keepPreviousData,
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 1000,
  })


  return {
    ...useGetClientById,
    client: useGetClientById.data,
  }
};
