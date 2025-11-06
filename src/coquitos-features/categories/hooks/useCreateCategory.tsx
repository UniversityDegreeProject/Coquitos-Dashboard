import { type QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { createCategory, getCategories } from "../services/category.service";
import { categoriesQueries } from "../const";
import type { 
  CreateCategoryResponse, 
  GetCategoriesResponse, 
  SearchCategoriesParams, 
  Category 
} from "../interfaces";


interface OptimisticMutateCategory {
  previousData: GetCategoriesResponse;
  currentQueryKey: QueryKey;
}

interface UseCreateCategoryOptions {
  currentParams: SearchCategoriesParams;
  onNewPageCreated?: (newPage: number) => void;
  onSuccessCallback?: () => void;
  onFinally?: () => void;
}

export const useCreateCategory = (options: UseCreateCategoryOptions) => {
  const { currentParams, onNewPageCreated, onSuccessCallback, onFinally } = options;
  const queryClient = useQueryClient();

  const useCreateCategoryMutation = useMutation({


    onMutate: async (): Promise<OptimisticMutateCategory> => {

      const currentQueryKey = categoriesQueries.categoryWithFilters(currentParams);

      queryClient.cancelQueries({ queryKey: currentQueryKey });

      const previousData = queryClient.getQueryData<GetCategoriesResponse>(currentQueryKey);
      
      if (!previousData) {
        throw new Error('No se encontraron datos para la categoría');
      }


 
      return { previousData, currentQueryKey };
    },

    mutationFn: (newCategory: Category): Promise<CreateCategoryResponse> => createCategory(newCategory),

    onSuccess: async (createdCategoryResponse: CreateCategoryResponse , _Category : Category, { previousData } : OptimisticMutateCategory) => {
      const dataBeforeRefetch = previousData;

      const wasPageFull = dataBeforeRefetch && currentParams.limit <= dataBeforeRefetch.data.length

      // 2. Invalidar TODAS las queries de usuarios
      await queryClient.invalidateQueries({
        queryKey: categoriesQueries.allCategories,
      });

      // 3. Refetch la página actual para obtener datos actualizados
      await queryClient.refetchQueries({
        queryKey: categoriesQueries.categoryWithFilters(currentParams),
      });

      // 4. Si la página ESTABA llena, el nuevo usuario fue a una nueva página → navegar
      if (wasPageFull) {
        const newPageNumber = currentParams.page + 1;
        const newPageParams = {
          ...currentParams,
          page: newPageNumber,
        };
        const newPageKey = categoriesQueries.categoryWithFilters(newPageParams);
        
        // Fetch la nueva página para asegurar que tenga datos
        try {
          await queryClient.fetchQuery({
            queryKey: newPageKey,
            queryFn: () => getCategories(newPageParams),
          });
        } catch (error) {
          console.error('Error fetching new page:', error);
        }
        
        // Navegar a la nueva página
        if (onNewPageCreated) {
          setTimeout(() => onNewPageCreated(newPageNumber), 100);
        }
      }

      // 5. Ejecutar callback de éxito (cerrar modal, etc.)
      if (onSuccessCallback) {
        onSuccessCallback();
      }

      // 6. Desactivar estado de mutación
      if (onFinally) {
        onFinally();
      }

      // 7. Mensaje de éxito
      Swal.fire({
        title: '¡Categoría creada!',
        text: `${createdCategoryResponse.category.name} se creó correctamente`,
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

    onError: (error: Error, _categorySubmitted: Category, context?: OptimisticMutateCategory) => {
      // Cerrar modal también en caso de error
      if (context?.previousData) {
        queryClient.setQueryData<GetCategoriesResponse>(context.currentQueryKey, context.previousData);
      }

      if (onSuccessCallback) {
        onSuccessCallback();
      }

      // Desactivar estado de mutación
      if (onFinally) {
        onFinally();
      }

      // Mensaje de error personalizado
      const errorMessages: Record<string, string> = {
        name: 'El nombre ya está en uso',
        description: 'La descripción ya está en uso',
      };

      const errorKey = Object.keys(errorMessages).find(key =>
        error.message.toLowerCase().includes(key)
      );

      const errorMessage = errorKey
        ? errorMessages[errorKey]
        : error.message || 'Error al crear la categoría';

      Swal.fire({
        title: 'Error al crear categoría',
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
    useCreateCategoryMutation,
    isPending: useCreateCategoryMutation.isPending,
  };
};