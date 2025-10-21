// * Library
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';

// * Others
import type { Category } from '../interfaces';
import { useQuerys } from '../const';
import { updateCategory } from '../services/category.service';

interface OptimisticUpdateCategory {
  optimisticCategory: Category;
  originalCategory: Category;
}

/**
 * Hook para actualizar una categoría existente
 * Implementa actualización optimista de la UI
 */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  const updateCategoryMutation = useMutation({

    onMutate: (categoryToUpdate: Category): OptimisticUpdateCategory => {
      const oldCategories = queryClient.getQueryData<Category[]>(useQuerys.allCategories);
      const originalCategory = oldCategories?.find(category => category.id === categoryToUpdate.id);

      if (!originalCategory) {
        throw new Error('Categoría no encontrada');
      }

      const optimisticCategory: Category = {
        ...categoryToUpdate,
        isOptimistic: true,
      }

      // Aplicar la mutación optimista
      queryClient.setQueryData<Category[]>(useQuerys.allCategories, (oldCategories): Category[] => {
        if (!oldCategories) return [];

        return oldCategories.map(category =>
          category.id === categoryToUpdate.id
            ? optimisticCategory
            : category
        );
      });

      return { optimisticCategory, originalCategory };
    },

    mutationFn: (categoryUpdated: Category) => updateCategory(categoryUpdated.id!, categoryUpdated),

    onSuccess: (updatedCategory): void => {
      queryClient.setQueryData<Category[]>(useQuerys.allCategories, (oldCategories): Category[] => {
        if (!oldCategories) return [updatedCategory];

        const dataUpdatedSuccess = oldCategories.map((category: Category) => {
          if (category.id === updatedCategory.id || (category as Category & { isOptimistic?: boolean }).isOptimistic) {
            return updatedCategory;
          }
          return category;
        });
        return dataUpdatedSuccess;
      });

      Swal.fire({
        title: 'Categoría actualizada exitosamente',
        text: `La categoría ${updatedCategory.name} se ha actualizado correctamente`,
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

    onError: (error, categoryToUpdate: Category, context?: OptimisticUpdateCategory): void => {
      queryClient.setQueryData<Category[]>(useQuerys.allCategories, (oldCategories): Category[] => {
        if (!oldCategories) return [];
        if (!context?.originalCategory) return oldCategories;

        // Restaurar los datos originales de la categoría
        return oldCategories.map((category: Category) =>
          category.id === categoryToUpdate.id
            ? context.originalCategory
            : category
        );
      });

      const errorMessage = error.message || "Ha ocurrido un error al actualizar la categoría.";

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
    ...updateCategoryMutation,
  }
};

