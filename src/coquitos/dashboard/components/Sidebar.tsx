import { 
  Home, 
  ShoppingCart, 
  Package, 
  Grid3X3, 
  Users, 
  UserCheck, 
  Shield, 
  BarChart3, 
  Calculator, 
  Settings,
  ChefHat
} from 'lucide-react';

interface SidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export const Sidebar = ({ activeSection, onSectionChange } : SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Inicio', icon: Home },
    { id: 'orders', label: 'Órdenes', icon: ShoppingCart },
    { 
      id: 'sales', 
      label: 'Gestión de Ventas', 
      icon: Package,
      submenu: [
        { id: 'products', label: 'Productos', icon: Package },
        { id: 'categories', label: 'Categorías', icon: Grid3X3 },
        { id: 'clients', label: 'Clientes', icon: Users },
      ]
    },
    { 
      id: 'admin', 
      label: 'Administración', 
      icon: Shield,
      submenu: [
        { id: 'users', label: 'Usuarios', icon: UserCheck },
      ]
    },
    { id: 'reports', label: 'Reportes', icon: BarChart3 },
    { id: 'cash-close', label: 'Cierre de Caja', icon: Calculator },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Cokitos</h1>
            <p className="text-sm text-gray-500">Dashboard Admin</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => !item.submenu && onSectionChange(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-orange-50 transition-colors ${
                activeSection === item.id ? 'bg-orange-50 text-orange-600 border-r-2 border-orange-600' : 'text-gray-700'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
            
            {item.submenu && (
              <div className="ml-4">
                {item.submenu.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => onSectionChange(subItem.id)}
                    className={`w-full flex items-center px-6 py-2 text-sm text-left hover:bg-orange-50 transition-colors ${
                      activeSection === subItem.id ? 'bg-orange-50 text-orange-600 border-r-2 border-orange-600' : 'text-gray-600'
                    }`}
                  >
                    <subItem.icon className="w-4 h-4 mr-3" />
                    {subItem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};