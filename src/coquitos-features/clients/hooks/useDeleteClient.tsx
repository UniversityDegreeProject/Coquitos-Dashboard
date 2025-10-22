import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteClient } from '../services/client.service';
import { toast } from 'sonner';

/**
 * Hook para eliminar un cliente
 */
export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: () => {
      // Invalidar y refetch las queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente eliminado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar cliente: ${error.message}`);
    },
  });
};
