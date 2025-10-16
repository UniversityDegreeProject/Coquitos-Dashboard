# 📄 Documentación de Paginación - Usuarios

## 🎯 Objetivo
Implementar paginación en la lista de usuarios siguiendo la arquitectura del backend y separando responsabilidades.

---

## 🏗️ Arquitectura Implementada

### **Separación de Responsabilidades**

```
📂 users/
├── services/
│   └── use.service.ts          // ✅ Llamadas a la API (getUsers, getUsersPaginated)
├── hooks/
│   ├── useGetUsers.tsx          // ✅ Obtener TODOS los usuarios (sin paginación)
│   └── useUserPagination.tsx    // ✅ Hook de paginación con estado y lógica
├── components/
│   └── UserPagination.tsx       // ✅ Componente UI de controles de paginación
└── pages/
    └── UsersPage.tsx            // ✅ Página que usa el hook de paginación
```

---

## 📋 Archivos Modificados/Creados

### 1️⃣ **`services/use.service.ts`** - Servicios de API

#### ➕ Agregado:
```typescript
// Interface para parámetros de paginación
export interface GetUsersParams {
  page?: number;
  limit?: number;
}

// Interface para respuesta paginada del backend
interface PaginatedUsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Función para obtener usuarios paginados
export const getUsersPaginated = async (params: GetUsersParams): Promise<PaginatedUsersResponse> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  
  const response = await CoquitoApi.get<PaginatedUsersResponse>(
    `/users?${queryParams.toString()}`
  );
  
  return response.data;
}
```

**📌 Responsabilidad:** Llamadas HTTP a la API del backend.

---

### 2️⃣ **`const/use-querys.ts`** - Query Keys

#### ➕ Agregado:
```typescript
usersPaginated: (params: {
  page?: number;
  limit?: number;
}) => ['users', 'paginated', params] as const,
```

**📌 Responsabilidad:** Claves únicas para el caché de TanStack Query.

---

### 3️⃣ **`hooks/useUserPagination.tsx`** - ⭐ Hook Principal

#### Funcionalidad:
- ✅ Estado local de `page` y `limit`
- ✅ Query con TanStack Query (`useQuery`)
- ✅ Funciones de navegación (`nextPage`, `previousPage`, `firstPage`, `lastPage`)
- ✅ Función para cambiar el límite (`changeLimit`)
- ✅ Información derivada (`totalPages`, `hasNextPage`, `hasPreviousPage`)
- ✅ `placeholderData` para mantener datos anteriores mientras carga

#### Retorno del Hook:
```typescript
{
  // Datos
  users,
  total,
  page,
  limit,
  totalPages,
  hasNextPage,
  hasPreviousPage,

  // Estado de carga
  isPending,
  isFetching,
  isError,
  error,

  // Acciones
  goToPage,
  nextPage,
  previousPage,
  firstPage,
  lastPage,
  changeLimit,
}
```

**📌 Responsabilidad:** Lógica de estado y paginación con TanStack Query.

---

### 4️⃣ **`components/UserPagination.tsx`** - Componente UI

#### Características:
- ✅ Información de resultados: "Mostrando 1 a 7 de 45 usuarios"
- ✅ Selector de límite: 5, 7, 10, 20, 50 por página
- ✅ Botones de navegación:
  - ⏮ Primera página
  - ← Anterior
  - Indicador de página actual
  - → Siguiente
  - ⏭ Última página
- ✅ Estados deshabilitados según disponibilidad
- ✅ Indicador de carga visual (`isFetching`)
- ✅ Soporte para tema claro/oscuro

**📌 Responsabilidad:** Presentación visual y UX de la paginación.

---

### 5️⃣ **`pages/UsersPage.tsx`** - Consumo del Hook

#### Cambios:
```typescript
// Antes (sin paginación)
const { data: users = [], isPending } = useGetUsers();

// Después (con paginación)
const {
  users,
  isPending,
  isFetching,
  page,
  totalPages,
  total,
  limit,
  hasNextPage,
  hasPreviousPage,
  firstPage,
  previousPage,
  nextPage,
  lastPage,
  changeLimit,
} = useUserPagination({ initialPage: 1, initialLimit: 7 });
```

#### Renderizado:
```tsx
<div className="rounded-xl shadow-lg overflow-hidden">
  <UserGrid users={users} isPending={isPending} />
  
  {!isPending && users.length > 0 && (
    <UserPagination
      page={page}
      totalPages={totalPages}
      total={total}
      limit={limit}
      hasNextPage={hasNextPage}
      hasPreviousPage={hasPreviousPage}
      isFetching={isFetching}
      onFirstPage={firstPage}
      onPreviousPage={previousPage}
      onNextPage={nextPage}
      onLastPage={lastPage}
      onChangeLimit={changeLimit}
    />
  )}
</div>
```

