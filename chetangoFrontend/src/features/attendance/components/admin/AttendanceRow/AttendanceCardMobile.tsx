// ============================================
// ATTENDANCE CARD MOBILE COMPONENT
// ============================================

import { useCallback, useEffect, useState } from 'react'
import type { StudentAttendance } from '../../../types/attendanceTypes'
import { AttendanceToggle } from '../AttendanceToggle'
import { PackageStatusBadge } from '../PackageStatusBadge'
import { formatStudentInitials } from './AttendanceRow'

interface AttendanceCardMobileProps {
  student: StudentAttendance
  onToggleAttendance: () => void
  onObservationChange: (observation: string) => void
  isUpdating: boolean
}

/**
 * Mobile card component for displaying a single student's attendance
 * Stacked layout optimized for mobile screens
 * 
 * Requirements: 7.1, 7.2
 */
export function AttendanceCardMobile({
  student,
  onToggleAttendance,
  onObservationChange,
  isUpdating,
}: AttendanceCardMobileProps) {
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
    <div 
      className="p-4 hover:bg-[rgba(255,255,255,0.02)] transition-colors duration-200"
      role="listitem"
      aria-label={`Asistencia de ${student.nombreCompleto}`}
    >
      {/* Header: Avatar, Name, Toggle */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Avatar with initials - gradient dual per Figma */}
          <div
            className="
              w-10 h-10 flex-shrink-0
              rounded-xl
              flex items-center justify-center
              backdrop-blur-sm
              bg-gradient-to-br from-[rgba(201,52,72,0.2)] to-[rgba(124,90,248,0.2)]
              border border-[rgba(255,255,255,0.1)]
              text-[#f9fafb]
              font-medium
            "
            aria-hidden="true"
          >
            {formatStudentInitials(student.avatarIniciales)}
          </div>
          {/* Name and document */}
          <div className="flex flex-col min-w-0">
            <p className="text-[#f9fafb] font-medium text-[15px] truncate">
              {student.nombreCompleto}
            </p>
            <p className="text-[#9ca3af] text-[13px] truncate">
              DNI: {student.documentoIdentidad}
            </p>
          </div>
        </div>
        
        {/* Toggle */}
        <AttendanceToggle
          isPresent={isPresent}
          onToggle={onToggleAttendance}
          disabled={isUpdating}
          isLoading={isUpdating}
        />
      </div>

      {/* Package Status Badge */}
      <div className="mb-3">
        <PackageStatusBadge package={student.paquete} />
        {isSharedPackage && sharedStudentNames.length > 0 && (
          <p className="text-[#7c5af8] text-[11px] mt-2 italic flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#7c5af8]" />
            <span>Paquete compartido con: {sharedStudentNames.join(', ')}</span>
          </p>
        )}
      </div>

      {/* Observation Input - Per Figma styling */}
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
        "
      />
    </div>
  )
}
