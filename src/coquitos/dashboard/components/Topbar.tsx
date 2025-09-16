import { Bell, LogOut } from 'lucide-react';

export const Topbar = () => {

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

  return (
    <header 
      className="sticky top-0 z-10 flex h-16 w-full items-center justify-between bg-white px-6 shadow-sm"
      aria-label="Barra de navegación superior"
    >
      {/* Sección Izquierda (Puede usarse para Breadcrumbs o Título de la página) */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700">Bienvenido</h2>
      </div>

      {/* Sección Derecha (Acciones y Perfil de Usuario) */}
      <div className="flex items-center space-x-4">
        {/* Botón de Notificaciones */}
        <button
          type="button"
          aria-label="Ver notificaciones"
          className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          <Bell className="h-6 w-6" />
        </button>

        <div className="h-8 border-l border-gray-200" aria-hidden="true"></div>

        {/* Perfil de Usuario */}
        <div className="flex items-center space-x-3">
          <div 
            className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600"
            aria-hidden="true" // El nombre del usuario ya es legible
          >
            {user.initials}
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-800">{user.name}</p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>
        </div>

        {/* Botón de Cerrar Sesión */}
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Cerrar sesión"
          className="rounded-full p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <LogOut className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
};