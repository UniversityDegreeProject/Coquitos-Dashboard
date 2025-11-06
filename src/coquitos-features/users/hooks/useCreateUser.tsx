import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { createUser, getUsers } from "../services/use.service";
import { usersQueries } from "../const/users-queries";
import type { 
  CreateUserResponse, 
  GetUsersResponse, 
  SearchUsersParams, 
  User 
} from "../interfaces";


interface OptimisticMutateUser {
  previousData: GetUsersResponse;
  currentQueryKey: QueryKey;
}

interface UseCreateUserOptions {
  currentParams: SearchUsersParams;
  onNewPageCreated?: (newPage: number) => void;
  onSuccessCallback?: () => void;
  onFinally?: () => void;
}

export const useCreateUser = (options: UseCreateUserOptions) => {
  const { currentParams, onNewPageCreated, onSuccessCallback, onFinally } = options;
  const queryClient = useQueryClient();

  const useCreateUserMutation = useMutation({


    onMutate: async (): Promise<OptimisticMutateUser> => {
      // Marcar el usuario como optimista solo para animación visual
      const currentQueryKey = usersQueries.userWithFilters(currentParams);

      queryClient.cancelQueries({ queryKey: currentQueryKey });

      const previousData = queryClient.getQueryData<GetUsersResponse>(currentQueryKey);
      
      if (!previousData) {
        throw new Error('No se encontraron datos para el usuario');
      }


 
      return { previousData, currentQueryKey };
    },

    mutationFn: (newUser: User): Promise<CreateUserResponse> => createUser(newUser),

    onSuccess: async (createdUserResponse: CreateUserResponse , _User : User, context : OptimisticMutateUser) => {
      
      const { previousData } = context;

      const wasPageFull = previousData && currentParams.limit <= previousData.data.length

   
      if (previousData) {
        // 4. Si la página ESTABA llena, el nuevo usuario fue a una nueva página → navegar
        if (wasPageFull) {
          const newPageNumber = currentParams.page + 1;
          const newPageParams = {
            ...currentParams,
            page: newPageNumber,
          };
          const newPageKey = usersQueries.userWithFilters(newPageParams);
          
          // Fetch la nueva página para asegurar que tenga datos
          try {
            await queryClient.fetchQuery({
              queryKey: newPageKey,
              queryFn: () => getUsers(newPageParams),
            });
          } catch (error) {
            console.error('Error fetching new page:', error);
          }
          
          // Navegar a la nueva página
          if (onNewPageCreated) {
            setTimeout(() => onNewPageCreated(newPageNumber), 100);
          }
        }
      }

      // 2. Invalidar TODAS las queries de usuarios
      await queryClient.invalidateQueries({
        queryKey: usersQueries.allUsers,
      });

      // 3. Refetch la página actual para obtener datos actualizados
      await queryClient.refetchQueries({
        queryKey: usersQueries.userWithFilters(currentParams),
      });
  

      // 5. Ejecutar callback de éxito (cerrar modal, etc.)
      if (onSuccessCallback) {
        onSuccessCallback();
      }

         // 7. Desactivar estado de mutación (después de que el usuario cierre el mensaje)
      if (onFinally) {
        onFinally();
      }
      // 6. Mensaje de éxito (esperar a que el usuario haga clic en OK)
      await Swal.fire({
        title: '¡Usuario creado!',
        text: `${createdUserResponse.user.username} se creó correctamente`,
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

    onError: async (error: Error, _userSubmitted: User, context?: OptimisticMutateUser) => {
      // Cerrar modal también en caso de error
      if (context?.previousData) {
        queryClient.setQueryData<GetUsersResponse>(context.currentQueryKey, context.previousData);
      }

      if (onSuccessCallback) {
        onSuccessCallback();
      }

      // Desactivar estado de mutación (después de que el usuario cierre el mensaje)
      if (onFinally) {
        onFinally();
      }

      // Mensaje de error personalizado
      const errorMessages: Record<string, string> = {
        email: 'El correo electrónico ya está registrado',
        username: 'El nombre de usuario ya existe',
        phone: 'El número de teléfono ya está en uso',
        correo: 'El correo electrónico ya está registrado',
        usuario: 'El nombre de usuario ya existe',
      };

      const errorKey = Object.keys(errorMessages).find(key =>
        error.message.toLowerCase().includes(key)
      );

      const errorMessage = errorKey
        ? errorMessages[errorKey]
        : error.message || 'Error al crear el usuario';

      // Mensaje de error (esperar a que el usuario haga clic en OK)
      await Swal.fire({
        title: 'Error al crear usuario',
        text: errorMessage || 'No se pudo crear el usuario',
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
    isPending: useCreateUserMutation.isPending,
  };
};