// * Library
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';

// * Others
import type { User } from '../interfaces';
import { useUserStore } from '../store/user.store';
import { useQuerys } from '../const';
import { updateUser } from '../services/use.service';



interface OptimisticUpdateUser {
  optimisticUser : User;
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { closeModal } = useUserStore();

  const updateUserMutation = useMutation({

    onMutate: (usertoUpdate: User) : OptimisticUpdateUser => {

      //* Optimistic update
      const optimisticUser : User = {
        ...usertoUpdate,
        id: crypto.randomUUID(),
        isOptimistic: true,
      }

      queryClient.setQueryData<User[]>(useQuerys.allUsers, ( oldUsers ) : User[] =>  {
        if( !oldUsers ) return [optimisticUser];
        return [...oldUsers, optimisticUser];
      });

      return { optimisticUser };
    },

    mutationFn: ( userUpdated : User) => updateUser(userUpdated.id!, userUpdated),


    onSuccess: (updatedUser, _ : User, { optimisticUser } : OptimisticUpdateUser) : void => {
      
      queryClient.setQueryData<User[]>(useQuerys.allUsers, ( oldUsers ) : User[]  => {

        if (!oldUsers) return [updatedUser];

        const dataUpdatedSuccess = oldUsers.map(( user : User ) => {
          if (user.id === optimisticUser.id || (user as User & { isOptimistic?: boolean }).isOptimistic) {
            return updatedUser;
          }
          return user;
        });
        return dataUpdatedSuccess;
      });
      
      Swal.fire({
        title: 'Usuario actualizado exitosamente',
        text: `El usuario ${updatedUser.username || optimisticUser.username} se ha actualizado correctamente`,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#38bdf8',
        customClass: {
          popup: 'rounded-xl',
          title: 'text-xl font-bold text-gray-800',
          htmlContainer: 'text-gray-600',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          closeModal();
        }
      });
    },

    onError: ( error, _ : User, context? : OptimisticUpdateUser) : void => {

      queryClient.setQueryData<User[]>(useQuerys.allUsers, ( oldUsers  ) : User[] => {
        
        if (!oldUsers) return [];

        if (!context?.optimisticUser) return oldUsers;

        return oldUsers.filter( (user : User) => user.id !== context?.optimisticUser?.id );
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