export const getRoleColor = (role: string) => {
  switch (role) {
    case "Administrador":
      return "bg-red-100 text-red-800";
    case "Supervisor":
      return "bg-blue-100 text-blue-800";
    case "Vendedor":
      return "bg-green-100 text-green-800";
    case "Mesero":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
