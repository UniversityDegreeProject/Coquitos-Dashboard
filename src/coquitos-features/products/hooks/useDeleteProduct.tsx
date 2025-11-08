import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { deleteProduct } from '../services/product.service';
import type { DeleteProductResponse, GetProductsResponse, SearchProductsParams } from '../interfaces';
import { productsQueries } from '../const/products-queries';

interface DeleteProductContext {
  previousData?: GetProductsResponse;
  currentQueryKey : QueryKey
}

interface DeleteProductOptions{
  currentParams: SearchProductsParams;
  onPageEmpty?: () => void;
}
/**
 * Hook para eliminar un producto
 * Implementa actualización optimista de la UI
 */
export const useDeleteProduct = (options: DeleteProductOptions ) => {

  const { currentParams, onPageEmpty } = options;
  const queryClient = useQueryClient(); 

  const deleteProductMutation = useMutation({

    onMutate: async (): Promise<DeleteProductContext> => {

      const currentQueryKey = productsQueries.productsWithFilters( currentParams);

      queryClient.cancelQueries({ queryKey: currentQueryKey });

      const previousData = queryClient.getQueryData<GetProductsResponse>(currentQueryKey)!;
      

      return { previousData, currentQueryKey}
    },

    mutationFn: (productId: string) => deleteProduct(productId),

    onSuccess: async (productDeleted: DeleteProductResponse, _idSubmitted : string , context : DeleteProductContext) => {
      const { previousData } = context;
    
      if( previousData ){
        const productsOnPage = previousData.data;
        const pageWillBeEmpty = productsOnPage.filter( product => product.id !== _idSubmitted).length === 0;

        if ( pageWillBeEmpty && previousData.page > 1 && onPageEmpty ) {
          const newPage = previousData.page -1;
          const newParams = { ...currentParams, page : newPage };
          const previousQueryKey = productsQueries.productsWithFilters( newParams );

          queryClient.setQueryData<GetProductsResponse>( previousQueryKey, ( oldData) =>{
            if( !oldData ) return previousData;
            return {
              ...previousData,
              total: Math.max(0, previousData.total -1),
              page: newPage,
            }

          });

          onPageEmpty();

        }
      }

      await queryClient.invalidateQueries({
        queryKey: productsQueries.allProducts,
      });

      const totalPages = Math.max(1, Math.ceil(previousData?.total || 0 / currentParams.limit));
      const promiseQueryes = [];

      for (let page = 1; page <= totalPages; page++) {
        const pageParams = { ...currentParams, page };
        promiseQueryes.push(queryClient.refetchQueries({
          queryKey: productsQueries.productsWithFilters(pageParams),
        }));
      }

      await Promise.all(promiseQueryes);

      await Swal.fire({
        title: 'Producto eliminado exitosamente',
        text: `El producto ${productDeleted.product.name} se ha eliminado correctamente`,
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

    onError: async (error : Error, _: string, context?: DeleteProductContext): Promise<void> => {
      // Restaurar el producto eliminado optimistamente
      if( context?.previousData ){
        queryClient.setQueryData<GetProductsResponse>( context.currentQueryKey, context.previousData);
      }

      await Swal.fire({
        title: 'Error al eliminar producto',
        text: error.message,
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
    deleteProductMutation,
    ...deleteProductMutation,
  };
};

