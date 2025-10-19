import type { ProductStatus } from "../interfaces";

/**
 * Retorna la clase de Tailwind para el color del badge según el estado del producto
 */
export const getStatusColor = (status: ProductStatus): string => {
  switch (status) {
    case "Disponible":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "SinStock":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    case "Descontinuado":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  }
};

