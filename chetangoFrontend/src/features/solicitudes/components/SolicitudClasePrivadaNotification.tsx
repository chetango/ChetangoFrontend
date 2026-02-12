// ============================================
// SOLICITUD CLASE PRIVADA NOTIFICATION COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import type { SolicitudClasePrivadaDTO } from '@/features/solicitudes/types/solicitudesTypes'
import { Calendar, CheckCircle, Clock, Loader2, Star, X, XCircle } from 'lucide-react'
import { useState } from 'react'

interface SolicitudClasePrivadaNotificationProps {
  solicitud: SolicitudClasePrivadaDTO
  onDismiss?: () => void
  onApprove?: (idSolicitud: string) => void
  onReject?: (idSolicitud: string) => void
}

export const SolicitudClasePrivadaNotification = ({
  solicitud,
  onDismiss,
  onApprove,
  onReject
}: SolicitudClasePrivadaNotificationProps) => {
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
      <div className="absolute inset-0 bg-gradient-to-r from-[#7c5af8]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

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
        <div className="w-12 h-12 rounded-xl bg-[rgba(124,90,248,0.15)] flex items-center justify-center shrink-0">
          <Star className="w-6 h-6 text-[#7c5af8] animate-pulse" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-[#f9fafb] font-semibold text-sm">
              {solicitud.nombreAlumno}
            </h4>
            <span className="text-[#9ca3af] text-xs">
              solicita clase privada
            </span>
          </div>

          {/* Details */}
          <div className="space-y-1 mb-3">
            {solicitud.tipoClaseDeseado && (
              <p className="text-[#9ca3af] text-xs">
                Tipo: <span className="text-[#f9fafb]">{solicitud.tipoClaseDeseado}</span>
              </p>
            )}
            {solicitud.fechaPreferida && (
              <div className="flex items-center gap-2 text-[#9ca3af] text-xs">
                <Calendar className="w-3 h-3" />
                <span>
                  Fecha preferida: <span className="text-[#f9fafb]">
                    {new Date(solicitud.fechaPreferida).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </span>
              </div>
            )}
            {solicitud.horaPreferida && (
              <div className="flex items-center gap-2 text-[#9ca3af] text-xs">
                <Clock className="w-3 h-3" />
                <span>
                  Hora: <span className="text-[#f9fafb]">{solicitud.horaPreferida}</span>
                </span>
              </div>
            )}
            {solicitud.observacionesAlumno && (
              <p className="text-[#9ca3af] text-xs italic mt-2">
                "{solicitud.observacionesAlumno}"
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            {onApprove && (
              <button
                onClick={handleApprove}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#7c5af8] hover:bg-[#6b4fd6] text-white text-xs font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <CheckCircle className="w-3 h-3" />
                )}
                Agendar
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
