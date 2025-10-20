# 🔐 Sistema de Renovación Automática de Tokens

## 📋 Descripción General

Sistema completo de gestión de tokens JWT con detección de inactividad del usuario y renovación automática.

### Características Principales

- ✅ **Renovación Automática**: Renueva el token antes de que expire si el usuario está activo
- ✅ **Detección de Inactividad**: Detecta cuando el usuario no interactúa con la aplicación
- ✅ **Cierre Automático**: Cierra sesión si el usuario está inactivo y el token expira
- ✅ **Logging Detallado**: Logs en consola para debugging y monitoring
- ✅ **UI Debugger**: Componente visual para ver el estado del sistema en desarrollo

---

## 🔧 Configuración

### Tiempos Configurables en `CoquitoApp.tsx`

```typescript
useTokenRefresh({
  renewBeforeExpiry: 5,    // Renovar X minutos antes de expirar (default: 5)
  inactivityTimeout: 10,   // Minutos sin actividad antes de cerrar sesión (default: 10)
  checkInterval: 1,        // Intervalo de verificación en minutos (default: 1)
});
```

### Tiempos del Backend (según API_DOCUMENTATION.md)

- **Access Token**: 1 hora (3600 segundos)
- **Refresh Token**: 7 días (604800 segundos)

---

## 🎯 Flujos de Comportamiento

### Escenario 1: Usuario Trabajando Activamente ✅

```
1. Usuario hace login
   → Recibe accessToken (1h) y refreshToken (7 días)

2. Usuario trabaja normalmente (hace clicks, mueve mouse en la APP)
   → Sistema detecta actividad constante

3. A los 55 minutos (5 min antes de expirar)
   → Sistema detecta: Token por expirar + Usuario ACTIVO
   → 🔄 Renueva automáticamente el token en segundo plano

4. Usuario sigue trabajando sin interrupciones
   → Ciclo se repite indefinidamente
```

**Log esperado:**
```
[TokenRefresh] 🔍 Verificación periódica:
  ⏰ Tiempo restante del token: 4m 30s
  👤 Usuario ✅ ACTIVO
  📊 Estado: authenticated

[TokenRefresh] 🔄 Token por expirar con usuario activo - Renovando proactivamente
[TokenRefresh] 🔄 Renovando token proactivamente...
[TokenRefresh] 🔄 Token renovado exitosamente
```

---

### Escenario 2: Usuario Deja la Aplicación Abierta ⏸️

```
1. Usuario hace login y trabaja por 5 minutos
   → Sistema detecta actividad

2. Usuario se va (deja la ventana abierta, pero va a VS Code / otra app)
   → Pasan 10 minutos sin detectar actividad EN LA VENTANA
   → [UserActivity] ❌ Usuario INACTIVO (10 minutos sin actividad)

3. Token expira (después de 1 hora desde el login)
   → Sistema detecta: Token expirado + Usuario INACTIVO
   → 🚪 Cierra sesión automáticamente
   → Limpia localStorage
   → Muestra toast: "Sesión cerrada por inactividad"
```

**Log esperado:**
```
[UserActivity] ❌ Usuario INACTIVO (10 minutos sin actividad)
[TokenRefresh] Usuario inactivo detectado

[TokenRefresh] 🔍 Verificación periódica:
  ⏰ Tiempo restante del token: Expirado
  👤 Usuario ❌ INACTIVO
  📊 Estado: authenticated

[TokenRefresh] ⚠️ Token expirado
[TokenRefresh] 🚪 Usuario inactivo - Cerrando sesión
```

---

### Escenario 3: Token Expira Durante una Petición 🔄

```
1. Usuario trabajando activamente
2. Token expira justo antes de hacer una petición GET/POST
3. La petición retorna 401 (Unauthorized)
4. Interceptor de Axios captura el error 401
5. Interceptor usa refreshToken para renovar automáticamente
6. Interceptor reintenta la petición original con el nuevo token
7. ✅ Usuario no se entera del proceso
```

