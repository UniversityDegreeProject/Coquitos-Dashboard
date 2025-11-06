// * Library
import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import Swal from 'sweetalert2';

// * Others
import type { GetCategoriesResponse, SearchCategoriesParams, UpdateCategoryResponse, Category } from '../interfaces';
import { categoriesQueries } from '../const';
import { updateCategory } from '../services/category.service';

interface UpdateCategoryContext {
  previousData?: GetCategoriesResponse;
  currentQueryKey: QueryKey;
}
interface UseUpdateCategoryOptions {
  currentParams: SearchCategoriesParams;
  onSuccessCallback?: () => void;
  onFinally?: () => void;
  categoryMessageState: string;
}

export const useUpdateCategory = (options: UseUpdateCategoryOptions) => {
  const { currentParams, onSuccessCallback, onFinally, categoryMessageState } = options;
  const queryClient = useQueryClient();

  const updateCategoryMutation = useMutation({
    onMutate: async (): Promise<UpdateCategoryContext> => {
      // Marcar el usuario como optimista solo para animación visual
      const currentQueryKey = categoriesQueries.categoryWithFilters(currentParams);
      await queryClient.cancelQueries({ queryKey: currentQueryKey });
      const previousData = queryClient.getQueryData<GetCategoriesResponse>(currentQueryKey);

      if (!previousData) {
        throw new Error('Categoría no encontrada');
      }

      return { previousData, currentQueryKey };
    },

    mutationFn: (categoryUpdated: Category,) => updateCategory(categoryUpdated.id!, categoryUpdated),

    onSuccess: async (updateCategoryResponse: UpdateCategoryResponse) => {
      // Invalidar y refetch todas las queries de usuarios
      await queryClient.invalidateQueries({ 
        queryKey: categoriesQueries.allCategories,
      });

      // Asegurar que la página actual se refetch
      await queryClient.refetchQueries({
        queryKey: categoriesQueries.categoryWithFilters(currentParams),
      });

      // Ejecutar callback de éxito (cerrar modal, etc.)
      if (onSuccessCallback) {
        onSuccessCallback();
      }

      // Desactivar estado de mutación
      if (onFinally) {
        onFinally();
      }

      Swal.fire({
        title: 'Categoría actualizada exitosamente',
        text: categoryMessageState || `La categoría ${updateCategoryResponse.category.name} se ha actualizado correctamente`,
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

    onError: (error: Error, _originalCategorySubmitted: Category, context?: UpdateCategoryContext) => {
      // Rollback: restaurar datos anteriores
      if (context?.previousData) {
        queryClient.setQueryData<GetCategoriesResponse>(context.currentQueryKey, context.previousData);
      }

      // Cerrar modal también en caso de error
      if (onSuccessCallback) {
        onSuccessCallback();
      }

      // Desactivar estado de mutación
      if (onFinally) {
        onFinally();
      }

      // Mensaje de error personalizado
        let errorMessage = "Ha ocurrido un error al actualizar la categoría.";

      if (error.message.includes("name") || error.message.includes("nombre")) {
        errorMessage = error.message;
      } else if (error.message.includes("description") || error.message.includes("descripción")) {
        errorMessage = error.message;
      } else {
        errorMessage = error.message;
      }
      Swal.fire({
        title: 'Error al actualizar categoría',
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
    updateCategoryMutation,
    isPending: updateCategoryMutation.isPending,
  };
}; 