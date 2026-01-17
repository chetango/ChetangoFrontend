export type { UserType, SessionType, AuthContextType } from './types/authTypes'
export { useAuth } from './hooks/useAuth'
export { useActiveRole } from './hooks/useActiveRole'
export { useLogoutMutation } from './api/authApi'
export { LoginForm } from './components/LoginForm'
export { AuthCallback } from './components/AuthCallback'
export { RoleSelector } from './components/RoleSelector/RoleSelector'

// Privado - solo para app/providers
export { authSlice } from './store/authSlice'
export { msalInstance } from './api/msalInstance'