// ============================================
// SOLICITUD RENOVACION NOTIFICATION COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import type { SolicitudRenovacionPaqueteDTO } from '@/features/solicitudes/types/solicitudesTypes'
import { CheckCircle, Loader2, Package, X, XCircle } from 'lucide-react'
import { useState } from 'react'

interface SolicitudRenovacionNotificationProps {
  solicitud: SolicitudRenovacionPaqueteDTO
  onDismiss?: () => void
  onApprove?: (idSolicitud: string) => void
  onReject?: (idSolicitud: string) => void
}

export const SolicitudRenovacionNotification = ({
  solicitud,
  onDismiss,
  onApprove,
  onReject
}: SolicitudRenovacionNotificationProps) => {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleApprove = async () => {
    if (onApprove) {
      setIsProcessing(true)
      try {
        await onApprove(solicitud.idSolicitud)
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const handleReject = async () => {
    if (onReject) {
      setIsProcessing(true)
      try {
        await onReject(solicitud.idSolicitud)
      } finally {
        setIsProcessing(false)
      }
    }
  }

  return (
    <GlassPanel className="p-4 relative overflow-hidden group hover:scale-[1.01] transition-all duration-300">
      {/* Ambient glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#c93448]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Close button */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 text-[#9ca3af] hover:text-[#f9fafb] transition-colors"
          disabled={isProcessing}
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="flex items-start gap-4 relative z-10">
        {/* Icon with animation */}
        <div className="w-12 h-12 rounded-xl bg-[rgba(201,52,72,0.15)] flex items-center justify-center shrink-0">
          <Package className="w-6 h-6 text-[#c93448] animate-pulse" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-[#f9fafb] font-semibold text-sm">
              {solicitud.nombreAlumno}
            </h4>
            <span className="text-[#9ca3af] text-xs">
              quiere renovar su paquete
            </span>
          </div>

          {/* Details */}
          <div className="space-y-1 mb-3">
            {solicitud.tipoPaqueteActual && (
              <p className="text-[#9ca3af] text-xs">
                Paquete actual: <span className="text-[#f9fafb]">{solicitud.tipoPaqueteActual}</span>
              </p>
            )}
            {solicitud.clasesRestantes !== null && solicitud.clasesRestantes !== undefined && (
              <p className="text-[#9ca3af] text-xs">
                Clases restantes: <span className="text-[#f59e0b] font-medium">{solicitud.clasesRestantes}</span>
              </p>
            )}
            {solicitud.tipoPaqueteDeseado && (
              <p className="text-[#9ca3af] text-xs">
                Desea: <span className="text-[#f9fafb]">{solicitud.tipoPaqueteDeseado}</span>
              </p>
            )}
            {solicitud.mensajeAlumno && (
              <p className="text-[#9ca3af] text-xs italic mt-2">
                "{solicitud.mensajeAlumno}"
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            {onApprove && (
              <button
                onClick={handleApprove}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#10b981] hover:bg-[#059669] text-white text-xs font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <CheckCircle className="w-3 h-3" />
                )}
                Ver Solicitud
              </button>
            )}
            {onReject && (
              <button
                onClick={handleReject}
                disabled={isProcessing}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] text-[#9ca3af] hover:text-[#f9fafb] text-xs font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <XCircle className="w-3 h-3" />
                )}
                Ignorar
              </button>
            )}
          </div>

          {/* Timestamp */}
          <p className="text-[#6b7280] text-xs mt-2">
            {new Date(solicitud.fechaSolicitud).toLocaleString('es-ES', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    </GlassPanel>
  )
}
