import { Outlet } from "react-router";

// components
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";

export const CoquitoLayout = () => {
  return (
    <div className="flex h-screen bg-amber-50 text-gray-800">
      {/* Columna Izquierda Fija: Sidebar */}
      <Sidebar />

      {/* Columna Derecha Flexible (ocupa el resto del espacio) */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Fila Superior: Topbar */}
        <Topbar />

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