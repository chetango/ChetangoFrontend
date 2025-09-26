// ============================================
// CONTRATO PÚBLICO DE LA FEATURE AUTH
// ============================================

// TIPOS
export type { UserType, SessionType, AuthContextType } from './types/authTypes'

// HOOKS - Solo para routing y componentes
export { useAuth } from './hooks/useAuth'
export { useAuthInterceptor } from './hooks/useAuthInterceptor'

// API
export { useProfileQuery, useSessionQuery, useLogoutMutation } from './api/authApi'

// COMPONENTS
export { LoginForm } from './components/LoginForm'
export { AuthCallback } from './components/AuthCallback'

// STORE
export { authSlice, setLoading, setError, setInitialized, clearError } from './store/authSlice'

// CONFIGURACIÓN
export { msalConfig, loginRequest, tokenRequest } from './api/msalConfig'
export { msalInstance } from './api/msalInstance'