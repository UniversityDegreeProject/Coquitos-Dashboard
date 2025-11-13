import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBatchStock } from "../services/product-batch.service";
import { productBatchesQueries, productsQueries } from "../const";
import type { UpdateBatchStockFormData } from "../interfaces";
import Swal from "sweetalert2";

interface UseUpdateBatchStockOptions {
  productId: string;
  onSuccessCallback?: () => void;
}

/**
 * Hook para actualizar el stock de un batch
 * Útil para reasignar cuando llegan más unidades del mismo peso/precio
 */
export const useUpdateBatchStock = (options: UseUpdateBatchStockOptions) => {
  const { productId, onSuccessCallback } = options;
  const queryClient = useQueryClient();

  const updateBatchStockMutation = useMutation({
    mutationFn: (data: UpdateBatchStockFormData) => updateBatchStock(data),

    onSuccess: async (response) => {
      // Invalidar queries de batches y products
      await queryClient.invalidateQueries({
        queryKey: productBatchesQueries.batchesByProduct(productId),
      });
      
      await queryClient.invalidateQueries({
        queryKey: productsQueries.allProducts,
      });

      // No hacer refetch inmediato para evitar recarga de página
      // Los queries se invalidaron arriba y se actualizarán automáticamente

      // Callback de éxito
      if (onSuccessCallback) {
        onSuccessCallback();
      }

      // Mensaje de éxito
      await Swal.fire({
        title: 'Stock actualizado',
        text: `Nuevo stock: ${response.batch.stock} unidades`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
    },

    onError: async (error: Error) => {
      await Swal.fire({
        title: 'Error al actualizar stock',
        text: error.message,
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
      });
    },
  });

  return {
    updateBatchStockMutation,
    isPending: updateBatchStockMutation.isPending,
  };
};

