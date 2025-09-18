import { LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';

interface UserDropdownProps {
  user: {
    name: string;
    role: string;
    initials: string;
  };
  onLogout: () => void;
}

/**
 * Componente del menú desplegable del usuario
 * Incluye opciones como perfil, configuración y cerrar sesión
 */
export const UserDropdown = ({ user, onLogout }: UserDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = useCallback(() => {
    onLogout();
    setIsOpen(false);
  }, [onLogout]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón del usuario */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 sm:space-x-3 p-1 sm:p-2 rounded-lg hover:bg-gradient-to-r hover:from-[#275081]/20 hover:to-[#F9E44E]/10 group"
      >
        <div className="relative">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 lg:h-11 lg:w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#F9E44E] to-[#F5F7E7] font-bold text-[#275081] shadow-lg group-hover:shadow-xl text-xs sm:text-sm">
            {user.initials}
          </div>
          {/* Indicador de estado online */}
          <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 sm:h-3 sm:w-3 bg-[#F9E44E] border-2 border-[#275081] rounded-full animate-pulse"></div>
        </div>
        {/* Información del usuario - Oculta en pantallas muy pequeñas */}
        <div className="text-left hidden xs:block">
          <p className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#F9E44E]">
            {user.name}
          </p>
          <p className="text-xs text-[#F5F7E7] font-medium hidden sm:block">
            {user.role}
          </p>
        </div>
        <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hidden xs:block ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 sm:w-56 bg-gradient-to-br from-[#2d2d2d] to-[#1a1a1a] rounded-lg shadow-xl border border-gray-700 py-2 z-50">
          {/* Header del dropdown */}
          <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-700">
            <p className="text-xs sm:text-sm font-semibold text-white truncate">{user.name}</p>
            <p className="text-xs text-[#F5F7E7] truncate">{user.role}</p>
          </div>

          {/* Opciones del menú */}
          <div className="py-1">
                    <button className="w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-300 hover:bg-gradient-to-r hover:from-[#275081]/20 hover:to-[#F9E44E]/10 hover:text-white">
              <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>Mi Perfil</span>
            </button>
            
                    <button className="w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-300 hover:bg-gradient-to-r hover:from-[#275081]/20 hover:to-[#F9E44E]/10 hover:text-white">
              <Settings className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>Configuración</span>
            </button>
          </div>

          {/* Separador */}
          <div className="border-t border-gray-700 my-1"></div>

          {/* Botón de cerrar sesión */}
          <div className="py-1">
            <button
              onClick={handleLogout}
                      className="w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>Salir</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
