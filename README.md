# 📚 Documentación API Backend - Sistema POS Coquito

> Documentación completa de la API REST para el sistema de punto de venta (POS) Coquito

## 📖 Tabla de Contenidos

- [Información General](#información-general)
- [Arquitectura](#arquitectura)
- [Base de Datos](#base-de-datos)
- [Autenticación](#autenticación)
- [Endpoints](#endpoints)
  - [Auth](#auth-endpoints)
  - [Users](#users-endpoints)
- [Modelos de Datos](#modelos-de-datos)
- [Códigos de Estado](#códigos-de-estado)
- [Manejo de Errores](#manejo-de-errores)
- [Implementación Frontend](#implementación-frontend---búsqueda-de-usuarios)
  - [Arquitectura de Features](#arquitectura-de-features-clean-architecture)
  - [Implementación de Búsqueda](#implementación-de-búsqueda)
  - [Ventajas de la Arquitectura](#ventajas-de-esta-arquitectura)
  - [Patrón Recomendado](#patrón-recomendado-para-nuevas-features)

---

## 🌐 Información General

### Base URL
```
http://localhost:3000
```

### Tecnologías
- **Runtime**: Node.js
- **Framework**: Express.js
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma
- **Validación**: Zod
- **Autenticación**: JWT (JSON Web Tokens)
- **Encriptación**: Bcrypt
- **Email**: Nodemailer

### Headers Requeridos

Para todas las peticiones:
```http
Content-Type: application/json
```

Para rutas protegidas (próximamente):
```http
Authorization: Bearer <token>
```

---

## 🏗️ Arquitectura

El backend está construido siguiendo **Clean Architecture** con las siguientes capas:

```
┌─────────────────────────────────────────────┐
│         CAPA DE PRESENTACIÓN                │
│   (Controllers, Routes, Views)              │
│   - Manejo de HTTP                          │
│   - Validación inicial                      │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         CAPA DE DOMINIO                     │
│   (Use Cases, DTOs, Entities, Interfaces)   │
│   - Lógica de negocio                       │
│   - Reglas de validación                    │
│   - Contratos (abstracciones)               │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│      CAPA DE INFRAESTRUCTURA                │
│   (Repositories, Datasources)               │
│   - Acceso a datos (Prisma)                 │
│   - Servicios externos                      │
│   - Implementaciones concretas              │
└─────────────────────────────────────────────┘
```

### Flujo de una Request

```
1. HTTP Request → Routes
2. Routes → Controller
3. Controller → DTO (Validación con Zod)
4. Controller → Use Case (Lógica de negocio)
5. Use Case → Repository (Abstracción)
6. Repository → Datasource (Prisma/BD)
7. Datasource → PostgreSQL
8. Retorno: PostgreSQL → ... → HTTP Response
```

---

## 💾 Base de Datos

### Modelos Implementados

#### 👤 User (Usuario)
```typescript
{
  id: string (UUID)
  username: string (único)
  email: string (único)
  emailVerified: boolean
  password: string (hasheada)
  firstName: string
  lastName: string
  phone: string | null
  role: "Administrador" | "Cajero"
  status: "Activo" | "Inactivo" | "Suspendido"
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### 📦 Modelos Futuros (Schema ya definido)
- **Category**: Categorías de productos
- **Product**: Catálogo de productos
- **Customer**: Clientes
- **Order**: Órdenes de venta
- **OrderItem**: Items de órdenes
- **CashRegister**: Control de caja
- **StockMovement**: Movimientos de inventario
- **DailySalesReport**: Reportes diarios
- **ActivityLog**: Registro de actividades

### Relaciones Principales

```
User (1) ──┬──> (N) Orders
           ├──> (N) CashRegisters
           ├──> (N) StockMovements
           └──> (N) ActivityLogs

Category (1) ──> (N) Products

Product (1) ──┬──> (N) OrderItems
              └──> (N) StockMovements

Order (1) ──> (N) OrderItems
```

---

## 🔐 Autenticación

### Sistema de Autenticación JWT

El sistema utiliza **JSON Web Tokens (JWT)** para autenticación.

#### Flujo de Autenticación

```
1. Usuario → POST /api/auth/login
2. Backend valida credenciales
3. Backend genera JWT
4. Cliente recibe token
5. Cliente guarda token (localStorage/sessionStorage)
6. Cliente envía token en cada request:
   Header: Authorization: Bearer <token>
```

#### Estructura del Token JWT

```json
{
  "id": "uuid-del-usuario",
  "username": "juan123",
  "email": "juan@mail.com",
  "role": "Administrador",
  "iat": 1697123456,
  "exp": 1697209856
}
```

#### Expiración
- **Duración**: 24 horas (por defecto)
- **Refresh**: Próximamente

---

## 🛣️ Endpoints

### AUTH ENDPOINTS

Base path: `/api/auth`

---

#### 1️⃣ **POST** `/api/auth/register`
Registrar un nuevo usuario (solo admins - próximamente protegido).

**Request Body:**
```json
{
  "username": "juan123",
  "email": "juan@example.com",
  "password": "Password123!",
  "firstName": "Juan",
  "lastName": "Pérez",
  "phone": "3001234567",
  "role": "Cajero",
  "status": "Activo"
}
```

**Validaciones:**
- `username`: 3-20 caracteres, único
- `email`: formato válido, único
- `password`: 6-16 caracteres, debe incluir:
  - Al menos 1 mayúscula
  - Al menos 1 minúscula
  - Al menos 1 número
  - Al menos 1 caracter especial (@$!%*?&)
- `firstName`: requerido, no vacío
- `lastName`: requerido, no vacío
- `phone`: requerido, no vacío
- `role`: "Administrador" | "Cajero"
- `status`: "Activo" | "Inactivo" | "Suspendido" (default: "Activo")

**Response 201:**
```json
{
  "user": {
    "id": "uuid",
    "username": "juan123",
    "email": "juan@example.com",
    "emailVerified": false,
    "firstName": "Juan",
    "lastName": "Pérez",
    "phone": "3001234567",
    "role": "Cajero",
    "status": "Activo",
    "createdAt": "2024-10-12T10:30:00.000Z",
    "updatedAt": "2024-10-12T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 400:**
```json
{
  "error": "El email ya está registrado"
}
```
```json
{
  "error": "El username ya está en uso"
}
```

---

#### 2️⃣ **POST** `/api/auth/login`
Iniciar sesión.

**Request Body:**
```json
{
  "username": "juan123",
  "password": "Password123!"
}
```

**Validaciones:**
- `username`: requerido, no vacío
- `password`: 6-16 caracteres con formato válido

**Response 200:**
```json
{
  "user": {
    "id": "uuid",
    "username": "juan123",
    "email": "juan@example.com",
    "emailVerified": true,
    "firstName": "Juan",
    "lastName": "Pérez",
    "phone": "3001234567",
    "role": "Cajero",
    "status": "Activo",
    "createdAt": "2024-10-12T10:30:00.000Z",
    "updatedAt": "2024-10-12T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 400:**
```json
{
  "error": "Usuario o contraseña incorrectos"
}
```

**Response 403:**
```json
{
  "error": "Usuario inactivo o suspendido"
}
```

---

#### 3️⃣ **POST** `/api/auth/retry-verify-email`
Reenviar email de verificación.

**Request Body:**
```json
{
  "email": "juan@example.com"
}
```

**Response 200:**
```json
{
  "message": "Email de verificación enviado"
}
```

---

#### 4️⃣ **GET** `/api/auth/verify-email/:token`
Verificar email con token.

**URL Parameters:**
- `token`: JWT token de verificación

**Response 200:**
```json
{
  "message": "Email verificado correctamente"
}
```

**Response 400:**
```json
{
  "error": "Token inválido o expirado"
}
```

---

#### 5️⃣ **POST** `/api/auth/forgot-password`
Solicitar restablecimiento de contraseña.

**Request Body:**
```json
{
  "email": "juan@example.com"
}
```

**Response 200:**
```json
{
  "message": "Email de restablecimiento enviado"
}
```

**Response 404:**
```json
{
  "error": "Usuario no encontrado"
}
```

---

#### 6️⃣ **GET** `/api/auth/reset-password-page/:token`
Página HTML para restablecer contraseña (para email).

**URL Parameters:**
- `token`: JWT token de restablecimiento

**Response 200:** Página HTML con formulario

---

#### 7️⃣ **POST** `/api/auth/reset-password-submit`
Formulario HTML enviado desde el email.

_(Uso interno del formulario HTML)_

---

#### 8️⃣ **POST** `/api/auth/reset-password`
Restablecer contraseña (para frontend SPA).

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "newPassword": "NewPassword123!"
}
```

**Validaciones:**
- `token`: JWT válido
- `newPassword`: 6-16 caracteres con formato válido

**Response 200:**
```json
{
  "message": "Contraseña restablecida correctamente"
}
```

**Response 400:**
```json
{
  "error": "Token inválido o expirado"
}
```

---

### USERS ENDPOINTS

Base path: `/api/users`

---

#### 1️⃣ **GET** `/api/users`
Obtener todos los usuarios.

**Response 200:**
```json
{
  "users": [
    {
      "id": "uuid-1",
      "username": "juan123",
      "email": "juan@example.com",
      "emailVerified": true,
      "firstName": "Juan",
      "lastName": "Pérez",
      "phone": "3001234567",
      "role": "Cajero",
      "status": "Activo",
      "createdAt": "2024-10-12T10:30:00.000Z",
      "updatedAt": "2024-10-12T10:30:00.000Z"
    },
    {
      "id": "uuid-2",
      "username": "maria456",
      "email": "maria@example.com",
      "emailVerified": true,
      "firstName": "María",
      "lastName": "García",
      "phone": "3007654321",
      "role": "Administrador",
      "status": "Activo",
      "createdAt": "2024-10-10T08:15:00.000Z",
      "updatedAt": "2024-10-11T14:20:00.000Z"
    }
  ]
}
```

**Response 500:**
```json
{
  "error": "Internal server error"
}
```

---

#### 2️⃣ **GET** `/api/users/search`
Buscar usuarios con filtros y paginación.

**Query Parameters:**
- `search` (opcional): Busca en username, email, firstName, lastName
- `role` (opcional): "Administrador" | "Cajero"
- `status` (opcional): "Activo" | "Inactivo" | "Suspendido"
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Items por página (default: 10)

**Ejemplos de URLs:**
```
GET /api/users/search?search=Juan
GET /api/users/search?role=Administrador
GET /api/users/search?status=Activo&page=2&limit=20
GET /api/users/search?search=juan&role=Cajero&status=Activo&page=1&limit=10
```

**Response 200:**
```json
{
  "users": [
    {
      "id": "uuid-1",
      "username": "juan123",
      "email": "juan@example.com",
      "emailVerified": true,
      "firstName": "Juan",
      "lastName": "Pérez",
      "phone": "3001234567",
      "role": "Cajero",
      "status": "Activo",
      "createdAt": "2024-10-12T10:30:00.000Z",
      "updatedAt": "2024-10-12T10:30:00.000Z"
    }
  ],
  "total": 156,
  "page": 2,
  "limit": 20,
  "totalPages": 8
}
```

**Response 400:**
```json
{
  "error": "Rol inválido"
}
```

**Validaciones:**
- `search`: string opcional (insensitive, busca parcial)
- `role`: debe ser "Administrador" o "Cajero"
- `status`: debe ser "Activo", "Inactivo" o "Suspendido"
- `page`: número entero positivo
- `limit`: número entero positivo

---

#### 3️⃣ **GET** `/api/users/search/by-email`
Buscar usuario por email.

**Query Parameters:**
- `email` (requerido): Email del usuario

**Ejemplo:**
```
GET /api/users/search/by-email?email=juan@example.com
```

**Response 200:**
```json
{
  "user": {
    "id": "uuid",
    "username": "juan123",
    "email": "juan@example.com",
    "emailVerified": true,
    "firstName": "Juan",
    "lastName": "Pérez",
    "phone": "3001234567",
    "role": "Cajero",
    "status": "Activo",
    "createdAt": "2024-10-12T10:30:00.000Z",
    "updatedAt": "2024-10-12T10:30:00.000Z"
  }
}
```

**Response 404:**
```json
{
  "error": "User not found"
}
```

**Response 400:**
```json
{
  "error": "Email inválido"
}
```

---

#### 4️⃣ **GET** `/api/users/:id`
Obtener usuario por ID.

**URL Parameters:**
- `id`: UUID del usuario

**Ejemplo:**
```
GET /api/users/550e8400-e29b-41d4-a716-446655440000
```

**Response 200:**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "juan123",
    "email": "juan@example.com",
    "emailVerified": true,
    "firstName": "Juan",
    "lastName": "Pérez",
    "phone": "3001234567",
    "role": "Cajero",
    "status": "Activo",
    "createdAt": "2024-10-12T10:30:00.000Z",
    "updatedAt": "2024-10-12T10:30:00.000Z"
  }
}
```

**Response 404:**
```json
{
  "error": "User not found"
}
```

**Response 400:**
```json
{
  "error": "Id inválido"
}
```

---

#### 5️⃣ **PATCH** `/api/users/:id`
Actualizar usuario.

**URL Parameters:**
- `id`: UUID del usuario

**Request Body (todos los campos son opcionales):**
```json
{
  "username": "juan123_updated",
  "email": "juan_new@example.com",
  "emailVerified": true,
  "firstName": "Juan Carlos",
  "lastName": "Pérez López",
  "phone": "3009876543",
  "role": "Administrador",
  "status": "Suspendido",
  "password": "NewPassword123!"
}
```

**Validaciones:**
- `username`: mínimo 1 carácter (si se envía)
- `email`: formato válido (si se envía)
- `emailVerified`: booleano (si se envía)
- `firstName`: mínimo 1 carácter (si se envía)
- `lastName`: mínimo 1 carácter (si se envía)
- `phone`: mínimo 1 carácter (si se envía)
- `role`: "Administrador" | "Cajero" (si se envía)
- `status`: "Activo" | "Inactivo" | "Suspendido" (si se envía)
- `password`: mínimo 1 carácter (si se envía, será hasheada)

**Response 200:**
```json
{
  "user": {
    "id": "uuid",
    "username": "juan123_updated",
    "email": "juan_new@example.com",
    "emailVerified": true,
    "firstName": "Juan Carlos",
    "lastName": "Pérez López",
    "phone": "3009876543",
    "role": "Administrador",
    "status": "Suspendido",
    "createdAt": "2024-10-12T10:30:00.000Z",
    "updatedAt": "2024-10-12T15:45:00.000Z"
  }
}
```

**Response 404:**
```json
{
  "error": "User not found"
}
```

**Response 400:**
```json
{
  "error": "Id inválido"
}
```

---

#### 6️⃣ **DELETE** `/api/users/:id`
Eliminar usuario.

**URL Parameters:**
- `id`: UUID del usuario

**Ejemplo:**
```
DELETE /api/users/550e8400-e29b-41d4-a716-446655440000
```

**Response 200:**
```json
{
  "message": "Usuario eliminado exitosamente",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "juan123",
    "email": "juan@example.com",
    "emailVerified": true,
    "firstName": "Juan",
    "lastName": "Pérez",
    "phone": "3001234567",
    "role": "Cajero",
    "status": "Activo",
    "createdAt": "2024-10-12T10:30:00.000Z",
    "updatedAt": "2024-10-12T10:30:00.000Z"
  }
}
```

**Response 404:**
```json
{
  "error": "User not found"
}
```

**Response 400:**
```json
{
  "error": "Id user not found"
}
```

---

## 📊 Modelos de Datos

### UserEntity

```typescript
interface UserEntity {
  id: string;                    // UUID
  username: string;              // Único
  email: string;                 // Único
  emailVerified: boolean;        // Estado de verificación
  password: string;              // Hash bcrypt (NO enviar al frontend)
  firstName: string;             // Nombre
  lastName: string;              // Apellido
  phone: string | null;          // Teléfono opcional
  role: "Administrador" | "Cajero";
  status: "Activo" | "Inactivo" | "Suspendido";
  createdAt: Date;               // Fecha de creación
  updatedAt: Date | null;        // Fecha de última actualización
}
```

### Roles y Permisos

| Rol            | Permisos                                                      |
|----------------|---------------------------------------------------------------|
| **Administrador** | - Gestionar usuarios (CRUD completo)                       |
|                | - Gestionar productos y categorías                           |
|                | - Ver todos los reportes                                      |
|                | - Gestionar órdenes                                           |
|                | - Realizar cierre de caja                                     |
| **Cajero**     | - Crear y ver órdenes                                         |
|                | - Ver catálogo de productos                                   |
|                | - Cerrar su propia caja                                       |
|                | - NO puede gestionar usuarios                                 |
|                | - NO puede gestionar categorías                               |

### Status de Usuario

- **Activo**: Usuario puede iniciar sesión y operar normalmente
- **Inactivo**: Usuario temporalmente deshabilitado
- **Suspendido**: Usuario bloqueado, no puede iniciar sesión

---

## 📡 Códigos de Estado HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| **200** | OK | Operación exitosa |
| **201** | Created | Recurso creado exitosamente (registro) |
| **400** | Bad Request | Error de validación o datos inválidos |
| **401** | Unauthorized | No autenticado (token inválido/faltante) |
| **403** | Forbidden | No autorizado (sin permisos) |
| **404** | Not Found | Recurso no encontrado |
| **409** | Conflict | Conflicto (email/username duplicado) |
| **500** | Internal Server Error | Error del servidor |

---

## ⚠️ Manejo de Errores

### Formato de Errores

Todos los errores siguen este formato:

```json
{
  "error": "Mensaje descriptivo del error"
}
```

### Tipos de Errores Comunes

#### Errores de Validación (400)
```json
{
  "error": "Email inválido"
}
```
```json
{
  "error": "Contraseña debe tener al menos 6 caracteres"
}
```
```json
{
  "error": "Rol inválido"
}
```

#### Errores de Conflicto (400/409)
```json
{
  "error": "El email ya está registrado"
}
```
```json
{
  "error": "El username ya está en uso"
}
```

#### Errores de Autenticación (400/401)
```json
{
  "error": "Usuario o contraseña incorrectos"
}
```
```json
{
  "error": "Token inválido o expirado"
}
```

#### Errores de Autorización (403)
```json
{
  "error": "Usuario inactivo o suspendido"
}
```
```json
{
  "error": "No tienes permisos para realizar esta acción"
}
```

#### Errores de Recurso No Encontrado (404)
```json
{
  "error": "User not found"
}
```
```json
{
  "error": "Usuario no encontrado"
}
```

#### Errores del Servidor (500)
```json
{
  "error": "Internal server error"
}
```

---

## 🔄 Ejemplos de Integración Frontend

### 1. Registro de Usuario

```typescript
// services/authService.ts
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'Administrador' | 'Cajero';
  status?: 'Activo' | 'Inactivo' | 'Suspendido';
}) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    
    // Guardar token
    localStorage.setItem('token', response.data.token);
    
    return {
      success: true,
      user: response.data.user,
      token: response.data.token
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al registrar usuario'
      };
    }
    return {
      success: false,
      error: 'Error desconocido'
    };
  }
};
```

### 2. Login

```typescript
// services/authService.ts
export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password
    });
    
    // Guardar token y usuario
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return {
      success: true,
      user: response.data.user,
      token: response.data.token
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al iniciar sesión'
      };
    }
    return {
      success: false,
      error: 'Error desconocido'
    };
  }
};
```

### 3. Buscar Usuarios con Filtros

```typescript
// services/userService.ts
export const searchUsers = async (params: {
  search?: string;
  role?: 'Administrador' | 'Cajero';
  status?: 'Activo' | 'Inactivo' | 'Suspendido';
  page?: number;
  limit?: number;
}) => {
  try {
    // Construir query params
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.role) queryParams.append('role', params.role);
    if (params.status) queryParams.append('status', params.status);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    const response = await axios.get(
      `${API_URL}/users/search?${queryParams.toString()}`
    );
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al buscar usuarios'
      };
    }
    return {
      success: false,
      error: 'Error desconocido'
    };
  }
};
```

### 4. Actualizar Usuario

```typescript
// services/userService.ts
export const updateUser = async (
  userId: string, 
  updates: Partial<{
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: 'Administrador' | 'Cajero';
    status: 'Activo' | 'Inactivo' | 'Suspendido';
    password: string;
  }>
) => {
  try {
    const response = await axios.patch(
      `${API_URL}/users/${userId}`,
      updates
    );
    
    return {
      success: true,
      user: response.data.user
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al actualizar usuario'
      };
    }
    return {
      success: false,
      error: 'Error desconocido'
    };
  }
};
```

### 5. Eliminar Usuario

```typescript
// services/userService.ts
export const deleteUser = async (userId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${userId}`);
    
    return {
      success: true,
      message: response.data.message,
      user: response.data.user
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al eliminar usuario'
      };
    }
    return {
      success: false,
      error: 'Error desconocido'
    };
  }
};
```

### 6. Configuración de Axios con Interceptors (Recomendado)

```typescript
// config/axios.config.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token automáticamente
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejo de errores global
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

---

## 🧪 Testing con Postman/Thunder Client

### Colección de Pruebas

#### 1. Registro
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test123!",
  "firstName": "Test",
  "lastName": "User",
  "phone": "3001234567",
  "role": "Cajero",
  "status": "Activo"
}
```

#### 2. Login
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "Test123!"
}
```

#### 3. Buscar Usuarios
```http
GET http://localhost:3000/api/users/search?search=test&page=1&limit=10
```

#### 4. Obtener Usuario por ID
```http
GET http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000
```

#### 5. Actualizar Usuario
```http
PATCH http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "firstName": "Test Updated",
  "status": "Suspendido"
}
```

#### 6. Eliminar Usuario
```http
DELETE http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000
```

---

## 📝 Notas Importantes

### Seguridad
1. **Passwords**: Nunca se devuelven en las respuestas (están hasheadas)
2. **Tokens**: Expiran en 24 horas
3. **CORS**: Configurado para desarrollo (ajustar en producción)
4. **Validación**: Doble capa (Zod + lógica de negocio)

### Paginación
- **Default**: 10 items por página
- **Máximo recomendado**: 100 items por página
- **Formato**: Siempre incluye `total`, `page`, `limit`, `totalPages`

### Timestamps
- Todas las fechas están en formato ISO 8601 UTC
- Ejemplo: `"2024-10-12T10:30:00.000Z"`

### UUIDs
- Todos los IDs son UUID v4
- Ejemplo: `"550e8400-e29b-41d4-a716-446655440000"`

---

## 🎨 Implementación Frontend - Búsqueda de Usuarios

### Arquitectura de Features (Clean Architecture)

El módulo de usuarios sigue el patrón de Clean Architecture organizado por features:

```
src/coquitos-features/users/
├── components/         # Componentes visuales
├── const/             # Constantes y configuraciones
├── helpers/           # Funciones auxiliares
├── hooks/             # Custom hooks de TanStack Query
├── interfaces/        # Tipos e interfaces TypeScript
├── pages/             # Páginas del módulo
├── schemas/           # Esquemas de validación Zod
├── services/          # Servicios de API
└── store/             # Store de Zustand
```

---

### 🔍 Implementación de Búsqueda

#### 1. **Interfaces** (`interfaces/user.interface.ts`)

```typescript
export type Role = "Administrador" | "Cajero";
export type Status = "Activo" | "Inactivo" | "Suspendido";

