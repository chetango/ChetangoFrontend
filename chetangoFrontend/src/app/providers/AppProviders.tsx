import { AuthProvider } from '@/app/providers/AuthProvider'
import { QueryProvider } from '@/app/providers/QueryProvider'
import { ReduxProvider } from '@/app/providers/ReduxProvider'
import { Toaster } from '@/design-system/molecules/Toast'
import { UserQuickViewProvider } from '@/features/users'
import { networkStatusService } from '@/shared/services/network/NetworkStatusService'
import { NetworkStatusBanner } from '@/shared/components/NetworkStatusBanner'
import { useEffect } from 'react'

interface AppProvidersProps {
  children: React.ReactNode
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  // Inicializar NetworkStatusService al montar la app
  useEffect(() => {
    console.log('[AppProviders] Initializing network status service...')
    networkStatusService.initialize()
    
    return () => {
      console.log('[AppProviders] Destroying network status service...')
      networkStatusService.destroy()
    }
  }, [])

  return (
    <ReduxProvider>
      <QueryProvider>
        <AuthProvider>
          <UserQuickViewProvider>
            <NetworkStatusBanner />
            {children}
            <Toaster />
          </UserQuickViewProvider>
        </AuthProvider>
      </QueryProvider>
    </ReduxProvider>
  )
}