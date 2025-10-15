import { useShallow } from 'zustand/shallow';
import { useThemeStore } from '../stores/themeStore';
import { useMemo } from 'react';

/**
 * Hook optimizado para manejar temas
 * Proporciona colores y utilidades según el tema activo
 */
export const useTheme = () => {
  // Usar un único selector para evitar múltiples re-renders
  const theme = useThemeStore(useShallow((state) => state.theme));
  const toggleTheme = useThemeStore(useShallow((state) => state.toggleTheme));
  const setTheme = useThemeStore(useShallow((state) => state.setTheme));
  
  const isDark = theme === 'dark';
  const isLight = theme === 'light';

  // Paleta de colores optimizada para ambos temas
  const colors = useMemo(() => {
    if (isDark) {
      return {
        // Tema Dark mejorado - Paleta moderna y atractiva
        primary: '#1E3A8A',      // Azul más profundo y moderno
        secondary: '#F59E0B',    // Naranja más vibrante
        accent: '#FEF3C7',       // Crema más cálida
        background: '#0F172A',   // Fondo principal más oscuro y elegante
        surface: '#1E293B',      // Superficie principal (sidebar, topbar) - Slate más claro
        surfaceSecondary: '#334155', // Superficie secundaria - Slate medio
        surfaceTertiary: '#475569',  // Superficie terciaria - Slate más claro
        text: {
          primary: '#F8FAFC',    // Texto principal - Slate más claro
          secondary: '#E2E8F0',  // Texto secundario - Slate claro
          accent: '#F59E0B',     // Texto de acento - Naranja vibrante
          muted: '#94A3B8'       // Texto deshabilitado - Slate medio
        },
        border: '#334155',       // Bordes - Slate medio
        shadow: 'shadow-2xl',    // Sombras más pronunciadas
        gradient: {
          primary: 'from-[#1E3A8A] to-[#F59E0B]',
          surface: 'from-[#1E293B] to-[#334155]',
          accent: 'from-[#F59E0B] to-[#FEF3C7]',
          subtle: 'from-[#1E293B]/80 to-[#334155]/60'
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

  // Utilidades CSS optimizadas con nueva paleta de colores
  const css = useMemo(() => ({
    // Clases para sidebar
    sidebar: {
      background: isDark ? 'bg-[#1E293B]' : 'bg-[#F5F7E7]',
      border: isDark ? 'border-[#334155]' : 'border-[#E5E7EB]',
      shadow: isDark ? 'shadow-2xl' : 'shadow-lg'
    },
    
    // Clases para topbar
    topbar: {
      background: isDark ? 'bg-[#1E293B]' : 'bg-[#F5F7E7]',
      border: isDark ? 'border-[#334155]' : 'border-[#E5E7EB]',
      text: isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'
    },
    
    // Clases para contenido principal
    content: {
      background: isDark ? 'bg-[#0F172A]' : 'bg-[#FFFFFF]',
      text: isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'
    },
    
    // Clases para elementos interactivos mejoradas
    interactive: {
      hover: isDark 
        ? 'hover:bg-gradient-to-r hover:from-[#334155]/60 hover:to-[#475569]/40 hover:text-[#F8FAFC] transition-all duration-200' 
        : 'hover:bg-gradient-to-r hover:from-[#275081]/10 hover:to-[#F9E44E]/20 hover:text-[#275081] transition-all duration-200',
      active: isDark
        ? 'bg-gradient-to-r from-[#1E3A8A] to-[#F59E0B] text-white shadow-lg'
        : 'bg-gradient-to-r from-[#275081] to-[#F9E44E] text-white shadow-lg'
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