**Esto lo maneja `axios.adapter.ts` automáticamente**

---

### Escenario 4: Refresh Token Inválido o Expirado ❌

```
1. Token expira (después de 1 hora)
2. Sistema intenta renovar con refreshToken
3. RefreshToken está expirado (7 días) o inválido
4. Backend retorna 401 en /auth/refresh-token
5. 🚪 Cierra sesión inmediatamente
6. Redirige a /login
7. Usuario debe iniciar sesión nuevamente
```

---

## 🧪 Cómo Probar el Sistema

### Opción 1: Reducir Tiempos para Testing Rápido

**En `CoquitoApp.tsx`** (solo para testing):

```typescript
useTokenRefresh({
  renewBeforeExpiry: 0.5,   // 30 segundos antes de expirar
  inactivityTimeout: 1,     // 1 minuto de inactividad
  checkInterval: 0.25,      // Verificar cada 15 segundos
});
```

### Opción 2: Ver Logs en la Consola

1. Abre la aplicación en el navegador
2. Abre DevTools (F12)
3. Ve a la pestaña "Console"
4. Busca logs que empiecen con `[UserActivity]` y `[TokenRefresh]`

### Opción 3: Usar el Debugger Visual

El componente `<TokenDebugger />` se muestra automáticamente en la esquina inferior derecha en modo desarrollo:

- 🔐 **Token Debugger**
  - Token expira en: `✅ 58m 30s` (verde si más de 5 min, amarillo si menos de 5 min, rojo si menos de 1 min)
  - Estado: `authenticated`
  - Última actividad: `14:30:45`
  - 💡 Solo detecta actividad EN esta ventana

---

## 🐛 Troubleshooting

### No veo logs en la consola

**Causa**: El sistema solo genera logs si estás autenticado.

**Solución**: 
1. Haz login primero
2. Espera 1 minuto (es el intervalo de verificación por defecto)
3. Deberías ver logs como:
   ```
   [UserActivity] 🎯 Sistema de detección de actividad iniciado
   [TokenRefresh] 🔍 Verificación periódica: ...
   ```

### El sistema no detecta que estoy inactivo

**Causa**: Estás moviendo el mouse DENTRO de la ventana de la aplicación.

**Solución**: Para simular inactividad:
1. Mueve el mouse FUERA de la ventana (a VS Code, por ejemplo)
2. No toques el teclado
3. Espera el tiempo configurado de inactividad (default: 10 minutos)
4. Verás el log: `[UserActivity] ❌ Usuario INACTIVO`

### El token no se renueva automáticamente

**Causa**: El token aún tiene mucho tiempo de vida.

**Solución**:
- El sistema solo renueva cuando faltan `renewBeforeExpiry` minutos (default: 5)
- Si el token tiene 30 minutos restantes, esperará hasta que falten 5 minutos
- Para testing, reduce `renewBeforeExpiry` a 0.5 minutos

---

## 📊 Logs Disponibles

### Logs de Actividad del Usuario

```typescript
[UserActivity] 🎯 Sistema de detección de actividad iniciado
[UserActivity] ℹ️ Solo detecta actividad DENTRO de la ventana del navegador
[UserActivity] ⏱️ Tiempo de inactividad configurado: 10 minutos
[UserActivity] ✅ Usuario ACTIVO nuevamente
[UserActivity] ❌ Usuario INACTIVO (10 minutos sin actividad)
```

### Logs de Gestión de Tokens

