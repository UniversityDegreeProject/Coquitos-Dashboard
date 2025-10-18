import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { deleteCategory } from '../services/category.service';
import { useQuerys } from '../const';
import type { Category } from '../interfaces';

interface OptimisticDeleteCategory {
  deletedCategory: Category;
}

/**
 * Hook para eliminar una categoría
 * Implementa actualización optimista de la UI
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  const deleteCategoryMutation = useMutation({

    onMutate: async (categoryId: string): Promise<OptimisticDeleteCategory> => {
      const oldCategories = queryClient.getQueryData<Category[]>(useQuerys.allCategories);
      const deletedCategory = oldCategories?.find(category => category.id === categoryId);

      if (!deletedCategory) {
        throw new Error('Categoría no encontrada');
      }

      const optimisticCategory: Category = {
        ...deletedCategory,
        isOptimistic: true,
      };

      queryClient.setQueryData<Category[]>(useQuerys.allCategories, (oldCategories): Category[] => {
        if (!oldCategories) return [];

        return oldCategories.map(category =>
          category.id === categoryId
            ? optimisticCategory
            : category
        );
      });

      return { deletedCategory };
    },

    mutationFn: (categoryId: string) => deleteCategory(categoryId),

    onSuccess: (categoryDeleted: Category, categoryId) => {
      queryClient.setQueryData<Category[]>(useQuerys.allCategories, (oldCategories): Category[] => {
        if (!oldCategories) return [];
        return oldCategories.filter((category: Category) => category.id !== categoryId);
      });

      Swal.fire({
        title: 'Categoría eliminada exitosamente',
        text: `La categoría ${categoryDeleted.name} se ha eliminado correctamente`,
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

    onError: (error, categoryId: string, context?: OptimisticDeleteCategory): void => {
      queryClient.setQueryData<Category[]>(useQuerys.allCategories, (oldCategories): Category[] => {
        if (!oldCategories) return [];
        if (!context?.deletedCategory) return oldCategories;

        return oldCategories.map(category =>
          category.id === categoryId
            ? context.deletedCategory
            : category
        );
      });

      Swal.fire({
        title: 'Error al eliminar categoría',
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
    deleteCategoryMutation,
    ...deleteCategoryMutation,
  }
};

