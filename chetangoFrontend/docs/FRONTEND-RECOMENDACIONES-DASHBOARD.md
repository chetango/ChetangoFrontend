# 🎨 Frontend - Dashboard Recomendaciones

## ✅ IMPLEMENTACIÓN COMPLETADA

### 📁 Estructura de Archivos Creados

```
src/
├── features/
│   ├── solicitudes/
│   │   ├── api/
│   │   │   ├── solicitudesMutations.ts     ✅ Mutations (POST)
│   │   │   └── solicitudesQueries.ts       ✅ Queries (GET Admin)
│   │   ├── components/
│   │   │   ├── SolicitudRenovacionNotification.tsx     ✅ Card notificación renovación
│   │   │   ├── SolicitudClasePrivadaNotification.tsx   ✅ Card notificación clase privada
│   │   │   └── SolicitudesNotifications.tsx            ✅ Container admin
│   │   ├── types/
│   │   │   └── solicitudesTypes.ts         ✅ TypeScript types
│   │   └── index.ts                        ✅ Module exports
│   │
│   └── referidos/
│       ├── api/
│       │   ├── referidosQueries.ts         ✅ Query mi-codigo
│       │   └── referidosMutations.ts       ✅ Mutation generar-codigo
│       ├── types/
│       │   └── referidosTypes.ts           ✅ TypeScript types
│       └── index.ts                        ✅ Module exports
│
└── dashboard/
    └── alumno/
        └── components/
            └── RecomendadosSection.tsx     ✅ Actualizado con nuevas acciones
```

---

## 🎯 FUNCIONALIDADES IMPLEMENTADAS

### 1️⃣ **Renovar Paquete** 📦

**Dashboard Alumno:**
- Card con prioridad alta cuando quedan ≤2 clases
- Botón "Renovar Paquete" con loading state
- Mutation: `useSolicitarRenovacionPaquete()`
- Toast de confirmación al enviar solicitud

**Dashboard Admin:**
- Componente `<SolicitudRenovacionNotification />`
- Muestra: nombre, paquete actual, clases restantes, mensaje
- Icono de paquete animado (📦 pulse)
- Botones: "Ver Solicitud" / "Ignorar"
- Query automática cada 2 minutos

---

### 2️⃣ **Clase Privada** ⭐

**Dashboard Alumno:**
- Card con icono estrella morada
- Botón "Quiero Clase Privada" con loading state
- Mutation: `useSolicitarClasePrivada()`
- Toast de confirmación al enviar solicitud

**Dashboard Admin:**
- Componente `<SolicitudClasePrivadaNotification />`
- Muestra: nombre, tipo clase, fecha/hora preferida, observaciones
- Icono estrella animado (⭐ pulse)
- Botones: "Agendar" / "Ignorar"
- Query automática cada 2 minutos

---

### 3️⃣ **Invita un Amigo** 🤝

**Dashboard Alumno:**
- Card verde con icono de personas
- Dos estados:
  1. **Sin código**: Botón "Generar Código"
  2. **Con código**: Muestra código y contador de usos, botón "Copiar Código"
- Query: `useMiCodigoReferido()`
- Mutation: `useGenerarCodigoReferido()`
- Beneficios mostrados en descripción

**Formato Código:**
- Estructura: `NOMBRE2026XX` (ej: JUAN2645, MARI2612)
- 4 letras del nombre + 2 dígitos año + 2 números aleatorios

---

## 🔗 INTEGRACIÓN CON BACKEND

### Endpoints Utilizados:

```typescript
// ALUMNO (ApiScope)
POST   /api/solicitudes/renovar-paquete
POST   /api/solicitudes/clase-privada
GET    /api/referidos/mi-codigo
POST   /api/referidos/generar-codigo

// ADMIN (AdminOnly)
GET    /api/solicitudes/renovacion-paquete/pendientes
GET    /api/solicitudes/clase-privada/pendientes
```

### React Query Cache Strategy:

