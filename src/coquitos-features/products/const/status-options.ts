import type { ProductStatus } from "../interfaces";


interface StatusOptions {
  label: string;
  value: ProductStatus;
}
export const statusOptions: StatusOptions[] = [
  { label: "Disponible", value: "Disponible" },
  { label: "Sin Stock", value: "SinStock" },
  { label: "Descontinuado", value: "Descontinuado" }
];

