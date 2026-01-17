// ============================================
// ATTENDANCE ROW COMPONENT
// ============================================

import { useState, useEffect, useCallback } from 'react'
import { GlassInput } from '@/design-system'
import { GlassTableRow, GlassTableCell } from '@/design-system/molecules/GlassTable'
import { AttendanceToggle } from '../AttendanceToggle'
import { PackageStatusBadge } from '../PackageStatusBadge'
import type { StudentAttendance } from '../../../types/attendanceTypes'

interface AttendanceRowProps {
  student: StudentAttendance
  onToggleAttendance: () => void
  onObservationChange: (observation: string) => void
  isUpdating: boolean
}

/**
 * Formats student initials for avatar display
 */
export function formatStudentInitials(avatarIniciales: string): string {
  return avatarIniciales.substring(0, 2).toUpperCase()
}

/**
 * Row component for displaying a single student's attendance
 * Composes: Avatar, Name, Document, PackageStatusBadge, AttendanceToggle, Observation input
 * Handles observation debounce (500ms)
 *
 * Requirements: 3.2, 5.1, 5.3
 */
export function AttendanceRow({
  student,
  onToggleAttendance,
  onObservationChange,
  isUpdating,
}: AttendanceRowProps) {
  const [localObservation, setLocalObservation] = useState(
    student.asistencia.observacion || ''
  )

  // Sync local state with prop changes
  useEffect(() => {
    setLocalObservation(student.asistencia.observacion || '')
  }, [student.asistencia.observacion])

  // Debounced observation change handler
  useEffect(() => {
    const currentObservation = student.asistencia.observacion || ''
    if (localObservation === currentObservation) {
      return
    }

    const timeoutId = setTimeout(() => {
      onObservationChange(localObservation)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [localObservation, student.asistencia.observacion, onObservationChange])

  // Handle blur to save immediately
  const handleBlur = useCallback(() => {
    const currentObservation = student.asistencia.observacion || ''
    if (localObservation !== currentObservation) {
      onObservationChange(localObservation)
    }
  }, [localObservation, student.asistencia.observacion, onObservationChange])

  const isPresent = student.asistencia.estado === 'Presente'

  return (
    <GlassTableRow>
      {/* ALUMNO column */}
      <GlassTableCell>
        <div className="flex items-center gap-3">
          {/* Avatar with initials */}
          <div
            className="
              w-10 h-10
              rounded-full
              flex items-center justify-center
              backdrop-blur-xl
              bg-[rgba(201,52,72,0.2)]
              border border-[rgba(201,52,72,0.4)]
              text-[#f9fafb]
              font-medium
              text-sm
            "
            aria-label={`Avatar de ${student.nombreCompleto}`}
          >
            {formatStudentInitials(student.avatarIniciales)}
          </div>
          {/* Name and document */}
          <div className="flex flex-col">
            <span className="text-[#f9fafb] font-medium">
              {student.nombreCompleto}
            </span>
            <span className="text-[#6b7280] text-sm">
              {student.documentoIdentidad}
            </span>
          </div>
        </div>
      </GlassTableCell>

      {/* PAQUETE column */}
      <GlassTableCell>
        <PackageStatusBadge package={student.paquete} />
      </GlassTableCell>

      {/* ASISTENCIA column */}
      <GlassTableCell>
        <AttendanceToggle
          isPresent={isPresent}
          onToggle={onToggleAttendance}
          disabled={isUpdating}
          isLoading={isUpdating}
        />
      </GlassTableCell>

      {/* OBSERVACIÓN column */}
      <GlassTableCell>
        <GlassInput
          type="text"
          placeholder="Agregar observación..."
          value={localObservation}
          onChange={(e) => setLocalObservation(e.target.value)}
          onBlur={handleBlur}
          disabled={isUpdating}
          className="min-w-[200px]"
          aria-label={`Observación para ${student.nombreCompleto}`}
        />
      </GlassTableCell>
    </GlassTableRow>
  )
}
