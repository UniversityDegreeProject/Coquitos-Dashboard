import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBatch } from "../services/product-batch.service";
import { productBatchesQueries, productsQueries } from "../const";
import type { CreateBatchFormData, CreateBatchResponse } from "../interfaces";
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

    onSuccess: async (batchCreated : CreateBatchResponse) => {
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
      const wasIncremented = batchCreated.batch.stock > 1;
      await Swal.fire({
        title: wasIncremented ? `¡Lote ${batchCreated.batch.batchCode} actualizado!` : `¡Lote ${batchCreated.batch.batchCode} creado exitosamente!`,
        html: wasIncremented 
          ? `Ya existía un batch con este peso/precio.<br/>Stock incrementado a <strong>${batchCreated.batch.stock}</strong> unidades<br/><small class="text-gray-500">${batchCreated.batch.batchCode}</small>`
          : `Código: ${batchCreated.batch.batchCode}<br/>Stock: ${batchCreated.batch.stock} unidad`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
    },

    onError: async (error: Error) => {
      await Swal.fire({
        title: 'Error al crear lote',
        text: error.message,
        icon: 'error',
        timer: 1500,
        showConfirmButton: false,
      });
    },
  });

  return {
    useCreateBatchMutation,
    isPending: useCreateBatchMutation.isPending,
  };
};

