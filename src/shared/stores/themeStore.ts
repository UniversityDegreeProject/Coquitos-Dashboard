import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'dark' | 'light';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

/**
 * Store global para el manejo de temas
 * Persiste el tema seleccionado en localStorage
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light' as Theme, // Por defecto modo light
      
      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark'
        }));
      },
      
      setTheme: (theme: Theme) => {
        set({ theme });
      }
    }),
    {
      name: 'coquitos-theme-storage', 
      partialize: (state) => ({ theme: state.theme }), 
      skipHydration: false, 
    }
  )
);
