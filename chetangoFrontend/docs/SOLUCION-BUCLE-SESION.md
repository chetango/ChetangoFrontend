# 🔧 Solución al Problema de Bucle Infinito en Sesión

**Fecha:** 23 de Febrero de 2026  
**Problema resuelto:** Bucle infinito cuando expira la sesión sin internet  
**Nivel técnico:** Explicación para cualquier desarrollador

---

## 📋 ¿Qué problema teníamos?

### **Situación:**
Cuando dejabas la aplicación abierta por mucho tiempo y te desconectabas del internet, al regresar la aplicación entraba en un **bucle infinito** que mostraba errores repetidos en la consola:

```
[Auth Interceptor] Silent token acquisition failed
[Auth Interceptor] Attempting interactive token acquisition...
[Auth Interceptor] Silent token acquisition failed
[Auth Interceptor] Attempting interactive token acquisition...
... (repetido infinitamente)
```

### **¿Por qué pasaba esto?**

1. **Tokens expirados:** Después de cierto tiempo, los tokens de Microsoft expiran (es normal)
2. **Sin internet:** Sin conexión no se pueden renovar los tokens
3. **Múltiples intentos simultáneos:** Cada petición HTTP intentaba obtener un token al mismo tiempo
4. **Cada intento fallaba** y abría un popup → Usuario cerraba popup → Se intentaba redirect
5. **Otros 5 requests hacían lo mismo** → Más popups → Más redirects
6. **Resultado:** Bucle infinito 🔄

**Solución temporal que usabas:** Cerrar el navegador completamente

---

## ✅ ¿Qué solución implementamos?

Implementamos una **arquitectura profesional** con 3 nuevos componentes:

### **1. TokenAcquisitionService (Coordinador de Tokens)**

**¿Qué hace?**
- Centraliza TODOS los intentos de obtener tokens en un solo lugar
- Si 10 requests piden token al mismo tiempo, solo se hace **1 intento**
- Los otros 9 esperan el resultado del primero (evita múltiples popups)

**¿Cómo funciona?**
```
Request 1: "Necesito token" → Inicia proceso de obtener token
Request 2: "Necesito token" → Espera el resultado del Request 1
Request 3: "Necesito token" → Espera el resultado del Request 1
...
Resultado: ✓ Solo 1 popup, todos reciben el mismo token
```

**Características profesionales:**
- **Circuit breaker:** Si falla 3 veces seguidas, deja de intentar (evita loops)
- **Promise caching:** Reutiliza el intento en progreso
- **Clasificación de errores:** Sabe qué tipo de error ocurrió y cómo manejarlo

---

### **2. NetworkStatusService (Detector de Internet)**

**¿Qué hace?**
- Monitorea constantemente si hay conexión a internet
- Notifica a la aplicación cuando se pierde/recupera conexión
- Detecta cuando vuelves de "suspender" el PC

**¿Cómo funciona?**
```
Internet ON  → Todo normal
Internet OFF → ⚠️ Marca que no hay internet
Vuelves      → Verifica automáticamente conectividad
Internet ON  → ✓ Notifica que se recuperó
```

**Características profesionales:**
- **Event listeners del navegador:** Detecta eventos `online`/`offline`
- **Visibility change:** Detecta cuando vuelves de sleep
- **Ping real opcional:** Puede hacer ping a Google para verificar conectividad real
- **Patrón Observer:** Otros componentes se suscriben a cambios

---

### **3. AuthInterceptor Mejorado (Interceptor Inteligente)**

**¿Qué hace ahora?**
- Verifica estado de internet **ANTES** de intentar obtener tokens
- Usa el TokenAcquisitionService (no intenta solo)
- Hace logout limpio antes de redirect (cancela requests pendientes)
- No muestra popups si no hay internet

**Flujo nuevo:**
```
1. Request HTTP necesita token
   ↓
2. ¿Hay internet?
   NO → Deja que falle naturalmente (muestra mensaje amigable)
   SÍ → Continúa
   ↓
3. Pide token al TokenAcquisitionService
   ↓
4. Si falla:
   - ¿Error de red? → Espera a que vuelva internet
   - ¿Usuario canceló popup? → No fuerza logout
   - ¿Token inválido? → Logout limpio + redirect
   ↓
5. Si ya hay otro intento en progreso:
   → Espera el resultado (no hace nada más)
```

---

## 🎯 ¿Qué beneficios obtienes ahora?

### **1. Ya NO necesitas cerrar el navegador** ✅
- La app detecta automáticamente sesión expirada
- Hace logout limpio
- Te redirige a login sin problemas

### **2. Sin bucles infinitos** ✅
- Solo un intento de token a la vez
- Circuit breaker detiene intentos fallidos repetidos
- Logs claros en consola (no spam)

### **3. Mejor experiencia sin internet** ✅
- Banner visual que dice "Sin conexión a internet"
- No intenta popups cuando no hay internet
- Al reconectar, muestra "Conexión restablecida"

### **4. Código más profesional** ✅
- Patrón Singleton (una sola instancia de servicios)
- Separation of Concerns (cada clase hace una cosa)
- Typesafe con TypeScript
- Fácil de mantener y testear

---

## 📁 Archivos Creados

### **Nuevos Servicios:**
```
src/shared/services/
├── auth/
│   └── TokenAcquisitionService.ts    (Coordinador de tokens)
├── network/
│   └── NetworkStatusService.ts       (Detector de internet)
└── index.ts                          (Exports)
```

