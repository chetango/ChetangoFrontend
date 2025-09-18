// ============================================
// CONTRATO PÚBLICO DE LA FEATURE AUTH
// ============================================

// TIPOS
export type { UserType, SessionType, AuthContextType } from './types/authTypes'

// HOOKS
export { useAuth } from './hooks/useAuth'
export { useRequireAuth } from './hooks/useRequireAuth'

// STORE
export { authSlice, setLoading, setError, setInitialized, clearError } from './store/authSlice'

// CONFIGURACIÓN
export { msalConfig, loginRequest, tokenRequest } from './api/msalConfig'