import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { deleteProduct } from '../services/product.service';
import { useQuerys } from '../const';
import type { ProductResponse } from '../interfaces';

interface OptimisticDeleteProduct {
  deletedProduct: ProductResponse;
}

/**
 * Hook para eliminar un producto
 * Implementa actualización optimista de la UI
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  const deleteProductMutation = useMutation({

    onMutate: async (productId: string): Promise<OptimisticDeleteProduct> => {
      const oldProducts = queryClient.getQueryData<ProductResponse[]>(useQuerys.allProducts);
      const deletedProduct = oldProducts?.find(product => product.id === productId);

      if (!deletedProduct) {
        throw new Error('Producto no encontrado');
      }

      // Actualización optimista: marcar como "en proceso de eliminación"
      queryClient.setQueryData<ProductResponse[]>(useQuerys.allProducts, (oldProducts): ProductResponse[] => {
        if (!oldProducts) return [];
        return oldProducts.filter(product => product.id !== productId);
      });

      return { deletedProduct };
    },

    mutationFn: (productId: string) => deleteProduct(productId),

    onSuccess: (productDeleted: ProductResponse) => {
      // Confirmación de que el producto fue eliminado
      queryClient.setQueryData<ProductResponse[]>(useQuerys.allProducts, (oldProducts): ProductResponse[] => {
        if (!oldProducts) return [];
        return oldProducts.filter((product: ProductResponse) => product.id !== productDeleted.id);
      });

      Swal.fire({
        title: 'Producto eliminado exitosamente',
        text: `El producto ${productDeleted.name} se ha eliminado correctamente`,
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

    onError: (error, _: string, context?: OptimisticDeleteProduct): void => {
      // Restaurar el producto eliminado optimistamente
      queryClient.setQueryData<ProductResponse[]>(useQuerys.allProducts, (oldProducts): ProductResponse[] => {
        if (!oldProducts) return [];
        if (!context?.deletedProduct) return oldProducts;

        return [...oldProducts, context.deletedProduct];
      });

      Swal.fire({
        title: 'Error al eliminar producto',
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
    deleteProductMutation,
    ...deleteProductMutation,
  };
};

