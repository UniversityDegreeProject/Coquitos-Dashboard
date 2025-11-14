import type { Product } from "../interfaces";
import type { ProductBatch } from "../interfaces/product-batch.interface";

/**
 * Convierte un batch del backend al formato del frontend
 * Maneja la conversión de Decimal a number si es necesario
 */
const convertBatch = (batch: any): ProductBatch => {
  return {
    ...batch,
    unitPrice: typeof batch.unitPrice === 'object' && 'toNumber' in batch.unitPrice
      ? batch.unitPrice.toNumber()
      : Number(batch.unitPrice),
    weight: typeof batch.weight === 'object' && 'toNumber' in batch.weight
      ? batch.weight.toNumber()
      : Number(batch.weight),
    stock: Number(batch.stock),
  };
};

export const backendProductToFrontendProduct = (backendProduct: any): Product => {
  // Convertir batches si existen
  const batches = backendProduct.batches 
    ? backendProduct.batches.map(convertBatch)
    : undefined;

  return {
    ...backendProduct,
    batches,
    // Asegurar que price también sea number si viene como Decimal
    price: typeof backendProduct.price === 'object' && 'toNumber' in backendProduct.price
      ? backendProduct.price.toNumber()
      : Number(backendProduct.price),
    // Asegurar que pricePerKg también sea number si viene como Decimal
    pricePerKg: backendProduct.pricePerKg 
      ? (typeof backendProduct.pricePerKg === 'object' && 'toNumber' in backendProduct.pricePerKg
          ? backendProduct.pricePerKg.toNumber()
          : Number(backendProduct.pricePerKg))
      : undefined,
  };
};