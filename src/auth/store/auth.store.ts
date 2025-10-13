import { create, type StateCreator } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import type { AuthState, UserLoginFormData } from "@/auth/interface";
import { login } from "../services/auth.service";
import { useThemeStore } from "@/shared/stores/themeStore";

const authApi : StateCreator<AuthState, [["zustand/devtools", never], ["zustand/persist", unknown]], []> = (set) => ({
  status: "not-authenticated",
  user: null,
  token: null,
  error: null,

  login: async ( credentials : UserLoginFormData ) => {
    set({ user: null, token: null, status: "authenticating", error: null }, false , "Authenticating");
    try {
      const { token,...user } = await login(credentials);
      if (!token || !user) {
        const errorMessage = "Error al iniciar sesión";
        set({ error: errorMessage, status: "not-authenticated" }, false , "Login error");
        toast.error(errorMessage);
        throw new Error("No se pudo iniciar sesión");
      }

      set({ user, token, status: "authenticated", error: null }, false , "Login success");
      
 
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
    set({ user: null, token: null, status: "not-authenticated", error: null }, false , "Logout success");
    toast.info("Sesión cerrada");
  },
  clearError: () => set({ error: null }),
});


export const useAuthStore = create<AuthState>()(
  devtools(
    persist(authApi, {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        //? Cuando se recupera del localStorage, actualizar el estado de autenticación
        if (state) {
          if (state.user && state.token) {
            state.status = "authenticated";
          } else {
            state.status = "not-authenticated";
          }
        }
      },
    })
  )
)