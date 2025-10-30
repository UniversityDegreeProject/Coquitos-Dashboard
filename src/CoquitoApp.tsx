import { RouterProvider } from "react-router"
import { appRouter } from "@/router/app.route"
import { useTokenRefresh, useAuthInitialization, useAuthLogout } from "@/hooks"
import { GlobalLoader } from "@/shared/loaders-Skeleton"
import { TokenDebugger } from "@/components/TokenDebugger"

export const CoquitoApp = () => {
  const isInitializing = useAuthInitialization();
  const isLoggingOut = useAuthLogout();

  
  // Sistema de renovación automática de tokens y detección de inactividad
  // - Renueva el token automáticamente si el usuario está activo y el token está por expirar
  // - Cierra sesión automáticamente si el usuario está inactivo y el token expira
  useTokenRefresh({
    renewBeforeExpiry: 5,
    inactivityTimeout: 10,
    checkInterval: 1,
  });

  if (isInitializing) {
    return <GlobalLoader title="Embutidos Coquito" subtitle="Cargando..." />;
  }
  if (isLoggingOut) {
    return <GlobalLoader title="Embutidos Coquito" subtitle="Cerrando sesión..." />;
  }

  return (
    <>
      <RouterProvider router={appRouter} />
      <TokenDebugger />
    </>
  )
}