```typescript
// Dashboard Alumno
useMiCodigoReferido()
  - staleTime: 10 minutos
  - refetch: Manual

// Dashboard Admin  
useSolicitudesRenovacionPendientes()
useSolicitudesClasePrivadaPendientes()
  - staleTime: 2 minutos
  - refetchInterval: Cada 2 minutos
  - refetchOnWindowFocus: true
```

---

## 🎨 COMPONENTES UI

### Notificación Renovación

```tsx
<SolicitudRenovacionNotification
  solicitud={solicitud}
  onApprove={(id) => console.log('Aprobar', id)}
  onDismiss={() => console.log('Ignorar')}
/>
```

**Visual:**
- GlassPanel con efecto hover
- Icono 📦 animado (pulse)
- Color theme: `#c93448` (rojo)
- Ring border si prioridad alta
- Gradiente ambient glow on hover

### Notificación Clase Privada

```tsx
<SolicitudClasePrivadaNotification
  solicitud={solicitud}
  onApprove={(id) => console.log('Agendar', id)}
  onDismiss={() => console.log('Ignorar')}
/>
```

**Visual:**
- GlassPanel con efecto hover
- Icono ⭐ animado (pulse)
- Color theme: `#7c5af8` (morado)
- Iconos Calendar y Clock para fecha/hora
- Gradiente ambient glow on hover

### Container Admin

```tsx
<SolicitudesNotifications maxItems={5} />
```

**Features:**
- Combina ambos tipos de solicitudes
- Ordena por fecha (más recientes primero)
- Badge con total de pendientes
- Loading skeleton mientras carga
- Empty state si no hay solicitudes

---

## 📊 FLUJO DE USUARIO

### Alumno Dashboard

1. **Renovar Paquete:**
   ```
   Usuario ve card → Click "Renovar Paquete" → Loading spinner → Toast confirmación → Card actualizado
   ```

2. **Clase Privada:**
   ```
   Usuario ve card → Click "Quiero Clase Privada" → Loading spinner → Toast confirmación
   ```

3. **Invita Amigo:**
   ```
   Sin código: Click "Generar Código" → Loading → Toast con código → Card muestra código
   Con código: Click "Copiar Código" → Clipboard.writeText() → Toast "Copiado"
   ```

### Admin Dashboard

1. **Recibe solicitud:**
   ```
   Polling cada 2min → Nueva solicitud aparece → Badge actualizado → Card con animación
   ```

2. **Procesa solicitud:**
   ```
   Click "Ver Solicitud" / "Agendar" → Navega a módulo correspondiente
   Click "Ignorar" → Remueve notificación local (no afecta backend)
   ```

---

## 🔄 ESTADOS Y VALIDACIONES

### Mutations (Alumno)

**useSolicitarRenovacionPaquete:**
- ✅ Validación: Solo 1 solicitud pendiente por alumno
- ✅ Error: "Ya tienes una solicitud pendiente"
- ✅ Success: Invalida cache dashboard alumno

**useSolicitarClasePrivada:**
- ✅ Validación: Solo 1 solicitud en últimos 7 días
- ✅ Error: "Ya tienes una solicitud pendiente en los últimos 7 días"
- ✅ Success: Invalida cache dashboard alumno

**useGenerarCodigoReferido:**
- ✅ Validación: Solo 1 código activo por alumno
- ✅ Error: "Ya tienes un código de referido activo"
- ✅ Success: Invalida cache mi-codigo

### Queries (Admin)

**useSolicitudesRenovacionPendientes:**
- ✅ Solo retorna estado "Pendiente"
- ✅ Ordenadas por fecha (más antiguas primero en backend)
- ✅ Frontend reordena por fecha descendente

**useSolicitudesClasePrivadaPendientes:**
- ✅ Solo retorna estado "Pendiente"
- ✅ Ordenadas por fecha (más antiguas primero en backend)
- ✅ Frontend reordena por fecha descendente

---

## 🚀 USO EN DASHBOARDS

