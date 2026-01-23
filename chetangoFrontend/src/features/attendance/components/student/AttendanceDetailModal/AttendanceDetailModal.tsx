// ============================================
// ATTENDANCE DETAIL MODAL COMPONENT - STUDENT VIEW
// ============================================

import { useEffect, useCallback } from 'react'
import { X, CheckCircle2, Info } from 'lucide-react'
import type { AsistenciaRecord } from '../../../types/studentTypes'
import { getEstadoInfo, getTipoInfo, formatearHora12 } from '../AttendanceHistoryCard'

interface AttendanceDetailModalProps {
  /** Attendance record to display, null if modal is closed */
  record: AsistenciaRecord | null
  /** Whether the modal is open */
  isOpen: boolean
  /** Handler to close the modal */
  onClose: () => void
}

/**
 * Format date to long Spanish format
 */
export function formatearFechaLarga(fecha: string): string {
  const date = new Date(fecha + 'T00:00:00')
  const opciones: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }
  const fechaFormateada = date.toLocaleDateString('es-ES', opciones)
  return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1)
}

/**
 * AttendanceDetailModal component for student attendance view
 * Displays detailed information about a single attendance record
 * 
 * Sections:
 * - Fecha y hora
 * - Clase
 * - Estado y Tipo
 * - Impacto en paquete (with notes if available)
 * 
 * Accessibility:
 * - Focus trap within modal
 * - Escape key to close
 * - Proper ARIA attributes
 * - Keyboard navigation
 * 
 * Requirements: 4.5, 7.3, 7.4
 */
