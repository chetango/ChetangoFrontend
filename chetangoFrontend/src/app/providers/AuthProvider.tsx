import { createContext, useContext } from 'react'
import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { msalConfig } from '@/features/auth/api/msalConfig'
import { useAuthInterceptor } from '@/features/auth/hooks/useAuthInterceptor'

// INSTANCIA MSAL SINGLETON
const msalInstance = new PublicClientApplication(msalConfig)

// CONTEXTO PARA INSTANCIA MSAL (NO ESTADO)
const MsalInstanceContext = createContext<PublicClientApplication | null>(null)

interface AuthProviderProps {
  children: React.ReactNode
}

const AuthProviderContent = ({ children }: AuthProviderProps) => {
  // Setup HTTP interceptors for authentication
  useAuthInterceptor()
  
  return (
    <MsalInstanceContext.Provider value={msalInstance}>
      {children}
    </MsalInstanceContext.Provider>
  )
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthProviderContent>{children}</AuthProviderContent>
    </MsalProvider>
  )
}

// HOOK PARA OBTENER INSTANCIA MSAL
export const useMsalInstance = () => {
  const context = useContext(MsalInstanceContext)
  if (!context) {
    throw new Error('useMsalInstance must be used within AuthProvider')
  }
  return context
}