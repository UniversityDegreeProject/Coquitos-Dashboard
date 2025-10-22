/**
 * Helper para obtener el color del estado del cliente
 */

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Activo':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'Inactivo':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  }
};
