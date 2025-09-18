// ============================================
// UTILIDADES DE TESTING - CHETANGO
// ============================================

import { render, type RenderOptions } from '@testing-library/react'
import { type ReactElement } from 'react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { store } from '@/app/store'

// QueryClient singleton para testing
const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 0,
    },
  },
})

// Wrapper con providers necesarios
interface AllTheProvidersProps {
  children: React.ReactNode
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {

  return (
    <Provider store={store}>
      <QueryClientProvider client={testQueryClient}>
        {children}
      </QueryClientProvider>
    </Provider>
  )
}

// Render personalizado con providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Helpers específicos para Chetango
export const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@chetango.com',
  role: 'STUDENT' as const,
}

export const mockAttendance = {
  id: '1',
  userId: '1',
  date: '2024-01-15',
  status: 'PRESENT' as const,
}

export const mockPayment = {
  id: '1',
  userId: '1',
  amount: 50000,
  status: 'PAID' as const,
  date: '2024-01-15',
}