### Dashboard Alumno

```tsx
import { RecomendadosSection } from '@/features/dashboard/alumno/components/RecomendadosSection'

<RecomendadosSection paquete={dashboardData.paqueteActivo} />
```

**Props:**
- `paquete`: PaqueteActivo | null - Para mostrar prioridad alta si quedan ≤2 clases

### Dashboard Admin

```tsx
import { SolicitudesNotifications } from '@/features/solicitudes'

<SolicitudesNotifications maxItems={5} />
```

**Props:**
- `maxItems?`: number - Cantidad máxima a mostrar (default: 5)

---

## 🎨 DESIGN SYSTEM

### Colors

```typescript
Renovación:  #c93448 (rojo chetango)
Clase Privada: #7c5af8 (morado)
Referidos:   #10b981 (verde)
```

### Components Used

- `<GlassPanel />` - Panel con glass-morphism effect
- `<Loader2 />` from lucide-react - Loading spinner
- Toast from sonner - Notificaciones

### Animations

```css
/* Pulse animation para iconos */
animate-pulse

/* Hover scale */
hover:scale-[1.02] transition-all duration-300

/* Ambient glow */
opacity-0 group-hover:opacity-100 transition-opacity duration-500
```

---

## 🧪 TESTING

### Manual Testing Checklist

**Dashboard Alumno:**
- [ ] Card "Renovar Paquete" aparece cuando clasesRestantes ≤ 2
- [ ] Click en "Renovar Paquete" muestra loading y envía solicitud
- [ ] Toast de éxito aparece después de enviar
- [ ] Click en "Quiero Clase Privada" envía solicitud
- [ ] Card "Invita Amigo" sin código muestra "Generar Código"
- [ ] Generar código muestra código y cambia botón a "Copiar Código"
- [ ] Copiar código funciona correctamente

**Dashboard Admin:**
- [ ] Container muestra badge con total de solicitudes
- [ ] Cards de notificación aparecen con animación
- [ ] Hover muestra ambient glow
- [ ] Click en "Ver Solicitud" / "Agendar" ejecuta callback
- [ ] Click en "Ignorar" remueve notificación
- [ ] Auto-refresh cada 2 minutos funciona

---

## 📝 PRÓXIMOS PASOS

### Fase 1 - Testing (Actual)
- ✅ Implementación completada
- ⏳ Compilación y verificación de imports
- ⏳ Testing manual en dashboard alumno
- ⏳ Testing manual en dashboard admin

### Fase 2 - Integración Admin
- ⏳ Crear flujo completo de aprobación de solicitud renovación
- ⏳ Crear flujo completo de agendado de clase privada
- ⏳ Implementar persistencia de "ignorar" notificaciones

### Fase 3 - Mejoras UX
- ⏳ Modal con formulario completo para solicitudes
- ⏳ Calendario interactivo para fecha/hora clase privada
- ⏳ Panel de seguimiento de solicitudes para alumno
- ⏳ Historial de referidos exitosos

---

## 🐛 KNOWN ISSUES / TODO

1. **Admin callbacks pendientes:**
   - `onApprove` actualmente solo hace console.log
   - Falta navegación a módulo de paquetes/pagos para crear paquete
   - Falta navegación a módulo de clases para agendar

2. **Dismiss notifications:**
   - Actualmente solo remueve local (no persiste)
   - Considerar agregar endpoint para marcar como "vista"

3. **Referidos:**
   - Falta implementar flujo completo de aplicación de beneficios
   - Falta tracking de nuevos alumnos por código

---

## 📚 DOCUMENTACIÓN DE REFERENCIA

- Backend: [IMPLEMENTACION-RECOMENDACIONES-DASHBOARD.md](../../chetango-backend/docs/IMPLEMENTACION-RECOMENDACIONES-DASHBOARD.md)
- API Contract: Ver backend docs para request/response schemas
- Design System: Glass-morphism pattern ya establecido en proyecto
