// ============================================
// UNIVERSAL GUARDS - CHETANGO
// ============================================

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth'

export function RequireAuth({ to = '/login' }: { to?: string }) {
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
        {/* QUITAR ESTILOS INLINE EN EL FUTURO*/}
        <div>Cargando... Guardian RequireAuth</div>
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
  
  return <Outlet />
}

export function OnlyGuests({ to = '/dashboard' }: { to?: string }) {
  const { status } = useAuth()
  
  if (status === 'unknown') {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        {/* QUITAR ESTILOS INLINE EN EL FUTURO*/}
        <div>Cargando... Guardian OnlyGuests</div>
      </div>
    )
  }
  
  if (status === 'authenticated') {
    return <Navigate to={to} replace />
  }
  
  return <Outlet />
}

type RequireRoleProps = {
  anyOf?: string[]
  allOf?: string[]
  to?: string
}

export function RequireRole({ anyOf, allOf, to = '/dashboard' }: RequireRoleProps) {
  const { status, session } = useAuth()
  
  if (status === 'unknown') {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        {/* QUITAR ESTILOS INLINE EN EL FUTURO*/}
        <div>Cargando... Guardían RequireRole</div>
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
    return <Navigate to={to} replace />
  }
  
  return <Outlet />
}