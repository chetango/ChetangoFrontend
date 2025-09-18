// ============================================
// ROUTE GUARDS - CHETANGO
// ============================================

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { ROUTES } from '@/shared/constants/routes'

interface ProtectedRouteProps {
  children: React.ReactNode
  roles?: string[] // Para uso futuro con backend
}

export const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { session, authState } = useAuth()
  const location = useLocation()

  // Mostrar loading mientras se inicializa
  if (!authState.isInitialized || authState.isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Verificando autenticación...</div>
      </div>
    )
  }

  // Si no está autenticado, redirigir a login
  if (!session.isAuthenticated) {
    return (
      <Navigate 
        to={ROUTES.LOGIN} 
        state={{ returnUrl: location.pathname + location.search }}
        replace 
      />
    )
  }

  // TODO: Implementar validación de roles cuando tengas backend
  // if (roles && session.user?.roles) {
  //   const hasRequiredRole = roles.some(role => session.user.roles.includes(role))
  //   if (!hasRequiredRole) {
  //     return <Navigate to={ROUTES.DASHBOARD} replace />
  //   }
  // }

  return <>{children}</>
}