import { ChefHat } from 'lucide-react';
import { useIsDark } from '@/shared/hooks/useThemeSelectors';
import { memo } from 'react';


interface SidebarHeaderProps {
  isCollapsed?: boolean;
}

export const SidebarHeader = memo(({ isCollapsed = false }: SidebarHeaderProps) => {
  const isDark = useIsDark();

  return (
    <div className={`${isCollapsed ? 'p-3' : 'p-6'} border-b ${isDark ? 'border-[#334155]' : 'border-gray-200'} ${isDark ? 'bg-gradient-to-br from-[#1E293B] to-[#334155]' : 'bg-gradient-to-br from-[#F5F7E7] to-[#FFFFFF]'} relative overflow-hidden`}>
      {/* Efecto de brillo sutil de fondo */}
      <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[#F59E0B]/10 via-transparent to-[#FEF3C7]/5' : 'bg-gradient-to-br from-[#275081]/5 via-transparent to-[#F9E44E]/10'}`}></div>
      
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-4'} relative z-10`}>
        {/* Logo con ícono mejorado */}
        <div className="relative">
          <div className={`${isCollapsed ? 'w-10 h-10' : 'w-14 h-14'} bg-gradient-to-br from-[#F59E0B] to-[#FEF3C7] rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-[#F59E0B]/20`}>
            <ChefHat className={`${isCollapsed ? 'w-6 h-6' : 'w-8 h-8'} text-[#1E3A8A]`} />
          </div>
          {/* Efecto de brillo sutil */}
          <div className={`absolute inset-0 ${isCollapsed ? 'w-10 h-10' : 'w-14 h-14'} bg-gradient-to-br from-white/30 to-transparent rounded-2xl`}></div>
          {/* Punto de estado */}
          <div className={`absolute -top-1 -right-1 w-4 h-4 bg-[#F59E0B] rounded-full border-2 ${isDark ? 'border-[#1E293B]' : 'border-white'} shadow-lg`}></div>
        </div>
        
        {/* Información de la aplicación mejorada - Solo visible cuando no está colapsado */}
        {!isCollapsed && (
          <div className="flex-1">
            <h1 className={`text-2xl font-bold ${isDark ? 'text-[#F8FAFC]' : 'text-[#275081]'} tracking-tight mb-1`}>
              Coquitos
            </h1>
            <p className={`text-sm ${isDark ? 'text-[#E2E8F0]' : 'text-[#6B7280]'} font-medium`}>
              Sistema POS
            </p>
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 bg-[#F59E0B] rounded-full mr-2 animate-pulse"></div>
              <span className="text-xs text-[#F59E0B] font-medium">Online</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
