# 🚀 Cómo Usar y Probar el Sistema de Tokens

## ✅ Mejoras Aplicadas

He optimizado el sistema para eliminar re-renders innecesarios y mejorar los logs:

1. ✅ **Logs solo se muestran UNA vez al inicio** (no se duplican)
2. ✅ **Verificaciones cada 1 minuto** (no cada segundo)
3. ✅ **Hooks optimizados** (no se reinician constantemente)
4. ✅ **Debugger visual en pantalla** (esquina inferior derecha)

---

## 📊 Logs que Verás Ahora

### Al Iniciar Sesión (Solo UNA vez):

```
[UserActivity] 🎯 Sistema de detección de actividad iniciado
[UserActivity] ℹ️ Solo detecta actividad DENTRO de la ventana del navegador
[UserActivity] ⏱️ Tiempo de inactividad configurado: 10 minutos

[TokenRefresh] 🚀 Sistema de renovación automática iniciado
[TokenRefresh] ⚙️ Configuración:
  - Renovar 5 minutos antes de expirar
  - Inactividad después de 10 minutos
  - Verificación cada 1 minuto(s)
```

### Cada 1 Minuto (Verificación Periódica):

```
[TokenRefresh] 🔍 Verificación periódica:
  ⏰ Tiempo restante del token: 41m 28s
  👤 Usuario ✅ ACTIVO
  📊 Estado: authenticated
[TokenRefresh] ✅ Token válido por 41m 28s más
```

---

## 🎯 Cómo Probar el Sistema

### 1. **Ver el Debugger Visual** 👁️

En la esquina inferior derecha de tu pantalla verás un panel negro con:

```
🔐 Token Debugger
Token expira en: ✅ 58m 30s
Estado: authenticated
Última actividad: 14:30:45
💡 Solo detecta actividad EN esta ventana
```

**Colores:**
- Verde (✅): Más de 5 minutos restantes
- Amarillo (⚠️): Menos de 5 minutos restantes
- Rojo (🔴): Menos de 1 minuto restante

---

### 2. **Probar Detección de Actividad** 🖱️

**Para que el sistema te considere ACTIVO:**
1. Mueve el mouse **DENTRO** de la ventana del navegador
2. Haz click en cualquier parte
3. Usa el scroll
4. Presiona teclas

**Para que el sistema te considere INACTIVO:**
1. Mueve el mouse **FUERA** de la ventana (a VS Code, otra app, etc.)
2. No toques nada dentro del navegador
3. Espera 10 minutos
4. Verás el log: `[UserActivity] ❌ Usuario INACTIVO (10 minutos sin actividad)`

---

### 3. **Probar Renovación Automática** 🔄

**Opción A: Esperar 55 minutos (No recomendado)**

**Opción B: Testing Rápido (Recomendado)**

Edita temporalmente `CoquitoApp.tsx`:

```typescript
useTokenRefresh({
  renewBeforeExpiry: 0.5,   // ⚡ 30 segundos antes de expirar
  inactivityTimeout: 1,     // ⚡ 1 minuto de inactividad
  checkInterval: 0.25,      // ⚡ Verificar cada 15 segundos
});
```

**Ahora:**
1. Haz login
2. Tu token expira en 1 hora
3. En 59.5 minutos, el sistema intentará renovar
4. Si estás moviendo el mouse (ACTIVO) → Renovará automáticamente
5. Si no has tocado nada en 1 minuto (INACTIVO) → NO renovará

**Logs esperados (cuando renueve):**
```
[TokenRefresh] 🔄 Token por expirar con usuario activo - Renovando proactivamente
[TokenRefresh] 🔄 Renovando token proactivamente...
[TokenRefresh] 🔄 Token renovado exitosamente
```

---

### 4. **Probar Cierre por Inactividad** 🚪

1. Haz login
2. Deja la ventana abierta
3. Mueve el mouse FUERA del navegador (a VS Code, por ejemplo)
4. Espera 10 minutos (o 1 minuto si usaste la configuración de testing)
5. Espera a que el token expire (1 hora)

**Logs esperados:**
```
[UserActivity] ❌ Usuario INACTIVO (10 minutos sin actividad)
[TokenRefresh] ⚠️ Usuario inactivo detectado

[TokenRefresh] 🔍 Verificación periódica:
  ⏰ Tiempo restante del token: Expirado
  👤 Usuario ❌ INACTIVO
  📊 Estado: authenticated

[TokenRefresh] ⚠️ Token expirado
[TokenRefresh] 🚪 Usuario inactivo - Cerrando sesión
```

**Resultado:** 
- Se limpia el localStorage
- Te redirige a `/login`
- Ves un toast: "Sesión cerrada por inactividad"

---

## 🐛 Solución de Problemas

### "No veo el debugger visual"

**Causa:** Solo aparece cuando estás autenticado.

**Solución:** Haz login primero.

---

### "No veo logs en la consola"

**Causa 1:** No estás autenticado.
**Solución:** Haz login.

