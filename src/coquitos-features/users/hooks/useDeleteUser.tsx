// * Librerías
import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import Swal from 'sweetalert2';

// * Servicios
import { deleteUser } from '../services/use.service';

// * Constantes
import { usersQueries } from '../const';

// * Interfaces
import type { DeleteUserResponse, GetUsersResponse, SearchUsersParams } from '../interfaces';


/**
 * Opciones para el hook useDeleteUser
 */
interface UseDeleteUserOptions {
  currentParams: SearchUsersParams; 
  onPageEmpty?: () => void; 
  onFinally?: () => void;
}


interface DeleteUserContext {
  previousData?: GetUsersResponse;
  currentQueryKey: QueryKey;
}

/**
 * Hook de mutación para ELIMINAR un usuario.
 * Se integra con el store global 'isMutating' para mostrar un loader general.
 * Maneja la lógica de 'página vacía' al eliminar el último item.
 */
export const useDeleteUser = (options: UseDeleteUserOptions) => {
  const { currentParams, onPageEmpty, onFinally } = options;
  const queryClient = useQueryClient();


  const deleteUserMutation = useMutation({

    // ==================================================================
    // onMutate: Se ejecuta ANTES de la llamada a la API
    // ==================================================================
    onMutate: async () : Promise<DeleteUserContext> => {
      // 2. ¡ACTIVAR EL LOADER GLOBAL!


      // 3. Definir la Query Key exacta que queremos manipular
      const currentQueryKey = usersQueries.userWithFilters(currentParams);

      // 4. Cancelar refetches en curso para evitar conflictos
      await queryClient.cancelQueries({ queryKey: currentQueryKey });

      // 5. Tomar un "snapshot" (copia de seguridad) del caché actual
      // Esto es VITAL para el 'onError' (rollback) y para 'onSuccess' (lógica de página vacía)
      const previousData = queryClient.getQueryData<GetUsersResponse>(currentQueryKey);

      // 6. Devolver el snapshot en la "mochila de contexto"
      return { previousData, currentQueryKey };
    },

    mutationFn: (userId: string) => deleteUser(userId),

 
    onSuccess: async (deletedUserResponse: DeleteUserResponse, userId: string, context: DeleteUserContext) => {
      const { previousData } = context;

      // 7. Lógica de "página vacía" (basada en el snapshot)
      if (previousData) {
        const usersOnPage = previousData.data;
        const willBeEmpty = usersOnPage.filter(user => user.id !== userId).length === 0;

        if (willBeEmpty && previousData.page > 1 && onPageEmpty) {
          // Llama al "teléfono" (callback) en UsersPage para cambiar de página
          
          // (Tu lógica avanzada para actualizar el caché de la pág anterior es correcta,
          // pero la invalidación global de abajo también la manejará eventualmente.
          // Para mayor robustez, la mantenemos.)
          const previousPageParams = { ...currentParams, page: currentParams.page - 1 };
          const previousPageKey = usersQueries.userWithFilters(previousPageParams);
          
          queryClient.setQueryData<GetUsersResponse>(previousPageKey, (oldData) => {
             if (!oldData) return oldData;
             return {
               ...oldData,
               total: Math.max(0, oldData.total - 1),
               totalPages: Math.max(1, Math.ceil((oldData.total - 1) / currentParams.limit)),
             };
          });

          // Llama al callback para que UsersPage cambie de página
          onPageEmpty();
        }
      }

      // 8. Invalidar queries
      await queryClient.invalidateQueries({
        queryKey: usersQueries.allUsers,
      });

      // 8.1. Refetch MANUAL de TODAS las páginas conocidas en cache
      // Esto asegura que página 2, 3, etc. se actualicen inmediatamente
      const totalPages = Math.ceil((previousData?.total || 0) / currentParams.limit);
      const refetchPromises = [];

      for (let page = 1; page <= totalPages; page++) {
        const pageParams = { ...currentParams, page };
        refetchPromises.push(
          queryClient.refetchQueries({
            queryKey: usersQueries.userWithFilters(pageParams),
            exact: true,
          })
        );
      }

      // Esperar a que TODAS las páginas se actualicen
      await Promise.all(refetchPromises);

      if( onFinally ) {
        onFinally();
      }

      // 9. Notificación de éxito
      Swal.fire({
        title: '¡Usuario eliminado!',
        text: `${deletedUserResponse.user.username} se eliminó correctamente`,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#38bdf8',
        customClass: { popup: 'rounded-xl',
          title: 'text-xl font-bold text-gray-800',
          htmlContainer: 'text-gray-600',
        },
      });
    },

    // ==================================================================
    // onError: Se ejecuta si la API falla
    // ==================================================================
    onError: (error: Error, _userId: string, context?: DeleteUserContext) => {
      // 10. ¡Rollback! Restaurar los datos previos
      if (context?.previousData) {
        queryClient.setQueryData(context.currentQueryKey, context.previousData);
      }

      // 11. Notificación de error
      Swal.fire({
        title: 'Error al eliminar',
        text: error.message || 'No se pudo eliminar el usuario',
        icon: 'error',
        confirmButtonColor: '#38bdf8',
        confirmButtonText: 'OK',
        customClass: { popup: 'rounded-xl',
          title: 'text-xl font-bold text-gray-800',
          htmlContainer: 'text-gray-600',
        },
      });
    },


  });

  return {
    deleteUserMutation,
    isPending: deleteUserMutation.isPending,
  };
};