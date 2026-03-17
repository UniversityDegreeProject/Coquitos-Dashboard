import { paths } from '@/router/paths';
import { LogOut, Settings, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import type { User as UserType } from '@/coquitos-features/users/interfaces/user.interface';
import { toast } from 'sonner';

interface UserDropdownProps {
  user: UserType;
  onLogout: () => void;
}

/**
 * Componente del menú desplegable del usuario
 * Incluye opciones como configuración y cerrar sesión
 */
export const UserDropdown = ({ user, onLogout }: UserDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

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

  const handleNavigateToSettings = useCallback(() => {
    setIsOpen(false);
    navigate(paths.dashboard.settings);
  }, [navigate]);

  const handleLogout = useCallback(() => {
    toast.info('Cerrando Sesion...');

    setTimeout(() => {
      onLogout();
      setIsOpen(false);
      navigate(paths.auth.login);
    }, 1000);
      
  }, [onLogout, navigate]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón del usuario */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 sm:space-x-3 p-1 sm:p-2 rounded-lg hover:bg-gradient-to-r hover:from-[#275081]/20 hover:to-[#F9E44E]/10 group"
      >
        <div className="relative">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 lg:h-11 lg:w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#F9E44E] to-[#F5F7E7] font-bold text-[#275081] shadow-sm group-hover:shadow-md text-xs sm:text-sm">
            {user.firstName?.charAt(0)} {user.lastName?.charAt(0)}
          </div>
          {/* Indicador de estado online */}
          <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 sm:h-3 sm:w-3 bg-[#F9E44E] border border-[#275081] rounded-full animate-pulse"></div>
        </div>
        {/* Información del usuario - Oculta en pantallas muy pequeñas */}
        <div className="text-left hidden xs:block">
          <p className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#F9E44E]">
            {user.firstName} {user.lastName}
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
        <div className="absolute right-0 top-full mt-2 w-48 sm:w-56 bg-gradient-to-br from-[#2d2d2d] to-[#1a1a1a] rounded-lg shadow-md border border-gray-700 py-2 z-50">
          {/* Header del dropdown */}
          <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-700">
            <p className="text-xs sm:text-sm font-semibold text-white truncate">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-[#F5F7E7] truncate">{user.role}</p>
          </div>

          {/* Opciones del menú */}
          <div className="py-1">
            <button
              onClick={handleNavigateToSettings}
              className="w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-300 hover:bg-gradient-to-r hover:from-[#275081]/20 hover:to-[#F9E44E]/10 hover:text-white"
            >
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
