import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { deleteUser } from '../services/use.service';
import { useQuerys } from '../const';
import type { User } from '../interfaces';

interface OptimisticDeleteUser {
  deletedUser: User;
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  const deleteUserMutation = useMutation({

    onMutate: async (userId: string): Promise<OptimisticDeleteUser> => {
      const oldUsers = queryClient.getQueryData<User[]>(useQuerys.allUsers);
      const deletedUser = oldUsers?.find(user => user.id === userId);

      if (!deletedUser) {
        throw new Error('Usuario no encontrado');
      }

      const optimisticUser: User = {
        ...deletedUser,
        isOptimistic: true,
      };

      queryClient.setQueryData<User[]>(useQuerys.allUsers, ( oldUsers ) : User[] => {
        if( !oldUsers ) return [];
        
        return oldUsers.map(user => 
          user.id === userId 
            ? optimisticUser 
            : user
        );
      });

      return { deletedUser };
    },

    mutationFn: (userId: string) => deleteUser(userId),

    onSuccess: ( userDeleted:User, userId) => {
      queryClient.setQueryData<User[]>(useQuerys.allUsers, ( oldUsers ) : User[] => {
        if( !oldUsers ) return [];
        return oldUsers.filter( (user : User) => user.id !== userId );
      });
      Swal.fire({
        title: 'Usuario eliminado exitosamente',
        text: `El usuario ${userDeleted.username} se ha eliminado correctamente`,
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
    
    onError: (error, userId: string, context?: OptimisticDeleteUser) : void  => {

      queryClient.setQueryData<User[]>(useQuerys.allUsers, ( oldUsers ) : User[] => {
        if( !oldUsers ) return [];
        
        if (!context?.deletedUser) return oldUsers;

        return oldUsers.map(user => 
          user.id === userId 
            ? context.deletedUser
            : user
        );
      });

      Swal.fire({
        title: 'Error al eliminar usuario',
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
    deleteUserMutation,
    ...deleteUserMutation,
  }
}; 