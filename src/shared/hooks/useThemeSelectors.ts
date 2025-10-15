import { useThemeStore } from '../stores/themeStore';
import { useShallow } from 'zustand/react/shallow';

/**
 * Hooks específicos para selectores de tema
 * Garantiza máxima reactividad
 */

export const useThemeMode = () => useThemeStore( useShallow((state) => state.theme));
export const useToggleTheme = () => useThemeStore( useShallow((state) => state.toggleTheme));
export const useSetTheme = () => useThemeStore( useShallow((state) => state.setTheme));

export const useIsDark = () => {
  const theme = useThemeStore(useShallow((state) => state.theme));
  return theme === 'dark';
};

export const useIsLight = () => {
  const theme = useThemeStore(useShallow((state) => state.theme));
  return theme === 'light';
};
