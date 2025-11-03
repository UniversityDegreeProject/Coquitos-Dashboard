// * Library
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';

// * Others
import type { GetUsersResponse, SearchUsersParams, UpdateUserResponse, User } from '../interfaces';
import { usersQueries } from '../const/users-queries';
import { updateUser } from '../services/use.service';

interface UseUpdateUserOptions {
  currentParams: SearchUsersParams;
  onSuccessCallback?: () => void;
  onFinally?: () => void;
}

export const useUpdateUser = (options: UseUpdateUserOptions) => {
  const { currentParams, onSuccessCallback, onFinally } = options;
  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({
    onMutate: async () => {
      // Marcar el usuario como optimista solo para animación visual
      const currentQueryKey = usersQueries.userWithFilters(currentParams);
      const previousData = queryClient.getQueryData<GetUsersResponse>(currentQueryKey);

      if (!previousData) {
        throw new Error('Usuario no encontrado');
      }

      return { previousData };
    },

    mutationFn: (userUpdated: User) => updateUser(userUpdated.id!, userUpdated),

    onSuccess: async (updateUserResponse: UpdateUserResponse) => {
      // Invalidar y refetch todas las queries de usuarios
      await queryClient.invalidateQueries({ 
        queryKey: usersQueries.allUsers,
      });

      // Asegurar que la página actual se refetch
      await queryClient.refetchQueries({
        queryKey: usersQueries.userWithFilters(currentParams),
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
        title: 'Usuario actualizado exitosamente',
        text: `El usuario ${updateUserResponse.user.firstName} se ha actualizado correctamente`,
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

    onError: (error: Error, _originalUserSubmitted: User, context) => {
      // Rollback: restaurar datos anteriores
      if (context?.previousData) {
        const currentQueryKey = usersQueries.userWithFilters(currentParams);
        queryClient.setQueryData(currentQueryKey, context.previousData);
      }

      // Cerrar modal también en caso de error
      if (onSuccessCallback) {
        onSuccessCallback();
      }

      // Desactivar estado de mutación
      if (onFinally) {
        onFinally();
      }

      // Mensaje de error personalizado
      let errorMessage = "Ha ocurrido un error al actualizar el usuario.";

      if (error.message.includes("email") || error.message.includes("correo")) {
        errorMessage = error.message;
      } else if (error.message.includes("username") || error.message.includes("usuario")) {
        errorMessage = error.message;
      } else {
        errorMessage = error.message;
      }

      Swal.fire({
        title: 'Error al actualizar usuario',
        text: errorMessage,
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
    updateUserMutation,
    isPending: updateUserMutation.isPending,
  };
}; 