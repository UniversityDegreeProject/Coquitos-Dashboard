import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../services/product.service";
import { type ProductResponse, type ProductFormData } from "../interfaces";
import Swal from "sweetalert2";
import { useQuerys } from "../const";

interface OptimisticMutationProduct {
  optimisticProduct: ProductResponse;
}

/**
 * Hook para crear un nuevo producto
 * Implementa actualización optimista de la UI
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  const useCreateProductMutation = useMutation({

    onMutate: (productToCreate: ProductFormData): OptimisticMutationProduct => {
      const optimisticProduct: ProductResponse = {
        id: crypto.randomUUID(),
        name: productToCreate.name,
        description: productToCreate.description || '',
        price: productToCreate.price,
        sku: productToCreate.sku || '',
        stock: productToCreate.stock || 0,
        minStock: productToCreate.minStock || 5,
        image: productToCreate.image || '',
        ingredients: productToCreate.ingredients || '',
        status: productToCreate.status || 'Disponible',
        categoryId: productToCreate.categoryId,
        category: {
          id: productToCreate.categoryId,
          name: 'Cargando...',
          status: 'Activo'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<ProductResponse[]>(useQuerys.allProducts, (oldProducts) => {
        if (!oldProducts) return [optimisticProduct];
        return [...oldProducts, optimisticProduct];
      });

      return { optimisticProduct };
    },

    mutationFn: (newProduct: ProductFormData): Promise<ProductResponse> => createProduct(newProduct),

    onSuccess: (createdProduct: ProductResponse, _, { optimisticProduct }) => {
      queryClient.setQueryData<ProductResponse[]>(useQuerys.allProducts, (oldProducts) => {
        if (!oldProducts) return [createdProduct];

        const productCreateSuccess = oldProducts.map(product => {
          if (product.id === optimisticProduct.id) {
            return createdProduct;
          }
          return product;
        });

        return productCreateSuccess;
      });

      Swal.fire({
        title: '¡Registro exitoso!',
        text: `Producto ${createdProduct?.name || optimisticProduct?.name} se ha registrado correctamente.`,
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

    onError: (error: Error, _, context?: OptimisticMutationProduct | undefined): void => {
      queryClient.setQueryData<ProductResponse[]>(useQuerys.allProducts, (oldData: ProductResponse[] | undefined) => {
        if (!oldData) return [];
        if (!context?.optimisticProduct) return oldData;
        return oldData.filter((product: ProductResponse) => product.id !== context.optimisticProduct.id);
      });

      const errorMessage = error.message || "Ha ocurrido un error al crear el producto.";

      Swal.fire({
        title: 'Error al crear producto',
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
    useCreateProductMutation,
    ...useCreateProductMutation,
  };
};

