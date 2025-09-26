// ============================================
// AUTH PROVIDER - CHETANGO
// ============================================
// Solo responsabilidad: Proveer MSAL a la aplicación

import { MsalProvider } from '@azure/msal-react'
import { msalInstance } from '@/features/auth/api/msalInstance'
import { useAuthInterceptor } from '@/features/auth/hooks/useAuthInterceptor'

interface AuthProviderProps {
  children: React.ReactNode
}

const AuthProviderContent = ({ children }: AuthProviderProps) => {
  // Setup HTTP interceptors
  useAuthInterceptor()
  return <>{children}</>
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthProviderContent>{children}</AuthProviderContent>
    </MsalProvider>
  )
}