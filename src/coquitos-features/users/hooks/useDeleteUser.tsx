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
      // Marcar el usuario como optimista solo para animación visual
      const currentQueryKey = usersQueries.userWithFilters(options.currentParams);
      const previousData = queryClient.getQueryData<GetUsersResponse>(currentQueryKey);

      if (previousData) {
        queryClient.setQueryData<GetUsersResponse>(currentQueryKey, (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.map(user =>
              user.id === userId ? { ...user, isOptimistic: true } : user
            ),
          };
        });
      }

      return { previousData, userId };
    },

    mutationFn: (userId: string) => deleteUser(userId),

    onSuccess: async (deletedUserResponse: DeleteUserResponse, userId: string, context) => {
      const { previousData } = context;

      // 1. Determinar si la página quedará vacía
      if (previousData) {
        const willBeEmpty = previousData.data.filter(user => user.id !== userId).length === 0;
        
        if (willBeEmpty && previousData.page > 1 && options.onPageEmpty) {
          // Navegar a la página anterior ANTES de invalidar
          setTimeout(() => options.onPageEmpty!(), 100);
        }
      }

      // 2. Invalidar y refetch TODAS las queries de usuarios
      await queryClient.invalidateQueries({ 
        queryKey: usersQueries.allUsers,
      });

      // 3. Asegurar que la página actual se refetch
      await queryClient.refetchQueries({
        queryKey: usersQueries.userWithFilters(options.currentParams),
      });

      // 4. Mensaje de éxito
      Swal.fire({
        title: '¡Usuario eliminado!',
        text: `${deletedUserResponse.user.username} se eliminó correctamente`,
        icon: 'success',
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
      // Rollback: restaurar datos anteriores
      if (context?.previousData) {
        const currentQueryKey = usersQueries.userWithFilters(options.currentParams);
        queryClient.setQueryData(currentQueryKey, context.previousData);
      }

      // Mensaje de error
      Swal.fire({
        title: 'Error al eliminar',
        text: error.message || 'No se pudo eliminar el usuario',
        icon: 'error',
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