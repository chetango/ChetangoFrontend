export { useLogoutMutation } from './api/authApi'
export { useUserProfileQuery, type UserProfile, type UserProfileResponse } from './api/profileQueries'
export { AuthCallback } from './components/AuthCallback'
export { LoginForm } from './components/LoginForm'
export { LoginFormAphellion } from './components/LoginFormAphellion'
export { RoleSelector } from './components/RoleSelector/RoleSelector'
export { useActiveRole } from './hooks/useActiveRole'
export { useAuth } from './hooks/useAuth'
export type { AuthContextType, SessionType, UserType } from './types/authTypes'

// Privado - solo para app/providers
export { msalInstance } from './api/msalInstance'
export { authSlice } from './store/authSlice'
