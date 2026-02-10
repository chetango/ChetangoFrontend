// ============================================
// CLASE CARD COMPONENT
// Displays a class card with glassmorphism styling
// Requirements: 3.4, 3.5, 3.6, 6.6, 7.5, 12.1, 12.2
// ============================================

import { Badge, GlassButton, GlassPanel } from '@/design-system'
import { ArrowRight, CheckCircle, Clock, Edit2, Users, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { ClaseEstado, ClaseListItemDTO } from '../types/classTypes'

// ============================================
// TYPES
// ============================================

export interface ClaseCardProps {
  /** Class data from API */
  clase: ClaseListItemDTO
  /** Calculated estado based on date */
  estado: ClaseEstado
  /** Professor name (optional, for display) */
  nombreProfesor?: string
  /** Callback when edit button is clicked */
  onEdit?: (idClase: string) => void
  /** Callback when cancel button is clicked */
  onCancel?: (idClase: string) => void
  /** Callback when complete button is clicked */
  onComplete?: (idClase: string) => void
  /** Callback when view detail is clicked */
  onViewDetail?: (idClase: string) => void
  /** Whether the card is in loading state */
  isLoading?: boolean
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Formats time from HH:mm:ss to HH:mm
 */
export function formatTime(time: string): string {
  return time.substring(0, 5)
}

/**
 * Calculates duration string from start and end times
 */
export function calculateDuration(horaInicio: string, horaFin: string): string {
  const [startH, startM] = horaInicio.split(':').map(Number)
  const [endH, endM] = horaFin.split(':').map(Number)

  const totalMinutes = endH * 60 + endM - (startH * 60 + startM)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}min`
  if (hours > 0) return `${hours}h`
  return `${minutes}min`
}

/**
 * Gets badge variant based on estado
 * Requirements: 3.5
 */
export function getEstadoBadgeVariant(
  estado: ClaseEstado
): 'error' | 'info' | 'success' | 'none' {
  switch (estado) {
    case 'hoy':
      return 'error' // Red
    case 'programada':
      return 'info' // Purple
    case 'completada':
      return 'success' // Green
    case 'cancelada':
      return 'none' // Gray
    default:
      return 'info'
  }
}

/**
 * Gets estado display text
 */
export function getEstadoText(estado: ClaseEstado): string {
  switch (estado) {
    case 'hoy':
      return 'Hoy'
    case 'programada':
      return 'Programada'
    case 'completada':
      return 'Completada'
    case 'cancelada':
      return 'Cancelada'
    default:
      return estado
  }
}

/**
 * Calculates capacity percentage
 */
export function calculateCapacityPercentage(
  totalAsistencias: number,
  cupoMaximo: number
): number {
  if (cupoMaximo === 0) return 0
  return Math.min(100, Math.round((totalAsistencias / cupoMaximo) * 100))
}

/**
 * Gets capacity bar color based on percentage
 */
export function getCapacityBarColor(percentage: number): string {
  if (percentage >= 90) return 'bg-red-500'
  if (percentage >= 70) return 'bg-yellow-500'
  return 'bg-emerald-500'
}


// ============================================
// COMPONENT
// ============================================

/**
 * ClaseCard - Displays a class card with glassmorphism styling
 *
 * Features:
 * - Estado badge (Hoy/Programada/Completada/Cancelada)
 * - Time display with duration
 * - Capacity progress bar
 * - Edit/Cancel buttons (conditional visibility)
 * - Navigate to attendance button
 *
 * Requirements: 3.4, 3.5, 3.6, 6.6, 7.5, 12.1, 12.2
 */
export function ClaseCard({
  clase,
  estado,
  nombreProfesor,
  onEdit,
  onCancel,
  onComplete,
  onViewDetail,
  isLoading = false,
}: ClaseCardProps) {
  const navigate = useNavigate()

  const capacityPercentage = calculateCapacityPercentage(
    clase.totalAsistencias,
    clase.cupoMaximo
  )

  // Determine if action buttons should be visible
  // Requirements: 6.6, 7.5
  const canEdit = estado === 'hoy' || estado === 'programada'
  const canCancel = estado === 'hoy' || estado === 'programada'
  const canNavigateToAttendance = estado !== 'cancelada'
  const canComplete = clase.estado !== 'Completada' && clase.estado !== 'Cancelada'

  // Handle navigation to attendance page
  // Requirements: 12.1, 12.2
  const handleNavigateToAttendance = () => {
    navigate(`/admin/attendance?claseId=${clase.idClase}`)
  }

  // Opacity for cancelled classes
  const cardOpacity = estado === 'cancelada' ? 'opacity-60' : ''

  if (isLoading) {
    return (
      <GlassPanel className={`p-4 ${cardOpacity}`}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-white/10 rounded w-1/3" />
          <div className="h-3 bg-white/10 rounded w-1/2" />
          <div className="h-2 bg-white/10 rounded w-full" />
        </div>
      </GlassPanel>
    )
  }

  return (
    <GlassPanel hover={canEdit} className={`p-4 min-w-[380px] ${cardOpacity}`}>
      {/* Header: Tipo + Estado Badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">{clase.tipoClase}</h3>
          {nombreProfesor && (
            <p className="text-sm text-gray-400">{nombreProfesor}</p>
          )}
        </div>
        <Badge variant={getEstadoBadgeVariant(estado)} shape="pill">
          {getEstadoText(estado)}
        </Badge>
      </div>

      {/* Time Info */}
      <div className="flex items-center gap-2 text-gray-300 mb-3">
        <Clock className="w-4 h-4 text-gray-400" />
        <span className="text-sm">
          {formatTime(clase.horaInicio)} - {formatTime(clase.horaFin)}
        </span>
        <span className="text-xs text-gray-500">
          ({calculateDuration(clase.horaInicio, clase.horaFin)})
        </span>
      </div>

      {/* Capacity Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 text-gray-300">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm">
              {clase.totalAsistencias} / {clase.cupoMaximo}
            </span>
          </div>
          <span className="text-xs text-gray-500">{capacityPercentage}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full ${getCapacityBarColor(capacityPercentage)} transition-all duration-300`}
            style={{ width: `${capacityPercentage}%` }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* View Detail Button */}
        {onViewDetail && (
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={() => onViewDetail(clase.idClase)}
            className="text-xs"
          >
            Ver Detalle
          </GlassButton>
        )}

        {/* Navigate to Attendance - Requirements: 12.1, 12.2 */}
        {canNavigateToAttendance && (
          <GlassButton
            variant="secondary"
            size="sm"
            onClick={handleNavigateToAttendance}
            className="text-xs flex items-center gap-1"
          >
            <span>Ir a Asistencia</span>
            <ArrowRight className="w-3 h-3" />
          </GlassButton>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Complete Button */}
        {canComplete && onComplete && (
          <GlassButton
            variant="secondary"
            size="sm"
            onClick={() => onComplete(clase.idClase)}
            title="Completar clase y generar pagos"
            className="text-xs flex items-center gap-1 !bg-emerald-500/20 !border-emerald-500/40 hover:!bg-emerald-500/30"
          >
            <CheckCircle className="w-3 h-3" />
            <span>Completar</span>
          </GlassButton>
        )}

        {/* Edit Button - Requirements: 6.6 */}
        {canEdit && onEdit && (
          <GlassButton
            variant="icon"
            onClick={() => onEdit(clase.idClase)}
            title="Editar clase"
            className="!p-2"
          >
            <Edit2 className="w-4 h-4" />
          </GlassButton>
        )}

        {/* Cancel Button - Requirements: 7.5 */}
        {canCancel && onCancel && (
          <GlassButton
            variant="icon"
            onClick={() => onCancel(clase.idClase)}
            title="Cancelar clase"
            className="!p-2 hover:!bg-red-500/20 hover:!border-red-500/40"
          >
            <X className="w-4 h-4" />
          </GlassButton>
        )}
      </div>
    </GlassPanel>
  )
}
