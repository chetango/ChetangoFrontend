// ============================================
// COMPLIANCE GUARD HOOK
// ============================================
// Consulta el estado de cumplimiento del tenant actual y
// redirige al onboarding legal si el admin no ha completado
// la aceptación de documentos obligatorios.

import { useAuth } from '@/features/auth'
import { ROUTES } from '@/shared/constants/routes'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEstadoCumplimientoQuery } from '../api/complianceQueries'

/**
 * Devuelve el estado de cumplimiento y aplica el redirect automático
 * si el tenant no puede operar todavía.
 *
 * Úsalo sólo en componentes que envuelvan rutas de admin.
 */
export const useComplianceGuard = () => {
  const { session } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isAdmin = session?.user?.roles?.includes('admin')

  // Solo ejecutar la query si el usuario es admin
  const { data: estado, isLoading } = useEstadoCumplimientoQuery(!!isAdmin)

  useEffect(() => {
    // Si no es admin o no tenemos datos, no hacemos nada
    if (!isAdmin || isLoading || !estado) return

    // Si ya está en el onboarding, no redirigir de nuevo
    if (location.pathname === ROUTES.ONBOARDING_LEGAL) return

    // Si el onboarding no está completo → redirigir
    if (!estado.onboardingCompletado) {
      navigate(ROUTES.ONBOARDING_LEGAL, { replace: true })
      return
    }

    // Si requiere reaceptación Y tiene documentos pendientes obligatorios → redirigir
    if (estado.requiereReaceptacion && estado.documentosPendientes.some(d => d.esObligatorio)) {
      navigate(ROUTES.ONBOARDING_LEGAL, { replace: true })
    }
  }, [isAdmin, isLoading, estado, navigate, location.pathname])

  return {
    cumplimientoLoading: isLoading,
    estado,
    requiereBanner:
      !!estado?.onboardingCompletado &&
      !!estado?.requiereReaceptacion &&
      (estado?.documentosPendientes.length ?? 0) > 0,
    documentosPendientes: estado?.documentosPendientes.length ?? 0,
  }
}
