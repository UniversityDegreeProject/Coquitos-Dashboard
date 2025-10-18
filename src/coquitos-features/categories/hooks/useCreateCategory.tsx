import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "../services/category.service";
import { type Category } from "../interfaces"
import Swal from "sweetalert2";
import { useQuerys } from "../const";

interface OptimisticMutationCategory {
  optimisticCategory: Category
}

/**
 * Hook para crear una nueva categoría
 * Implementa actualización optimista de la UI
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  const useCreateCategoryMutation = useMutation({

    onMutate: (categoryToCreate: Category): OptimisticMutationCategory => {
      const optimisticCategory: Category = {
        ...categoryToCreate,
        id: crypto.randomUUID(),
        isOptimistic: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      queryClient.setQueryData<Category[]>(useQuerys.allCategories, (oldCategories) => {
        if (!oldCategories) return [optimisticCategory];
        return [...oldCategories, optimisticCategory];
      });

      return { optimisticCategory };
    },

    mutationFn: (newCategory: Category): Promise<Category> => createCategory(newCategory),

    onSuccess: (createdCategory: Category, _, { optimisticCategory }) => {
      queryClient.setQueryData<Category[]>(useQuerys.allCategories, (oldCategories) => {
        if (!oldCategories) return [createdCategory];

        const categoryCreateSuccess = oldCategories.map(category => {
          if (category.id === optimisticCategory.id || (category as Category & { isOptimistic?: boolean }).isOptimistic) {
            return createdCategory;
          }
          return category;
        });

        return categoryCreateSuccess;
      });

      Swal.fire({
        title: '¡Registro exitoso!',
        text: `Categoría ${createdCategory?.name || optimisticCategory?.name} se ha registrado correctamente.`,
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

    onError: (error: Error, _, context?: OptimisticMutationCategory | undefined): void => {
      queryClient.setQueryData<Category[]>(useQuerys.allCategories, (oldData: Category[] | undefined) => {
        if (!oldData) return [];
        if (!context?.optimisticCategory) return oldData;
        return oldData.filter((category: Category) => category.id !== context.optimisticCategory.id);
      });

      const errorMessage = error.message || "Ha ocurrido un error al crear la categoría.";

      Swal.fire({
        title: 'Error al crear categoría',
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
    useCreateCategoryMutation,
    ...useCreateCategoryMutation,
  };
};

