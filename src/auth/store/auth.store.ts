import { create, type StateCreator } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

import type { AuthState, UserLoginFormData } from "@/auth/interface";
import { login } from "../services/auth.service";
import { useThemeStore } from "@/shared/stores/themeStore";

interface JWTPayload {
  exp: number;
}

const authApi : StateCreator<AuthState, [["zustand/devtools", never], ["zustand/persist", unknown]], []> = (set) => ({
  status: "not-authenticated",
  user: null,
  accessToken: null,
  refreshToken: null,
  error: null,

  login: async ( credentials : UserLoginFormData ) => {
    set({ user: null, accessToken: null, refreshToken: null, status: "authenticating", error: null }, false , "Authenticating");
    try {
      const { accessToken, refreshToken, ...rest } = await login(credentials);
      if (!accessToken || !refreshToken || !rest) {
        const errorMessage = "Error al iniciar sesión";
        set({ error: errorMessage, status: "not-authenticated" }, false , "Login error");
        toast.error(errorMessage);
        throw new Error("No se pudo iniciar sesión");
      }

      const user = rest.user;
      set({ user: user, accessToken, refreshToken, status: "authenticated", error: null }, false , "Login success");
      
      useThemeStore.getState().setTheme('light');
      toast.success(`¡Bienvenido, ${user.firstName}!`);
  
    } catch (error) {
      let errorMessage = "Error al iniciar sesión";
      
      if (isAxiosError(error) && error.response) {
        errorMessage = error.response.data.error;


      } else if (isAxiosError(error) && error.request) {
        errorMessage = "Error de conexión. Verifica tu internet";
      }

      set({ error: errorMessage, status: "not-authenticated" }, false , "Login error");
      toast.error(errorMessage);
    }
  },
  logout: () => {
    // Primero establecer el estado de "logging-out"
    set({ status: "logging-out" }, false, "Logging out");
    
    // Pequeño delay para mostrar el loader
    setTimeout(() => {
      set({ user: null, accessToken: null, refreshToken: null, status: "not-authenticated", error: null }, false , "Logout success");
      toast.info("Sesión cerrada");
    }, 500);
  },
  clearError: () => set({ error: null }),
  updateTokens: (accessToken: string, refreshToken: string) => {
    set({ accessToken, refreshToken }, false, "Tokens updated");
  },
});


export const useAuthStore = create<AuthState>()(
  devtools(
    persist(authApi, {
      name: "auth-storage",
      partialize: (state) => ({ 
        user: state.user, 
        accessToken: state.accessToken,
        refreshToken: state.refreshToken 
      }),
      onRehydrateStorage: () => (state) => {
        //? Cuando se recupera del localStorage, actualizar el estado de autenticación
        if (state) {
          if (state.user && state.accessToken && state.refreshToken) {
            // Verificar si el token está expirado
            try {
              const decoded = jwtDecode<JWTPayload>(state.accessToken);
              const now = Date.now();
              const expirationTime = decoded.exp * 1000; // Convertir a milisegundos
              
              if (now >= expirationTime) {
                // Token expirado - limpiar todo y cerrar sesión
                console.log('[AuthStore] ⚠️ Token expirado detectado al iniciar - Limpiando sesión');
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
                state.status = "not-authenticated";
                toast.info('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
              } else {
                // Token válido - restaurar sesión
                state.status = "authenticated";
                console.log('[AuthStore] ✅ Sesión restaurada exitosamente');
              }
            } catch (error) {
              // Error al decodificar token - limpiar todo
              console.error('[AuthStore] ❌ Error al verificar token:', error);
              state.user = null;
              state.accessToken = null;
              state.refreshToken = null;
              state.status = "not-authenticated";
            }
          } else {
            state.status = "not-authenticated";
          }
        }
      },
    })
  )
)