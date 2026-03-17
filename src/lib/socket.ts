import { io, type Socket } from "socket.io-client";
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getEnvsAdapter } from "@/config/getEnvs.adapter";

/**
 * Extraemos solo el origen (ej: "https://example.com/api" -> "https://example.com")
 * Socket.IO se conecta al origen, no al path de la API
 */
const SOCKET_URL = new URL(getEnvsAdapter.API_URL, window.location.origin)
  .origin;

/**
 * Instancia singleton del cliente Socket.IO.
 * Se conecta al backend y se reconecta automáticamente si pierde conexión.
 */
export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  transports: ["websocket"],
  extraHeaders: {
    "ngrok-skip-browser-warning": "true",
  },
});

/**
 * Hook reutilizable: escucha un evento de Socket.IO e invalida
 * automáticamente las queries de TanStack Query asociadas.
 *
 * ✅ Incluye debounce de 300ms para agrupar ráfagas de eventos
 *    y evitar múltiples invalidaciones/re-renders simultáneos
 *    (problema "Thundering Herd").
 *
 * @example
 * useSocketEvent("user:created", ["users"]);
 * useSocketEvent("user:updated", ["users"]);
 */
export function useSocketEvent(
  event: string,
  queryKey: readonly unknown[],
  onEvent?: (data: unknown) => void,
): void {
  const queryClient = useQueryClient();
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = (data: unknown) => {
      console.log(`[SOCKET_EVENT_RECEIVED] Event: "${event}"`, data);

      // Ejecutar callback personalizado inmediatamente (no afecta renders)
      onEvent?.(data);

      // Agrupar invalidaciones: si llegan 5 eventos rápidos,
      // solo se invalida UNA vez después de 300ms de silencio.
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        queryClient.invalidateQueries({ queryKey });
        debounceTimerRef.current = null;
      }, 300);
    };

    socket.on(event, handler);
    return () => {
      socket.off(event, handler);
      // Limpiar timer pendiente al desmontar
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, queryClient]);
}
