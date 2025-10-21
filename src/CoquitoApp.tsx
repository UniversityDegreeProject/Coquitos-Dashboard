import { RouterProvider } from "react-router"
import { appRouter } from "@/router/app.route"
import { useTokenRefresh, useAuthInitialization, useAuthLogout } from "@/hooks"
import { TokenDebugger, GlobalLoader } from "@/components"

export const CoquitoApp = () => {
  // Detectar si el estado de autenticación se está inicializando
  const isInitializing = useAuthInitialization();
  const isLoggingOut = useAuthLogout();
  // Sistema de renovación automática de tokens y detección de inactividad
  // - Renueva el token automáticamente si el usuario está activo y el token está por expirar
  // - Cierra sesión automáticamente si el usuario está inactivo y el token expira
  useTokenRefresh({
    renewBeforeExpiry: 5,    // Renovar 5 minutos antes de expirar
    inactivityTimeout: 10,   // Considerar inactivo después de 10 minutos sin actividad
    checkInterval: 1,        // Verificar cada 1 minuto
  });

  // Mostrar loader mientras se inicializa el estado
  if (isInitializing) {
    return <GlobalLoader title="Embutidos Coquito" subtitle="Cargando..." />;
  }
  // Mostrar loader mientras se cierrra la sesión
  if (isLoggingOut) {
    return <GlobalLoader title="Embutidos Coquito" subtitle="Cerrando sesión..." />;
  }

  return (
    <>
      <RouterProvider router={appRouter} />
      
      {/* Componente de debugging - Remover en producción */}
      {import.meta.env.DEV && <TokenDebugger />}
    </>
  )
}
