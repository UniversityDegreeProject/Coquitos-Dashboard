/**
 * Obtiene el color de badge según el estado de la categoría
 */
export const getStatusColor = (status: string): string => {
  return status === "Activo"
    ? "bg-green-100 text-green-800"
    : "bg-red-100 text-red-800";
};

