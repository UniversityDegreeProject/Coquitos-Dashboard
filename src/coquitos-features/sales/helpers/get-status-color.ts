import type { SaleStatus } from "../interfaces";

/**
 * Retorna las clases de Tailwind para el badge de estado
 */
export const getStatusColor = (status: SaleStatus): string => {
  const colors: Record<SaleStatus, string> = {
    Completado: "bg-green-500 text-white dark:bg-green-600 dark:text-white",
    Pendiente:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    Cancelado: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    Reembolsado:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  };

  return colors[status] || colors.Pendiente;
};
