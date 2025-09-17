import { useCallback, useState, useMemo } from 'react';

export const useSidebarState = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  /**
   * Alterna el estado de expansión de un elemento del menú
   * @param itemLabel - Etiqueta del elemento a expandir/contraer
   */
  const handleToggleSubmenu = useCallback((itemLabel: string) => {
    setExpandedItems(prev => {
      const isExpanded = prev.includes(itemLabel);
      return isExpanded 
        ? prev.filter(label => label !== itemLabel)
        : [...prev, itemLabel];
    });
  }, []);

  // Memoizamos el objeto de retorno para evitar re-renders
  return useMemo(() => ({
    expandedItems,
    handleToggleSubmenu
  }), [expandedItems, handleToggleSubmenu]);
};
