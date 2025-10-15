import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "../services/use.service";
import { type User } from "../interfaces"
import Swal from "sweetalert2";
import { useUserStore } from "../store/user.store";
import { useQuerys } from "../const";

interface OptimisticMutationUser{
  optimisticUser : User
}

export const useCreateUser = () => {

  const queryClient = useQueryClient();
  const { closeModal } = useUserStore();

  const useCreateUserMutation = useMutation({


    onMutate: ( userSimulated : User ) : OptimisticMutationUser => {
      const optimisticUser : User = {
        ...userSimulated,
        id: crypto.randomUUID(),
        isOptimistic: true,
      }


      queryClient.setQueryData<User[]>(useQuerys.createUser(), ( oldUsers )=>{
        if( !oldUsers ) return [optimisticUser];
        return [...oldUsers, optimisticUser];
      });

      return { optimisticUser };
    },

    mutationFn: ( newUser : User ) : Promise<User> => createUser( newUser ),

    onSuccess: (newUser: User, _ , { optimisticUser }) => {

      queryClient.setQueryData<User[]>(useQuerys.createUser(), ( oldUsers )=>{
        if( !oldUsers ) return [newUser];

        const userCreateSuccess = oldUsers.map( user => user.id === optimisticUser.id ? newUser : user );

        return userCreateSuccess;

      });
      

      Swal.fire({
        title: '¡Registro exitoso!',
        text: `Empleado ${optimisticUser?.username} se ha  registrado correctamente.`,
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

    onError: (error : Error, _ , context? : OptimisticMutationUser | undefined ) : void => {

      queryClient.setQueryData<User[]>(useQuerys.createUser(), ( oldData : User[] | undefined) => {

        if (!oldData) return [];

        if (!context?.optimisticUser) return oldData;

        return oldData.filter( ( user : User ) => user.id !== context.optimisticUser.id );
      });

      Swal.fire({
        title: '¡Error!',
        text: `${error.message}`,
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
    useCreateUserMutation,
    ...useCreateUserMutation,
  };
};  