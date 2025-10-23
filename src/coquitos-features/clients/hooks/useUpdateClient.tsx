import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateClient } from '../services/client.service';
import type { ClientFormData, ClientResponse } from '../interfaces';
import Swal from 'sweetalert2';
import { querysClient } from '../const';

/**
 * Hook para actualizar un cliente
 */


export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  const updateClientMutation = useMutation({

    // TODO: IMPLEMENTAR MUTACION OPTIMISTA
    mutationFn: (clientData: ClientFormData) =>  updateClient(clientData.id!, clientData),

    onSuccess: (updatedClient: ClientResponse) =>{
      queryClient.invalidateQueries({ queryKey: querysClient.allClients });
      Swal.fire({
        title: 'Cliente actualizado exitosamente',
        text: `El cliente ${updatedClient.customer.firstName} ${updatedClient.customer.lastName} se ha actualizado correctamente`,
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
        title: 'Error al actualizar cliente',
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
    updateClientMutation,
    ...updateClientMutation,
  }
};