export interface User {
  id?: string;
  username: string;
  email: string;
  emailVerified?: boolean;
  firstName: string;
  lastName: string;
  phone: string;
  role: Role;
  status: Status;
  createdAt?: Date;
  updatedAt?: Date;
}
```

---

#### 2. **Servicios** (`services/use.service.ts`)

```typescript
// Servicio de búsqueda de usuarios
export const searchUsers = async (search: string): Promise<User[]> => {
  try {
    const response = await CoquitoApi.get<UsersResponse>(
      `/users/search?search=${search}`
    );
    return response.data.users;
  } catch (error) {
    throw new Error(`Error al buscar usuarios: ${error}`);
  }
}
```

**Funcionalidad:**
- Realiza petición GET al endpoint `/users/search`
- Recibe un parámetro de búsqueda
- Retorna array de usuarios filtrados
- Manejo de errores con mensajes descriptivos

---

#### 3. **Constantes de Query** (`const/use-querys.ts`)

```typescript
export const useQuerys = {
  allUsers: ['users'] as const,
  searchUsers: (params: {
    search?: string;
    role?: 'Administrador' | 'Cajero';
    status?: 'Activo' | 'Inactivo' | 'Suspendido';
    page?: number;
    limit?: number;
  }) => [useQuerys.allUsers, params] as const,
}
```

**Funcionalidad:**
- Define query keys tipadas para TanStack Query
- Permite cache granular por parámetros de búsqueda
- Seguimiento de dependencias automático

---

#### 4. **Hook de Búsqueda** (`hooks/useSearchUsers.tsx`)

```typescript
export const useSearchUsers = ({ 
  search = "", 
  role = "", 
  status = "" 
}: UseSearchUsersParams) => {
  // Determinar si hay filtros activos
  const hasFilters = search.trim() !== "" || role !== "" || status !== "";

  const searchQuery = useQuery({
    queryKey: useQuerys.searchUsers({
      search: search || undefined,
      role: role || undefined,
      status: status || undefined,
    }),
    queryFn: () => searchUsers(search),
    
    // Configuración de caché
    staleTime: 1000 * 60 * 2, // 2 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    
    // Solo ejecutar si hay filtros activos
    enabled: hasFilters,
  });

  return {
    ...searchQuery,
    hasFilters,
  };
};
```

**Características:**
- **Parámetros tipados**: `search`, `role`, `status`
- **Caché inteligente**: Solo busca si hay filtros activos
- **Optimización**: No refetch innecesarios
- **Query key dinámica**: Cache por parámetros específicos
- **Estado de filtros**: Retorna `hasFilters` para lógica condicional

---

#### 5. **Integración en Página** (`pages/UsersPage.tsx`)

```typescript
export const UsersPage = () => {
  // React Hook Form para los filtros
  const { control, watch } = useForm({
    defaultValues: {
      search: "",
      roleFilter: "",
      statusFilter: "",
    },
    mode: "onChange",
  });

  // Observar cambios en tiempo real
  const searchValue = watch("search");
  const roleFilterValue = watch("roleFilter") as Role | "";
  const statusFilterValue = watch("statusFilter") as Status | "";

  // Hook de todos los usuarios
  const { data: allUsers = [], isPending: isPendingAll } = useGetUsers();
  
  // Hook de búsqueda (solo se activa con filtros)
  const { 
    data: searchedUsers = [], 
    isPending: isPendingSearch,
    hasFilters 
  } = useSearchUsers({
    search: searchValue,
    role: roleFilterValue,
    status: statusFilterValue,
  });

  // Determinar qué datos mostrar
  const { users, isPending } = useMemo(() => {
    if (hasFilters) {
      return { users: searchedUsers, isPending: isPendingSearch };
    }
    return { users: allUsers, isPending: isPendingAll };
  }, [hasFilters, searchedUsers, allUsers, isPendingSearch, isPendingAll]);

  return (
    // UI con filtros y tabla de usuarios
  );
};
```

**Flujo de Datos:**
1. **Usuario escribe** → React Hook Form captura con `watch()`
2. **Valores reactivos** → `useSearchUsers` recibe parámetros
3. **Validación** → Si hay filtros, ejecuta query
4. **TanStack Query** → Llama al servicio y cachea
5. **Servicio** → Petición HTTP al backend
6. **Resultado** → `useMemo` decide qué datos mostrar
7. **Render** → Componente actualiza la tabla

---

### 🎯 Ventajas de esta Arquitectura

#### 🔹 Separación de Responsabilidades
- **Services**: Solo comunicación con API
- **Hooks**: Solo lógica de estado (TanStack Query)
- **Components**: Solo UI
- **Interfaces**: Solo tipos compartidos

#### 🔹 Reutilización
```typescript
// El hook puede reutilizarse en cualquier componente
const { data: activeUsers } = useSearchUsers({ 
  status: "Activo" 
});
```

#### 🔹 Testabilidad
```typescript
// Servicios puros fáciles de testear
test('searchUsers debería buscar por término', async () => {
  const result = await searchUsers("Juan");
  expect(result).toBeInstanceOf(Array);
});
```

#### 🔹 Caché Automático
- TanStack Query cachea resultados
- Query keys únicas por parámetros
- Invalidación selectiva de cache

#### 🔹 TypeScript Estricto
- Interfaces compartidas
- Sin `any`
- Autocompletado completo

---

### 📋 Ejemplo de Uso Completo

```tsx
// En cualquier componente:
import { useSearchUsers } from '@/coquitos-features/users/hooks/useSearchUsers';

