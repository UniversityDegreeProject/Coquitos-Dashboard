import { memo } from 'react';

//* components
import { SidebarHeader } from './SidebarHeader';
import { SidebarFooter } from './SidebarFooter';
import { useSidebarState } from '../hooks/useSidebarState';
import { menuItems } from '../config/menuItems';
import { SidebarMenuItem } from './SidebarMenuItem';
import { useTheme } from '@/shared/hooks/useTheme';

interface SidebarProps {
  isCollapsed?: boolean;
  onCloseSidebar?: () => void;
}

export const Sidebar = memo<SidebarProps>(({ isCollapsed = false, onCloseSidebar }: SidebarProps) => {
  const { expandedItems, handleToggleSubmenu } = useSidebarState();
  const { css } = useTheme();

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-72'} ${css.sidebar.background} ${css.sidebar.shadow} border-r ${css.sidebar.border} transition-all duration-200 relative flex flex-col h-full`}>
      {/* Header del Sidebar */}
      <SidebarHeader isCollapsed={isCollapsed} />
      
      {/* Navegación principal */}
      <nav className={`flex-1 py-6 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <SidebarMenuItem
              key={item.to}
              item={item}
              expandedItems={expandedItems}
              onToggleSubmenu={handleToggleSubmenu}
              isCollapsed={isCollapsed}
              onCloseSidebar={onCloseSidebar}
            />
          ))}
        </ul>
      </nav>
      
      {/* Footer del Sidebar */}
      <SidebarFooter isCollapsed={isCollapsed} />
    </div>
  );
});