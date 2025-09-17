import { Sun, Moon, PanelLeft } from 'lucide-react';
import { useState } from 'react';
import { UserDropdown } from './UserDropdown';


interface TopbarProps {
  title: string;
  subtitle?: string;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}
export const Topbar = ({  title, subtitle, onToggleSidebar, isSidebarCollapsed } : TopbarProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // NOTA: La información del usuario debería provenir de un estado global o un hook de autenticación.
  // Por ahora, usamos datos estáticos como ejemplo.
  const user = {
    name: 'Jesús Cokitos',
    role: 'Administrador',
    initials: 'JC',
  };

  const handleLogout = () => {
    // Lógica para cerrar sesión (ej. limpiar tokens, redirigir al login)
    console.log('Cerrando sesión...');
  };



  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Aquí se implementaría la lógica para cambiar el tema
  };

  return (
    <header 
      className="sticky top-0 z-20 flex h-16 sm:h-20 w-full items-center justify-between bg-[#275081] backdrop-blur-md border-b border-[#275081] px-3 sm:px-6 lg:px-8 shadow-lg"
      aria-label="Barra de navegación superior"
    >
      {/* Sección Izquierda - Botón de colapso y título */}
      <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6 min-w-0 flex-1">
        {/* Botón de colapso del sidebar */}
        <button
          onClick={onToggleSidebar}
          className="flex-shrink-0 p-1.5 sm:p-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-100 focus:outline-none focus:ring-2 focus:ring-[#F9E44E] focus:ring-offset-2"
          aria-label={isSidebarCollapsed ? 'Expandir sidebar' : 'Contraer sidebar'}
        >
          <PanelLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-tight truncate"> 
            {title} 
          </h1>
          <p className="text-xs sm:text-sm text-[#F5F7E7] font-medium truncate hidden sm:block"> 
            {subtitle || 'Panel de administración'} 
          </p>
        </div>
      </div>

      {/* Sección Derecha - Acciones y Perfil de Usuario */}
      <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4 flex-shrink-0">
        {/* Botón de cambio de tema - Solo visible en pantallas medianas y grandes */}
        <button
          type="button"
          onClick={handleToggleTheme}
          aria-label={`Cambiar a tema ${isDarkMode ? 'claro' : 'oscuro'}`}
          className="hidden sm:flex relative p-1.5 sm:p-2 text-gray-400 transition-all duration-100 hover:bg-gradient-to-r hover:from-[#275081]/20 hover:to-[#F9E44E]/10 hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#275081] focus:ring-offset-2"
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </button>

        {/* Separador visual - Solo visible en pantallas medianas y grandes */}
        <div className="hidden sm:block h-6 sm:h-8 border-l border-gray-600" aria-hidden="true"></div>

        {/* Menú desplegable del usuario */}
        <UserDropdown user={user} onLogout={handleLogout} />
      </div>
    </header>
  );
};