// ============================================
// APP PROVIDERS - CHETANGO
// ============================================

import { ReduxProvider } from '@/app/providers/ReduxProvider'
import { QueryProvider } from '@/app/providers/QueryProvider'

interface AppProvidersProps {
  children: React.ReactNode
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <ReduxProvider>
      <QueryProvider>
        {children}
      </QueryProvider>
    </ReduxProvider>
  )
}