import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';

// * Components or files 
import { createClient, getClients } from '../services/client.service';
import type { ClientFormData, GetClientsResponse, SearchClientsParams } from '../interfaces';

import { clientsQueries } from '../const';
import Swal from 'sweetalert2';
import type { CreateClientResponse } from '../interfaces/client.interface';



interface CreateClientContext {
  previousData?: GetClientsResponse;
  currentQueryKey: QueryKey;
}

interface UseCreateClientOptions {
  currentParams: SearchClientsParams;
  onNewPageCreated?: (newPage: number) => void;
  onSuccessCallback?: () => void;
  onFinally?: () => void;
}
/**
 * Hook para crear un nuevo cliente
 * @param options - Opciones para el hook como onSuccessCallback que y onFinally
 */

export const useCreateClient = (options: UseCreateClientOptions) => {
  const { currentParams, onNewPageCreated, onSuccessCallback, onFinally } = options;

  const queryClient = useQueryClient();

  
  const useCreateClientMutation = useMutation({

    onMutate: async (): Promise<CreateClientContext> => {

      const currentQueryKey = clientsQueries.clientsWithFilters(currentParams);

      queryClient.cancelQueries({ queryKey: currentQueryKey });

      const previousData = queryClient.getQueryData<GetClientsResponse>(currentQueryKey);


      if (!previousData) {
        throw new Error('Cliente no encontrado');
      }
      return { previousData, currentQueryKey };

    },
    
    mutationFn: (clientData: ClientFormData) => createClient(clientData),

    onSuccess: async (createClientResponse: CreateClientResponse, _clientSubmitted: ClientFormData, { previousData }: CreateClientContext) => {


        const dataBeforeRefetch = previousData;

        const wasPageFull = dataBeforeRefetch && currentParams.limit <= dataBeforeRefetch.data.length;


        await queryClient.invalidateQueries({
          queryKey: clientsQueries.allClients,
        });

        await queryClient.refetchQueries({
          queryKey: clientsQueries.clientsWithFilters(currentParams),
        });
        
        if (wasPageFull) {
          const newPageNumber = currentParams.page + 1;
          const newPageParams = {
            ...currentParams,
            page: newPageNumber,
          };
          const newPageKey = clientsQueries.clientsWithFilters(newPageParams);
          
          try {
            await queryClient.fetchQuery({
              queryKey: newPageKey,
              queryFn: () => getClients(newPageParams),
            });
          } catch (error) {
            console.error('Error fetching new page:', error);
          };


          if (onNewPageCreated) {
            setTimeout(() => onNewPageCreated(newPageNumber), 100);
          }
        };
        
        if (onSuccessCallback) {
          onSuccessCallback();
        }

        if (onFinally) {
          onFinally();
        }
 

      Swal.fire({
        title: '¡Cliente creado exitosamente!',
        text: `El cliente ${createClientResponse.customer.firstName} se ha creado correctamente`,
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


    onError: (error: Error, _clientSubmitted: ClientFormData, context?: CreateClientContext) => {

      if (context?.previousData) {
        queryClient.setQueryData<GetClientsResponse>(context.currentQueryKey, context.previousData);
      }

      if (onFinally) {
        onFinally();
      }


      Swal.fire({
        title: 'Error al crear cliente',
        text: error.message || 'No se pudo crear el cliente',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
        customClass: {
          popup: 'rounded-xl',
          title: 'text-xl font-bold text-gray-800',
          htmlContainer: 'text-gray-600',
        },
      });
    },
  });

  return {
    useCreateClientMutation,
    ...useCreateClientMutation,
  }
};
