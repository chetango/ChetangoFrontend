# Configuración de Entornos - Chetango Frontend

**Actualizado:** 10 Febrero 2026

## 📋 Resumen de Entornos

| Entorno | Comando | API | Redirect URI | Variables |
|---------|---------|-----|--------------|-----------|
| **Desarrollo Local** | `npm run dev` | `http://localhost:5194` | `http://localhost:5173` | `.env` |
| **Preview Producción** | `npm run preview` | `https://api.corporacionchetango.com` | `http://localhost:4173` | `.env.production.local` |
| **Producción Azure** | GitHub Actions | `https://api.corporacionchetango.com` | `https://app.corporacionchetango.com` | GitHub Variables |

---

## 🔧 Desarrollo Local (día a día)

**Usado para:** Desarrollo diario, pruebas contra backend local

**Comando:**
```bash
npm run dev
```

**Configuración:** Archivo `.env` (NO se sube a GitHub)

**URLs:**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5194`
- Redirect URI: `http://localhost:5173/auth-callback`

**Variables principales:**
```env
VITE_API_BASE_URL=http://localhost:5194
VITE_ENTRA_REDIRECT_URI=http://localhost:5173/auth-callback
```

**Requisitos:**
- Backend corriendo localmente en puerto 5194
- Base de datos local (Development o QA)

---

## 🎯 Preview Producción Local

**Usado para:** Probar build de producción antes de deploy

**Comandos:**
```bash
# Build con configuración de producción local
npm run build -- --mode production.local

# Previsualizar el build
npm run preview
```

**Configuración:** Archivo `.env.production.local` (NO se sube a GitHub)

**URLs:**
- Frontend: `http://localhost:4173`
- Backend: `https://api.corporacionchetango.com`
- Redirect URI: `http://localhost:4173`

**Variables principales:**
```env
VITE_API_BASE_URL=https://api.corporacionchetango.com
VITE_AZURE_REDIRECT_URI=http://localhost:4173
```

**Requisitos:**
- Internet para conectar a Azure
- Agregar `http://localhost:4173` en Azure Entra ID redirect URIs

---

## 🚀 Producción Azure

**Usado para:** Deployment automático en Azure Static Web Apps

**Trigger:** Push o merge a branch `develop`

**URLs:**
- Frontend: `https://app.corporacionchetango.com`
- Backend: `https://api.corporacionchetango.com`
- Redirect URI: `https://app.corporacionchetango.com`

**Variables:** Configuradas en GitHub → Settings → Secrets and variables → Actions → Variables

**Variables de GitHub Actions:**
```
VITE_API_BASE_URL=https://api.corporacionchetango.com
VITE_AZURE_CLIENT_ID=d35c1d4d-9ddc-4a8b-bb89-1964b37ff573
VITE_AZURE_TENANT_ID=8a57ec5a-e2e3-44ad-9494-77fbc7467251
VITE_AZURE_REDIRECT_URI=https://app.corporacionchetango.com
```

**Proceso de deployment:**
1. Push a `develop`
2. GitHub Actions ejecuta workflow
3. Build con variables de producción
4. Deploy a Azure Static Web Apps
5. SSL automático con dominio personalizado

---

## 📝 Archivo de Variables

### `.env` - Desarrollo Local
```env
# Backend local
VITE_API_BASE_URL=http://localhost:5194

# Autenticación local
VITE_ENTRA_TENANT_ID=8a57ec5a-e2e3-44ad-9494-77fbc7467251
VITE_ENTRA_CLIENT_ID=d35c1d4d-9ddc-4a8b-bb89-1964b37ff573
VITE_ENTRA_AUTHORITY=https://chetangoprueba.ciamlogin.com/8a57ec5a-e2e3-44ad-9494-77fbc7467251
VITE_ENTRA_REDIRECT_URI=http://localhost:5173/auth-callback
VITE_ENTRA_POST_LOGOUT_REDIRECT_URI=http://localhost:5173
VITE_ENTRA_SCOPES=openid,profile,email,api://d35c1d4d-9ddc-4a8b-bb89-1964b37ff573/access_as_user
```

### `.env.production.local` - Preview Local
```env
# Backend Azure
VITE_API_BASE_URL=https://api.corporacionchetango.com

# Autenticación para preview local
VITE_AZURE_TENANT_ID=8a57ec5a-e2e3-44ad-9494-77fbc7467251
VITE_AZURE_CLIENT_ID=d35c1d4d-9ddc-4a8b-bb89-1964b37ff573
VITE_AZURE_REDIRECT_URI=http://localhost:4173
```

