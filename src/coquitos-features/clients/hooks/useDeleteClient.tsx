import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import Swal from 'sweetalert2';
// *Components
import type { GetClientsResponse, SearchClientsParams } from '../interfaces';
import { clientsQueries } from '../const';
import { deleteClient } from '../services/client.service';
import type { DeleteClientResponse } from '../interfaces/client.interface';


interface DeleteClientContext {
  previousData?: GetClientsResponse;
  currentQueryKey: QueryKey;
}

interface UseDeleteClientOptions {
  currentParams: SearchClientsParams;
  onPageEmpty?: () => void;
  onFinally?: () => void;
}

/**
 * Hook para eliminar un cliente
 */
export const useDeleteClient = (options: UseDeleteClientOptions) => {

  const { currentParams, onPageEmpty, onFinally } = options;

  const queryClient = useQueryClient();

  const deleteClientMutation = useMutation({

    onMutate: async (): Promise<DeleteClientContext> => {
      const currentQueryKey = clientsQueries.clientsWithFilters(currentParams);

      await queryClient.cancelQueries({ queryKey: currentQueryKey });

      const previousData = queryClient.getQueryData<GetClientsResponse>(currentQueryKey);

      if( !previousData) throw new Error("No se encontró el cliente");


      return {
        previousData,
        currentQueryKey,
      }
    },

    mutationFn: async ( id : string ) => deleteClient( id ),

    onSuccess : async ( clientDeleted : DeleteClientResponse, clientIdSubmitted : string, context : DeleteClientContext) => {

      const { previousData} = context;

      if( previousData) {
        const clientsOnPage = previousData.data;
        const willBeEmpty = clientsOnPage.filter( client => client.id  !== clientIdSubmitted ).length === 0;

        if( willBeEmpty && previousData.page > 1 && onPageEmpty ){

          const previousPageParams = { ...currentParams, page : previousData.page - 1 };
          const previousPageKey = clientsQueries.clientsWithFilters(previousPageParams);

          queryClient.setQueryData<GetClientsResponse>(previousPageKey, (oldData) => {
            if( !oldData ) return oldData;
            return {
              ...oldData,
              total : Math.max(0, oldData.total - 1),
              totalPages : Math.max(1, Math.ceil((oldData.total - 1) / previousPageParams.limit)),
            };
          });

          onPageEmpty();

        };

        await queryClient.invalidateQueries({
          queryKey: clientsQueries.allClients,
        });
      };

      const totalPages = Math.ceil((previousData?.total || 0) / currentParams.limit );
      const refetchPromises = [];

      for (let page = 1; page <= totalPages; page++) {
        const pageParams = { ...currentParams, page };

        refetchPromises.push(
          queryClient.refetchQueries({
            queryKey: clientsQueries.clientsWithFilters(pageParams),
            exact: true,
          })
        );
      }

      await Promise.all(refetchPromises);

      if( onFinally ) {
        onFinally();
      }

      Swal.fire({
        title: '¡Cliente eliminado!',
        text: `${clientDeleted.customer.firstName} se eliminó correctamente`,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#38bdf8',
        customClass: { popup: 'rounded-xl',
          title: 'text-xl font-bold text-gray-800',
          htmlContainer: 'text-gray-600',
        },
      });

    },

    onError : ( error : Error, _clientIdSubmitted : string, context? : DeleteClientContext) => {

      if( context?.previousData) {
        queryClient.setQueryData<GetClientsResponse>(context.currentQueryKey , context.previousData);
      }

      if( onFinally ) {
        onFinally();
      }

      Swal.fire({
        title: '¡Cliente no eliminado!',
        text: error.message || 'No se pudo eliminar el cliente',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#38bdf8',
        customClass: { popup: 'rounded-xl',
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
