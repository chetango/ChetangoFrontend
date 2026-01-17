// ============================================
// CONSUMPTION HISTORY ITEM COMPONENT
// Displays a single attendance record in the package detail modal
// Requirements: 6.6
// ============================================

import { Calendar } from 'lucide-react'
import { Badge } from '@/design-system'
import type { AsistenciaHistorialDTO } from '../../../types/packageTypes'

interface ConsumptionHistoryItemProps {
  /** Attendance history item data */
  asistencia: AsistenciaHistorialDTO
}

// ============================================
// HELPER FUNCTIONS (exported for testing)
// ============================================

/**
 * Formats ISO date string to localized date format
 * Requirements: 6.6
 */
export function formatHistorialDate(isoDate: string): string {
  try {
    const date = new Date(isoDate)
    return date.toLocaleDateString('es-CO', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return isoDate
  }
}

/**
 * Formats time span strings (HH:mm:ss) to display format (HH:mm)
 * Requirements: 6.6
 */
export function formatTimeSpan(timeSpan: string): string {
  // TimeSpan format from backend: "HH:mm:ss"
  const parts = timeSpan.split(':')
  if (parts.length >= 2) {
    return `${parts[0]}:${parts[1]}`
  }
  return timeSpan
}

/**
 * Formats the horario display combining horaInicio and horaFin
 * Requirements: 6.6
 */
export function formatHorario(horaInicio: string, horaFin: string): string {
  return `${formatTimeSpan(horaInicio)} - ${formatTimeSpan(horaFin)}`
}

/**
 * Gets the badge variant based on descontada status
 * Property 18: Historial Item Display Format
 * - descontada === true: "Descontada" (green/success)
 * - descontada === false: "No descontada" (gray/none)
 * Requirements: 6.6
 */
export function getDescontadaBadgeConfig(descontada: boolean): {
  variant: 'success' | 'none'
  label: string
} {
  return descontada
    ? { variant: 'success', label: 'Descontada' }
    : { variant: 'none', label: 'No descontada' }
}

// ============================================
// COMPONENT
// ============================================

/**
 * ConsumptionHistoryItem - Displays a single attendance record
 *
 * Features:
 * - Calendar icon
 * - Tipo de clase
 * - Fecha y horario formateados
 * - Badge "Descontada" (verde) o "No descontada" (gris)
 *
 * Requirements: 6.6
 */
export function ConsumptionHistoryItem({ asistencia }: ConsumptionHistoryItemProps) {
  const badgeConfig = getDescontadaBadgeConfig(asistencia.descontada)

  return (
    <div
      className="
        flex items-center justify-between
        p-3
        rounded-lg
        bg-[rgba(255,255,255,0.03)]
        border border-[rgba(255,255,255,0.06)]
        hover:bg-[rgba(255,255,255,0.05)]
        transition-colors duration-200
      "
    >
      {/* Left side: Icon, tipo de clase, fecha y horario */}
      <div className="flex items-center gap-3">
        {/* Calendar icon */}
        <div
          className="
            w-9 h-9
            rounded-lg
            flex items-center justify-center
            bg-[rgba(201,52,72,0.15)]
            border border-[rgba(201,52,72,0.3)]
          "
        >
          <Calendar className="w-4 h-4 text-[#c93448]" />
        </div>

        {/* Tipo de clase and date/time info */}
        <div className="flex flex-col">
          <span className="text-[#f9fafb] font-medium text-sm">
            {asistencia.tipoClase}
          </span>
          <div className="flex items-center gap-2 text-[#9ca3af] text-xs">
            <span>{formatHistorialDate(asistencia.fecha)}</span>
            <span className="text-[#6b7280]">•</span>
            <span>{formatHorario(asistencia.horaInicio, asistencia.horaFin)}</span>
          </div>
        </div>
      </div>

      {/* Right side: Badge */}
      <Badge variant={badgeConfig.variant} shape="pill">
        {badgeConfig.label}
      </Badge>
    </div>
  )
}
