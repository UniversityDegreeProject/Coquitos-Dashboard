// * Library
import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import Swal from 'sweetalert2';

// * Others
import type { GetUsersResponse, SearchUsersParams, UpdateUserResponse, User } from '../interfaces';
import { usersQueries } from '../const/users-queries';
import { updateUser } from '../services/use.service';



interface UseUpdateUserContext {
  previousData : GetUsersResponse;
  currentQueryKey : QueryKey;
}

interface UseUpdateUserOptions {
  currentParams : SearchUsersParams,
}
export const useUpdateUser = (options: UseUpdateUserOptions) => {

  const { currentParams } = options;
  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({

    onMutate: async (userToUpdate: User) : Promise<UseUpdateUserContext> => {

      const currentQueryKey = usersQueries.userWithFilters(currentParams);

      await queryClient.cancelQueries({ queryKey: currentQueryKey });

      const previousData = queryClient.getQueryData<GetUsersResponse>(currentQueryKey);

      if (!previousData) {
        
        return { 
          previousData: { data: [], total: 0, page: 1, limit: 5, totalPages: 1, nextPage: null, previousPage: null }, 
          currentQueryKey 
        };
      }

      const optimisticUser = {
        ...userToUpdate,
        isOptimistic: true,
      }
      
      queryClient.setQueryData<GetUsersResponse>( currentQueryKey , ( originalOldData ) =>{

        if( !originalOldData ) return originalOldData;

        const userOptimisticAdded = originalOldData.data.map( user => user.id === optimisticUser.id ? optimisticUser : user );

        return {
          ...originalOldData,
          data : userOptimisticAdded,
        }
      });


      return { previousData: previousData!, currentQueryKey };
      
    },

    mutationFn: ( userUpdated : User) => updateUser(userUpdated.id!, userUpdated),


    onSuccess: ( updateUserResponse : UpdateUserResponse, _originalUserSubmmited : User, optimisticUserContext : UseUpdateUserContext ) : void => {
      
     const { currentQueryKey } = optimisticUserContext;

      queryClient.setQueryData<GetUsersResponse>( currentQueryKey, ( dataWithOptimisticUser) =>{

        if( !dataWithOptimisticUser ) return dataWithOptimisticUser;

        const userUpdatedSuccess = dataWithOptimisticUser.data.map( user => user.id === updateUserResponse.user.id ? updateUserResponse.user : user )

        return {
          ...dataWithOptimisticUser,
          data : userUpdatedSuccess,
        }

      });

      queryClient.invalidateQueries({ 
        queryKey : usersQueries.allUsers,
        refetchType : 'active'
      });

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

    onError: ( error : Error, _originalUserSubmmited : User, optimisticUserContext : UseUpdateUserContext | undefined ) : void => {

      if( !optimisticUserContext ) return;

      const { previousData, currentQueryKey  } = optimisticUserContext;

      queryClient.setQueryData<GetUsersResponse>( currentQueryKey, previousData );

       // Mapeo de errores más limpio
      // const errorMessages: Record<string, string> = {
      //   email: 'El correo electrónico ya está en uso',
      //   username: 'El nombre de usuario ya está registrado',
      //   phone: 'El número de teléfono ya existe',
      // };

      // const errorKey = Object.keys(errorMessages).find(key => 
      //   error.message.toLowerCase().includes(key)
      // );

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