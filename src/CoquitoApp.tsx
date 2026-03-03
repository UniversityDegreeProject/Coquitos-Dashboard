import { RouterProvider } from "react-router";
import { useEffect } from "react";
import { appRouter } from "@/router/app.route";
import { useTokenRefresh, useAuthInitialization, useAuthLogout } from "@/hooks";
import { GlobalLoader } from "@/shared/loaders-Skeleton";
import { useSocketStore } from "@/shared/stores/socketStore";
import { useAuthStore } from "@/auth/store/auth.store";
import { socket } from "@/lib/socket";
import { toast } from "sonner";

export const CoquitoApp = () => {
  const isInitializing = useAuthInitialization();
  const isLoggingOut = useAuthLogout();
  const connectSocket = useSocketStore((state) => state.connect);
  const disconnectSocket = useSocketStore((state) => state.disconnect);

  // Conectar socket al montar la app
  useEffect(() => {
    connectSocket();
    return () => disconnectSocket();
  }, [connectSocket, disconnectSocket]);

  // Capa 1: Listener global de force-logout
  // Si el admin desactiva a este usuario, cerrar sesión inmediatamente
  useEffect(() => {
    const handleForceLogout = (data: { userId: string }) => {
      const currentUser = useAuthStore.getState().user;
      if (currentUser && currentUser.id === data.userId) {
        toast.error("Tu cuenta ha sido deshabilitada por el administrador");
        useAuthStore.getState().logout();
      }
    };

    socket.on("user:force-logout", handleForceLogout);
    return () => {
      socket.off("user:force-logout", handleForceLogout);
    };
  }, []);

  // Sistema de renovación automática de tokens y detección de inactividad
  // - Renueva el token automáticamente si el usuario está activo y el token está por expirar
  // - Cierra sesión automáticamente si el usuario está inactivo y el token expira
  useTokenRefresh({
    renewBeforeExpiry: 5,
    inactivityTimeout: 1, // ⏱️ 10 minutos de inactividad antes de cerrar sesión
    checkInterval: 1,
  });

  if (isInitializing) {
    return <GlobalLoader title="Embutidos Coquito" subtitle="Cargando..." />;
  }
  if (isLoggingOut) {
    return (
      <GlobalLoader title="Embutidos Coquito" subtitle="Cerrando sesión..." />
    );
  }

  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  );
};
