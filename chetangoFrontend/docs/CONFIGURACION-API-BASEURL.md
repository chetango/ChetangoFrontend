# Configuración del API BaseURL - IMPORTANTE

## 📌 Problema Identificado y Solucionado

### Fecha: 26 de enero de 2026
### Desarrollador: GitHub Copilot
### Contexto: Implementación del Dashboard Administrador

---

## ❌ Error Original

El dashboard y otras vistas mostraban el error:
```
Failed to load resource: the server responded with a status of 404 ()
GET https://localhost:7194/api/api/reportes/dashboard
```

### Causa Raíz
Duplicación del segmento `/api` en las URLs de las peticiones HTTP.

---

## 🔍 Análisis del Problema

### Configuración Incorrecta en `.env`
```bash
# ❌ INCORRECTO - incluía /api en el baseURL
VITE_API_BASE_URL=https://localhost:7194/api
```

### httpClient.ts
```typescript
const httpClient = axios.create({
  baseURL: ENV_CONFIG.API_URL,  // <- tomaba el valor del .env
  timeout: ENV_CONFIG.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### Llamadas a la API en los queries
```typescript
// Ejemplo de packageQueries.ts, dashboardQueries.ts, etc.
httpClient.get('/api/alumnos')           // <- incluía /api en el path
httpClient.get('/api/reportes/dashboard')
httpClient.get('/api/paquetes/${id}')
```

### Resultado
```
baseURL: https://localhost:7194/api
path: /api/reportes/dashboard
URL final: https://localhost:7194/api/api/reportes/dashboard  ❌ DUPLICADO
```

---

## ✅ Solución Aplicada

### 1. Actualizar `.env`
```bash
# ✅ CORRECTO - sin /api en el baseURL
VITE_API_BASE_URL=https://localhost:7194
```

### 2. Mantener los paths con `/api`
```typescript
// Todos los queries mantienen el prefijo /api
httpClient.get('/api/alumnos')
httpClient.get('/api/reportes/dashboard')
httpClient.get('/api/paquetes/${id}')
httpClient.get('/api/pagos')
httpClient.get('/api/clases')
```

### Resultado Correcto
```
baseURL: https://localhost:7194
path: /api/reportes/dashboard
URL final: https://localhost:7194/api/reportes/dashboard  ✅ CORRECTO
```

---

## 📐 Convención del Proyecto

### ✅ Patrón Correcto a Seguir
```typescript
// .env
VITE_API_BASE_URL=https://localhost:7194

// En todos los *Queries.ts
httpClient.get('/api/recurso')
httpClient.post('/api/recurso', data)
httpClient.put('/api/recurso/${id}', data)
httpClient.delete('/api/recurso/${id}')
```

### ⚠️ Verificación en Futuros Desarrollos

Antes de implementar nuevos endpoints, verificar:

1. **El `.env` NO debe incluir `/api` al final del baseURL**
   ```bash
   # ✅ Correcto
   VITE_API_BASE_URL=https://localhost:7194
   VITE_API_BASE_URL=https://api.chetango.com
   
   # ❌ Incorrecto
   VITE_API_BASE_URL=https://localhost:7194/api
   ```

2. **Todos los paths en queries SÍ deben incluir `/api`**
   ```typescript
   // ✅ Correcto
   httpClient.get('/api/reportes/dashboard')
   
   // ❌ Incorrecto
   httpClient.get('/reportes/dashboard')
   ```

3. **Verificar en archivos existentes el patrón antes de implementar**
   ```bash
   # Buscar ejemplos existentes
   grep -r "httpClient.get" src/features/*/api/
   ```

---

## 🔄 Checklist para Nuevas Implementaciones

Cuando implementes un nuevo módulo o feature:

- [ ] Verificar que `.env` tenga `VITE_API_BASE_URL=https://localhost:7194` (sin `/api`)
- [ ] Usar el patrón `httpClient.get('/api/recurso')` en queries
- [ ] Revisar queries existentes como referencia (packages, payments, attendance)
- [ ] No asumir configuraciones - siempre verificar con `grep_search` o `read_file`
- [ ] Después de cambios en `.env`, reiniciar el servidor de desarrollo
- [ ] Probar las URLs finales en DevTools Network tab

---

## 📝 Archivos Relacionados

- `.env` - Configuración de variables de entorno
- `src/shared/api/httpClient.ts` - Cliente HTTP base con interceptores
- `src/shared/constants/env.ts` - Constantes de entorno
- `src/features/*/api/*Queries.ts` - Todos los queries del proyecto
- `src/features/dashboard/api/dashboardQueries.ts` - Query del dashboard (caso de corrección)

---

## 🚨 Notas Importantes

1. **Reiniciar servidor tras cambiar `.env`**: Vite no recarga automáticamente cambios en variables de entorno
2. **Patrón consistente**: TODOS los endpoints siguen esta convención sin excepciones
3. **Backend**: Las rutas en el backend .NET están decoradas con `[Route("api/[controller]")]`
4. **Environments**: Aplica igual para Development, QA, y Production

---

## 📚 Referencias

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Axios Configuration](https://axios-http.com/docs/config_defaults)
- Documentación del proyecto: `docs/FRONTEND-AUTH-SETUP.md`

---

**Última actualización**: 26 de enero de 2026
**Autor**: GitHub Copilot con Claude Sonnet 4.5
