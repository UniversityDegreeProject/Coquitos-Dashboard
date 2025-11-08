import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBatch } from "../services/product-batch.service";
import { productBatchesQueries, productsQueries } from "../const";
import type { CreateBatchFormData } from "../interfaces";
import Swal from "sweetalert2";

interface UseCreateBatchOptions {
  productId: string;
  onSuccessCallback?: () => void;
}

/**
 * Hook para crear un nuevo batch de producto de peso variable
 */
export const useCreateBatch = (options: UseCreateBatchOptions) => {
  const { productId, onSuccessCallback } = options;
  const queryClient = useQueryClient();

  const useCreateBatchMutation = useMutation({
    mutationFn: (batchData: CreateBatchFormData) => createBatch(productId, batchData),

    onSuccess: async (response) => {
      // Invalidar queries de batches
      await queryClient.invalidateQueries({
        queryKey: productBatchesQueries.batchesByProduct(productId),
      });
      
      // Invalidar TODAS las queries de products (incluye lista y stats)
      await queryClient.invalidateQueries({
        queryKey: productsQueries.allProducts,
      });

      // Refetch inmediato para actualizar la UI
      await queryClient.refetchQueries({
        queryKey: productsQueries.allProducts,
      });

      // Callback de éxito
      if (onSuccessCallback) {
        onSuccessCallback();
      }

      // Mensaje de éxito (indica si se combinó con batch existente)
      const wasIncremented = response.batch.stock > 1;
      await Swal.fire({
        title: wasIncremented ? '¡Batch actualizado!' : '¡Batch creado!',
        html: wasIncremented 
          ? `Ya existía un batch con este peso/precio.<br/>Stock incrementado a <strong>${response.batch.stock}</strong> unidades<br/><small class="text-gray-500">${response.batch.batchCode}</small>`
          : `Código: ${response.batch.batchCode}<br/>Stock: ${response.batch.stock} unidad`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
    },

    onError: async (error: Error) => {
      await Swal.fire({
        title: 'Error al crear batch',
        text: error.message,
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
      });
    },
  });

  return {
    useCreateBatchMutation,
    isPending: useCreateBatchMutation.isPending,
  };
};

