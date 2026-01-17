// ============================================
// UNIVERSAL GUARDS - CHETANGO
// ============================================

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { ROUTE_ACCESS } from '@/shared/constants/routes'

interface GuardProps {
  to?: string
  children: React.ReactNode
}

export function RequireAuth({ to = '/login', children }: GuardProps) {
  const { status } = useAuth()
  const location = useLocation()
  
  if (status === 'unknown') {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Cargando...</div>
      </div>
    )
  }
  
  if (status !== 'authenticated') {
    return (
      <Navigate 
        to={to} 
        replace 
        state={{ from: location }} 
      />
    )
  }
  
  return <>{children}</>
}

export function OnlyGuests({ to = '/dashboard', children }: GuardProps) {
  const { status } = useAuth()
  
  if (status === 'unknown') {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Cargando...</div>
      </div>
    )
  }
  
  if (status === 'authenticated') {
    return <Navigate to={to} replace />
  }
  
  return <>{children}</>
}

interface RequireRoleProps {
  anyOf?: string[]
  allOf?: string[]
  to?: string
  children: React.ReactNode
}

export function RequireRole({ anyOf, allOf, to, children }: RequireRoleProps) {
  const { status, session } = useAuth()
  
  if (status === 'unknown') {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Cargando...</div>
      </div>
    )
  }
  
  if (status !== 'authenticated') {
    return <Navigate to="/login" replace />
  }

  const roles = session?.user?.roles ?? []
  const okAny = anyOf ? anyOf.some(r => roles.includes(r)) : true
  const okAll = allOf ? allOf.every(r => roles.includes(r)) : true

  if (!okAny || !okAll) {
    const defaultRoute = to || getDefaultRouteForUser(roles)
    return <Navigate to={defaultRoute} replace />
  }
  
  return <>{children}</>
}

function getDefaultRouteForUser(roles: string[]): string {
  return ROUTE_ACCESS.getDefaultRoute(roles)
}