# Dependencias del Proyecto Chetango

## Dependencias Principales
```bash
npm install @reduxjs/toolkit react-redux @tanstack/react-query @tanstack/react-query-devtools react-router-dom react-hook-form @hookform/resolvers zod axios
```

## Dependencias de Desarrollo
```bash
npm install -D @types/node vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom prettier eslint-config-prettier eslint-plugin-prettier husky lint-staged @commitlint/cli @commitlint/config-conventional sass
```

## Stack Tecnológico
- **Framework**: React 19 + Vite
- **Lenguaje**: TypeScript
- **Estado**: Redux Toolkit (UI/local) + TanStack Query (servidor)
- **Estilos**: SCSS con CSS Modules
- **Formularios**: React Hook Form + Zod
- **HTTP**: Axios
- **Testing**: Vitest + Testing Library
- **Linting**: ESLint + Prettier

## Reglas de Dependencias Arquitecturales

### 🚫 DEPENDENCIAS PROHIBIDAS (Para evitar violaciones)

```typescript
// ❌ PROHIBIDO - app/providers no debe usar features
import { useAuth } from '@/features/auth' // en app/providers/
import { authSlice } from '@/features/auth' // en shared/

// ❌ PROHIBIDO - design-system debe ser independiente
import { ROUTES } from '@/shared/constants' // en design-system/
import { useErrorHandler } from '@/shared/hooks' // en design-system/

// ❌ PROHIBIDO - shared no debe usar features
import { msalConfig } from '@/features/auth/api' // en shared/
import { setError } from '@/features/auth' // en shared/

// ❌ PROHIBIDO - features entre sí directamente
import { usePayments } from '@/features/payments' // en features/attendance/
```

### ✅ DEPENDENCIAS PERMITIDAS

```typescript
// ✅ CORRECTO - features pueden usar shared y design-system
import { httpClient } from '@/shared/api/httpClient'
import { Button } from '@/design-system/atoms/Button'
import { ROUTES } from '@/shared/constants/routes'

// ✅ CORRECTO - pages pueden usar features y design-system
import { useAuth } from '@/features/auth'
import { AuthLayout } from '@/design-system/templates/AuthLayout'

// ✅ CORRECTO - design-system solo usa sus propios tokens
import { colors, spacing } from '@/design-system/tokens'

// ✅ CORRECTO - app/router puede usar features/auth para routing
import { useAuth } from '@/features/auth' // en app/router/guards.tsx

// ✅ CORRECTO - app/store puede usar features para slices
import { authSlice } from '@/features/auth' // en app/store/rootReducer.ts
```

### 🔄 COMUNICACIÓN ENTRE FEATURES

```typescript
// ✅ CORRECTO - A través de shared
export const authEvents = {
  LOGIN_SUCCESS: 'auth/loginSuccess',
  LOGOUT: 'auth/logout'
} // en shared/constants/events.ts

// ✅ CORRECTO - A través de contratos públicos
export { useAuth, AuthGuard } from './hooks/useAuth' // en features/auth/index.ts

// ✅ CORRECTO - A través de store global
const globalState = useAppSelector(state => state.auth) // desde cualquier feature
```

### 🚨 ANTI-PATRONES A EVITAR

1. **Lógica fragmentada**: NO dispersar una responsabilidad en múltiples capas
2. **Dependencias circulares**: app/ ↔ features/, shared/ ↔ features/
3. **Funcionalidad duplicada**: Múltiples guards, interceptores, constantes
4. **Imports relativos**: Usar siempre alias absolutos @/
5. **Mezcla de responsabilidades**: pages/ con lógica de negocio