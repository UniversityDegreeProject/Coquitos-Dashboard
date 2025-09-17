import { Outlet, useLocation } from "react-router";
import { useState } from "react";

// components
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";
import { paths } from "@/router/paths";

const urlRoutes = {
  [paths.home]: { title : "Dashboard", subtitle : "Panel de Control"} ,
  [paths.orders]: { title : "Órdenes", subtitle : "Gestiona, administra y visualiza las órdenes"},
  [paths.products]: { title : "Productos", subtitle : "Gestiona, administra y visualiza los productos"},
  [paths.categories]: { title : "Categorías", subtitle : "Gestiona, administra y visualiza las categorías"},
  [paths.clients]: { title : "Clientes", subtitle : "Gestiona, administra y visualiza los clientes"},
  [paths.users]: { title : "Usuarios", subtitle : "Gestiona, administra y visualiza los usuarios"},
  [paths.reports]: { title : "Reportes", subtitle : "Gestiona, administra y visualiza los reportes"},
  [paths.cashClosing]: { title : "Cierre de Caja", subtitle : "Gestiona, administra y visualiza el cierre de caja"},
  [paths.settings]: { title : "Configuración", subtitle : "Configuración de Coquitos"},
  [paths.admin.users]: { title : "Usuarios", subtitle : "Gestiona, administra y visualiza los usuarios"},
}



export const CoquitoLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const { pathname } = useLocation();
  const urlRoute = urlRoutes[pathname as keyof typeof urlRoutes];
  


  return (
    <div className="flex h-screen bg-[#F5F7E7] text-gray-800">
      {/* Columna Izquierda Fija: Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} />

      {/* Columna Derecha Flexible (ocupa el resto del espacio) */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Fila Superior: Topbar */}
        <Topbar 
          title={urlRoute.title} 
          subtitle={urlRoute.subtitle}
          onToggleSidebar={handleToggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Fila Inferior: Área de contenido principal con scroll */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* AQUÍ es donde React Router renderizará tus páginas (ej. DashboardPage) */}
            <Outlet />
          </div>
        </main>
        
      </div>
    </div>
  );
};