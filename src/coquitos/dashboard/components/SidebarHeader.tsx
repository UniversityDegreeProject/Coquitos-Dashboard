import { ChefHat } from 'lucide-react';
import React from 'react';
import { useTheme } from '@/shared/hooks/useTheme';
import { useIsDark } from '@/shared/hooks/useThemeSelectors';


interface SidebarHeaderProps {
  isCollapsed?: boolean;
}

export const SidebarHeader = React.memo(({ isCollapsed = false }: SidebarHeaderProps) => {
  const { css } = useTheme();
  const isDark = useIsDark();

  return (
    <div className={`${isCollapsed ? 'p-3' : 'p-6'} border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} ${isDark ? 'bg-gradient-to-br from-[#275081] to-[#1a1a1a]' : 'bg-gradient-to-br from-[#F5F7E7] to-[#FFFFFF]'} relative overflow-hidden`}>
      {/* Efecto de brillo sutil de fondo */}
      <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[#F9E44E]/10 via-transparent to-[#F5F7E7]/5' : 'bg-gradient-to-br from-[#275081]/5 via-transparent to-[#F9E44E]/10'}`}></div>
      
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-4'} relative z-10`}>
        {/* Logo con ícono mejorado */}
        <div className="relative">
          <div className={`${isCollapsed ? 'w-10 h-10' : 'w-14 h-14'} bg-gradient-to-br from-[#F9E44E] to-[#F5F7E7] rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-[#F9E44E]/20`}>
            <ChefHat className={`${isCollapsed ? 'w-6 h-6' : 'w-8 h-8'} text-[#275081]`} />
          </div>
          {/* Efecto de brillo sutil */}
          <div className={`absolute inset-0 ${isCollapsed ? 'w-10 h-10' : 'w-14 h-14'} bg-gradient-to-br from-white/30 to-transparent rounded-2xl`}></div>
          {/* Punto de estado */}
          <div className={`absolute -top-1 -right-1 w-4 h-4 bg-[#F9E44E] rounded-full border-2 ${isDark ? 'border-[#275081]' : 'border-white'} shadow-lg`}></div>
        </div>
        
        {/* Información de la aplicación mejorada - Solo visible cuando no está colapsado */}
        {!isCollapsed && (
          <div className="flex-1">
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#275081]'} tracking-tight mb-1`}>
              Coquitos
            </h1>
            <p className={`text-sm ${isDark ? 'text-[#F5F7E7]' : 'text-[#6B7280]'} font-medium`}>
              Sistema POS
            </p>
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 bg-[#F9E44E] rounded-full mr-2 animate-pulse"></div>
              <span className="text-xs text-[#F9E44E] font-medium">Online</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
