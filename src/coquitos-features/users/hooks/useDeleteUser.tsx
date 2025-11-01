import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { deleteUser } from '../services/use.service';
import { usersQueries } from '../const/users-queries';
import type { DeleteUserResponse, GetUsersResponse, SearchUsersParams } from '../interfaces';

interface UseDeleteUserOptions {
  currentParams: SearchUsersParams;
  onPageEmpty?: () => void;
}

export const useDeleteUser = (options: UseDeleteUserOptions) => {
  const queryClient = useQueryClient();

  const deleteUserMutation = useMutation({
    onMutate: async (userId: string) => {
      // 1. Query key específica de la página actual
      const currentQueryKey = usersQueries.userWithFilters(options.currentParams);

      // 2. Cancelar la query actual
      await queryClient.cancelQueries({ queryKey: currentQueryKey });

      // 3. Obtener snapshot de la query ACTUAL (no todas)
      const previousData = queryClient.getQueryData<GetUsersResponse>(currentQueryKey);

      if (!previousData) {
        console.error('No hay datos en cache');
        return { previousData: null, currentQueryKey };
      }

      // 4. Aplicar optimistic update SOLO a la query actual
      queryClient.setQueryData<GetUsersResponse>(currentQueryKey, (oldData) => {
          if (!oldData) return oldData;

          // Marcar el usuario como optimista (animación pulse)
          return {
            ...oldData,
            data: oldData.data.map(user =>
              user.id === userId
                ? { ...user, isOptimistic: true }
                : user
            ),
          };
        }
      );

      return { previousData, currentQueryKey };
    },

    mutationFn: (userId: string) => deleteUser(userId),

    onSuccess: async (deletedUserResponse: DeleteUserResponse, userId: string, context) => {
      const { currentQueryKey, previousData } = context;

      if( !previousData ) {
        await queryClient.invalidateQueries({ queryKey: usersQueries.allUsers });
        // hacer un swal
        return;
      }

      // 1. Remover el usuario de la query actual
      queryClient.setQueryData<GetUsersResponse>( currentQueryKey, (oldData) => {
          if (!oldData) return oldData;

          const filteredUsers = oldData.data.filter(user => user.id !== userId);

          // Detectar si la página quedó vacía
          if (filteredUsers.length === 0 && oldData.page > 1 && options.onPageEmpty) {
            // Ejecutar callback para cambiar de página
            setTimeout(() => options.onPageEmpty!(), 100);
          }

          return {
            ...oldData,
            data: filteredUsers,
            total: Math.max(0, oldData.total - 1),
          };
        }
      );

      // 2. Invalidar TODAS las queries de usuarios para que se refresquen
      await queryClient.invalidateQueries({ 
        queryKey: usersQueries.allUsers,
        refetchType: 'active'
      });

      // 3. Mostrar mensaje de éxito
      Swal.fire({
        title: '¡Usuario eliminado!',
        text: `${deletedUserResponse.user.username} se eliminó correctamente`,
        icon: 'success',
        // timer: 2000,
        // showConfirmButton: false,
        confirmButtonColor: '#38bdf8',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'rounded-xl',
          title: 'text-xl font-bold text-gray-800',
          htmlContainer: 'text-gray-600',
        },
      });
    },

    onError: async (error: Error, _userId: string, context) => {
      if (!context) return;

      const { previousData, currentQueryKey } = context;

      // 1. Rollback: restaurar el snapshot
      if (previousData) {
        queryClient.setQueryData(currentQueryKey, previousData);
      }

      // 2. Mostrar error
      Swal.fire({
        title: 'Error al eliminar',
        text: error.message || 'No se pudo eliminar el usuario',
        icon: 'error',
        // confirmButtonText: 'Entendido',
        // confirmButtonColor: '#ef4444',
        confirmButtonColor: '#38bdf8',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'rounded-xl',
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