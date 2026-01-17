// ============================================
// USE ACTIVE ROLE HOOK - CHETANGO
// ============================================

import { useCallback, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { setAvailableRoles, setActiveRole, clearRoles, restoreActiveRole } from '@/features/auth/store/roleSlice'
import { useAuth } from './useAuth'

export const useActiveRole = () => {
  const dispatch = useAppDispatch()
  const { session } = useAuth()
  const { activeRole, availableRoles } = useAppSelector((state) => state.role)
  const rolesInitialized = useRef(false)

  // Sincronizar roles disponibles cuando cambie la sesión
  // Usar JSON.stringify para comparar arrays por valor, no por referencia
  const rolesKey = session.user?.roles ? JSON.stringify(session.user.roles.sort()) : ''
  
  useEffect(() => {
    if (session.user?.roles && session.user.roles.length > 0) {
      // Solo inicializar una vez para evitar loops
      if (!rolesInitialized.current) {
        rolesInitialized.current = true
        dispatch(setAvailableRoles(session.user.roles))
        dispatch(restoreActiveRole())
      }
    } else if (rolesInitialized.current) {
      rolesInitialized.current = false
      dispatch(clearRoles())
    }
  }, [rolesKey, dispatch])

  // Cambiar rol activo
  const switchRole = useCallback((role: string) => {
    dispatch(setActiveRole(role))
  }, [dispatch])

  // Verificar si el usuario tiene un rol específico
  const hasRole = useCallback((role: string) => {
    return availableRoles.includes(role)
  }, [availableRoles])

  // Verificar si el rol activo tiene permisos para una acción
  const canAccess = useCallback((requiredRoles: string[]) => {
    return activeRole ? requiredRoles.includes(activeRole) : false
  }, [activeRole])

  return {
    activeRole,
    availableRoles,
    switchRole,
    hasRole,
    canAccess,
    hasMultipleRoles: availableRoles.length > 1,
  }
}