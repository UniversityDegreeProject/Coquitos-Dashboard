// * Library
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';

// * Others
import type { User } from '../interfaces';
import { useQuerys } from '../const';
import { updateUser } from '../services/use.service';



interface OptimisticUpdateUser {
  optimisticUser : User;
  originalUser : User;
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({

    onMutate: (usertoUpdate: User) : OptimisticUpdateUser => {

      const oldUsers = queryClient.getQueryData<User[]>(useQuerys.allUsers);
      const originalUser = oldUsers?.find(user => user.id === usertoUpdate.id);

      if (!originalUser) {
        throw new Error('Usuario no encontrado');
      }

      // 2. Crear la versión optimista
      const optimisticUser : User = {
        ...usertoUpdate,
        isOptimistic: true,
      }

      // 3. Aplicar la mutación optimista
      queryClient.setQueryData<User[]>(useQuerys.allUsers, ( oldUsers ) : User[] =>  {
        if( !oldUsers ) return [];

        return oldUsers.map(user => 
          user.id === usertoUpdate.id 
            ? optimisticUser 
            : user
        );
      });

      // 4. Retornar tanto el usuario optimista como el original
      return { optimisticUser, originalUser };
    },

    mutationFn: ( userUpdated : User) => updateUser(userUpdated.id!, userUpdated),


    onSuccess: (updatedUser, ) : void => {
      
      queryClient.setQueryData<User[]>(useQuerys.allUsers, ( oldUsers ) : User[]  => {

        if (!oldUsers) return [updatedUser];

        const dataUpdatedSuccess = oldUsers.map(( user : User ) => {
          if (user.id === updatedUser.id || (user as User & { isOptimistic?: boolean }).isOptimistic) {
            return updatedUser;
          }
          return user;
        });
        return dataUpdatedSuccess;
      });
      
      // Invalidar queries paginadas para reflejar la actualización
      queryClient.invalidateQueries({ queryKey: ['users', 'paginated'] });

      Swal.fire({
        title: 'Usuario actualizado exitosamente',
        text: `El usuario ${updatedUser.username} se ha actualizado correctamente`,
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

    onError: ( error, userToUpdate : User, context? : OptimisticUpdateUser) : void => {

      queryClient.setQueryData<User[]>(useQuerys.allUsers, ( oldUsers  ) : User[] => {
        
        if (!oldUsers) return [];

        if (!context?.originalUser) return oldUsers;

        // Restaurar los datos originales del usuario
        return oldUsers.map((user : User) => 
          user.id === userToUpdate.id 
            ? context.originalUser // Restaurar datos originales
            : user
        );
      });

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
    ...updateUserMutation,
  }
}; 