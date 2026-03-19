import { paths } from "@/router/paths";
import {
  Home,
  ShoppingCart,
  Package,
  Grid3X3,
  Users,
  Shield,
  BarChart3,
  Calculator,
  Settings,
  History,
} from "lucide-react";

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
export const menuItems = (isAdmin: boolean): MenuItem[] => {
  return [
    { to: paths.dashboard.home, label: "Inicio", icon: Home },
    { to: paths.dashboard.sales, label: "Ventas", icon: ShoppingCart },
    {
      to: paths.dashboard.cashClosing,
      label: "Caja",
      icon: Calculator,
    },
    {
      to: paths.dashboard.products,
      label: "Productos - Clientes",
      icon: Package,
      submenu: [
        { to: paths.dashboard.products, label: "Productos", icon: Package },
        { to: paths.dashboard.categories, label: "Categorías", icon: Grid3X3 },
        { to: paths.dashboard.clients, label: "Clientes", icon: Users },
      ],
    },

    ...(isAdmin
      ? [
          {
            to: paths.dashboard.users,
            label: "Administración",
            icon: Shield,
            submenu: [
              { to: paths.dashboard.users, label: "Usuarios", icon: Users },
              {
                to: paths.dashboard.activityLog,
                label: "Registro de Actividades",
                icon: History,
              },
            ],
          },
        ]
      : []),
    ...(isAdmin
      ? [{ to: paths.dashboard.reports, label: "Reportes", icon: BarChart3 }]
      : []),

    ...(isAdmin
      ? [
          {
            to: paths.dashboard.settings,
            label: "Configuración",
            icon: Settings,
          },
        ]
      : []),
  ];
};
