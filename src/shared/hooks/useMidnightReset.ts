import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Hook que invalida toda la cache de React Query a la medianoche (hora local).
 * Útil para dashboards que deben reiniciarse al día siguiente si la aplicación
 * se queda abierta toda la noche.
 */
export const useMidnightReset = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const scheduleMidnightReset = () => {
      const now = new Date();
      const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // mañana
        0,
        0,
        0,
        0,
      );

      const timeUntilMidnight = midnight.getTime() - now.getTime();

      timeoutId = setTimeout(() => {
        // A la medianoche, invalidar todas las queries para refrescar el dashboard
        queryClient.invalidateQueries();

        // Reprogramar para la siguiente medianoche
        scheduleMidnightReset();
      }, timeUntilMidnight);
    };

    scheduleMidnightReset();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [queryClient]);
};
