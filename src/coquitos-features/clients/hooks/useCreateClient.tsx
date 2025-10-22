import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '../services/client.service';
import type { CreateClientRequest } from '../interfaces';
import { toast } from 'sonner';

/**
 * Hook para crear un nuevo cliente
 */
export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clientData: CreateClientRequest) => createClient(clientData),
    onSuccess: () => {
      // Invalidar y refetch las queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente creado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al crear cliente: ${error.message}`);
    },
  });
};
