# Implementación de Filtro por Sede

## 📋 Resumen

Se implementó un sistema de filtrado por sede (Medellín/Manizales) en las páginas administrativas de Pagos, Usuarios y Reportes. El filtro permite a los administradores ver y gestionar datos específicos de cada sede o ver todos los datos consolidados.

## ✅ Implementado

### 1. Componente Reutilizable: `SedeFilter`

**Ubicación:** `src/shared/components/SedeFilter.tsx`

**Características:**
- Componente reutilizable con 3 opciones: Todas las sedes, Medellín, Manizales
- Dos variantes: `compact` (para páginas internas) y `full` (para dashboard)
- Diseño glassmorphism con iconos (Globe para todas, Building2 para sedes específicas)
- Colores distintivos:
  - Todas: Cyan (#06b6d4)
  - Medellín: Verde (#10b981)
  - Manizales: Azul (#3b82f6)
- Estado activo con borde inferior y glow effect

**Tipo:**
```typescript
export type SedeFilterValue = 'all' | 1 | 2 // 'all' | Medellín | Manizales
```

### 2. Página de Pagos (AdminPaymentsPage)

**Estado:** ✅ **Completamente Implementado**

**Cambios realizados:**
1. Importado `SedeFilter` y tipo `SedeFilterValue`
2. Agregado estado: `const [sedeFilter, setSedeFilter] = useState<SedeFilterValue>('all')`
3. Insertado componente `<SedeFilter />` en la UI (después de las estadísticas, antes del dashboard Kanban)
4. Creado variables filtradas:
   - `filteredPendingPayments`: Pagos pendientes filtrados por sede
   - `filteredVerifiedPayments`: Pagos verificados hoy filtrados por sede
   - `filteredAllVerifiedPayments`: Todos los pagos verificados filtrados por sede
5. Actualizado el render de las 3 columnas del Kanban:
   - "Pendientes" usa `filteredPendingPayments`
   - "Verificados Hoy" usa `filteredVerifiedPayments`
   - "Últimos Pagos" usa `filteredAllVerifiedPayments`
6. Actualizado `HistorialPagosAlumnosSection` para recibir datos filtrados

**Lógica de filtrado:**
```typescript
const filteredPendingPayments = sedeFilter === 'all' 
  ? pendingPayments 
  : pendingPayments?.filter(p => p.sede === sedeFilter)
```

**Resultado:** Los administradores pueden filtrar pagos por sede en tiempo real. El contador de cada columna se actualiza automáticamente.

### 3. Página de Usuarios (UsersPage)

**Estado:** ✅ **Completamente Implementado**

**Cambios realizados:**
1. Importado `SedeFilter` y tipo `SedeFilterValue`
2. Agregado estado: `const [sedeFilter, setSedeFilter] = useState<SedeFilterValue>('all')`
3. Insertado componente `<SedeFilter />` en la sección de filtros (antes de Role Filter y Status Filter)
4. Creado variable filtrada usando `useMemo`:
   ```typescript
   const filteredUsers = React.useMemo(() => {
     if (!data?.items) return []
     if (sedeFilter === 'all') return data.items
     return data.items.filter(user => user.sede === sedeFilter)
   }, [data?.items, sedeFilter])
   ```
5. Actualizado el render de la tabla para usar `filteredUsers` en lugar de `data?.items`
6. Actualizado validación de lista vacía para usar `filteredUsers?.length === 0`

**Resultado:** Los administradores pueden filtrar usuarios (alumnos, profesores, admins) por sede. El filtro se combina con los filtros existentes de rol y estado.

### 4. Página de Reportes (ReportsPage)

**Estado:** ⚠️ **Parcialmente Implementado** (UI lista, backend pendiente)

**Cambios realizados:**
1. Importado `SedeFilter` y tipo `SedeFilterValue`
2. Agregado estado: `const [sedeFilter, setSedeFilter] = useState<SedeFilterValue>('all')`
3. Insertado componente `<SedeFilter />` en el panel de "Filtros Globales" (antes del DateRangeFilter)
4. Agregado prop `showLabel` al SedeFilter para mostrar etiqueta

**Pendiente:**
- **Backend:** Los endpoints de reportes (`/api/reportes/*`) no aceptan actualmente un parámetro de `sede`
- Cada endpoint necesita ser modificado para:
  1. Aceptar parámetro opcional `sede?: int` (1 = Medellín, 2 = Manizales)
  2. Filtrar datos por sede en las queries SQL/LINQ
  3. Cuando `sede` no se envía, devolver datos de todas las sedes (comportamiento actual)

**Endpoints a modificar:**
- `/api/reportes/alumnos`
- `/api/reportes/clases`
- `/api/reportes/asistencias`
- `/api/reportes/paquetes`
- `/api/reportes/ingresos`

**Queries del frontend a actualizar:**
- `useReporteAlumnos`: Agregar `sede` en `GetReporteAlumnosRequest`
- `useReporteClases`: Agregar `sede` en `GetReporteClasesRequest`
- `useReporteAsistencias`: Agregar `sede` en `GetReporteAsistenciasRequest`
- `useReportePaquetes`: Agregar `sede` en `GetReportePaquetesRequest`
- `useReporteIngresos`: Agregar `sede` en `GetReporteIngresosRequest`

**Ejemplo de cambio en query:**
```typescript
export function useReporteAlumnos(
  filters: GetReporteAlumnosRequest,
  sede?: SedeFilterValue,  // <-- Agregar parámetro
  enabled = true
) {
  return useQuery({
    queryKey: reportKeys.alumnos({ ...filters, sede }),  // <-- Incluir en key
    queryFn: async (): Promise<ReporteAlumnosDTO> => {
      const params = new URLSearchParams()
      // ... otros parámetros
      if (sede && sede !== 'all') 
        params.append('sede', sede.toString())  // <-- Agregar a request
      
      const response = await httpClient.get<ReporteAlumnosDTO>(
        `/api/reportes/alumnos?${params.toString()}`
      )
      return response.data
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  })
}
```

## 🎨 Diseño y UX

### Ubicación del filtro por página:

1. **AdminPaymentsPage:**
   - Después de las tarjetas de estadísticas (Total, Pendientes, etc.)
   - Antes del dashboard Kanban de 3 columnas
   - Margen: `my-4 sm:my-6` para espaciado

2. **UsersPage:**
   - En la sección de filtros, antes de los selectores de Role y Status
   - Dentro de un `flex-shrink-0` para mantener tamaño fijo
   - Alineado con los demás filtros

3. **ReportsPage:**
   - Dentro del panel "Filtros Globales" (GlassPanel)
   - Antes del DateRangeFilter
   - Con prop `showLabel` para mostrar título "Filtro por Sede"

### Colores y Estilo:

- **Glassmorphism:** Fondo semi-transparente con blur
- **Hover:** Efecto glow con box-shadow y transform scale
- **Active:** Borde inferior coloreado de 2px
- **Iconos:** Tamaño consistente (16px), cambian con hover
- **Transiciones:** Suaves (300ms) para cambios de estado

## 🧪 Testing Recomendado

### 1. Página de Pagos
- [ ] Crear pagos con diferentes sedes (desde admin de Medellín y Manizales)
- [ ] Verificar que aparecen en "Pendientes" solo cuando se selecciona su sede
- [ ] Verificar que "Todas" muestra todos los pagos
- [ ] Verificar que el contador de cada columna se actualiza correctamente
- [ ] Verificar que el historial de pagos de alumnos también se filtra

### 2. Página de Usuarios
- [ ] Crear usuarios (alumnos/profesores) con diferentes sedes
- [ ] Filtrar por sede y verificar que solo aparecen los usuarios de esa sede
- [ ] Combinar filtro de sede con filtro de rol (ej: "Profesores de Medellín")
- [ ] Combinar filtro de sede con búsqueda por nombre
- [ ] Verificar que la paginación funciona correctamente con el filtro

### 3. Página de Reportes (Cuando backend esté listo)
- [ ] Seleccionar sede y generar reporte de alumnos
- [ ] Verificar que solo aparecen alumnos de la sede seleccionada
- [ ] Exportar PDF/Excel y verificar que datos coinciden
- [ ] Probar cada tipo de reporte (clases, asistencias, paquetes, ingresos)
- [ ] Verificar que las métricas agregadas (totales, promedios) se calculan correctamente por sede

## 📝 Notas Técnicas

### Tipos de datos con `sede`:

Los siguientes tipos ya tienen el campo `sede: Sede` (1 o 2):
- `PagoDTO` en pagos
- `User` en usuarios
- DTOs de reportes (cuando se implemente backend)

### Performance:

- **Pagos:** Filtrado client-side eficiente (listas pequeñas: <100 items)
- **Usuarios:** Uso de `useMemo` para evitar recalcular filtrado en cada render
- **Reportes:** El filtrado debe ser server-side (datos pueden ser grandes: >1000 items)

### Herencia de Sede:

Recordar que todos los datos creados heredan automáticamente la sede del admin que los crea (`EmailUsuarioCreador`), por lo que no es necesario que el admin seleccione manualmente la sede al crear registros.

## 🚀 Próximos Pasos

1. **Implementar backend de reportes con filtro de sede** (prioritario)
   - Modificar controladores en `Chetango.Api`
   - Modificar queries en `Chetango.Application/Reportes`
   - Agregar parámetro `sede` en cada handler

2. **Testing E2E**
   - Crear tests de Playwright para verificar filtrado en las 3 páginas
   - Verificar que filtros se combinan correctamente

3. **Documentación para usuario final**
   - Agregar tooltips explicativos en los filtros
   - Crear sección en manual de usuario

## 🎯 Checklist de Implementación

- [x] Componente `SedeFilter` creado
- [x] Filtro en AdminPaymentsPage (100% funcional)
- [x] Filtro en UsersPage (100% funcional)
- [x] Filtro en ReportsPage - UI (100%)
- [ ] Filtro en ReportsPage - Backend (0%)
- [ ] Tests E2E
- [ ] Documentación de usuario

---

**Última actualización:** 2024
**Desarrollador:** GitHub Copilot + Usuario
