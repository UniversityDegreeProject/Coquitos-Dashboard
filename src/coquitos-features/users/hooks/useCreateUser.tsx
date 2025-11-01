import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { createUser } from "../services/use.service";
import { usersQueries } from "../const/users-queries";
import type { 
  CreateUserResponse, 
  GetUsersResponse, 
  SearchUsersParams, 
  User 
} from "../interfaces";

interface UseCreateUserContext {
  previousData: GetUsersResponse | null;
  currentQueryKey: QueryKey;
  optimisticUser: User;
  shouldCreateNewPage: boolean;
  newPageParams?: SearchUsersParams;
}

interface UseCreateUserOptions {
  currentParams: SearchUsersParams;
  onNewPageCreated?: (newPage: number) => void; // Callback para navegar a nueva página
}

export const useCreateUser = (options: UseCreateUserOptions) => {
  const { currentParams, onNewPageCreated } = options;
  const queryClient = useQueryClient();

  const useCreateUserMutation = useMutation({
    onMutate: async (userToCreate: User): Promise<UseCreateUserContext> => {
      const currentQueryKey = usersQueries.userWithFilters(currentParams);

      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey: currentQueryKey });

      // Obtener datos actuales
      const previousData = queryClient.getQueryData<GetUsersResponse>(currentQueryKey);

      if (!previousData) {
        console.warn('No hay datos en cache para crear usuario');
        return {
          previousData: null,
          currentQueryKey,
          optimisticUser: {
            ...userToCreate,
            id: crypto.randomUUID(),
            isOptimistic: true,
          },
          shouldCreateNewPage: false,
        };
      }

      // Crear usuario optimista con ID temporal
      const optimisticUser: User = {
        ...userToCreate,
        id: crypto.randomUUID(),
        isOptimistic: true,
      };

      // Detectar si la página actual está llena
      const isPageFull = previousData.data.length >= currentParams.limit;
      const shouldCreateNewPage = isPageFull;

      if (shouldCreateNewPage) {
        // CASO 1: Página llena → Crear usuario en NUEVA página
        const newPageNumber = previousData.page + 1;
        const newPageParams: SearchUsersParams = {
          ...currentParams,
          page: newPageNumber,
        };
        const newPageQueryKey = usersQueries.userWithFilters(newPageParams);

        // Crear nueva página con el usuario optimista
        queryClient.setQueryData<GetUsersResponse>(newPageQueryKey, {
          data: [optimisticUser],
          total: previousData.total + 1,
          page: newPageNumber,
          limit: currentParams.limit,
          totalPages: Math.ceil((previousData.total + 1) / currentParams.limit),
          nextPage: null,
          previousPage: `page=${previousData.page}`,
        });

        // Navegar a la nueva página después de un delay
        setTimeout(() => {
          if (onNewPageCreated) {
            onNewPageCreated(newPageNumber);
          }
        }, 100);

        return {
          previousData,
          currentQueryKey: newPageQueryKey, // ← Query key de la NUEVA página
          optimisticUser,
          shouldCreateNewPage: true,
          newPageParams,
        };
      } else {
        // CASO 2: Página con espacio → Agregar a página actual
        queryClient.setQueryData<GetUsersResponse>(currentQueryKey, (oldData) => {
          if (!oldData) return oldData;

          // Agregar al final si no existe
          const userExists = oldData.data.some(user => user.id === optimisticUser.id);
          if (userExists) return oldData;

          return {
            ...oldData,
            data: [...oldData.data, optimisticUser],
            total: oldData.total + 1,
            totalPages: Math.ceil((oldData.total + 1) / currentParams.limit),
          };
        });

        return {
          previousData,
          currentQueryKey,
          optimisticUser,
          shouldCreateNewPage: false,
        };
      }
    },

    mutationFn: (newUser: User): Promise<CreateUserResponse> => createUser(newUser),

    onSuccess: ( createdUserResponse: CreateUserResponse, _originalUser: User, context: UseCreateUserContext  ) => {
      const { currentQueryKey, optimisticUser, shouldCreateNewPage } = context;

      // Reemplazar usuario optimista con el real del servidor
      queryClient.setQueryData<GetUsersResponse>(currentQueryKey, (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          data: oldData.data.map(user =>
            user.id === optimisticUser.id
              ? createdUserResponse.user // ← Usuario real del backend
              : user
          ),
        };
      });

      // Invalidar todas las queries para sincronizar
      queryClient.invalidateQueries({
        queryKey: usersQueries.allUsers,
        refetchType: 'active',
      });

      // Mensaje de éxito
      const successMessage = shouldCreateNewPage
        ? `Usuario creado en nueva página`
        : `Usuario creado correctamente`;

      Swal.fire({
        title: '¡Usuario creado!',
        text: `${createdUserResponse.user.username} - ${successMessage}`,
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

    onError: ( error: Error, _originalUser: User, context?: UseCreateUserContext ) => {
      if (!context) return;

      const { previousData, currentQueryKey, optimisticUser, shouldCreateNewPage } = context;

      if (shouldCreateNewPage) {
        // Si se creó una página nueva, eliminarla completamente
        queryClient.removeQueries({ queryKey: currentQueryKey });

        // Restaurar la página anterior si existía
        if (previousData) {
          const previousPageKey = usersQueries.userWithFilters({
            ...currentParams,
            page: previousData.page,
          });
          queryClient.setQueryData(previousPageKey, previousData);
        }

        // Volver a la página anterior
        if (onNewPageCreated && previousData) {
          setTimeout(() => onNewPageCreated!(previousData.page), 100);
        }
      } else {
        // Rollback: Remover usuario optimista de la página actual
        queryClient.setQueryData<GetUsersResponse>(currentQueryKey, (oldData) => {
          if (!oldData) return previousData || oldData;

          return {
            ...oldData,
            data: oldData.data.filter(user => user.id !== optimisticUser.id),
            total: Math.max(0, oldData.total - 1),
            totalPages: Math.ceil(Math.max(0, oldData.total - 1) / currentParams.limit),
          };
        });
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

      Swal.fire({
        title: 'Error al crear usuario',
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
    useCreateUserMutation,
    isPending: useCreateUserMutation.isPending,
  };
};