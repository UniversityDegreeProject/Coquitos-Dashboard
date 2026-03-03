/**
 * Helper para obtener el color del tipo de cliente
 */

export const getClientTypeColor = (type: string): string => {
  switch (type) {
    case 'VIP':
      return 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-sm shadow-yellow-500/50';
    case 'Regular':
      return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm shadow-blue-500/50';
    case 'Ocasional':
      return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-sm shadow-gray-500/50';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  }
};
