# 🔐 Sistema de Renovación Automática de Tokens

## 📋 Descripción General

Sistema completo de gestión de tokens JWT con detección de inactividad del usuario y renovación automática.

### Características Principales

- ✅ **Renovación Automática**: Renueva el token antes de que expire si el usuario está activo
- ✅ **Detección de Inactividad**: Detecta cuando el usuario no interactúa con la aplicación
- ✅ **Cierre Automático Inteligente**: Cierra sesión si el usuario está inactivo y el token expira
- ✅ **Verificación al Iniciar**: Verifica si el token está expirado al recargar la página
- ✅ **Cierre Programado**: Programa el cierre de sesión exacto cuando el token expira durante inactividad
- ✅ **Cancelación de Cierre**: Cancela el cierre programado si el usuario se reactiva
- ✅ **Logging Detallado**: Logs en consola para debugging y monitoring
- ✅ **UI Debugger**: Componente visual para ver el estado del sistema en desarrollo

### ✨ Mejoras Recientes (Octubre 2025)

1. **Verificación de Token Expirado al Rehidratar**
   - Ahora al recargar la página, el sistema verifica inmediatamente si el token en localStorage está expirado
   - Si está expirado, cierra sesión automáticamente ANTES de que el usuario vea la aplicación
   - Implementado en `auth.store.ts` en la función `onRehydrateStorage`

2. **Cierre de Sesión Programado con Precisión**
   - Cuando el usuario se vuelve inactivo, el sistema programa un timer para cerrar sesión EXACTAMENTE cuando el token expire
   - Ya no depende solo de la verificación periódica (cada 1 minuto)
   - El cierre ocurre en el momento exacto de expiración, no hasta 1 minuto después

3. **Cancelación Inteligente de Cierre Programado**
   - Si el usuario se reactiva antes de que expire el token, el sistema cancela el cierre programado automáticamente
   - El usuario puede continuar trabajando normalmente y el token se renovará cuando esté por expirar

4. **Cierre Inmediato con Token Expirado**
   - Si la verificación periódica detecta un token expirado, cierra sesión INMEDIATAMENTE
   - Ya no espera a que el usuario esté inactivo para cerrar sesión
   - Comportamiento más estricto y seguro

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
   → Sistema programa cierre de sesión automático para cuando el token expire

3. Token expira (después de 1 hora desde el login)
   → El timer programado ejecuta el cierre de sesión automáticamente
   → 🚪 Cierra sesión automáticamente
   → Limpia localStorage
   → Muestra toast: "Sesión cerrada por inactividad y expiración del token"
```

**Log esperado:**
```
[UserActivity] ❌ Usuario INACTIVO (10 minutos sin actividad)
[TokenRefresh] ⚠️ Usuario inactivo detectado
[TokenRefresh] ⏰ Usuario inactivo - Programando cierre de sesión en 50m 30s

... (tiempo pasa) ...

[TokenRefresh] 🚪 Token expirado durante inactividad - Cerrando sesión
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

### Escenario 4: Usuario Recarga la Página con Token Expirado 🔄

```
1. Usuario hace login y deja la aplicación abierta
2. Pasan varios días sin que el usuario use la aplicación
3. Usuario recarga la página (F5)
4. Sistema rehidrata el estado desde localStorage
5. Sistema detecta que el token está expirado
   → 🚪 Cierra sesión automáticamente
   → Limpia localStorage
   → Redirige a /login
   → Muestra toast: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
```

**Log esperado:**
```
[AuthStore] ⚠️ Token expirado detectado al iniciar - Limpiando sesión
```

**✨ Nuevo comportamiento mejorado**: Ahora al recargar la página, el sistema verifica inmediatamente si el token está expirado y cierra la sesión antes de que el usuario pueda ver la aplicación.

---

### Escenario 5: Usuario Inactivo se Reactiva Antes de que Expire el Token ✅

```
1. Usuario hace login y trabaja por 5 minutos
   → Sistema detecta actividad

2. Usuario se va (deja la ventana abierta, pero va a VS Code / otra app)
   → Pasan 10 minutos sin detectar actividad EN LA VENTANA
   → [UserActivity] ❌ Usuario INACTIVO (10 minutos sin actividad)
   → Sistema programa cierre de sesión para cuando el token expire (en 45 minutos)

3. Usuario regresa a la aplicación después de 20 minutos
   → Usuario mueve el mouse en la ventana de la aplicación
   → [UserActivity] ✅ Usuario ACTIVO nuevamente
   → Sistema cancela el cierre de sesión programado
   → Sistema detecta que el token está por expirar (faltan 25 minutos)
   
4. A los 55 minutos (5 min antes de expirar el token)
   → Sistema detecta: Token por expirar + Usuario ACTIVO
   → 🔄 Renueva automáticamente el token en segundo plano
   
5. Usuario sigue trabajando sin interrupciones
```

