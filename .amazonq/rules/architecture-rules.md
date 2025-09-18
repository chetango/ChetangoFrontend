# Reglas de Arquitectura Frontend - Chetango

## REGLAS CRÍTICAS - LEER ANTES DE CUALQUIER MODIFICACIÓN

### 1. ESTRUCTURA DE CARPETAS OBLIGATORIA

```
src/
├── app/                          # ⚠️ SOLO configuración global de la aplicación
│   ├── providers/               # Providers de React (QueryProvider, ThemeProvider, etc.)
│   ├── router/                  # Configuración de rutas, guards, layouts
│   └── store/                   # Store principal de Redux Toolkit
├── shared/                      # ⚠️ Código compartido ENTRE features
│   ├── api/                     # httpClient, interceptores, configuración API
│   ├── lib/                     # Utilidades, helpers, funciones puras
│   ├── types/                   # Tipos TypeScript globales
│   └── constants/               # Constantes de toda la aplicación
├── design-system/               # ⚠️ Sistema de diseño (Atomic Design)
│   ├── atoms/                   # Componentes básicos (Button, Input, Badge) + .module.scss
│   ├── molecules/               # Combinaciones de atoms (SearchBox, FormField) + .module.scss
│   ├── organisms/               # Componentes complejos (Header, Sidebar, DataTable) + .module.scss
│   ├── templates/               # Layouts y plantillas de página + .module.scss
│   └── tokens/                  # Design tokens (colores, tipografía, espaciado)
├── features/                    # ⚠️ Features del dominio de negocio
│   ├── auth/                    # Autenticación y autorización
│   ├── attendance/              # Control de asistencia
│   ├── payments/                # Gestión de pagos y paquetes
│   ├── alerts/                  # Sistema de alertas internas
│   ├── reports/                 # Reportes y exportación (PDF/Excel)
│   └── users/                   # Gestión de usuarios y roles
├── pages/                       # ⚠️ Páginas/rutas de la aplicación
└── assets/                      # Recursos estáticos (imágenes, iconos, etc.)
```

### 2. ESTRUCTURA INTERNA DE FEATURES (OBLIGATORIA)

Cada feature DEBE tener esta estructura exacta:

```
features/[feature-name]/
├── api/                         # Queries, mutations, endpoints específicos
├── components/                  # Componentes UI específicos de la feature
├── hooks/                       # Hooks personalizados de la feature
├── store/                       # Slice de Redux específico
├── types/                       # Tipos TypeScript específicos
└── index.ts                     # Barrel export (exportaciones públicas)
```

### 3. REGLAS DE UBICACIÓN POR TIPO DE ARCHIVO

#### 🔴 COMPONENTES UI - ¿Dónde van?

**ATOMS** → `src/design-system/atoms/`
- Componentes básicos reutilizables
- Ejemplos: Button, Input, Badge, Avatar, Icon
- NO tienen lógica de negocio
- Solo props y estilos

**MOLECULES** → `src/design-system/molecules/`
- Combinación de 2+ atoms
- Ejemplos: SearchBox, FormField, Card, Modal
- Lógica UI simple (validación visual, estados)

**ORGANISMS** → `src/design-system/organisms/`
- Componentes complejos reutilizables
- Ejemplos: Header, Sidebar, DataTable, Navigation
- Pueden usar hooks del design-system

**COMPONENTES DE FEATURE** → `src/features/[feature]/components/`
- Componentes específicos del dominio
- Ejemplos: AttendanceForm, PaymentCard, UserProfile
- Usan hooks y store de la misma feature

#### 🔴 LÓGICA DE ESTADO - ¿Dónde va?

**REDUX SLICES** → `src/features/[feature]/store/`
- Estado local de UI (modales, filtros, selecciones)
- Estado de dominio local (formularios, cache temporal)
- Permisos y roles del usuario
- Configuración de UI

**REACT QUERY** → `src/features/[feature]/api/`
- Fetching de datos remotos
- Cache de servidor
- Sincronización con backend
- Estados de loading/error

#### 🔴 HOOKS - ¿Dónde van?

**HOOKS DE FEATURE** → `src/features/[feature]/hooks/`
- Lógica específica del dominio
- Ejemplos: useAttendance, usePayments, useUserPermissions

**HOOKS GLOBALES** → `src/shared/lib/hooks/`
- Lógica reutilizable entre features
- Ejemplos: useLocalStorage, useDebounce, useApi

#### 🔴 TIPOS TYPESCRIPT - ¿Dónde van?

**TIPOS DE FEATURE** → `src/features/[feature]/types/`
- Tipos específicos del dominio
- Ejemplos: AttendanceType, PaymentType, UserType

**TIPOS GLOBALES** → `src/shared/types/`
- Tipos compartidos entre features
- Ejemplos: ApiResponse, PaginationType, ErrorType

#### 🔴 PÁGINAS - ¿Dónde van?

**TODAS LAS PÁGINAS** → `src/pages/`
- Archivos de página/ruta
- Ejemplos: LoginPage.tsx, DashboardPage.tsx, AttendancePage.tsx
- Solo orquestación, NO lógica de negocio

### 4. REGLAS DE DEPENDENCIAS (CRÍTICAS)