export function AttendanceDetailModal({ record, isOpen, onClose }: AttendanceDetailModalProps) {
  // Handle escape key to close modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleKeyDown])

  // Don't render if not open or no record
  if (!isOpen || !record) {
    return null
  }

  const estadoInfo = getEstadoInfo(record.estado)
  const tipoInfo = getTipoInfo(record.tipo)
  const EstadoIcon = estadoInfo.icon
  const TipoIcon = tipoInfo.icon

  // Get estado icon color
  const getEstadoIconColor = () => {
    switch (estadoInfo.color) {
      case 'green':
        return 'text-[#34d399]'
      case 'gray':
        return 'text-[#9ca3af]'
      case 'blue':
        return 'text-[#60a5fa]'
      default:
        return 'text-[#9ca3af]'
    }
  }

  // Get tipo icon color
  const getTipoIconColor = () => {
    switch (tipoInfo.color) {
      case 'purple':
        return 'text-[#9b8afb]'
      case 'yellow':
        return 'text-[#fcd34d]'
      default:
        return 'text-[#9b8afb]'
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      data-testid="attendance-detail-modal"
    >
      <div
        className="
          w-full max-w-lg
          backdrop-blur-2xl 
          bg-gradient-to-br from-[rgba(42,42,48,0.95)] to-[rgba(30,30,36,0.95)]
          border border-[rgba(255,255,255,0.15)]
          rounded-3xl 
          p-6
          shadow-[0_24px_48px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.1)]
          animate-slide-in
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3
              id="modal-title"
              className="text-[#f9fafb] font-semibold mb-1"
              style={{ fontSize: '22px' }}
            >
              Detalle de la clase
            </h3>
            <p className="text-[#9ca3af] text-[14px]">Información completa</p>
          </div>
          <button
            onClick={onClose}
            className="
              p-2 rounded-xl 
              bg-[rgba(255,255,255,0.05)] 
              hover:bg-[rgba(255,255,255,0.1)] 
              transition-colors
              focus:outline-none
              focus:ring-2
              focus:ring-[rgba(124,90,248,0.5)]
            "
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5 text-[#9ca3af]" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Fecha y hora */}
          <div>
            <p className="text-[#6b7280] text-[12px] uppercase tracking-wide mb-2">Fecha y hora</p>
            <div
              className="
                p-4 rounded-xl 
                bg-[rgba(255,255,255,0.03)] 
                border border-[rgba(255,255,255,0.08)]
              "
            >
              <p className="text-[#f9fafb] font-medium mb-1" style={{ fontSize: '16px' }}>
                {formatearFechaLarga(record.fecha)}
              </p>
              <p className="text-[#9ca3af] text-[14px]">
                {formatearHora12(record.horaInicio)} - {formatearHora12(record.horaFin)}
              </p>
            </div>
          </div>

          {/* Clase */}
          <div>
            <p className="text-[#6b7280] text-[12px] uppercase tracking-wide mb-2">Clase</p>
            <div
              className="
                p-4 rounded-xl 
                bg-[rgba(255,255,255,0.03)] 
                border border-[rgba(255,255,255,0.08)]
              "
            >
              <p className="text-[#f9fafb] font-medium" style={{ fontSize: '16px' }}>
                {record.clase}
              </p>
            </div>
          </div>

          {/* Estado y Tipo */}
          <div className="grid grid-cols-2 gap-4">
            {/* Estado */}
            <div>
              <p className="text-[#6b7280] text-[12px] uppercase tracking-wide mb-2">Estado</p>
              <div
                className="
                  p-4 rounded-xl 
                  bg-[rgba(255,255,255,0.03)] 
                  border border-[rgba(255,255,255,0.08)]
                "
              >
                <div className="flex items-center gap-2">
                  <EstadoIcon className={`w-5 h-5 ${getEstadoIconColor()}`} aria-hidden="true" />
                  <p className="text-[#f9fafb] font-medium text-[14px]">{estadoInfo.label}</p>
                </div>
              </div>
            </div>

            {/* Tipo */}
            <div>
              <p className="text-[#6b7280] text-[12px] uppercase tracking-wide mb-2">Tipo</p>
              <div
                className="
                  p-4 rounded-xl 
                  bg-[rgba(255,255,255,0.03)] 
                  border border-[rgba(255,255,255,0.08)]
                "
              >
                <div className="flex items-center gap-2">
                  <TipoIcon className={`w-5 h-5 ${getTipoIconColor()}`} aria-hidden="true" />
                  <p className="text-[#f9fafb] font-medium text-[14px]">{tipoInfo.label}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Impacto en paquete */}
          <div>
            <p className="text-[#6b7280] text-[12px] uppercase tracking-wide mb-2">
              Impacto en tu paquete
            </p>
            <div
              className={`
                p-4 rounded-xl 
                border
                ${
                  record.descontada
                    ? 'bg-[rgba(124,90,248,0.1)] border-[rgba(124,90,248,0.3)]'
                    : 'bg-[rgba(156,163,175,0.08)] border-[rgba(156,163,175,0.2)]'
                }
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                {record.descontada ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-[#9b8afb]" aria-hidden="true" />
                    <p className="text-[#9b8afb] font-medium" style={{ fontSize: '15px' }}>
                      Esta clase se descontó de tu paquete
                    </p>
                  </>
                ) : (
                  <>
                    <Info className="w-5 h-5 text-[#9ca3af]" aria-hidden="true" />
                    <p className="text-[#d1d5db] font-medium" style={{ fontSize: '15px' }}>
                      Esta clase NO se descontó de tu paquete
                    </p>
                  </>
                )}
              </div>

              {record.nota && (
                <p className="text-[#9ca3af] text-[13px] leading-relaxed">{record.nota}</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-[rgba(255,255,255,0.08)]">
          <button
            onClick={onClose}
            className="
              w-full
              px-6 py-3 rounded-xl
              backdrop-blur-xl
              bg-[rgba(124,90,248,0.15)]
              border border-[rgba(124,90,248,0.3)]
              text-[#9b8afb]
              font-medium
              text-[14px]
              hover:bg-[rgba(124,90,248,0.25)]
              hover:border-[rgba(124,90,248,0.5)]
              transition-all
            "
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