### `.env.production` - Template para Producción
```env
# NOTA: Este archivo SÍ se sube a GitHub pero con valores placeholder
# Los valores reales vienen de GitHub Actions Variables

VITE_API_BASE_URL=https://api.corporacionchetango.com
VITE_AZURE_TENANT_ID=your-tenant-id
VITE_AZURE_CLIENT_ID=your-client-id
VITE_AZURE_REDIRECT_URI=https://app.corporacionchetango.com
```

---

## 🔐 Azure Entra ID Redirect URIs

Todos estos deben estar configurados en:
`Azure Portal → Entra ID → App registrations → Authentication`

**URIs configurados:**
- ✅ `http://localhost:5173/auth-callback` - Desarrollo
- ✅ `http://localhost:4173` - Preview local
- ✅ `https://app.corporacionchetango.com` - Producción
- ✅ `https://delightful-plant-02670d70f.1.azurestaticapps.net` - Temporal Azure (mantener como backup)

---

## 🧪 Cómo Probar Antes de Deploy

### 1. Probar cambios localmente
```bash
npm run dev
# Verifica que funcione contra backend local
```

### 2. Probar build de producción
```bash
# Asegúrate de tener .env.production.local configurado
npm run build -- --mode production.local
npm run preview

# Abre: http://localhost:4173
# Debería conectar a Azure API
```

### 3. Deploy a producción
```bash
git add .
git commit -m "feat: mi cambio"
git push origin develop

# Monitorear en: https://github.com/chetango/ChetangoFrontend/actions
```

---

## 🆘 Troubleshooting

### Error: "redirect_uri mismatch"
**Causa:** El redirect URI del build no coincide con los configurados en Entra ID

**Solución:**
1. Verifica que la URL esté en Entra ID → App registrations → Authentication
2. Si es local: Verifica tu archivo `.env` o `.env.production.local`
3. Si es producción: Verifica GitHub Actions Variables

### Error: "Network error" o "CORS error"
**Causa:** API no responde o CORS mal configurado

**Solución:**
1. Local: Verifica que backend esté corriendo en puerto correcto
2. Producción: Verifica que `https://api.corporacionchetango.com` responda
3. Verifica CORS en backend permite el origen del frontend

### Build falla en GitHub Actions
**Causa:** Variables de entorno faltantes

**Solución:**
1. Ve a GitHub → Settings → Secrets and variables → Actions → Variables
2. Verifica que todas las variables `VITE_*` existan
3. Compara con la lista en sección "Producción Azure"

---

## 📦 Archivos Importantes

**NO subir a GitHub (en `.gitignore`):**
- `.env` - Variables locales de desarrollo
- `.env.production.local` - Variables para preview local
- `.env.local` - Cualquier override local

**Subir a GitHub:**
- `.env.example` - Template con variables de ejemplo
- `.env.production` - Template para producción (con placeholders)
- `docs/CONFIGURACION-ENV.md` - Este documento

---

## 🎓 Usuarios de Prueba

**Admin:**
- Email: `Chetango@chetangoprueba.onmicrosoft.com`
- Acceso: Completo

**Profesor:**
- Email: `Jorgepadilla@chetangoprueba.onmicrosoft.com`
- Acceso: Dashboard profesor, clases, asistencias

**Alumno:**
- Email: `JuanDavid@chetangoprueba.onmicrosoft.com`
- Acceso: Dashboard alumno, clases, pagos

**Contraseñas:** Ver `chetango-backend/docs/FRONTEND-AUTH-SETUP.md`

---

## ✅ Checklist Pre-Deploy

Antes de hacer deploy a producción:

- [ ] Código funciona en `npm run dev`
- [ ] Código funciona en `npm run preview` (contra Azure API)
- [ ] No hay errores de TypeScript (`npm run build`)
- [ ] Tests pasan (si aplica)
- [ ] Variables de GitHub Actions están actualizadas
- [ ] Redirect URI de producción está en Entra ID
- [ ] Backend está desplegado y funcionando

---

## 📚 Referencias

- [Documentación Vite - Env Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Azure Static Web Apps - Custom Domain](https://docs.microsoft.com/azure/static-web-apps/custom-domain)
- [MSAL React - Configuration](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react)