**Log esperado:**
```
[UserActivity] ❌ Usuario INACTIVO (10 minutos sin actividad)
[TokenRefresh] ⚠️ Usuario inactivo detectado
[TokenRefresh] ⏰ Usuario inactivo - Programando cierre de sesión en 45m 30s

... (usuario mueve el mouse 20 minutos después) ...

[TokenRefresh] ✅ Usuario activo nuevamente
[TokenRefresh] ❌ Cancelando cierre de sesión programado

... (pasa el tiempo) ...

[TokenRefresh] 🔄 Token por expirar con usuario activo - Renovando proactivamente
```

---

### Escenario 6: Refresh Token Inválido o Expirado ❌

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

// Usuario se vuelve inactivo
[TokenRefresh] ⚠️ Usuario inactivo detectado
[TokenRefresh] ⏰ Usuario inactivo - Programando cierre de sesión en 45m 30s

// Usuario se reactiva antes de que expire el token
[TokenRefresh] ✅ Usuario activo nuevamente
[TokenRefresh] ❌ Cancelando cierre de sesión programado

// Token expira durante inactividad
[TokenRefresh] 🚪 Token expirado durante inactividad - Cerrando sesión

// Token expirado detectado en verificación periódica
[TokenRefresh] ⚠️ Token expirado
[TokenRefresh] 🚪 Token expirado - Cerrando sesión automáticamente

// No autenticado
[TokenRefresh] ⏸️ No autenticado - Sistema en espera
```

### Logs del Auth Store

```typescript
// Token expirado al recargar la página
[AuthStore] ⚠️ Token expirado detectado al iniciar - Limpiando sesión

// Sesión restaurada exitosamente
[AuthStore] ✅ Sesión restaurada exitosamente

// Error al verificar token
[AuthStore] ❌ Error al verificar token: [error details]
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

### Archivos Principales del Sistema

1. **`src/hooks/useUserActivity.ts`** - Detecta actividad del usuario (mouse, teclado, touch, etc.)
2. **`src/hooks/useTokenRefresh.ts`** - Coordina renovación de tokens y cierre automático
   - ✨ **Mejorado**: Ahora programa cierre de sesión preciso durante inactividad
   - ✨ **Mejorado**: Cancela cierre programado si el usuario se reactiva
   - ✨ **Mejorado**: Cierra sesión inmediatamente si detecta token expirado
3. **`src/hooks/index.ts`** - Exporta los hooks
4. **`src/auth/interface/auth-store.interface.ts`** - Interfaces actualizadas
5. **`src/auth/store/auth.store.ts`** - Store con accessToken y refreshToken
   - ✨ **Mejorado**: Verifica token expirado al rehidratar desde localStorage
   - ✨ **Mejorado**: Cierra sesión automáticamente al recargar si el token expiró
6. **`src/auth/services/auth.service.ts`** - Servicio de refresh token
7. **`src/config/axios.adapter.ts`** - Interceptor de renovación automática
8. **`src/components/TokenDebugger.tsx`** - Debugger visual (desarrollo)
9. **`src/CoquitoApp.tsx`** - Integración del sistema

---

## 🎉 Resultado Final

Tu aplicación ahora:

- ✅ **Renueva tokens automáticamente** cuando el usuario está activo
- ✅ **Cierra sesión inmediatamente** al detectar token expirado
- ✅ **Verifica token al iniciar** - Si recargas la página con token expirado, cierra sesión automáticamente
- ✅ **Programa cierre preciso** - Cuando estás inactivo, programa el cierre exacto cuando el token expire
- ✅ **Cancela cierre inteligentemente** - Si te reactivas, cancela el cierre programado
- ✅ **Maneja múltiples peticiones** simultáneas correctamente con el interceptor de Axios
- ✅ **Proporciona logs detallados** para debugging y monitoring
- ✅ **Incluye debugger visual** para desarrollo
- ✅ **Cumple con mejores prácticas** de seguridad

### 💡 Comportamiento Final

**Escenario típico de uso:**
1. Inicias sesión → Token válido por 1 hora
2. Trabajas activamente → Token se renueva automáticamente cada ~55 minutos
3. **Puedes trabajar durante HORAS sin interrupciones** ✅

**Escenario de inactividad:**
1. Dejas la aplicación abierta y te vas
2. A los 10 minutos → Sistema detecta inactividad y programa cierre para cuando expire el token
3. Cuando el token expira → Cierra sesión automáticamente 🔒
4. Si regresas antes de que expire → Sistema cancela el cierre y continúas trabajando ✅

**Escenario de recarga con token expirado:**
1. Dejas la aplicación abierta por varios días
2. Recargas la página (F5)
3. Sistema detecta token expirado → Cierra sesión INMEDIATAMENTE antes de mostrar la app 🔒
4. Redirige a login → Debes iniciar sesión nuevamente

**Resultado**: Sistema robusto, seguro e inteligente que protege las sesiones pero no interrumpe el trabajo activo. 🚀

