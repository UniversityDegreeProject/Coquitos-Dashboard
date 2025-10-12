# Sistema de Enrutamiento y Protección de Rutas

## Estructura

### Componentes de Protección de Rutas

#### `PrivateRoute`
Protege rutas que requieren autenticación.
- **Comportamiento**: 
  - Si el usuario NO está autenticado → Redirige a `/auth/login`
  - Si el usuario está autenticando → Muestra pantalla de carga
  - Si el usuario está autenticado → Permite acceso

**Uso**: Envuelve todas las rutas del dashboard.

#### `PublicRoute`
Protege rutas públicas (como login) de usuarios ya autenticados.
- **Comportamiento**: 
  - Si el usuario está autenticado → Redirige a `/dashboard`
  - Si el usuario NO está autenticado → Permite acceso

**Uso**: Envuelve todas las rutas de autenticación.

#### `RootRedirect`
Redirige la raíz `/` según el estado de autenticación.
- **Comportamiento**: 
  - Si el usuario está autenticado → Redirige a `/dashboard`
  - Si el usuario NO está autenticado → Redirige a `/auth/login`

**Uso**: Solo en la ruta raíz `/`.

## Flujo de Autenticación

```
Usuario no autenticado:
  → Accede a "/" → RootRedirect → "/auth/login"
  → Intenta acceder a "/dashboard" → PrivateRoute → Redirige a "/auth/login"
  → Accede a "/auth/login" → PublicRoute → Permite acceso ✓

Usuario autenticado:
  → Accede a "/" → RootRedirect → "/dashboard"
  → Accede a "/dashboard" → PrivateRoute → Permite acceso ✓
  → Intenta acceder a "/auth/login" → PublicRoute → Redirige a "/dashboard"
```

## Rutas Disponibles

Ver archivo `paths.ts` para lista completa de rutas.

### Rutas Públicas
- `/auth/login` - Página de inicio de sesión

### Rutas Privadas (Requieren autenticación)
- `/dashboard/home` - Dashboard principal
- `/dashboard/orders` - Gestión de órdenes
- `/dashboard/products` - Gestión de productos
- `/dashboard/categories` - Gestión de categorías
- `/dashboard/clients` - Gestión de clientes
- `/dashboard/users` - Gestión de usuarios
- `/dashboard/reports` - Reportes
- `/dashboard/cash-closing` - Cierre de caja
- `/dashboard/settings` - Configuración

## Persistencia de Sesión

El estado de autenticación se persiste en `localStorage` usando Zustand persist middleware:
- Cuando el usuario inicia sesión, su información y token se guardan
- Al recargar la página, el estado se recupera automáticamente
- Si el token existe en localStorage, el usuario se considera autenticado

