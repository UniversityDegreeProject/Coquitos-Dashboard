import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateClient } from '../services/client.service';
import type { UpdateClientRequest } from '../interfaces';
import { toast } from 'sonner';

/**
 * Hook para actualizar un cliente
 */
export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, clientData }: { id: string; clientData: UpdateClientRequest }) =>
      updateClient(id, clientData),
    onSuccess: (_, { id }) => {
      // Invalidar y refetch las queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', id] });
      toast.success('Cliente actualizado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar cliente: ${error.message}`);
    },
  });
};
