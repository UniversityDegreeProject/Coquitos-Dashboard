import { paths } from '@/router/paths';
import { 
  Home, 
  ShoppingCart, 
  Package, 
  Grid3X3, 
  Users, 
  Shield, 
  BarChart3, 
  Calculator, 
  Settings
} from 'lucide-react';

export interface MenuItem {
  to: string;
  label: string;
  icon: React.ElementType;
  submenu?: MenuItem[];
}

/**
 * Configuración de los elementos del menú del sidebar
 * Define la estructura de navegación de la aplicación
 */
export const menuItems: MenuItem[] = [
  { to: paths.home, label: "Inicio", icon: Home },
  { to: paths.orders, label: "Órdenes", icon: ShoppingCart },
  { 
    to: paths.sales, 
    label: "Gestión de Ventas", 
    icon: Package, 
    submenu: [
      { to: paths.products, label: "Productos", icon: Package },
      { to: paths.categories, label: "Categorías", icon: Grid3X3 },
      { to: paths.clients, label: "Clientes", icon: Users },
    ] 
  },
  { 
    to: paths.admin.users, 
    label: "Administración", 
    icon: Shield, 
    submenu: [
      { to: paths.users, label: "Usuarios", icon: Users },
    ] 
  },
  { to: paths.reports, label: "Reportes", icon: BarChart3 },
  { to: paths.cashClosing, label: "Cierre de Caja", icon: Calculator },
  { to: paths.settings, label: "Configuración", icon: Settings },
];
