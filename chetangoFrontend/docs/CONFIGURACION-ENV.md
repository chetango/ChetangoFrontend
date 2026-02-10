# Configuración de Variables de Entorno (.env)

## ⚠️ IMPORTANTE: Configuración de `VITE_API_BASE_URL`

### El Problema (26 de enero 2026)

Se detectó que el archivo `.env` tenía configurada la variable `VITE_API_BASE_URL` con el path `/api` incluido:

```env
# ❌ INCORRECTO
VITE_API_BASE_URL=https://localhost:7194/api
```

Esto causaba **duplicación de rutas** porque todas las llamadas HTTP en el código ya incluyen el prefijo `/api/`:

```typescript
// Ejemplo en dashboardQueries.ts
httpClient.get('/api/reportes/dashboard')  // ← Ya incluye /api

// Con baseURL mal configurado resultaba en:
// https://localhost:7194/api/api/reportes/dashboard ❌
```

**Error HTTP resultante:** `404 Not Found`

### La Solución

El `VITE_API_BASE_URL` debe configurarse **SIN** el path `/api`:

```env
# ✅ CORRECTO
VITE_API_BASE_URL=https://localhost:7194
```

De esta forma, las rutas se construyen correctamente:

```typescript
// baseURL = https://localhost:7194
httpClient.get('/api/reportes/dashboard')

// Resultado final:
// https://localhost:7194/api/reportes/dashboard ✅
```

### Regla General

**TODAS las rutas en el código frontend deben incluir el prefijo `/api/`:**

```typescript
// ✅ Ejemplos correctos
httpClient.get('/api/alumnos')
httpClient.get('/api/paquetes')
httpClient.get('/api/pagos')
httpClient.get('/api/reportes/dashboard')
httpClient.post('/api/asistencias', data)
```

**El baseURL NO debe incluir `/api`:**

```env
# Desarrollo local
VITE_API_BASE_URL=https://localhost:7194

# QA
VITE_API_BASE_URL=https://qa.chetango.com

# Producción
VITE_API_BASE_URL=https://api.chetango.com
```

### Verificación

Para verificar que la configuración es correcta:

1. Revisa el archivo `.env`:
   ```bash
   # Debe ser solo el dominio y puerto
   VITE_API_BASE_URL=https://localhost:7194
   ```

2. Verifica en el código que todas las rutas incluyan `/api/`:
   ```bash
   grep -r "httpClient.get\|httpClient.post\|httpClient.put\|httpClient.delete" src/features/
   ```

3. Después de cambiar `.env`, **SIEMPRE reinicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

### Contexto del httpClient

El `httpClient` se configura en `src/shared/api/httpClient.ts`:

```typescript
const httpClient = axios.create({
  baseURL: ENV_CONFIG.API_URL,  // ← Lee de VITE_API_BASE_URL
  timeout: ENV_CONFIG.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

El `ENV_CONFIG.API_URL` obtiene su valor de `import.meta.env.VITE_API_BASE_URL`.

---

**Fecha del Fix:** 26 de enero 2026  
**Desarrollador:** Copilot  
**Issue:** Duplicación de `/api` en rutas causando 404
