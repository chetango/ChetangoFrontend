import { createContext, useContext, useEffect } from 'react'
import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { msalConfig } from '@/features/auth/api/msalConfig'

// INSTANCIA MSAL SINGLETON
const msalInstance = new PublicClientApplication(msalConfig)

// CONTEXTO PARA INSTANCIA MSAL (NO ESTADO)
const MsalInstanceContext = createContext<PublicClientApplication | null>(null)

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  useEffect(() => {
    // Inicializar MSAL
    msalInstance.initialize()
  }, [])

  return (
    <MsalProvider instance={msalInstance}>
      <MsalInstanceContext.Provider value={msalInstance}>
        {children}
      </MsalInstanceContext.Provider>
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