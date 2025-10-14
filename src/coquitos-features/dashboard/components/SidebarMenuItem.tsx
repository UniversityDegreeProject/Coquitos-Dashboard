import { NavLink } from 'react-router';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { memo } from 'react';
import type { MenuItem } from '../config/menuItems';
import { useTheme } from '@/shared/hooks/useTheme';
import { useIsDark } from '@/shared/hooks/useThemeSelectors';



interface SidebarMenuItemProps {
  item: MenuItem;
  level?: number;
  expandedItems: string[];
  onToggleSubmenu: (itemLabel: string) => void;
  isCollapsed?: boolean;
  onCloseSidebar?: () => void;
}

/**
 * Componente individual para cada elemento del menú del sidebar
 * Maneja tanto elementos simples como elementos con submenús expandibles
 */
export const SidebarMenuItem = memo<SidebarMenuItemProps>(({ item, level = 0, expandedItems, onToggleSubmenu, isCollapsed = false, onCloseSidebar }) => {
  const isExpanded = expandedItems.includes(item.label);
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const indentClass = level > 0 ? 'ml-4' : '';
  const { css } = useTheme();
  const isDark = useIsDark();

  // Función optimizada para navegación
  const handleNavigation = () => {
    onCloseSidebar?.();
  };

  // Renderizar elemento con submenú
  if (hasSubmenu) {
    return (
      <li className="relative">
        <div>
          <button
            onClick={() => onToggleSubmenu(item.label)}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-4'} py-3.5 text-left ${isDark ? 'text-gray-300' : 'text-[#6B7280]'} ${css.interactive.hover} group rounded-lg ${indentClass}`}
            title={isCollapsed ? item.label : undefined}
          >
            <div className={`flex items-center ${isCollapsed ? '' : 'space-x-3'}`}>
              <div className={`w-8 h-8 rounded-lg ${isDark ? 'bg-[#334155]' : 'bg-white/80'} group-hover:bg-gradient-to-br group-hover:from-[#1E3A8A]/30 group-hover:to-[#F59E0B]/20 flex items-center justify-center shadow-sm transition-all duration-200`}>
                <item.icon className={`w-4 h-4 ${isDark ? 'text-[#E2E8F0]' : 'text-[#275081]'} group-hover:text-white transition-colors duration-200`} />
              </div>
              {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
            </div>
            {!isCollapsed && (isExpanded ? (
              <ChevronDown className={`w-4 h-4 ${isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'} transition-colors duration-200`} />
            ) : (
              <ChevronRight className={`w-4 h-4 ${isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'} transition-colors duration-200`} />
            ))}
          </button>
          
            {/* Submenú expandible mejorado */}
            {!isCollapsed && (
              <div className={`overflow-hidden transition-all duration-300 ${
                isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className={`${isDark ? 'bg-gradient-to-r from-[#334155]/40 to-[#475569]/20 border-[#334155]/50' : 'bg-gradient-to-r from-[#F5F7E7]/80 to-[#F9E44E]/20 border-gray-200'} rounded-lg py-2 mt-1 border shadow-sm`}>
                  <ul className="space-y-1">
                  {item.submenu?.map(subItem => (
                    <SidebarMenuItem
                      key={subItem.to}
                      item={subItem}
                      level={level + 1}
                      expandedItems={expandedItems}
                      onToggleSubmenu={onToggleSubmenu}
                      isCollapsed={isCollapsed}
                      onCloseSidebar={onCloseSidebar}
                    />
                  ))}
                  </ul>
                </div>
              </div>
            )}
        </div>
      </li>
    );
  };

  // Renderizar elemento simple sin submenú
  return (
    <li className="relative">
      <NavLink 
        to={item.to}
        onClick={handleNavigation}
        className={({ isActive }) => 
          `flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'} py-3.5 ${isDark ? 'text-[#E2E8F0]' : 'text-[#6B7280]'} ${css.interactive.hover} group relative rounded-lg ${
            isActive 
              ? css.interactive.active
              : ''
          } ${indentClass}`
        }
      >
        {({ isActive }) => (
          <>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
              isActive 
                ? 'bg-white/20 shadow-sm' 
                : `${isDark ? 'bg-[#334155]' : 'bg-white/80'} group-hover:bg-gradient-to-br group-hover:from-[#1E3A8A]/30 group-hover:to-[#F59E0B]/20`
            }`}>
              <item.icon className={`w-4 h-4 transition-colors duration-200 ${
                isActive 
                  ? 'text-white' 
                  : `${isDark ? 'text-[#E2E8F0]' : 'text-[#275081]'} group-hover:text-white`
              }`} />
            </div>
            {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
          </>
        )}
      </NavLink>
    </li>
  );
}, (prevProps, nextProps) => {
  // Optimización mejorada: comparación más eficiente y legible
  const isItemEqual = prevProps.item.to === nextProps.item.to && 
                     prevProps.item.label === nextProps.item.label;
  
  const isStateEqual = prevProps.isCollapsed === nextProps.isCollapsed && 
                      prevProps.level === nextProps.level;
  
  const isExpansionEqual = prevProps.expandedItems.includes(prevProps.item.label) === 
                          nextProps.expandedItems.includes(nextProps.item.label);
  
  // Solo re-renderizar si alguna propiedad relevante ha cambiado
  return isItemEqual && isStateEqual && isExpansionEqual;
});
