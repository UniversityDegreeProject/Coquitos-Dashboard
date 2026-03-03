import { io, type Socket } from "socket.io-client";
import { useEffect } from "react";
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
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  transports: ["websocket", "polling"],
  extraHeaders: {
    "ngrok-skip-browser-warning": "true",
  },
});

/**
 * Hook reutilizable: escucha un evento de Socket.IO e invalida
 * automáticamente las queries de TanStack Query asociadas.
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

  useEffect(() => {
    const handler = (data: unknown) => {
      console.log(`[SOCKET_EVENT_RECEIVED] Event: "${event}"`, data);

      queryClient.invalidateQueries({ queryKey });
      onEvent?.(data);
    };

    socket.on(event, handler);
    return () => {
      socket.off(event, handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, queryClient]);
}
