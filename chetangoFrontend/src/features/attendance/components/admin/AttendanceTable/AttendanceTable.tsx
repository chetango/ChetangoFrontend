// ============================================
// ATTENDANCE TABLE COMPONENT
// ============================================

import {
    GlassTable,
    GlassTableBody,
    GlassTableHead,
    GlassTableHeader,
    GlassTableRow,
} from '@/design-system/molecules/GlassTable'
import { Search } from 'lucide-react'
import type { StudentAttendance } from '../../../types/attendanceTypes'
import { AttendanceRow } from '../AttendanceRow'
import { AttendanceCardMobile } from '../AttendanceRow/AttendanceCardMobile'

interface AttendanceTableProps {
  students: StudentAttendance[]
  searchTerm: string
  onToggleAttendance: (studentId: string, idPaquete: string | null) => void
  onObservationChange: (studentId: string, idPaquete: string | null, observation: string) => void
  isUpdating: Record<string, boolean>
}

/**
 * Table component for displaying attendance records
 * - Desktop: Table layout with columns ALUMNO, PAQUETE, ASISTENCIA, OBSERVACIÓN
 * - Mobile: Card layout with stacked information
 * - Uses AttendanceRow for desktop, AttendanceCardMobile for mobile
 * - Handles empty state when no students match search
 *
 * Requirements: 3.1, 6.4, 7.1, 7.2
 */
export function AttendanceTable({
  students,
  searchTerm,
  onToggleAttendance,
  onObservationChange,
  isUpdating,
}: AttendanceTableProps) {
  // Empty state when no students match search
  if (students.length === 0) {
    return (
      <div
        className="
          flex flex-col items-center justify-center
          py-12 sm:py-16
        "
        role="status"
        aria-live="polite"
      >
        <Search className="w-10 h-10 sm:w-12 sm:h-12 text-[#6b7280] mb-4" aria-hidden="true" />
        <p className="text-[#9ca3af] text-base sm:text-lg text-center px-4">
          {searchTerm
            ? 'No se encontraron estudiantes'
            : 'No hay estudiantes en esta clase'}
        </p>
        {searchTerm && (
          <p className="text-[#6b7280] text-sm mt-2 text-center px-4">
            Intenta con otro término de búsqueda
          </p>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Desktop Table Layout - Hidden on mobile */}
      <div className="hidden md:block">
        <GlassTable showContainer={false}>
          <GlassTableHeader>
            <GlassTableRow>
              <GlassTableHead>ALUMNO</GlassTableHead>
              <GlassTableHead>PAQUETE</GlassTableHead>
              <GlassTableHead>ASISTENCIA</GlassTableHead>
              <GlassTableHead>OBSERVACIÓN</GlassTableHead>
            </GlassTableRow>
          </GlassTableHeader>
          <GlassTableBody>
            {students.map((student) => (
              <AttendanceRow
                key={`${student.idAlumno}-${student.paquete?.idPaquete}`}
                student={student}
                onToggleAttendance={() => onToggleAttendance(student.idAlumno, student.paquete?.idPaquete ?? null)}
                onObservationChange={(observation) =>
                  onObservationChange(student.idAlumno, student.paquete?.idPaquete ?? null, observation)
                }
                isUpdating={isUpdating[student.idAlumno] || false}
              />
            ))}
          </GlassTableBody>
        </GlassTable>
      </div>

      {/* Mobile Card Layout - Hidden on desktop */}
      <div className="md:hidden divide-y divide-[rgba(255,255,255,0.08)]">
        {students.map((student) => (
          <AttendanceCardMobile
            key={`${student.idAlumno}-${student.paquete?.idPaquete}`}
            student={student}
            onToggleAttendance={() => onToggleAttendance(student.idAlumno, student.paquete?.idPaquete ?? null)}
            onObservationChange={(observation) =>
              onObservationChange(student.idAlumno, student.paquete?.idPaquete ?? null, observation)
            }
            isUpdating={isUpdating[student.idAlumno] || false}
          />
        ))}
      </div>
    </>
  )
}
