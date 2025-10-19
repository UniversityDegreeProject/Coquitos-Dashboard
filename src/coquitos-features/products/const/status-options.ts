import type { ProductStatus } from "../interfaces";

export const statusOptions: { label: string; value: ProductStatus }[] = [
  { label: "Disponible", value: "Disponible" },
  { label: "Sin Stock", value: "SinStock" },
  { label: "Descontinuado", value: "Descontinuado" },
];

