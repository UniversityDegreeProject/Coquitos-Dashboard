import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { deleteUser } from '../services/use.service';
import { usersQueries } from '../const/users-queries';
import type { DeleteUserResponse, User } from '../interfaces';

interface OptimisticDeleteUser {
  deletedUser: User;
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  const deleteUserMutation = useMutation({

    onMutate: async (userId: string): Promise<OptimisticDeleteUser> => {
      const oldUsers = queryClient.getQueryData<DeleteUserResponse[]>(usersQueries.allUsers);
      const deletedUser = oldUsers?.find(user => user.user.id === userId);

      if (!deletedUser) {
        throw new Error('Usuario no encontrado');
      }

      const optimisticUser: DeleteUserResponse = {
        ...deletedUser,
        user: {
          ...deletedUser.user,
          isOptimistic: true,
        },
      };

      queryClient.setQueryData<DeleteUserResponse[]>(usersQueries.allUsers, ( oldUsers ) : DeleteUserResponse[] => {
        if( !oldUsers ) return [];
        
        return oldUsers.map(user => 
        user.user.id === userId 
            ? optimisticUser 
            : user
        );
      });

      return { deletedUser: optimisticUser.user };
    },

    mutationFn: (userId: string) => deleteUser(userId), 

    onSuccess: ( userDeleted:DeleteUserResponse, userId) => {
      queryClient.setQueryData<DeleteUserResponse[]>(usersQueries.allUsers, ( oldUsers ) : DeleteUserResponse[] => {
        if( !oldUsers ) return [];
        return oldUsers.filter( (user : DeleteUserResponse) => user.user.id !== userId );
      });

      // Invalidar queries paginadas para reflejar la eliminación
      queryClient.invalidateQueries({ queryKey: ['users', 'paginated'] });

      Swal.fire({
        title: 'Usuario eliminado exitosamente',
        text: `El usuario ${userDeleted.user.username} se ha eliminado correctamente`,
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

      queryClient.setQueryData<DeleteUserResponse[]>(usersQueries.allUsers, ( oldUsers ) : DeleteUserResponse[] => {
        if( !oldUsers ) return [];
        
        if (!context?.deletedUser) return oldUsers;

        return oldUsers.map((user : DeleteUserResponse) => 
          user.user.id === userId 
            ? {
              ...user,
              user: {
                ...user.user,
                isOptimistic: false,
              },
            } as DeleteUserResponse
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