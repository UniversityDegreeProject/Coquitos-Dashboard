import { memo } from "react";

interface SidebarFooterProps {
  isCollapsed?: boolean;
}

/**
 * Componente del footer del Sidebar
 * Muestra información de la versión del sistema POS
 */
export const SidebarFooter = memo(({ isCollapsed = false }: SidebarFooterProps) => {
  return (
    <div className={`absolute bottom-0 left-0 right-0 border-t border-[#275081] bg-[#275081] ${isCollapsed ? 'p-2' : 'p-6'}`}>
      <div className="text-center">
        <p className={`text-[#F5F7E7] font-medium ${isCollapsed ? 'text-xs' : 'text-xs'}`}>
          {isCollapsed ? 'v1.0' : 'Sistema POS v1.0'}
        </p>
      </div>
    </div>
  );
});
