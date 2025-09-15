// ============================================
// ROUTE GUARDS - CHETANGO
// ============================================

import { Navigate } from 'react-router-dom'
import { ROUTES, USER_ROLES } from '@/shared/constants'

interface ProtectedRouteProps {
  children: React.ReactNode
  roles?: string[]
}

export const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  // TODO: Implementar lógica de autenticación
  const isAuthenticated = false // Placeholder
  const userRole = USER_ROLES.STUDENT // Placeholder

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  // Si se especifican roles y el usuario no tiene permisos
  if (roles && !roles.includes(userRole)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return <>{children}</>
}