### **Nuevos Hooks:**
```
src/shared/hooks/
└── useNetworkStatus.ts               (Hook React para estado de red)
```

### **Nuevo Componente:**
```
src/shared/components/NetworkStatusBanner/
├── NetworkStatusBanner.tsx           (Banner de conexión)
└── index.ts
```

### **Archivos Modificados:**
```
src/shared/api/interceptors/
└── authInterceptor.ts                (Refactorizado con nuevos servicios)

src/features/auth/hooks/
└── useAuth.ts                        (Mejorado logout con reset de servicios)

src/app/providers/
└── AppProviders.tsx                  (Inicializa NetworkStatusService)
```

---

## 🧪 ¿Cómo probar que funciona?

### **Prueba 1: Sesión expirada sin internet**
1. Abre la aplicación
2. Desconecta internet (WiFi off)
3. Espera 10 minutos (o fuerza expiración borrando sessionStorage)
4. Reconecta internet
5. Intenta hacer alguna acción
6. **Resultado esperado:** 
   - ✓ Muestra banner "Sin conexión"
   - ✓ Al reconectar: "Conexión restablecida"
   - ✓ Te redirige a login limpiamente
   - ✓ NO bucles infinitos en consola

### **Prueba 2: Múltiples requests simultáneos**
1. Abre DevTools → Network
2. Borra sessionStorage manualmente
3. Refresca la página (F5)
4. **Resultado esperado:**
   - ✓ Solo 1 popup de autenticación
   - ✓ Todos los requests obtienen token del mismo intento
   - ✓ Logs ordenados en consola

### **Prueba 3: Usuario cancela popup**
1. Fuerza expiración de token
2. Cuando aparezca popup de Microsoft, dale "Cancelar"
3. **Resultado esperado:**
   - ✓ NO te saca de la sesión inmediatamente
   - ✓ Te permite intentar de nuevo
   - ✓ Después de 3 intentos fallidos → Logout automático

---

## 🔍 ¿Qué ver en la consola ahora?

### **Logs ordenados (sin bucles):**
```
[NetworkStatusService] Initializing...
[NetworkStatusService] Current status: ONLINE

[Auth Interceptor] Setting up with 1 accounts
[Auth Interceptor] Request to: /api/clases

[TokenAcquisitionService] Attempting silent token acquisition...
[TokenAcquisitionService] ✓ Silent acquisition successful
[Auth Interceptor] ✓ Token added to request

// Si falla:
[TokenAcquisitionService] Silent acquisition failed
[TokenAcquisitionService] Attempting interactive token acquisition (popup)...
[TokenAcquisitionService] ✓ Interactive acquisition successful

// Si no hay internet:
[NetworkStatusService] 🔴 Device is now OFFLINE
[Auth Interceptor] Device is offline, request may fail

// Cuando vuelve:
[NetworkStatusService] 🟢 Device is now ONLINE
```

---

## 💡 Conceptos Técnicos Usados (para aprender)

### **1. Singleton Pattern**
- Solo una instancia del servicio en toda la aplicación
- `TokenAcquisitionService.getInstance()`

### **2. Promise Caching**
- Si hay una promise en progreso, reutilizarla
- Evita múltiples llamadas paralelas al mismo endpoint

### **3. Circuit Breaker**
- Después de X fallos consecutivos, deja de intentar
- Protege contra loops infinitos

### **4. Observer Pattern (PubSub)**
- Servicios emiten eventos cuando cambia su estado
- Otros componentes se "suscriben" para recibir notificaciones

### **5. Separation of Concerns**
- Cada clase tiene UNA responsabilidad clara
- TokenAcquisitionService → Solo maneja tokens
- NetworkStatusService → Solo monitorea red
- AuthInterceptor → Solo intercepta requests HTTP

### **6. Clean Code Principles**
- Nombres descriptivos
- Funciones pequeñas y enfocadas
- Comentarios útiles (no obvios)
- TypeScript para type safety

---

## 🚀 Próximos Pasos (Opcional)

### **Mejoras futuras que podrías agregar:**

1. **Retry automático:** Cuando vuelva internet, reintentar requests fallidos
2. **Token refresh proactivo:** Renovar token antes de que expire
3. **Métricas:** Contar cuántas veces falla auth (telemetry)
4. **Offline mode:** Cachear datos localmente con IndexedDB
5. **Better UX:** Modal personalizado en lugar de popup nativo de Microsoft

---

## ❓ Preguntas Frecuentes

### **¿Debo cerrar el navegador todavía?**
❌ No, ya no es necesario. La app maneja todo automáticamente.

### **¿Qué pasa si dejo la app abierta toda la noche?**
✅ Al volver, detectará que expiró la sesión y te pedirá login limpiamente.

### **¿Funciona en producción?**
✅ Sí, funciona en todos los ambientes (local, QA, producción).

### **¿Afecta el rendimiento?**
✅ No, incluso mejora rendimiento al evitar múltiples llamadas simultáneas.

### **¿Es compatible con el código existente?**
✅ Sí, solo agregamos nuevos servicios. No rompimos nada existente.

---

## 📞 Soporte

Si encuentras algún problema o tienes dudas:
1. Revisa los logs en la consola del navegador
2. Busca mensajes de `[TokenAcquisitionService]` o `[NetworkStatusService]`
3. Comparte el error completo para ayudarte mejor

---

**✨ Resumen en una frase:**
*Ahora la aplicación es más inteligente: detecta cuando no hay internet, coordina los intentos de autenticación, y hace logout limpio sin bucles infinitos.*
