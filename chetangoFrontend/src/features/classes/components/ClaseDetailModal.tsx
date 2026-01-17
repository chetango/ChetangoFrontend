// ============================================
// CLASE DETAIL MODAL COMPONENT
// Modal for viewing class details
// Requirements: 4.2, 4.3, 4.4
// ============================================

import { useNavigate } from 'react-router-dom'
import { X, Calendar, Clock, Users, User, FileText, ArrowRight } from 'lucide-react'
import { GlassPanel, GlassButton, Badge, Skeleton } from '@/design-system'
import { useClaseDetailQuery } from '../api/classQueries'
import type { ClaseEstado } from '../types/classTypes'
import {
  formatTime,
  calculateDuration,
  getEstadoBadgeVariant,
  getEstadoText,
  calculateCapacityPercentage,
  getCapacityBarColor,
} from './ClaseCard'

// ============================================
// TYPES
// ============================================

export interface ClaseDetailModalProps {
  /** Class ID to fetch details for */
  idClase: string | null
  /** Whether the modal is open */
  isOpen: boolean
  /** Callback to close the modal */
  onClose: () => void
  /** Calculated estado based on date (optional, will be calculated if not provided) */
  estado?: ClaseEstado
}

// ============================================
// HELPER FUNCTIONS
// ============================================


/**
 * Calculates the estado of a class based on its date
 * Requirements: 3.5
 */
export function getClaseEstadoFromDate(fecha: string): ClaseEstado {
  const hoy = new Date().toISOString().split('T')[0]
  const claseDate = fecha.split('T')[0]

  if (claseDate === hoy) return 'hoy'
  if (claseDate < hoy) return 'completada'
  return 'programada'
}

/**
 * Formats a date string to a localized display format
 * @param fecha - ISO 8601 date string
 * @returns Formatted date string (e.g., "Lunes, 15 de Enero de 2026")
 */
export function formatDateDisplay(fecha: string): string {
  const date = new Date(fecha)
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Formats the horario display with duration
 * @param horaInicio - Start time in HH:mm:ss format
 * @param horaFin - End time in HH:mm:ss format
 * @returns Formatted string (e.g., "10:00 - 11:30 (1h 30min)")
 */
export function formatHorarioWithDuration(horaInicio: string, horaFin: string): string {
  const start = formatTime(horaInicio)
  const end = formatTime(horaFin)
  const duration = calculateDuration(horaInicio, horaFin)
  return `${start} - ${end} (${duration})`
}

// ============================================
// COMPONENT
// ============================================


/**
 * ClaseDetailModal - Modal for viewing class details
 *
 * Features:
 * - Fetches class details using useClaseDetailQuery
 * - Displays all class fields: estado badge, fecha, horario with duration,
 *   profesor, inscriptos/capacidad with progress bar, observaciones, monitores
 * - "Ir a Asistencia" button for navigation
 * - Loading state with skeleton
 * - Error handling for 404
 *
 * Requirements: 4.2, 4.3, 4.4
 */
export function ClaseDetailModal({
  idClase,
  isOpen,
  onClose,
  estado: providedEstado,
}: ClaseDetailModalProps) {
  const navigate = useNavigate()

  // Fetch class details - Requirements: 4.1, 4.2
  const {
    data: claseDetail,
    isLoading,
    error,
  } = useClaseDetailQuery(idClase || '', isOpen && !!idClase)

  // Don't render if not open
  if (!isOpen) return null

  // Calculate estado from date if not provided
  const estado = providedEstado || (claseDetail ? getClaseEstadoFromDate(claseDetail.fecha) : 'programada')

  // Handle navigation to attendance page - Requirements: 4.4
  const handleNavigateToAttendance = () => {
    if (idClase) {
      navigate(`/admin/asistencias?claseId=${idClase}`)
      onClose()
    }
  }

  // Can navigate to attendance for all except cancelled classes
  const canNavigateToAttendance = estado !== 'cancelada'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />


      {/* Modal */}
      <GlassPanel className="relative z-10 w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Detalle de Clase</h2>
          <GlassButton
            variant="icon"
            onClick={onClose}
            className="!p-2"
          >
            <X className="w-5 h-5" />
          </GlassButton>
        </div>

        {/* Loading State - Requirements: 10.2 */}
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        )}

        {/* Error State - Requirements: 4.5 */}
        {error && (
          <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300">
            <p className="text-sm">
              {(error as { response?: { status?: number } })?.response?.status === 404
                ? 'La clase especificada no existe'
                : 'Error al cargar los detalles de la clase'}
            </p>
          </div>
        )}


        {/* Content - Requirements: 4.3 */}
        {claseDetail && !isLoading && (
          <div className="space-y-5">
            {/* Tipo de Clase + Estado Badge */}
            <div className="flex items-start justify-between">
              <h3 className="text-2xl font-bold text-white">{claseDetail.tipoClase}</h3>
              <Badge variant={getEstadoBadgeVariant(estado)} shape="pill">
                {getEstadoText(estado)}
              </Badge>
            </div>

            {/* Fecha - Requirements: 4.3 */}
            <div className="flex items-center gap-3 text-gray-300">
              <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <span className="capitalize">{formatDateDisplay(claseDetail.fecha)}</span>
            </div>

            {/* Horario con Duración - Requirements: 4.3 */}
            <div className="flex items-center gap-3 text-gray-300">
              <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <span>{formatHorarioWithDuration(claseDetail.horaInicio, claseDetail.horaFin)}</span>
            </div>

            {/* Profesor Principal - Requirements: 4.3 */}
            <div className="flex items-center gap-3 text-gray-300">
              <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <span>{claseDetail.nombreProfesor}</span>
            </div>


            {/* Monitores (if any) */}
            {claseDetail.monitores && claseDetail.monitores.length > 0 && (
              <div className="flex items-start gap-3 text-gray-300">
                <Users className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 text-sm">Monitores:</span>
                  <ul className="mt-1 space-y-1">
                    {claseDetail.monitores.map((monitor) => (
                      <li key={monitor.idProfesor} className="text-gray-300">
                        {monitor.nombreProfesor}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Capacidad con Progress Bar - Requirements: 4.3 */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-gray-300">
                <Users className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span>
                  Inscriptos: {claseDetail.totalAsistencias} / {claseDetail.cupoMaximo}
                </span>
              </div>
              <div className="ml-8">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getCapacityBarColor(
                      calculateCapacityPercentage(claseDetail.totalAsistencias, claseDetail.cupoMaximo)
                    )} transition-all duration-300`}
                    style={{
                      width: `${calculateCapacityPercentage(claseDetail.totalAsistencias, claseDetail.cupoMaximo)}%`,
                    }}
                  />
                </div>
              </div>
            </div>


            {/* Observaciones */}
            {claseDetail.observaciones && (
              <div className="flex items-start gap-3 text-gray-300">
                <FileText className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 text-sm">Observaciones:</span>
                  <p className="mt-1 text-gray-300">{claseDetail.observaciones}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <GlassButton variant="secondary" onClick={onClose}>
                Cerrar
              </GlassButton>

              {/* Navigate to Attendance - Requirements: 4.4 */}
              {canNavigateToAttendance && (
                <GlassButton
                  variant="primary"
                  onClick={handleNavigateToAttendance}
                  className="flex items-center gap-2"
                >
                  <span>Ir a Asistencia</span>
                  <ArrowRight className="w-4 h-4" />
                </GlassButton>
              )}
            </div>
          </div>
        )}
      </GlassPanel>
    </div>
  )
}
