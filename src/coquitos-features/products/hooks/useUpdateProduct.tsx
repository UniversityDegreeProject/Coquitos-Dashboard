// * Library
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';

// * Others
import type { ProductResponse } from '../interfaces';
import { useQuerys } from '../const';
import { updateProduct } from '../services/product.service';

interface OptimisticUpdateProduct {
  optimisticProduct: ProductResponse;
  originalProduct: ProductResponse;
}

interface ProductUpdatePayload {
  productId: string;
  productData: Partial<ProductResponse>;
}

/**
 * Hook para actualizar un producto existente
 * Implementa actualización optimista de la UI
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  const updateProductMutation = useMutation({

    onMutate: ({ productId, productData }: ProductUpdatePayload): OptimisticUpdateProduct => {
      const oldProducts = queryClient.getQueryData<ProductResponse[]>(useQuerys.allProducts);
      const originalProduct = oldProducts?.find(product => product.id === productId);

      if (!originalProduct) {
        throw new Error('Producto no encontrado');
      }

      const optimisticProduct: ProductResponse = {
        ...originalProduct,
        ...productData,
        updatedAt: new Date().toISOString(),
      };

      // Aplicar la mutación optimista
      queryClient.setQueryData<ProductResponse[]>(useQuerys.allProducts, (oldProducts): ProductResponse[] => {
        if (!oldProducts) return [];

        return oldProducts.map(product =>
          product.id === productId
            ? optimisticProduct
            : product
        );
      });

      return { optimisticProduct, originalProduct };
    },

    mutationFn: ({ productId, productData }: ProductUpdatePayload) => 
      updateProduct(productId, productData),

    onSuccess: (updatedProduct): void => {
      queryClient.setQueryData<ProductResponse[]>(useQuerys.allProducts, (oldProducts): ProductResponse[] => {
        if (!oldProducts) return [updatedProduct];

        const dataUpdatedSuccess = oldProducts.map((product: ProductResponse) => {
          if (product.id === updatedProduct.id) {
            return updatedProduct;
          }
          return product;
        });
        return dataUpdatedSuccess;
      });

      Swal.fire({
        title: 'Producto actualizado exitosamente',
        text: `El producto ${updatedProduct.name} se ha actualizado correctamente`,
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

    onError: (error, { productId }: ProductUpdatePayload, context?: OptimisticUpdateProduct): void => {
      queryClient.setQueryData<ProductResponse[]>(useQuerys.allProducts, (oldProducts): ProductResponse[] => {
        if (!oldProducts) return [];
        if (!context?.originalProduct) return oldProducts;

        // Restaurar los datos originales del producto
        return oldProducts.map((product: ProductResponse) =>
          product.id === productId
            ? context.originalProduct
            : product
        );
      });

      const errorMessage = error.message || "Ha ocurrido un error al actualizar el producto.";

      Swal.fire({
        title: 'Error al actualizar producto',
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
    updateProductMutation,
    ...updateProductMutation,
  };
};