```typescript
// Verificación periódica (cada 1 minuto por defecto)
[TokenRefresh] 🔍 Verificación periódica:
  ⏰ Tiempo restante del token: 58m 30s
  👤 Usuario ✅ ACTIVO
  📊 Estado: authenticated

// Token válido
[TokenRefresh] ✅ Token válido por 58m 30s más

// Token por expirar con usuario activo
[TokenRefresh] 🔄 Token por expirar con usuario activo - Renovando proactivamente
[TokenRefresh] 🔄 Renovando token proactivamente...
[TokenRefresh] 🔄 Token renovado exitosamente

// Token por expirar con usuario inactivo
[TokenRefresh] ⏳ Token por expirar (3m 30s) pero usuario INACTIVO - No se renovará

// Token expirado
[TokenRefresh] ⚠️ Token expirado
[TokenRefresh] 🚪 Usuario inactivo - Cerrando sesión

// No autenticado
[TokenRefresh] ⏸️ No autenticado - Sistema en espera
```

---

## 🎯 Eventos que Detectan Actividad

El sistema escucha estos eventos **SOLO en la ventana del navegador de la aplicación**:

- `mousedown` - Click del mouse
- `mousemove` - Movimiento del mouse
- `keypress` - Tecla presionada
- `scroll` - Scroll de página
- `touchstart` - Touch en dispositivos móviles
- `click` - Click general

**⚠️ IMPORTANTE**: Si el mouse está en VS Code, en otra ventana, o fuera del navegador, **NO** se detecta actividad.

---

## 🔒 Consideraciones de Seguridad

1. **Tokens en localStorage**: 
   - Los tokens se guardan en `localStorage` con Zustand persist
   - Se limpian automáticamente al cerrar sesión
   - Se limpian si el refresh token es inválido

2. **Renovación Proactiva**:
   - Solo se renueva si el usuario está activo
   - Evita renovar tokens de usuarios que abandonaron la aplicación

3. **Inactividad**:
   - Si el usuario está inactivo y el token expira, se cierra sesión
   - Previene sesiones abiertas indefinidamente

4. **Interceptor de Axios**:
   - Maneja automáticamente errores 401
   - Cola de peticiones durante la renovación
   - Limpia todo y redirige si el refresh falla

---

## 🚀 Para Producción

### Remover el Debugger Visual

El componente `<TokenDebugger />` solo se muestra en desarrollo gracias a:

```typescript
{import.meta.env.DEV && <TokenDebugger />}
```

En producción (`npm run build`), **NO** se incluirá en el bundle.

### Configuración Recomendada

```typescript
useTokenRefresh({
  renewBeforeExpiry: 5,    // 5 minutos antes
  inactivityTimeout: 15,   // 15 minutos de inactividad
  checkInterval: 1,        // Verificar cada 1 minuto
});
```

---

## 📝 Resumen de Archivos Modificados

1. **`src/hooks/useUserActivity.ts`** - Detecta actividad del usuario
2. **`src/hooks/useTokenRefresh.ts`** - Coordina renovación de tokens
3. **`src/hooks/index.ts`** - Exporta los hooks
4. **`src/auth/interface/auth-store.interface.ts`** - Interfaces actualizadas
5. **`src/auth/store/auth.store.ts`** - Store con accessToken y refreshToken
6. **`src/auth/services/auth.service.ts`** - Servicio de refresh token
7. **`src/config/axios.adapter.ts`** - Interceptor de renovación automática
8. **`src/components/TokenDebugger.tsx`** - Debugger visual (desarrollo)
9. **`src/CoquitoApp.tsx`** - Integración del sistema

---

## 🎉 Resultado Final

Tu aplicación ahora:

- ✅ Renueva tokens automáticamente cuando el usuario está activo
- ✅ Cierra sesión cuando el usuario está inactivo y el token expira
- ✅ Maneja múltiples peticiones simultáneas correctamente
- ✅ Proporciona logs detallados para debugging
- ✅ Incluye debugger visual para desarrollo
- ✅ Cumple con las mejores prácticas de seguridad

El usuario puede trabajar durante horas sin interrupciones, pero si se va y deja la aplicación abierta, se cerrará sesión automáticamente por seguridad. 🔒

