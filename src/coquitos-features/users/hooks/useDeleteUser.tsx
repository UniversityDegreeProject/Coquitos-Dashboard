import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { useUserStore } from '../store/user.store';
import { deleteUser } from '../services/use.service';
import { useQuerys } from '../const';
import type { User } from '../interfaces';



export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  const { closeModal } = useUserStore();

  const deleteUserMutation = useMutation({

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
      }).then((result) => {
        if (result.isConfirmed) {
          closeModal();
        }
      });
    },
    onError: (error) : void  => {

      queryClient.setQueryData<User[]>(useQuerys.allUsers, ( oldUsers ) : User[] => {
        if( !oldUsers ) return [];
        return oldUsers;
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