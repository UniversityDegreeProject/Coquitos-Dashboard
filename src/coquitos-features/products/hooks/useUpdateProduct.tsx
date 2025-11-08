// * Library
import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import Swal from 'sweetalert2';

// * Others
// import type { ProductResponse } from '../interfaces';
// import { useQuerys } from '../const';
import { updateProduct } from '../services/product.service';
import type { GetProductsResponse, Product, SearchProductsParams, UpdateProductResponse } from '../interfaces';
import { productsQueries } from '../const';

interface UpdateProductContext {
  previousData: GetProductsResponse;
  currentQueryKey: QueryKey;
}

interface UseUpdateProductOptions {
  currentParams: SearchProductsParams;
}


/**
 * Hook para actualizar un producto existente
 * Implementa actualización optimista de la UI
 */
export const useUpdateProduct = ( options: UseUpdateProductOptions ) => {

  const { currentParams } = options;

  const queryClient = useQueryClient();

  const updateProductMutation = useMutation({

    onMutate: (): UpdateProductContext => {
      
      const currentQueryKey = productsQueries.productsWithFilters(currentParams);

      queryClient.cancelQueries({ queryKey: currentQueryKey });

      const previousData = queryClient.getQueryData<GetProductsResponse>(currentQueryKey);

      if( !previousData) throw new Error('Producto no encontrado');

      return { previousData, currentQueryKey };
    },

    mutationFn: (product: Product) => updateProduct(product.id!, product),

    onSuccess: async (updatedProduct: UpdateProductResponse, _productSubmitted: Product, context : UpdateProductContext) => {

      const { previousData } = context;

      if( previousData ){
        queryClient.setQueryData<GetProductsResponse>(productsQueries.productsWithFilters(currentParams), (oldData) => {
          if( !oldData ) return previousData;
          return {
            ...oldData,
            products: previousData.data.map((product) => product.id === updatedProduct.product.id ? updatedProduct.product : product),
          };
        });
      }

      await queryClient.invalidateQueries({
        queryKey: productsQueries.allProducts,
      });

      await queryClient.refetchQueries({
        queryKey: productsQueries.productsWithFilters(currentParams),
      });

      await Swal.fire({
        title: 'Producto actualizado exitosamente',
        text: `El producto ${updatedProduct.product.name} se ha actualizado correctamente`,
        icon: 'success',
        timer: 1500,
        // confirmButtonText: 'OK',
        // confirmButtonColor: '#38bdf8',
        customClass: {
          popup: 'rounded-xl',
          title: 'text-xl font-bold text-gray-800',
          htmlContainer: 'text-gray-600',
        },
      });
    },

    onError: async (error : Error, _productSubmitted: Product, context?: UpdateProductContext): Promise<void> => {

      if( context?.previousData ){
        queryClient.setQueryData<GetProductsResponse>( context.currentQueryKey, context.previousData);
      }



      const errorMessage = error.message || "Ha ocurrido un error al actualizar el producto.";

      await Swal.fire({
        title: 'Error al actualizar producto',
        text: errorMessage,
        icon: 'error',
        timer: 1500,
        // confirmButtonText: 'OK',
        // confirmButtonColor: '#38bdf8',
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

