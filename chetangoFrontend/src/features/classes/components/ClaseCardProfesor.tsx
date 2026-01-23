// ============================================
// CLASE CARD PROFESOR COMPONENT
// Card for profesor's class view with glassmorphism styling
// Requirements: 5.1
// ============================================

import { useNavigate } from 'react-router-dom'
import { Clock, Users, MapPin, Sparkles, AlertTriangle, ArrowRight, Eye } from 'lucide-react'
import { GlassPanel, Badge, GlassButton } from '@/design-system'
import type { ClaseProfesor } from '../types/classTypes'
import { formatearHora24, calcularDuracion } from '../utils/dateUtils'

// ============================================
// TYPES
// ============================================

export interface ClaseCardProfesorProps {
  /** Class data */
  clase: ClaseProfesor
  /** Callback when view detail is clicked */
  onViewDetail?: (clase: ClaseProfesor) => void
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
  estado: ClaseProfesor['estado']
): 'error' | 'info' | 'success' | 'none' {
  switch (estado) {
    case 'en_curso':
      return 'error'
    case 'programada':
      return 'info'
    case 'finalizada':
      return 'success'
    case 'cancelada':
      return 'none'
    default:
      return 'info'
  }
}

/**
 * Gets estado display text
 */
function getEstadoText(estado: ClaseProfesor['estado']): string {
  switch (estado) {
    case 'en_curso':
      return 'En curso'
    case 'programada':
      return 'Programada'
    case 'finalizada':
      return 'Finalizada'
    case 'cancelada':
      return 'Cancelada'
    default:
      return estado
  }
}

// ============================================
// COMPONENT
// ============================================

/**
 * ClaseCardProfesor - Card for profesor's class view
 *
 * Features:
 * - "En curso" badge with sparkles icon
 * - Alert banner when present
 * - "Ir a Asistencia" and "Ver Detalle" buttons
 * - Glassmorphism styling
 *
 * Requirements: 5.1
 */
export function ClaseCardProfesor({
  clase,
  onViewDetail,
  isLoading = false,
}: ClaseCardProfesorProps) {
  const navigate = useNavigate()

  const isEnCurso = clase.estado === 'en_curso'
  const isCancelada = clase.estado === 'cancelada'

  // Handle navigation to attendance page
  const handleNavigateToAttendance = () => {
    navigate(`/profesor/attendance?claseId=${clase.id}`)
  }

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
        isEnCurso ? 'ring-2 ring-[#c93448]/50' : ''
      }`}
    >
      {/* Alert Banner */}
      {clase.alerta && (
        <div className="mb-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-300 text-sm font-medium">
              {clase.alerta.tipo === 'cambio_horario' && 'Cambio de horario'}
              {clase.alerta.tipo === 'cancelada' && 'Clase cancelada'}
              {clase.alerta.tipo === 'baja_asistencia' && 'Baja asistencia'}
            </p>
            <p className="text-yellow-200/70 text-xs mt-0.5">{clase.alerta.mensaje}</p>
          </div>
        </div>
      )}

      {/* Header: Nombre + Estado Badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-1">{clase.nombre}</h3>
          <p className="text-sm text-gray-400">{clase.tipo}</p>
        </div>
        <Badge
          variant={getEstadoBadgeVariant(clase.estado)}
          shape="pill"
          className={isEnCurso ? 'flex items-center gap-1.5' : ''}
        >
          {isEnCurso && <Sparkles className="w-3.5 h-3.5" />}
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

        {/* Ubicación */}
        <div className="flex items-center gap-3 text-gray-300">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm">{clase.ubicacion}</span>
        </div>

        {/* Inscriptos */}
        <div className="flex items-center gap-3 text-gray-300">
          <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm">
            {clase.inscriptos} / {clase.capacidad} inscriptos
          </span>
        </div>
      </div>

      {/* Observaciones */}
      {clase.observaciones && (
        <div className="mb-5 p-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-gray-400 text-xs mb-1">Observaciones</p>
          <p className="text-gray-300 text-sm">{clase.observaciones}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Ir a Asistencia */}
        {!isCancelada && (
          <GlassButton
            variant="primary"
            size="sm"
            onClick={handleNavigateToAttendance}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <span>Ir a Asistencia</span>
            <ArrowRight className="w-4 h-4" />
          </GlassButton>
        )}

        {/* Ver Detalle */}
        {onViewDetail && (
          <GlassButton
            variant="secondary"
            size="sm"
            onClick={() => onViewDetail(clase)}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            <span>Ver Detalle</span>
          </GlassButton>
        )}
      </div>
    </GlassPanel>
  )
}