**Causa 2:** Los logs aparecen cada 1 minuto.
**Solución:** Espera 1 minuto o cambia `checkInterval: 0.25` para ver logs cada 15 segundos.

---

### "El sistema me marca como ACTIVO pero estoy en VS Code"

**Causa:** Moviste el mouse dentro del navegador recientemente (en los últimos 10 minutos).

**Solución:** 
- Los 10 minutos se cuentan desde tu **última** actividad EN EL NAVEGADOR
- Si hiciste scroll hace 3 minutos, el sistema te considera activo por 7 minutos más
- Espera 10 minutos completos SIN tocar el navegador

---

### "Los logs se duplican"

**Causa:** Hot reload de Vite está reiniciando los hooks.

**Solución:** Es normal en desarrollo. Recarga la página completa (F5).

---

## 📝 Configuración Recomendada por Escenario

### Para Desarrollo y Testing:
```typescript
useTokenRefresh({
  renewBeforeExpiry: 0.5,   // 30 segundos antes
  inactivityTimeout: 1,     // 1 minuto inactivo
  checkInterval: 0.25,      // Verificar cada 15s
});
```

### Para Producción:
```typescript
useTokenRefresh({
  renewBeforeExpiry: 5,     // 5 minutos antes
  inactivityTimeout: 15,    // 15 minutos inactivo
  checkInterval: 1,         // Verificar cada 1 minuto
});
```

### Para Testing Intensivo:
```typescript
useTokenRefresh({
  renewBeforeExpiry: 0.1,   // 6 segundos antes
  inactivityTimeout: 0.5,   // 30 segundos inactivo
  checkInterval: 0.1,       // Verificar cada 6s
});
```

---

## 🎬 Escenario de Prueba Completo

### Prueba 1: Usuario Activo (5 minutos)

1. Haz login
2. Trabaja normalmente (haz clicks, scroll, etc.)
3. Observa el debugger visual: `Última actividad` se actualiza constantemente
4. Observa los logs cada 1 minuto: `👤 Usuario ✅ ACTIVO`
5. **Resultado:** El sistema no cierra tu sesión

---

### Prueba 2: Usuario Inactivo (15 minutos)

1. Haz login
2. Trabaja por 2 minutos
3. Deja el navegador y ve a VS Code
4. Espera 10 minutos sin tocar el navegador
5. Verás: `[UserActivity] ❌ Usuario INACTIVO`
6. Espera otros 5 minutos más (total 15 minutos)
7. Observa el debugger: `Última actividad: 14:30:45` (ya no cambia)
8. Después de 1 hora total, se cierra la sesión
9. **Resultado:** `🚪 Usuario inactivo - Cerrando sesión`

---

### Prueba 3: Token Expira Durante Petición

1. Haz login
2. Espera 59 minutos (o simula con configuración de testing)
3. Haz una petición (carga usuarios, productos, etc.)
4. Si el token expiró justo durante la petición
5. El interceptor de Axios lo maneja automáticamente
6. La petición se completa sin errores
7. **Resultado:** No ves nada, todo funciona transparente

---

## ✅ Lista de Verificación

- [ ] Hice login y veo el debugger visual
- [ ] Los logs iniciales aparecieron UNA sola vez
- [ ] Los logs de verificación aparecen cada 1 minuto
- [ ] Puedo ver el tiempo restante del token actualizándose
- [ ] Cuando muevo el mouse EN el navegador, dice "ACTIVO"
- [ ] Cuando dejo de usar el navegador por 10 min, dice "INACTIVO"
- [ ] El debugger muestra mi última actividad correctamente
- [ ] No veo logs duplicados constantemente

---

## 🎉 Todo Está Funcionando Si...

1. ✅ Ves el debugger visual en la esquina
2. ✅ Los logs aparecen organizados (no spam)
3. ✅ El tiempo del token disminuye cada segundo en el debugger
4. ✅ Puedes trabajar horas sin que te cierre sesión
5. ✅ Si te vas, la sesión se cierra automáticamente

---

## 📞 Dudas Frecuentes

**P: ¿Por qué solo detecta actividad EN la ventana del navegador?**
**R:** Por seguridad de JavaScript. El navegador no puede detectar lo que haces fuera de él.

**P: ¿Puedo cambiar los tiempos?**
**R:** Sí, edita los valores en `CoquitoApp.tsx`.

**P: ¿El debugger visual aparece en producción?**
**R:** No, solo en desarrollo. Se elimina automáticamente al hacer `npm run build`.

**P: ¿Qué pasa si mi internet falla durante la renovación?**
**R:** El sistema reintentará en la próxima petición. Si falla completamente, cierra sesión.

**P: ¿Puedo desactivar los logs en producción?**
**R:** Los logs no aparecen en la consola de producción si usas `console.log`. Si quieres estar 100% seguro, envuelve los logs en `if (import.meta.env.DEV) { console.log(...) }`.

---

¡Listo! Ahora tienes un sistema completo de gestión de tokens funcionando correctamente. 🎉

