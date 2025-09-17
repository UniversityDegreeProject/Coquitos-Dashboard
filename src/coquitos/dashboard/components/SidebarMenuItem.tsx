import { NavLink } from 'react-router';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { MenuItem } from '../config/menuItems';
import { memo } from 'react';



interface SidebarMenuItemProps {
  item: MenuItem;
  level?: number;
  expandedItems: string[];
  onToggleSubmenu: (itemLabel: string) => void;
  isCollapsed?: boolean;
}

/**
 * Componente individual para cada elemento del menú del sidebar
 * Maneja tanto elementos simples como elementos con submenús expandibles
 */
export const SidebarMenuItem = memo(({ item, level = 0, expandedItems, onToggleSubmenu, isCollapsed = false }: SidebarMenuItemProps) => {
  const isExpanded = expandedItems.includes(item.label);
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const indentClass = level > 0 ? 'ml-4' : '';

  // Renderizar elemento con submenú
  if (hasSubmenu) {
    return (
      <li className="relative">
        <div>
          <button
            onClick={() => onToggleSubmenu(item.label)}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-4'} py-3.5 text-left text-gray-300 hover:bg-gradient-to-r hover:from-[#275081]/20 hover:to-[#F9E44E]/10 hover:text-white transition-all duration-100 group rounded-lg ${indentClass}`}
            title={isCollapsed ? item.label : undefined}
          >
            <div className={`flex items-center ${isCollapsed ? '' : 'space-x-3'}`}>
              <div className="w-8 h-8 rounded-lg bg-[#2d2d2d] group-hover:bg-gradient-to-br group-hover:from-[#275081]/30 group-hover:to-[#F9E44E]/20 flex items-center justify-center transition-all duration-100 shadow-sm">
                <item.icon className="w-4 h-4 text-[#F5F7E7] group-hover:text-white transition-colors duration-100" />
              </div>
              {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
            </div>
            {!isCollapsed && (isExpanded ? (
              <ChevronDown className="w-4 h-4 transition-transform duration-100 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 transition-transform duration-100 text-gray-400" />
            ))}
          </button>
          
            {/* Submenú expandible mejorado */}
            {!isCollapsed && (
              <div className={`overflow-hidden transition-all duration-150 ease-in-out ${
                isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <ul className="bg-gradient-to-r from-[#275081]/10 to-[#F9E44E]/5 rounded-lg py-1 mt-1 border border-[#275081]/20">
                  {item.submenu?.map(subItem => (
                    <SidebarMenuItem
                      key={subItem.to}
                      item={subItem}
                      level={level + 1}
                      expandedItems={expandedItems}
                      onToggleSubmenu={onToggleSubmenu}
                      isCollapsed={isCollapsed}
                    />
                  ))}
                </ul>
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
        className={({ isActive }) => 
          `flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'} py-3.5 text-gray-300 hover:bg-gradient-to-r hover:from-[#275081]/20 hover:to-[#F9E44E]/10 hover:text-white transition-all duration-100 group relative rounded-lg ${
            isActive 
              ? 'bg-gradient-to-r from-[#275081] to-[#F9E44E] text-white font-semibold shadow-lg shadow-[#275081]/30' 
              : ''
          } ${indentClass}`
        }
      >
        {({ isActive }) => (
          <>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-100 ${
              isActive 
                ? 'bg-white/20 shadow-sm' 
                : 'bg-[#2d2d2d] group-hover:bg-gradient-to-br group-hover:from-[#275081]/30 group-hover:to-[#F9E44E]/20'
            }`}>
              <item.icon className={`w-4 h-4 transition-colors duration-100 ${
                isActive 
                  ? 'text-white' 
                  : 'text-[#F5F7E7] group-hover:text-white'
              }`} />
            </div>
            {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
          </>
        )}
      </NavLink>
    </li>
  );
});
