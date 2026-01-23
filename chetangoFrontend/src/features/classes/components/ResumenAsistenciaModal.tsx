// ============================================
// RESUMEN ASISTENCIA MODAL COMPONENT
// Modal for viewing attendance summary of a class
// Requirements: 5.2
// ============================================

import { useNavigate } from 'react-router-dom'
import { X, Users, CheckCircle2, XCircle, ArrowRight } from 'lucide-react'
import { GlassPanel, GlassButton } from '@/design-system'
import type { ClaseProfesor } from '../types/classTypes'
import { formatearFechaCompleta, formatearHora24 } from '../utils/dateUtils'

// ============================================
// TYPES
// ============================================

export interface ResumenAsistenciaModalProps {
  /** Whether the modal is open */
  isOpen: boolean
  /** Callback to close the modal */
  onClose: () => void
  /** Class data */
  clase: ClaseProfesor | null
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Gets color class based on attendance percentage
 * >=80 green, >=65 yellow, <65 red
 */
function getAttendanceColor(percentage: number): {
  bg: string
  text: string
  bar: string
} {
  if (percentage >= 80) {
    return {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      bar: 'bg-emerald-500',
    }
  }
  if (percentage >= 65) {
    return {
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-400',
      bar: 'bg-yellow-500',
    }
  }
  return {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    bar: 'bg-red-500',
  }
}

// ============================================
// COMPONENT
// ============================================

/**
 * ResumenAsistenciaModal - Modal for viewing attendance summary
 *
 * Features:
 * - Attendance summary (inscriptos, presentes, ausentes, tasa)
 * - Progress bar for attendance level
 * - Color coding based on percentage
 * - "Ver Asistencia Completa" button
 * - Glassmorphism modal styles
 *
 * Requirements: 5.2
 */
export function ResumenAsistenciaModal({
  isOpen,
  onClose,
  clase,
}: ResumenAsistenciaModalProps) {
  const navigate = useNavigate()

  if (!isOpen || !clase) return null

  // Calculate attendance stats
  const presentes = clase.asistenciaReal || 0
  const inscriptos = clase.inscriptos
  const ausentes = inscriptos - presentes
  const porcentaje = clase.porcentajeAsistencia || 0

  const colors = getAttendanceColor(porcentaje)

  // Handle navigation to full attendance page
  const handleViewFullAttendance = () => {
    navigate(`/profesor/attendance?claseId=${clase.id}`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <GlassPanel className="relative z-10 w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Resumen de Asistencia</h2>
          <GlassButton variant="icon" onClick={onClose} className="!p-2">
            <X className="w-5 h-5" />
          </GlassButton>
        </div>

        {/* Class Info */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-white mb-1">{clase.nombre}</h3>
          <p className="text-gray-400 text-sm capitalize">
            {formatearFechaCompleta(clase.fecha)}
          </p>
          <p className="text-gray-500 text-sm">
            {formatearHora24(clase.horaInicio)} - {formatearHora24(clase.horaFin)}
          </p>
        </div>

        {/* Attendance Stats */}
        <div className="space-y-4 mb-6">
          {/* Inscriptos */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-gray-300">Inscriptos</span>
            </div>
            <span className="text-2xl font-semibold text-white">{inscriptos}</span>
          </div>

          {/* Presentes */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-gray-300">Presentes</span>
            </div>
            <span className="text-2xl font-semibold text-emerald-400">{presentes}</span>
          </div>

          {/* Ausentes */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <span className="text-gray-300">Ausentes</span>
            </div>
            <span className="text-2xl font-semibold text-red-400">{ausentes}</span>
          </div>
        </div>

        {/* Attendance Rate */}
        <div className={`p-4 rounded-xl ${colors.bg} border border-white/10 mb-6`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-300 text-sm">Tasa de Asistencia</span>
            <span className={`text-2xl font-bold ${colors.text}`}>{porcentaje}%</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full ${colors.bar} transition-all duration-500`}
              style={{ width: `${porcentaje}%` }}
            />
          </div>
          <p className="text-gray-500 text-xs mt-2">
            {porcentaje >= 80 && '¡Excelente asistencia!'}
            {porcentaje >= 65 && porcentaje < 80 && 'Asistencia aceptable'}
            {porcentaje < 65 && 'Asistencia baja'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <GlassButton variant="secondary" onClick={onClose}>
            Cerrar
          </GlassButton>
          <GlassButton
            variant="primary"
            onClick={handleViewFullAttendance}
            className="flex items-center gap-2"
          >
            <span>Ver Asistencia Completa</span>
            <ArrowRight className="w-4 h-4" />
          </GlassButton>
        </div>
      </GlassPanel>
    </div>
  )
}
