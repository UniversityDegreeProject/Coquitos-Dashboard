import { useCallback, useState } from 'react';


export const useSidebarState = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  /**
   * Alterna el estado de expansión de un elemento del menúw
   * @param itemLabel - Etiqueta del elemento a expandir/contraer
   */
  
  const handleToggleSubmenu = useCallback((itemLabel: string) => {
    setExpandedItems(prev => {
      return prev.includes(itemLabel) 
        ? prev.filter(label => label !== itemLabel)
        : [...prev, itemLabel]
    });
  }, []);

  return {
    expandedItems,
    handleToggleSubmenu
  };
};
