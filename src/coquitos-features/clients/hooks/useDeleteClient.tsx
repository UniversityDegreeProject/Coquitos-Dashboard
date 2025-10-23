import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteClient } from '../services/client.service';
import Swal from 'sweetalert2';

/**
 * Hook para eliminar un cliente
 */
export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  const deleteClientMutation = useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: () => {
      // Invalidar y refetch las queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['clients'] });

      Swal.fire({
        title: 'Cliente eliminado exitosamente',
        text: 'El cliente se ha eliminado correctamente',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#38bdf8',
        customClass: {
          popup: 'rounded-xl',
          title: 'text-xl font-bold text-gray-800',
          htmlContainer: 'text-gray-600',
        },
      });
    },
    onError: (error) => {
      Swal.fire({
        title: 'Error al eliminar cliente',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#38bdf8',
        customClass: {
          popup: 'rounded-xl',
          title: 'text-xl font-bold text-gray-800',
          htmlContainer: 'text-gray-600',
        },
      });
    },

  });

  return {
    deleteClientMutation,
    ...deleteClientMutation,
  }
};
