// * Library
import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import Swal from 'sweetalert2';

// * components or files
import type { Client, SearchClientsParams } from '../interfaces';
import { clientsQueries } from '../const';
import type { GetClientsResponse } from '../interfaces';
import { updateClient } from '../services/client.service';
import type { UpdateClientResponse } from '../interfaces/client.interface';



interface UpdateClientContext {
  previousData?: GetClientsResponse;
  currentQueryKey: QueryKey;
}

interface UseUpdateClientOptions {
  currentParams: SearchClientsParams;
  onSuccessCallback?: () => void;
  onFinally?: () => void;
}

export const useUpdateClient = (options: UseUpdateClientOptions) => {
  const { currentParams, onSuccessCallback, onFinally } = options;
  const queryClient = useQueryClient();

  const updateClientMutation = useMutation({
    onMutate: async (): Promise<UpdateClientContext> => {
      
      const currentQueryKey = clientsQueries.clientsWithFilters(currentParams);
      await queryClient.cancelQueries({ queryKey: currentQueryKey });
      const previousData = queryClient.getQueryData<GetClientsResponse>(currentQueryKey);

      if (!previousData) {
        throw new Error('Cliente no encontrado');
      }

      return { previousData, currentQueryKey };
    },

    mutationFn: (clientUpdated: Client) => updateClient(clientUpdated.id!, clientUpdated),

    onSuccess: async (updateClientResponse: UpdateClientResponse) => {
      // Invalidar y refetch todas las queries de usuarios
      await queryClient.invalidateQueries({ 
        queryKey: clientsQueries.allClients,
      });

      // Asegurar que la página actual se refetch
      await queryClient.refetchQueries({
        queryKey: clientsQueries.clientsWithFilters(currentParams),
      });

      // Ejecutar callback de éxito (cerrar modal, etc.)
      if (onSuccessCallback) {
        onSuccessCallback();
      }

      // Desactivar estado de mutación
      if (onFinally) {
        onFinally();
      }

      Swal.fire({
        title: 'Cliente actualizado exitosamente',
        text: `El cliente ${updateClientResponse.customer.firstName} se ha actualizado correctamente`,
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

    onError: (error: Error, _originalClientSubmitted: Client, context?: UpdateClientContext) => {
      // Rollback: restaurar datos anteriores
      if (context?.previousData) {
        queryClient.setQueryData<GetClientsResponse>(context.currentQueryKey, context.previousData);
      }

      if (onSuccessCallback) {
        onSuccessCallback();
      }

      // Desactivar estado de mutación
      if (onFinally) {
        onFinally();
      }

      Swal.fire({
        title: 'Error al actualizar cliente',
        text: error.message || 'No se pudo actualizar el cliente',
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
    isPending: updateClientMutation.isPending,
  };
}; 