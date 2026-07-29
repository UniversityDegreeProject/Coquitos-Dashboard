import type { Product, ProductStatus } from "../interfaces";

/**
 * Estado efectivo mostrado en UI y usado en filtros.
 * Si el stock es 0, se trata como SinStock aunque el backend diga Disponible.
 */
export const getEffectiveStatus = (product: Product): ProductStatus => {
  if (product.stock === 0) {
    return "SinStock";
  }
  return product.status;
};
