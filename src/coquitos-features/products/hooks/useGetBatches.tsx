import { useQuery } from "@tanstack/react-query";
import { productBatchesQueries } from "../const";
import { getBatchesByProduct } from "../services/product-batch.service";
import type { ProductBatch } from "../interfaces";

/**
 * Hook para obtener todos los batches de un producto específico
 * Solo para productos con isVariableWeight = true
 */
export const useGetBatches = (productId: string, enabled: boolean = true) => {
  const useQueryBatches = useQuery({
    queryKey: productBatchesQueries.batchesByProduct(productId),
    queryFn: () => getBatchesByProduct(productId),
    staleTime: 1000 * 60 * 2, // 2 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 1000,
    enabled: enabled && !!productId, // Solo ejecuta si hay productId y está habilitado
  });

  const batches: ProductBatch[] = useQueryBatches.data || [];

  return {
    ...useQueryBatches,
    batches,
  };
};