const MyComponent = () => {
  const { data: admins, isLoading } = useSearchUsers({
    role: 'Administrador',
    status: 'Activo'
  });

  if (isLoading) return <Spinner />;

  return (
    <div>
      {admins?.map(admin => (
        <UserCard key={admin.id} user={admin} />
      ))}
    </div>
  );
};
```

---

### 🛠️ Patrón Recomendado para Nuevas Features

Al crear nuevas funcionalidades (productos, órdenes, etc.), seguir esta estructura:

```
src/coquitos-features/[feature]/
├── interfaces/        # 1. Definir tipos
├── services/          # 2. Crear servicios de API
├── const/            # 3. Definir query keys
├── hooks/            # 4. Crear hooks de TanStack Query
├── schemas/          # 5. Esquemas de validación (Zod)
├── components/       # 6. Componentes de UI
├── pages/            # 7. Páginas principales
└── store/            # 8. Estado local (Zustand, solo UI)
```

**Orden de implementación:**
1. Interfaces → 2. Servicios → 3. Hooks → 4. Componentes → 5. Páginas

---

## 🚀 Próximas Implementaciones

- [ ] Middleware de autenticación JWT
- [ ] Endpoints de productos y categorías
- [ ] Endpoints de órdenes y ventas
- [ ] Endpoints de caja y cierres
- [ ] Endpoints de reportes
- [ ] WebSockets para notificaciones en tiempo real
- [ ] Rate limiting
- [ ] Logs de auditoría
- [ ] Upload de imágenes (productos, usuarios)

---

## 📞 Soporte

Para dudas o problemas con la API:
- **Repositorio**: [GitHub - Backend Coquito]
- **Desarrollador**: [Tu Nombre]
- **Email**: [Tu Email]

---

**Última actualización**: 12 de Octubre, 2024  
**Versión**: 1.0.0

