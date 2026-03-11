import { create } from "zustand";
import { socket } from "@/lib/socket";

interface SocketState {
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

export const useSocketStore = create<SocketState>()((set) => ({
  isConnected: false,

  connect: () => {
    // ✅ Limpiar listeners previos para evitar duplicados (StrictMode, remounts)
    socket.off("connect");
    socket.off("disconnect");

    socket.connect();

    socket.on("connect", () => {
      set({ isConnected: true });
      console.log("[Socket.IO] Conectado:", socket.id);
    });

    socket.on("disconnect", () => {
      set({ isConnected: false });
      console.log("[Socket.IO] Desconectado");
    });
  },

  disconnect: () => {
    socket.disconnect();
    set({ isConnected: false });
  },
}));
