// * Librerías
import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import Swal from 'sweetalert2';

// * Servicios
import { deleteCategory } from '../services/category.service';

// * Constantes
import { categoriesQueries } from '../const';

// * Interfaces
import type { DeleteCategoryResponse, GetCategoriesResponse, SearchCategoriesParams } from '../interfaces';


/**
 * Opciones para el hook useDeleteCategory
 */
interface UseDeleteCategoryOptions {
  currentParams: SearchCategoriesParams; 
  onPageEmpty?: () => void; 
  onFinally?: () => void;
}


interface DeleteCategoryContext {
  previousData?: GetCategoriesResponse;
  currentQueryKey: QueryKey;
}

/**
 * Hook de mutación para ELIMINAR un usuario.
 * Se integra con el store global 'isMutating' para mostrar un loader general.
 * Maneja la lógica de 'página vacía' al eliminar el último item.
 */
export const useDeleteCategory = (options: UseDeleteCategoryOptions) => {
  const { currentParams, onPageEmpty, onFinally } = options;
  const queryClient = useQueryClient();


  const deleteCategoryMutation = useMutation({

    // ==================================================================
    // onMutate: Se ejecuta ANTES de la llamada a la API
    // ==================================================================
    onMutate: async () : Promise<DeleteCategoryContext> => {
      // 2. ¡ACTIVAR EL LOADER GLOBAL!


      // 3. Definir la Query Key exacta que queremos manipular
      const currentQueryKey = categoriesQueries.categoryWithFilters(currentParams);

      // 4. Cancelar refetches en curso para evitar conflictos
      await queryClient.cancelQueries({ queryKey: currentQueryKey });

      // 5. Tomar un "snapshot" (copia de seguridad) del caché actual
      // Esto es VITAL para el 'onError' (rollback) y para 'onSuccess' (lógica de página vacía)
      const previousData = queryClient.getQueryData<GetCategoriesResponse>(currentQueryKey);

      // 6. Devolver el snapshot en la "mochila de contexto"
      return { previousData, currentQueryKey };
    },

    mutationFn: (categoryId: string) => deleteCategory(categoryId),

 
    onSuccess: async (deletedCategoryResponse: DeleteCategoryResponse, categoryId: string, context: DeleteCategoryContext) => {
      const { previousData } = context;

      // 7. Lógica de "página vacía" (basada en el snapshot)
      if (previousData) {
        const categoriesOnPage = previousData.data;
        const willBeEmpty = categoriesOnPage.filter(category => category.id !== categoryId).length === 0;

        if (willBeEmpty && previousData.page > 1 && onPageEmpty) {
          // Llama al "teléfono" (callback) en UsersPage para cambiar de página
          
          // (Tu lógica avanzada para actualizar el caché de la pág anterior es correcta,
          // pero la invalidación global de abajo también la manejará eventualmente.
          // Para mayor robustez, la mantenemos.)
          const previousPageParams = { ...currentParams, page: currentParams.page - 1 };
          const previousPageKey = categoriesQueries.categoryWithFilters(previousPageParams);
          
          queryClient.setQueryData<GetCategoriesResponse>(previousPageKey, (oldData) => {
             if (!oldData) return oldData;
             return {
               ...oldData,
               total: Math.max(0, oldData.total - 1),
               totalPages: Math.max(1, Math.ceil((oldData.total - 1) / currentParams.limit)),
             };
          });

          // Llama al callback para que UsersPage cambie de página
          onPageEmpty();
        }
      }

      // 8. Invalidar queries
      await queryClient.invalidateQueries({
        queryKey: categoriesQueries.allCategories,
      });

      // 8.1. Refetch MANUAL de TODAS las páginas conocidas en cache
      // Esto asegura que página 2, 3, etc. se actualicen inmediatamente
      const totalPages = Math.ceil((previousData?.total || 0) / currentParams.limit);
      const refetchPromises = [];

      for (let page = 1; page <= totalPages; page++) {
        const pageParams = { ...currentParams, page };
        refetchPromises.push(
          queryClient.refetchQueries({
            queryKey: categoriesQueries.categoryWithFilters(pageParams),
            exact: true,
          })
        );
      }

      // Esperar a que TODAS las páginas se actualicen
      await Promise.all(refetchPromises);

      if( onFinally ) {
        onFinally();
      }

      // 9. Notificación de éxito
      Swal.fire({
        title: '¡Categoría eliminada!',
        text: `${deletedCategoryResponse.category.name} se eliminó correctamente`,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#38bdf8',
        customClass: { popup: 'rounded-xl',
          title: 'text-xl font-bold text-gray-800',
          htmlContainer: 'text-gray-600',
        },
      });
    },

    // ==================================================================
    // onError: Se ejecuta si la API falla
    // ==================================================================
    onError: (error: Error, _categoryId: string, context?: DeleteCategoryContext) => {
      // 10. ¡Rollback! Restaurar los datos previos
      if (context?.previousData) {
        queryClient.setQueryData<GetCategoriesResponse>(context.currentQueryKey, context.previousData);
      }

      if( onFinally ) {
        onFinally();
      }

      // 11. Notificación de error
      Swal.fire({
        title: 'Error al eliminar',
        text: error.message || 'No se pudo eliminar la categoría',
        icon: 'error',
        confirmButtonColor: '#38bdf8',
        confirmButtonText: 'OK',
        customClass: { popup: 'rounded-xl',
          title: 'text-xl font-bold text-gray-800',
          htmlContainer: 'text-gray-600',
        },
      });
    },


  });

  return {
    deleteCategoryMutation,
    isPending: deleteCategoryMutation.isPending,
  };
};