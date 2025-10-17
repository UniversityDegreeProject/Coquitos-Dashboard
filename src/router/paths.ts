/**
 * Rutas de la aplicación
 * Centralizadas para facilitar la navegación y evitar errores de tipeo
 */
export const paths = {
  // Ruta raíz
  root: '/',

  // Rutas de autenticación (públicas)
  auth: {
    login: '/auth/login',
  },

  // Rutas del dashboard (privadas)
  dashboard: {
    root: '/dashboard',
    home: '/dashboard/home',
    orders: '/dashboard/orders',
    products: '/dashboard/products',
    categories: '/dashboard/categories',
    clients: '/dashboard/clients',
    users: '/dashboard/users',
    userDetail: (userId: string) => `/dashboard/users/${userId}`,
    reports: '/dashboard/reports',
    cashClosing: '/dashboard/cash-closing',
    settings: '/dashboard/settings',
  },
} as const;