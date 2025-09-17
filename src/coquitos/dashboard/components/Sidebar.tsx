import { SidebarHeader } from './SidebarHeader';
import { SidebarFooter } from './SidebarFooter';
import { SidebarMenuItem } from './SidebarMenuItem';
import { useSidebarState } from '../hooks/useSidebarState';
import { menuItems } from '../config/menuItems';

interface SidebarProps {
  isCollapsed?: boolean;
}

export const Sidebar = ({ isCollapsed = false }: SidebarProps) => {
  const { expandedItems, handleToggleSubmenu } = useSidebarState();

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-72'} bg-[#275081] shadow-xl border-r border-[#275081] transition-all duration-200 relative flex flex-col h-full`}>
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
            />
          ))}
        </ul>
      </nav>
      
      {/* Footer del Sidebar */}
      <SidebarFooter isCollapsed={isCollapsed} />
    </div>
  );
};