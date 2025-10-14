export const getStatusColor = (status: string) => {
  return status === "Activo"
    ? "bg-green-100 text-green-800"
    : "bg-red-100 text-red-800";
};