**📌 Responsabilidad:** Coordinar el hook con la UI.

---

## 🔄 Integración con Mutaciones

### Invalidación de Queries Paginadas

Para que las mutaciones (crear, actualizar, eliminar) reflejen los cambios en la paginación:

```typescript
// En useCreateUser.tsx, useUpdateUser.tsx, useDeleteUser.tsx
onSuccess: () => {
  // ... lógica existente ...
  
  // Invalidar queries paginadas
  queryClient.invalidateQueries({ queryKey: ['users', 'paginated'] });
}
```

**🔍 ¿Por qué?**
- Al invalidar `['users', 'paginated']`, **todas** las queries paginadas se marcan como obsoletas.
- TanStack Query automáticamente refetch la query activa (la página actual).
- Esto asegura que los datos mostrados estén sincronizados con el backend.

---

## 📊 Flujo de Datos

```
1. Usuario carga UsersPage
   ↓
2. useUserPagination({ initialPage: 1, initialLimit: 7 })
   ↓
3. useQuery con queryKey: ['users', 'paginated', { page: 1, limit: 7 }]
   ↓
4. getUsersPaginated({ page: 1, limit: 7 })
   ↓
5. GET /api/users?page=1&limit=7
   ↓
6. Backend responde: { users: [...], total: 45, page: 1, limit: 7, totalPages: 7 }
   ↓
7. UserGrid muestra los usuarios
   ↓
8. UserPagination muestra controles
```

### Cuando el usuario cambia de página:

```
1. Usuario click "Siguiente"
   ↓
2. nextPage() → setPage(2)
   ↓
3. useQuery detecta cambio en queryKey
   ↓
4. GET /api/users?page=2&limit=7
   ↓
5. Datos actualizados se muestran
```

---

## 🎨 Características UX

### 1. **Placeholder Data**
```typescript
placeholderData: (previousData) => previousData
```
- Mantiene los datos anteriores mientras carga la nueva página
- Evita parpadeos y pantalla en blanco

### 2. **Estados de Botones**
- Deshabilitados automáticamente cuando:
  - No hay página anterior/siguiente
  - Está cargando (`isFetching`)

### 3. **Indicador de Carga**
- Barra de progreso animada en la parte superior del componente de paginación
- Visible solo cuando `isFetching === true`

### 4. **Cambio de Límite Inteligente**
```typescript
const changeLimit = useCallback((newLimit: number) => {
  setLimit(newLimit);
  setPage(1); // ✅ Resetea a la primera página
}, []);
```

---

## 🔧 Configuración Recomendada

### Para 7 usuarios por página (actual):
```typescript
useUserPagination({ initialPage: 1, initialLimit: 7 })
```

### Para 10 usuarios por página:
```typescript
useUserPagination({ initialPage: 1, initialLimit: 10 })
```

### Sin parámetros (usa defaults):
```typescript
useUserPagination() // initialPage: 1, initialLimit: 7
```

---

## 📌 Ventajas de esta Arquitectura

### ✅ Separación de Responsabilidades
- **Servicio:** Solo llamadas HTTP
- **Hook:** Lógica de estado y paginación
- **Componente:** Solo presentación visual
- **Página:** Coordinación

### ✅ Reutilizable
- `useUserPagination` puede usarse en otras vistas de usuarios
- `UserPagination` es un componente presentacional puro

### ✅ Testeable
- Cada capa se puede testear independientemente
- Mock fácil del servicio para tests

### ✅ Performante
- TanStack Query maneja el caché automáticamente
- `placeholderData` evita re-renderizados innecesarios
- `staleTime` de 5 minutos reduce llamadas redundantes

### ✅ Escalable
- Fácil agregar búsqueda y filtros
- Fácil agregar ordenamiento
- Fácil agregar más opciones de límite

---

## 🚀 Próximas Mejoras (Futuras)

- [ ] Integrar búsqueda en tiempo real con paginación
- [ ] Integrar filtros (rol, estado) con paginación
- [ ] Persistir estado de paginación en URL (`?page=2&limit=10`)
- [ ] Agregar ordenamiento por columnas
- [ ] Agregar "Ir a página específica" (input numérico)

---

## 📚 Referencias

- **Backend Docs:** `/README.md` - Endpoint `GET /api/users`
- **TanStack Query:** [Pagination Guide](https://tanstack.com/query/latest/docs/react/guides/paginated-queries)
- **Arquitectura:** Clean Architecture + Feature-based structure

---

**Última actualización:** 16 de Octubre, 2025  
**Versión:** 1.0.0  
**Estado:** ✅ Implementado y funcionando

