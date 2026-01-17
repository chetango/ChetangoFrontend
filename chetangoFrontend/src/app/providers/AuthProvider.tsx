import { MsalProvider } from '@azure/msal-react'
import { msalInstance } from '@/features/auth/api/msalInstance'
import { useAuthInterceptor } from '@/shared/api/hooks/useAuthInterceptor'

interface AuthProviderProps {
  children: React.ReactNode
}

// Componente interno que usa el interceptor DENTRO del MsalProvider
const AuthInterceptorSetup = ({ children }: { children: React.ReactNode }) => {
  useAuthInterceptor()
  return <>{children}</>
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthInterceptorSetup>
        {children}
      </AuthInterceptorSetup>
    </MsalProvider>
  )
}