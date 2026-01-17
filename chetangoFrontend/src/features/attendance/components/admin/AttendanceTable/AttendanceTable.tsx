// ============================================
// ATTENDANCE TABLE COMPONENT
// ============================================

import { Search } from 'lucide-react'
import {
  GlassTable,
  GlassTableHeader,
  GlassTableBody,
  GlassTableHead,
  GlassTableRow,
} from '@/design-system/molecules/GlassTable'
import { AttendanceRow } from '../AttendanceRow'
import type { StudentAttendance } from '../../../types/attendanceTypes'

interface AttendanceTableProps {
  students: StudentAttendance[]
  searchTerm: string
  onToggleAttendance: (studentId: string) => void
  onObservationChange: (studentId: string, observation: string) => void
  isUpdating: Record<string, boolean>
}

/**
 * Table component for displaying attendance records
 * - Columns: ALUMNO, PAQUETE, ASISTENCIA, OBSERVACIÓN
 * - Uses AttendanceRow for each student
 * - Handles empty state when no students match search
 *
 * Requirements: 3.1, 6.4
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
          py-16
          backdrop-blur-xl
          bg-[rgba(26,26,32,0.5)]
          border border-[rgba(255,255,255,0.1)]
          rounded-xl
        "
      >
        <Search className="w-12 h-12 text-[#6b7280] mb-4" />
        <p className="text-[#9ca3af] text-lg">
          {searchTerm
            ? 'No se encontraron estudiantes'
            : 'No hay estudiantes en esta clase'}
        </p>
        {searchTerm && (
          <p className="text-[#6b7280] text-sm mt-2">
            Intenta con otro término de búsqueda
          </p>
        )}
      </div>
    )
  }

  return (
    <GlassTable>
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
            key={student.idAlumno}
            student={student}
            onToggleAttendance={() => onToggleAttendance(student.idAlumno)}
            onObservationChange={(observation) =>
              onObservationChange(student.idAlumno, observation)
            }
            isUpdating={isUpdating[student.idAlumno] || false}
          />
        ))}
      </GlassTableBody>
    </GlassTable>
  )
}
