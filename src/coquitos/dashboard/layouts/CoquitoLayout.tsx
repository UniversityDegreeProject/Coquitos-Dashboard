import { Outlet, useLocation } from "react-router";
import { useState, useCallback } from "react";

// components
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";
import { paths } from "@/router/paths";
import { useMobileDetection } from "../hooks/useMobileDetection";
import { useTheme } from "@/shared/hooks/useTheme";

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

  
  //? movil sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useMobileDetection();
  const { css } = useTheme();

  //? movil mode toggle|
  const handleToggleSidebar = useCallback(() => {
    if (isMobile) {
      setIsSidebarOpen(prev => !prev);
    } else {
      setIsSidebarCollapsed(prev => !prev);
    }
  }, [isMobile]);

  //?Cerrar sidebar al navegar en móvil
  const handleCloseSidebar = useCallback(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  //* browser

  const { pathname } = useLocation();
  const urlRoute = urlRoutes[pathname as keyof typeof urlRoutes];
  
  const routeBreadcrumb = urlRoute?.title || 'Panel de administración';
  const routeSubtitle = urlRoute?.subtitle || 'Panel de control de Coquitos';
  
  if (!routeBreadcrumb) {
    return <div>404</div>;
  }

  return (
    <div className={`flex h-screen ${css.content.background} ${css.content.text} relative`}>
      {/* Overlay en móvil cuando el sidebar está abierto */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-transparent bg-opacity-50 z-40"
          onClick={handleCloseSidebar}
        />
      )}

      {/* Sidebar - Solo visible en desktop o cuando está abierto en móvil */}
      {(!isMobile || isSidebarOpen) && (
        <div className={`${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'} ${isMobile ? 'w-80' : ''}`}>
          <Sidebar 
            isCollapsed={!isMobile && isSidebarCollapsed} 
            onCloseSidebar={handleCloseSidebar}
          />
        </div>
      )}

      {/* Contenido principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        <Topbar 
          title={routeBreadcrumb} 
          subtitle={routeSubtitle}  
          onToggleSidebar={handleToggleSidebar}
          isSidebarCollapsed={isMobile ? !isSidebarOpen : isSidebarCollapsed}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
        
      </div>
    </div>
  );
};