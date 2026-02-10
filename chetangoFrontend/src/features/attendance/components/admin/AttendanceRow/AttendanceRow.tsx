// ============================================
// ATTENDANCE ROW COMPONENT
// ============================================

import { GlassTableCell, GlassTableRow } from '@/design-system/molecules/GlassTable'
import { useCallback, useEffect, useState } from 'react'
import type { StudentAttendance } from '../../../types/attendanceTypes'
import { AttendanceToggle } from '../AttendanceToggle'
import { PackageStatusBadge } from '../PackageStatusBadge'

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

  const isSharedPackage = student.paquete?.esCompartido || false
  const sharedStudentNames = student.paquete?.nombresAlumnosCompartidos || []

  return (
    <GlassTableRow>
      {/* ALUMNO column */}
      <GlassTableCell>
        <div className="flex items-center gap-4">
          {/* Avatar with initials - gradient dual per Figma */}
          <div
            className="
              w-10 h-10
              rounded-xl
              flex items-center justify-center
              backdrop-blur-sm
              bg-gradient-to-br from-[rgba(201,52,72,0.2)] to-[rgba(124,90,248,0.2)]
              border border-[rgba(255,255,255,0.1)]
              text-[#f9fafb]
              font-medium
            "
            aria-label={`Avatar de ${student.nombreCompleto}`}
          >
            {formatStudentInitials(student.avatarIniciales)}
          </div>
          {/* Name and document */}
          <div>
            <p className="text-[#f9fafb] font-medium" style={{ fontSize: '15px' }}>
              {student.nombreCompleto}
            </p>
            <p className="text-[#9ca3af] text-[13px] mt-0.5">
              DNI: {student.documentoIdentidad}
            </p>
          </div>
        </div>
      </GlassTableCell>

      {/* PAQUETE column */}
      <GlassTableCell>
        <div>
          <PackageStatusBadge package={student.paquete} />
          {isSharedPackage && sharedStudentNames.length > 0 && (
            <p className="text-[#7c5af8] text-[11px] mt-2 italic flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#7c5af8]" />
              <span>Paquete compartido con: {sharedStudentNames.join(', ')}</span>
            </p>
          )}
        </div>
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

      {/* OBSERVACIÓN column - Per Figma styling */}
      <GlassTableCell>
        <input 
          type="text"
          value={localObservation}
          onChange={(e) => setLocalObservation(e.target.value)}
          onBlur={handleBlur}
          disabled={isUpdating}
          placeholder="Agregar nota..."
          aria-label={`Observación para ${student.nombreCompleto}`}
          className="
            w-full 
            px-3 py-2 
            backdrop-blur-xl 
            bg-[rgba(30,30,36,0.4)] 
            border border-[rgba(255,255,255,0.08)] 
            focus:border-[#c93448] 
            focus:bg-[rgba(30,30,36,0.6)] 
            rounded-lg 
            text-[#f9fafb] 
            text-[13px]
            placeholder-[#6b7280] 
            outline-none 
            transition-all duration-200
            disabled:opacity-50
            min-w-[200px]
          "
        />
      </GlassTableCell>
    </GlassTableRow>
  )
}