#### ✅ IMPORTS PERMITIDOS:
- `features/[any]` → `shared/*`
- `features/[any]` → `design-system/*`
- `pages/*` → `features/*`
- `pages/*` → `design-system/*`
- `app/*` → `features/*` (solo para store y routing)

#### ❌ IMPORTS PROHIBIDOS:
- `shared/*` → `features/*` (NUNCA)
- `design-system/*` → `features/*` (NUNCA)
- `features/[A]` → `features/[B]` (NUNCA directamente)
- `features/*` → `pages/*` (NUNCA)

#### 🔄 COMUNICACIÓN ENTRE FEATURES:
- Solo a través de `shared/` o contratos públicos en `index.ts`
- Usar eventos/store global si es necesario

### 5. CONVENCIONES DE NOMBRES (OBLIGATORIAS)

#### Archivos y Carpetas:
- Componentes: `PascalCase.tsx` (UserCard.tsx)
- Estilos SCSS: `PascalCase.module.scss` (UserCard.module.scss)
- Hooks: `camelCase.ts` (useAttendance.ts)
- Tipos: `camelCase.ts` (userTypes.ts)
- Páginas: `PascalCase.tsx` (AttendancePage.tsx)
- Carpetas: `kebab-case` (design-system, user-management)

#### Código:
- Componentes: `PascalCase` (UserCard)
- Hooks: `camelCase` con prefijo `use` (useAttendance)
- Tipos: `PascalCase` con sufijo `Type` (UserType)
- Constantes: `UPPER_SNAKE_CASE` (API_ENDPOINTS)
- Variables: `camelCase` (userData)

### 6. IMPORTS OBLIGATORIOS

#### Usar SIEMPRE alias absolutos:
```typescript
// ✅ CORRECTO
import { Button } from '@/design-system/atoms/Button'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { httpClient } from '@/shared/api/httpClient'

// ❌ INCORRECTO
import { Button } from '../../../design-system/atoms/Button'
import { useAuth } from '../../auth/hooks/useAuth'
```

### 7. DECISIONES POR CONTEXTO

#### ¿Es un componente nuevo?
1. **¿Es reutilizable en múltiples features?**
   - SÍ → `design-system/atoms|molecules|organisms/`
   - NO → `features/[feature]/components/`

2. **¿Qué nivel de complejidad?**
   - Básico (Button, Input) → `atoms/`
   - Combinación (SearchBox) → `molecules/`
   - Complejo (DataTable) → `organisms/`

#### ¿Es lógica de estado?
1. **¿Es datos del servidor?**
   - SÍ → React Query en `features/[feature]/api/`
   - NO → Redux en `features/[feature]/store/`

2. **¿Es estado global?**
   - SÍ → `app/store/`
   - NO → `features/[feature]/store/`

#### ¿Es un hook?
1. **¿Es específico de una feature?**
   - SÍ → `features/[feature]/hooks/`
   - NO → `shared/lib/hooks/`

#### ¿Es un tipo?
1. **¿Se usa en múltiples features?**
   - SÍ → `shared/types/`
   - NO → `features/[feature]/types/`

### 8. EJEMPLOS PRÁCTICOS

#### Crear componente de tarjeta de usuario:
```
¿Dónde va UserCard?
1. ¿Es reutilizable? SÍ (se usa en users, attendance, reports)
2. ¿Qué complejidad? Molecule (combina Avatar + Text + Button)
3. Ubicación: src/design-system/molecules/UserCard.tsx
```

#### Crear hook para gestionar asistencia:
```
¿Dónde va useAttendance?
1. ¿Es específico de feature? SÍ (solo para attendance)
2. Ubicación: src/features/attendance/hooks/useAttendance.ts
```

#### Crear página de reportes:
```
¿Dónde va ReportsPage?
1. ¿Es una página? SÍ
2. Ubicación: src/pages/ReportsPage.tsx
```

### 9. CHECKLIST ANTES DE CREAR ARCHIVOS

Antes de crear cualquier archivo, pregúntate:

- [ ] ¿He leído las reglas de arquitectura?
- [ ] ¿Sé exactamente en qué carpeta va este archivo?
- [ ] ¿He verificado las reglas de dependencias?
- [ ] ¿Estoy usando la convención de nombres correcta?
- [ ] ¿Estoy usando imports absolutos con @/?
- [ ] ¿Este archivo respeta la separación de responsabilidades?

### 10. FEATURES ACTUALES DEL DOMINIO

**Features definidas para Chetango:**
- `auth` - Autenticación, login, permisos, roles
- `attendance` - Control de asistencia, registro, consultas
- `classes` - Gestión de clases, horarios, historial de clases
- `packages` - Paquetes de membresías y clases
- `payments` - Gestión de pagos, facturación
- `schedules` - Horarios y programación
- `alerts` - Sistema de alertas internas, notificaciones
- `reports` - Reportes, exportación PDF/Excel, métricas
- `users` - Gestión de usuarios, perfiles, roles

**NO crear features nuevas sin justificación del dominio de negocio.**

---

## ⚠️ IMPORTANTE: ESTAS REGLAS SON OBLIGATORIAS

Si no estás seguro de dónde va un archivo, **PREGUNTA** antes de crearlo.
Es mejor preguntar que crear archivos en lugares incorrectos.

La arquitectura es la base del proyecto. Respétala siempre.