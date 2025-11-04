import { memo } from 'react';

//* components
import { SidebarHeader } from './SidebarHeader';
import { SidebarFooter } from './SidebarFooter';
import { useSidebarState } from '../hooks/useSidebarState';
import { menuItems } from '../config/menuItems';
import { SidebarMenuItem } from './SidebarMenuItem';
import { useTheme } from '@/shared/hooks/useTheme';
import { useAuthStore } from '@/auth/store/auth.store';
import { useShallow } from 'zustand/shallow';
import type { User } from '@/auth/interface';

interface SidebarProps {
  isCollapsed?: boolean;
  onCloseSidebar?: () => void;
}

export const Sidebar = memo<SidebarProps>(({ isCollapsed = false, onCloseSidebar }: SidebarProps) => {
  const { expandedItems, handleToggleSubmenu } = useSidebarState();
  const { css } = useTheme();

  const user = useAuthStore(useShallow((state) => state.user));
  const { role } = user as User ?? {};

  const isAdmin = role === "Administrador";

  const menuItemsWithRole = menuItems(isAdmin);

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-72'} ${css.sidebar.background} ${css.sidebar.shadow} border-r ${css.sidebar.border} transition-all duration-200 relative flex flex-col h-full`}>
      {/* Header del Sidebar - Fijo en la parte superior */}
      <div className="flex-shrink-0">
        <SidebarHeader isCollapsed={isCollapsed} />
      </div>
      
      {/* Navegación principal - Con scroll invisible */}
      <nav className={`flex-1 py-6 ${isCollapsed ? 'px-2' : 'px-4'} overflow-y-auto sidebar-scroll`}>
        <ul className="space-y-1">
          {menuItemsWithRole.map((item) => (
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
      
      {/* Footer del Sidebar - Fijo en la parte inferior */}
      <div className="flex-shrink-0">
        <SidebarFooter isCollapsed={isCollapsed} />
      </div>
    </div>
  );
});