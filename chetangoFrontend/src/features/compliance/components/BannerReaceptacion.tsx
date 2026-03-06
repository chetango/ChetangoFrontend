// ============================================
// BANNER REACEPTACION
// ============================================
// Banner no intrusivo que avisa al admin que hay documentos
// actualizados que requieren reaceptación, con link a la página.

import { AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'

interface BannerReaceptacionProps {
  documentosPendientes: number
}

export const BannerReaceptacion = ({ documentosPendientes }: BannerReaceptacionProps) => {
  const [cerrado, setCerrado] = useState(false)
  const navigate = useNavigate()

  if (cerrado || documentosPendientes === 0) return null

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between gap-3 text-sm">
      <div className="flex items-center gap-2 text-amber-800">
        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
        <span>
          Tienes{' '}
          <strong>
            {documentosPendientes} documento{documentosPendientes > 1 ? 's' : ''} legal
            {documentosPendientes > 1 ? 'es' : ''}
          </strong>{' '}
          actualizados que requieren tu aceptación para seguir operando.
        </span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={() => navigate(ROUTES.ONBOARDING_LEGAL)}
          className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-xs font-medium transition"
        >
          Revisar y aceptar
        </button>
        <button
          type="button"
          onClick={() => setCerrado(true)}
          className="text-amber-500 hover:text-amber-700 transition"
          aria-label="Cerrar aviso"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
