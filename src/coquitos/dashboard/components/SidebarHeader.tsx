import { ChefHat } from 'lucide-react';
import React from 'react';


interface SidebarHeaderProps {
  isCollapsed?: boolean;
}

export const SidebarHeader = React.memo(({ isCollapsed = false }: SidebarHeaderProps) => {
  return (
    <div className={`${isCollapsed ? 'p-3' : 'p-6'} border-b border-gray-700 bg-gradient-to-br from-[#275081] to-[#1a1a1a] relative overflow-hidden`}>
      {/* Efecto de brillo sutil de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F9E44E]/10 via-transparent to-[#F5F7E7]/5"></div>
      
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-4'} relative z-10`}>
        {/* Logo con ícono mejorado */}
        <div className="relative">
          <div className={`${isCollapsed ? 'w-10 h-10' : 'w-14 h-14'} bg-gradient-to-br from-[#F9E44E] to-[#F5F7E7] rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-[#F9E44E]/20`}>
            <ChefHat className={`${isCollapsed ? 'w-6 h-6' : 'w-8 h-8'} text-[#275081]`} />
          </div>
          {/* Efecto de brillo sutil */}
          <div className={`absolute inset-0 ${isCollapsed ? 'w-10 h-10' : 'w-14 h-14'} bg-gradient-to-br from-white/30 to-transparent rounded-2xl`}></div>
          {/* Punto de estado */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#F9E44E] rounded-full border-2 border-[#275081] shadow-lg"></div>
        </div>
        
        {/* Información de la aplicación mejorada - Solo visible cuando no está colapsado */}
        {!isCollapsed && (
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
              Coquitos
            </h1>
            <p className="text-sm text-[#F5F7E7] font-medium">
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
