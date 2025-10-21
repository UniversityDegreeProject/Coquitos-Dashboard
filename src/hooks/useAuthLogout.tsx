import { useAuthStore } from "@/auth/store/auth.store";

/**
 * Hook que detecta cuando el usuario está cerrando sesión
 * @returns {boolean} true si está cerrando sesión, false en caso contrario
 */
export const useAuthLogout = () => {
  const status = useAuthStore((state) => state.status);
  
  // Retornar true solo si el estado es "logging-out"
  return status === "logging-out";
};