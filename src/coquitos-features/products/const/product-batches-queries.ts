/**
 * Definición de query keys para TanStack Query - Product Batches
 * Siguiendo las mejores prácticas de estructura jerárquica
 */
export const productBatchesQueries = {
  allBatches: ['product-batches'] as const,
  batchesByProduct: (productId: string) => [...productBatchesQueries.allBatches, 'by-product', productId] as const,
};

