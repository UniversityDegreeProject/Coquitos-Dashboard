import { useThemeStore } from '../stores/themeStore';

/**
 * Hooks específicos para selectores de tema
 * Garantiza máxima reactividad
 */

export const useThemeMode = () => useThemeStore((state) => state.theme);
export const useToggleTheme = () => useThemeStore((state) => state.toggleTheme);
export const useSetTheme = () => useThemeStore((state) => state.setTheme);

export const useIsDark = () => {
  const theme = useThemeStore((state) => state.theme);
  return theme === 'dark';
};

export const useIsLight = () => {
  const theme = useThemeStore((state) => state.theme);
  return theme === 'light';
};
