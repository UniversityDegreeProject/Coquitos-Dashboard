import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "../services/use.service";
import { type User } from "../interfaces"
import Swal from "sweetalert2";
import { useQuerys } from "../const";

interface OptimisticMutationUser{
  optimisticUser : User
}

export const useCreateUser = () => {

  const queryClient = useQueryClient();

  const useCreateUserMutation = useMutation({


    onMutate: ( userToCreate : User ) : OptimisticMutationUser => {
      const optimisticUser : User = {
        ...userToCreate,
        id: crypto.randomUUID(),
        isOptimistic: true,
      }


      queryClient.setQueryData<User[]>(useQuerys.allUsers, ( oldUsers )=>{
        if( !oldUsers ) return [optimisticUser];
        return [...oldUsers, optimisticUser];
      });

      return { optimisticUser };
    },

    mutationFn: ( newUser : User ) : Promise<User> => createUser( newUser ),

    onSuccess: (createdUser: User, _ , { optimisticUser }) => {

      queryClient.setQueryData<User[]>(useQuerys.allUsers, ( oldUsers )=>{
        if( !oldUsers ) return [createdUser];

        const userCreateSuccess = oldUsers.map( user => {
          if (user.id === optimisticUser.id || (user as User & { isOptimistic?: boolean }).isOptimistic) {
            return createdUser;
          }
          return user;
        });

        return userCreateSuccess;

      });
      

      Swal.fire({
        title: '¡Registro exitoso!',
        text: `Usuario ${createdUser?.username || optimisticUser?.username} se ha registrado correctamente.`,
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

    onError: (error : Error, _ , context? : OptimisticMutationUser | undefined ) : void => {

      queryClient.setQueryData<User[]>(useQuerys.allUsers, ( oldData : User[] | undefined) => {

        if (!oldData) return [];

        if (!context?.optimisticUser) return oldData;

        return oldData.filter( ( user : User ) => user.id !== context.optimisticUser.id );
      });

      let errorMessage = "Ha ocurrido un error al crear el usuario.";
      
      if (error.message.includes("email") || error.message.includes("correo")) {
        errorMessage = error.message;
      } else if (error.message.includes("username") || error.message.includes("usuario")) {
        errorMessage = error.message;
      } else if (error.message.includes("network") || error.message.includes("fetch")) {
        errorMessage = error.message;
      }

      Swal.fire({
        title: 'Error al crear usuario',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#ef4444',
        customClass: {
          popup: 'rounded-xl',
          title: 'text-xl font-bold text-gray-800',
          htmlContainer: 'text-gray-600',
        },
      });
    },
  });

  return {
    useCreateUserMutation,
    ...useCreateUserMutation,
  };
};  