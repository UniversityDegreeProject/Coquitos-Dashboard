import type { ProductBatch } from "../interfaces";


export const backendBatchesToFrontendBatches = (backendBatches: ProductBatch) : ProductBatch  => {
  return {
    ...backendBatches,
    // expirationDate se mantiene como Date o string según venga del backend
    expirationDate: backendBatches.expirationDate 
      ? (backendBatches.expirationDate instanceof Date 
          ? backendBatches.expirationDate.toISOString() 
          : backendBatches.expirationDate)
      : undefined,
  }
}