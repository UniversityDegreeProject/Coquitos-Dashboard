import { useThemeStore } from '../stores/themeStore';
import { useMemo } from 'react';

/**
 * Hook optimizado para manejar temas
 * Proporciona colores y utilidades según el tema activo
 */
export const useTheme = () => {
  // Usar selectores específicos para mejor reactividad
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const isDark = theme === 'dark';
  const isLight = theme === 'light';

  // Paleta de colores optimizada para ambos temas
  const colors = useMemo(() => {
    if (isDark) {
      return {
        // Tema Dark (actual)
        primary: '#275081',      // Azul principal
        secondary: '#F9E44E',    // Naranja/amarillo
        accent: '#F5F7E7',       // Crema claro
        background: '#F5F7E7',   // Fondo principal
        surface: '#275081',      // Superficie (sidebar, topbar)
        surfaceSecondary: '#1a1a1a', // Superficie secundaria
        text: {
          primary: '#FFFFFF',    // Texto principal
          secondary: '#F5F7E7',  // Texto secundario
          accent: '#F9E44E',     // Texto de acento
          muted: '#gray-400'     // Texto deshabilitado
        },
        border: '#275081',       // Bordes
        shadow: 'shadow-xl',     // Sombras
        gradient: {
          primary: 'from-[#275081] to-[#F9E44E]',
          surface: 'from-[#275081] to-[#1a1a1a]',
          accent: 'from-[#F9E44E] to-[#F5F7E7]'
        }
      };
    } else {
      return {
        // Tema Light (nuevo)
        primary: '#F5F7E7',      // Crema como color principal
        secondary: '#F9E44E',    // Naranja/amarillo (mantenido)
        accent: '#275081',       // Azul como acento
        background: '#FFFFFF',   // Fondo blanco limpio
        surface: '#F5F7E7',      // Superficie crema suave
        surfaceSecondary: '#FFFFFF', // Superficie blanca
        text: {
          primary: '#1F2937',    // Texto oscuro principal
          secondary: '#275081',  // Texto azul
          accent: '#F9A602',     // Texto naranja más fuerte
          muted: '#6B7280'       // Texto gris suave
        },
        border: '#E5E7EB',       // Bordes suaves
        shadow: 'shadow-lg',     // Sombras más suaves
        gradient: {
          primary: 'from-[#F5F7E7] to-[#F9E44E]',
          surface: 'from-[#F5F7E7] to-[#FFFFFF]',
          accent: 'from-[#275081] to-[#F9E44E]'
        }
      };
    }
  }, [isDark]);

  // Utilidades CSS optimizadas - SIN transiciones para mejor rendimiento
  const css = useMemo(() => ({
    // Clases para sidebar
    sidebar: {
      background: isDark ? 'bg-[#275081]' : 'bg-[#F5F7E7]',
      border: isDark ? 'border-[#275081]' : 'border-[#E5E7EB]',
      shadow: isDark ? 'shadow-xl' : 'shadow-lg'
    },
    
    // Clases para topbar
    topbar: {
      background: isDark ? 'bg-[#275081]' : 'bg-[#F5F7E7]',
      border: isDark ? 'border-[#275081]' : 'border-[#E5E7EB]',
      text: isDark ? 'text-white' : 'text-[#1F2937]'
    },
    
    // Clases para contenido principal
    content: {
      background: isDark ? 'bg-[#F5F7E7]' : 'bg-[#FFFFFF]',
      text: isDark ? 'text-gray-800' : 'text-[#1F2937]'
    },
    
    // Clases para elementos interactivos - SIN transiciones
    interactive: {
      hover: isDark 
        ? 'hover:bg-gradient-to-r hover:from-[#275081]/20 hover:to-[#F9E44E]/10 hover:text-white' 
        : 'hover:bg-gradient-to-r hover:from-[#275081]/10 hover:to-[#F9E44E]/20 hover:text-[#275081]',
      active: isDark
        ? 'bg-gradient-to-r from-[#275081] to-[#F9E44E] text-white'
        : 'bg-gradient-to-r from-[#275081] to-[#F9E44E] text-white'
    }
  }), [isDark]);

  return {
    theme,
    toggleTheme,
    setTheme,
    isDark,
    isLight,
    colors,
    css
  };
};
