import { AuthProvider } from '@/app/providers/AuthProvider'
import { QueryProvider } from '@/app/providers/QueryProvider'
import { ReduxProvider } from '@/app/providers/ReduxProvider'
import { Toaster } from '@/design-system/molecules/Toast'
import { UserQuickViewProvider } from '@/features/users'

interface AppProvidersProps {
  children: React.ReactNode
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <ReduxProvider>
      <QueryProvider>
        <AuthProvider>
          <UserQuickViewProvider>
            {children}
            <Toaster />
          </UserQuickViewProvider>
        </AuthProvider>
      </QueryProvider>
    </ReduxProvider>
  )
}