import { RouterProvider } from "react-router"
import { appRouter } from "@/router/app.route"
import { useTokenRefresh } from "@/hooks"
import { TokenDebugger } from "@/components/TokenDebugger"

export const CoquitoApp = () => {
  // Sistema de renovación automática de tokens y detección de inactividad
  // - Renueva el token automáticamente si el usuario está activo y el token está por expirar
  // - Cierra sesión automáticamente si el usuario está inactivo y el token expira
  useTokenRefresh({
    renewBeforeExpiry: 5,    // Renovar 5 minutos antes de expirar
    inactivityTimeout: 10,   // Considerar inactivo después de 10 minutos sin actividad
    checkInterval: 1,        // Verificar cada 1 minuto
  });

  return (
    <>
      <RouterProvider router={appRouter} />
      
      {/* Componente de debugging - Remover en producción */}
      {import.meta.env.DEV && <TokenDebugger />}
    </>
  )
}
