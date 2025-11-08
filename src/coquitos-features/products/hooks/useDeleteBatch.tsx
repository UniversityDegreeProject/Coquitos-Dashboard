import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBatch } from "../services/product-batch.service";
import { productBatchesQueries, productsQueries } from "../const";
import Swal from "sweetalert2";

interface UseDeleteBatchOptions {
  productId: string;
}

/**
 * Hook para eliminar un batch
 * Solo permite eliminar batches con stock = 0
 */
export const useDeleteBatch = (options: UseDeleteBatchOptions) => {
  const { productId } = options;
  const queryClient = useQueryClient();

  const deleteBatchMutation = useMutation({
    mutationFn: (batchId: string) => deleteBatch(batchId),

    onSuccess: async (response) => {
      // Invalidar queries de batches y products
      await queryClient.invalidateQueries({
        queryKey: productBatchesQueries.batchesByProduct(productId),
      });
      
      await queryClient.invalidateQueries({
        queryKey: productsQueries.allProducts,
      });

      // Refetch inmediato para actualizar la UI
      await queryClient.refetchQueries({
        queryKey: productsQueries.allProducts,
      });

      // Mensaje de éxito
      await Swal.fire({
        title: 'Batch eliminado',
        text: `${response.batch.batchCode} ha sido eliminado`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
    },

    onError: async (error: Error) => {
      await Swal.fire({
        title: 'Error al eliminar batch',
        text: error.message,
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
      });
    },
  });

  return {
    deleteBatchMutation,
    isPending: deleteBatchMutation.isPending,
  };
};

