// ============================================
// CONTRATO PÚBLICO DE LA FEATURE AUTH
// ============================================

// TIPOS
export type { UserType, SessionType, AuthContextType } from './types/authTypes'

// HOOKS
export { useAuth } from './hooks/useAuth'
export { useRequireAuth } from './hooks/useRequireAuth'
export { useAuthInterceptor } from './hooks/useAuthInterceptor'

// API
export { useProfileQuery, useSessionQuery, useLogoutMutation } from './api/authApi'

// COMPONENTS
export { AuthGuard } from './components/AuthGuard'
export { LoginForm } from './components/LoginForm'

// STORE
export { authSlice, setLoading, setError, setInitialized, clearError } from './store/authSlice'

// CONFIGURACIÓN
export { msalConfig, loginRequest, tokenRequest } from './api/msalConfig'