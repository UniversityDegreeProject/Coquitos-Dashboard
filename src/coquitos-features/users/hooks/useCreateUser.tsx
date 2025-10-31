import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "../services/use.service";
import { type CreateUserResponse, type User } from "../interfaces"
import Swal from "sweetalert2";
import { usersQueries } from "../const/users-queries";

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


      queryClient.setQueryData<User[]>(usersQueries.allUsers, ( oldUsers )=>{
        if( !oldUsers ) return [optimisticUser];
        return [...oldUsers, optimisticUser];
      });

      return { optimisticUser };
    },

    mutationFn: ( newUser : User ) : Promise<CreateUserResponse> => createUser( newUser ),

    onSuccess: (createdUser: CreateUserResponse, _ , { optimisticUser }) => {

      queryClient.setQueryData<CreateUserResponse[]>(usersQueries.allUsers, ( oldUsers )=>{
        if( !oldUsers ) return [createdUser];

        const userCreateSuccess = oldUsers.map( user => {
          if (user.user.id === optimisticUser.id || (user as CreateUserResponse & { isOptimistic?: boolean }).isOptimistic) {
            return createdUser;
          }
          return user;
        });

        return userCreateSuccess;

      });
      
      // Invalidar queries paginadas para reflejar el nuevo usuario
      queryClient.invalidateQueries({ queryKey: ['users', 'paginated'] });

      Swal.fire({
        title: '¡Registro exitoso!',
        text: `Usuario ${createdUser?.user?.username || optimisticUser?.username} se ha registrado correctamente.`,
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

      queryClient.setQueryData<CreateUserResponse[]>(usersQueries.allUsers, ( oldData : CreateUserResponse[] | undefined) => {
        if (!oldData) return [];
        if (!context?.optimisticUser) return oldData;
        return oldData.filter( ( user : CreateUserResponse ) => user.user.id !== context.optimisticUser.id );
      });

      let errorMessage = "Ha ocurrido un error al crear el usuario.";
      
      if (error.message.includes("email") || error.message.includes("correo")) {
        errorMessage = error.message;
      } else if (error.message.includes("username") || error.message.includes("usuario")) {
        errorMessage = error.message;
      } else {
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