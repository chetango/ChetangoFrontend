// ============================================
// CLASE CARD ALUMNO COMPONENT
// Card for student's class view with glassmorphism styling
// Requirements: 6.1
// ============================================

import { Clock, User, MapPin, AlertCircle, Calendar, Eye } from 'lucide-react'
import { GlassPanel, Badge, GlassButton } from '@/design-system'
import type { ClaseAlumno } from '../types/classTypes'
import { formatearHora24, calcularDuracion } from '../utils/dateUtils'

// ============================================
// TYPES
// ============================================

export interface ClaseCardAlumnoProps {
  /** Class data */
  clase: ClaseAlumno
  /** Callback when view detail is clicked */
  onViewDetail?: (clase: ClaseAlumno) => void
  /** Callback when reprogramar is clicked */
  onReprogramar?: (clase: ClaseAlumno) => void
  /** Whether the card is in loading state */
  isLoading?: boolean
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Gets badge variant based on estado
 */
function getEstadoBadgeVariant(
  estado: ClaseAlumno['estado']
): 'error' | 'info' | 'success' | 'none' | 'warning' {
  switch (estado) {
    case 'en_curso':
      return 'error'
    case 'programada':
      return 'info'
    case 'finalizada':
      return 'success'
    case 'cancelada':
      return 'none'
    case 'reprogramada':
      return 'warning'
    default:
      return 'info'
  }
}

/**
 * Gets estado display text
 */
function getEstadoText(estado: ClaseAlumno['estado']): string {
  switch (estado) {
    case 'en_curso':
      return 'En curso'
    case 'programada':
      return 'Confirmada'
    case 'finalizada':
      return 'Finalizada'
    case 'cancelada':
      return 'Cancelada'
    case 'reprogramada':
      return 'Reprogramada'
    default:
      return estado
  }
}

// ============================================
// COMPONENT
// ============================================

/**
 * ClaseCardAlumno - Card for student's class view
 *
 * Features:
 * - "Próximo inicio" alert when minutosParaInicio <= 30
 * - Reprogramación info when puedeReprogramar is true
 * - "Reprogramar" and "Ver Detalles" buttons
 * - Glassmorphism styling
 *
 * Requirements: 6.1
 */
export function ClaseCardAlumno({
  clase,
  onViewDetail,
  onReprogramar,
  isLoading = false,
}: ClaseCardAlumnoProps) {
  const isCancelada = clase.estado === 'cancelada'
  const isProximoInicio =
    clase.minutosParaInicio !== undefined && clase.minutosParaInicio <= 30 && clase.minutosParaInicio > 0

  if (isLoading) {
    return (
      <GlassPanel className="p-5">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-white/10 rounded w-2/3" />
          <div className="h-4 bg-white/10 rounded w-1/2" />
          <div className="h-3 bg-white/10 rounded w-full" />
          <div className="h-10 bg-white/10 rounded w-full" />
        </div>
      </GlassPanel>
    )
  }

  return (
    <GlassPanel
      hover={!isCancelada}
      className={`p-5 ${isCancelada ? 'opacity-60' : ''} ${
        isProximoInicio ? 'ring-2 ring-yellow-500/50' : ''
      }`}
    >
      {/* Próximo Inicio Alert */}
      {isProximoInicio && (
        <div className="mb-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          <p className="text-yellow-300 text-sm">
            ¡Comienza en {clase.minutosParaInicio} minutos!
          </p>
        </div>
      )}

      {/* Header: Nombre + Estado Badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-1">{clase.nombre}</h3>
          <p className="text-sm text-gray-400">{clase.tipo}</p>
        </div>
        <Badge variant={getEstadoBadgeVariant(clase.estado)} shape="pill">
          {getEstadoText(clase.estado)}
        </Badge>
      </div>

      {/* Info Grid */}
      <div className="space-y-3 mb-5">
        {/* Horario */}
        <div className="flex items-center gap-3 text-gray-300">
          <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm">
            {formatearHora24(clase.horaInicio)} - {formatearHora24(clase.horaFin)}
            <span className="text-gray-500 ml-2">
              ({calcularDuracion(clase.horaInicio, clase.horaFin)})
            </span>
          </span>
        </div>

        {/* Profesor */}
        <div className="flex items-center gap-3 text-gray-300">
          <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm">{clase.profesor}</span>
        </div>

        {/* Ubicación */}
        <div className="flex items-center gap-3 text-gray-300">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm">{clase.ubicacion}</span>
        </div>
      </div>

      {/* Reprogramación Info */}
      {clase.puedeReprogramar && clase.horasParaReprogramar && (
        <div className="mb-5 p-3 rounded-xl bg-purple-500/10 border border-purple-500/30">
          <div className="flex items-center gap-2 text-purple-300 text-sm">
            <Calendar className="w-4 h-4" />
            <span>
              Puedes reprogramar hasta {clase.horasParaReprogramar}h antes
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Reprogramar */}
        {clase.puedeReprogramar && onReprogramar && !isCancelada && (
          <GlassButton
            variant="secondary"
            size="sm"
            onClick={() => onReprogramar(clase)}
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Reprogramar</span>
          </GlassButton>
        )}

        {/* Ver Detalles */}
        {onViewDetail && (
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={() => onViewDetail(clase)}
            className="flex items-center gap-2 ml-auto"
          >
            <Eye className="w-4 h-4" />
            <span>Ver Detalles</span>
          </GlassButton>
        )}
      </div>
    </GlassPanel>
  )
}
