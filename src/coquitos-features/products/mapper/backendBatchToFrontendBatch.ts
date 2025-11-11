import type { ProductBatch } from "../interfaces";


export const backendBatchesToFrontendBatches = (backendBatches: ProductBatch) : ProductBatch  => {


  return {
    ...backendBatches,
  }
}