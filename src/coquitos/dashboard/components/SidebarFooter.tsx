import { memo } from "react";
import { useTheme } from '@/shared/hooks/useTheme';
import { useIsDark } from '@/shared/hooks/useThemeSelectors';

interface SidebarFooterProps {
  isCollapsed?: boolean;
}

/**
 * Componente del footer del Sidebar
 * Muestra información de la versión del sistema POS
 */
export const SidebarFooter = memo(({ isCollapsed = false }: SidebarFooterProps) => {
  const {  } = useTheme();
  const isDark = useIsDark();

  return (
    <div className={`border-t ${isDark ? 'border-[#275081]' : 'border-gray-200'} ${isDark ? 'bg-[#275081]' : 'bg-[#F5F7E7]'} ${isCollapsed ? 'p-2' : 'p-6'}`}>
      <div className="text-center">
        <p className={`${isDark ? 'text-[#F5F7E7]' : 'text-[#6B7280]'} font-medium ${isCollapsed ? 'text-xs' : 'text-xs'}`}>
          {isCollapsed ? 'v1.0' : 'Sistema POS v1.0'}
        </p>
      </div>
    </div>
  );
});
