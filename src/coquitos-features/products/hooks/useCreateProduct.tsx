import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { createProduct, getProducts } from "../services/product.service";
// import { type ProductResponse, type ProductFormData } from "../interfaces";
import Swal from "sweetalert2";
import { productsQueries } from "../const";
import type { CreateProductResponse, GetProductsResponse, Product, SearchProductsParams } from "../interfaces";

interface CreateProductContext {
  previousData: GetProductsResponse;
  currentQueryKey: QueryKey;
}

interface UseCreateProductOptions {
  currentParams: SearchProductsParams;
  onNewPageCreated?: (newPage: number) => void;
}
/**
 * Hook para crear un nuevo producto
 * Implementa actualización optimista de la UI
 */
export const useCreateProduct = (options: UseCreateProductOptions) => {
  const { currentParams, onNewPageCreated } = options;

  const queryClient = useQueryClient();

  const useCreateProductMutation = useMutation({

    onMutate: (): CreateProductContext => {

      const currentQueryKey = productsQueries.productsWithFilters(currentParams);

      queryClient.cancelQueries({ queryKey: currentQueryKey });

      const previousData = queryClient.getQueryData<GetProductsResponse>(currentQueryKey);

      if( !previousData ) throw new Error('Producto no encontrado');


      return { previousData, currentQueryKey };
    },

    mutationFn: (newProduct: Product ) => createProduct(newProduct),

    onSuccess: async (createdProduct: CreateProductResponse, _productSubmitted: Product, context: CreateProductContext) => {
      const { previousData } = context;

      if ( previousData ){
        const wasPageFull = previousData.data.length >= currentParams.limit;
    
        if( wasPageFull ){
          const newPage = currentParams.page + 1;
          const newParams = { ...currentParams, page: newPage };
          const newPageKey = productsQueries.productsWithFilters(newParams);

          try {
            await queryClient.fetchQuery({
            queryKey: newPageKey,
            queryFn: () => getProducts(newParams),
          });
          } catch (error) {
            console.error('Error fetching new page:', error);
          }

          if( onNewPageCreated ){
            setTimeout(() => onNewPageCreated(newPage), 100);
          } 
        }
      }

      await queryClient.invalidateQueries({
        queryKey: productsQueries.allProducts,
      });

      await queryClient.refetchQueries({
        queryKey: productsQueries.productsWithFilters(currentParams),
      });

      await Swal.fire({
        title: '¡Registro exitoso!',
        text: `Producto ${createdProduct.product.name} se ha registrado correctamente.`,
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

    onError: async (error: Error, _productSubmitted: Product, context?: CreateProductContext): Promise<void> => {
      if( context?.previousData ){
        queryClient.setQueryData<GetProductsResponse>(context.currentQueryKey, context.previousData);
      }

      const errorMessage = error.message || "Ha ocurrido un error al crear el producto.";

      await Swal.fire({
        title: 'Error al crear producto',
        text: errorMessage,
        icon: 'error',
        timer: 1500,
        // confirmButtonText: 'Entendido',
        // confirmButtonColor: '#ef4444',
        customClass: {
          popup: 'rounded-xl',
          title: 'text-xl font-bold text-gray-800',
          htmlContainer: 'text-gray-600',
        },
      });
    },
  });

  return {
    useCreateProductMutation,
    ...useCreateProductMutation,
  };
};

