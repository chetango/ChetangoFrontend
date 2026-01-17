// ============================================
// CLASS SELECTOR COMPONENT
// ============================================

import { BookOpen } from 'lucide-react'
import {
  GlassSelect,
  GlassSelectTrigger,
  GlassSelectValue,
  GlassSelectContent,
  GlassSelectItem,
} from '@/design-system/atoms/GlassSelect'
import { Skeleton } from '@/design-system/atoms/Skeleton'
import { formatTimeForDisplay } from '@/shared/lib/dateUtils'
import type { ClassesByDateResponse } from '../../../types/attendanceTypes'

interface ClassSelectorProps {
  selectedClassId: string | null
  classes: ClassesByDateResponse | undefined
  onClassChange: (classId: string) => void
  isLoading: boolean
}

/**
 * Formats a class for display in the dropdown
 * Format: {nombre} - {horaInicio} a {horaFin} ({profesorPrincipal})
 * 
 * Requirements: 4.3
 */
export function formatClassDisplay(
  nombre: string,
  horaInicio: string,
  horaFin: string,
  profesorPrincipal: string
): string {
  return `${nombre} - ${formatTimeForDisplay(horaInicio)} a ${formatTimeForDisplay(horaFin)} (${profesorPrincipal})`
}

/**
 * Dropdown selector for classes on a specific date
 * - Displays class name, time range, and professor
 * - Handles empty state when no classes
 * - Uses glass select styling
 *
 * Requirements: 2.2, 2.4
 */
export function ClassSelector({
  selectedClassId,
  classes,
  onClassChange,
  isLoading,
}: ClassSelectorProps) {
  if (isLoading) {
    return <Skeleton className="h-12 w-80" />
  }

  const hasClasses = classes && classes.clases.length > 0

  if (!hasClasses) {
    return (
      <div
        className="
          flex items-center gap-3
          px-4 py-3
          min-w-[280px]
          backdrop-blur-xl
          bg-[rgba(30,30,36,0.6)]
          border border-[rgba(255,255,255,0.12)]
          rounded-xl
          text-[#6b7280]
          text-sm
        "
      >
        <BookOpen className="w-5 h-5" />
        <span>No hay clases para esta fecha</span>
      </div>
    )
  }

  return (
    <GlassSelect value={selectedClassId || undefined} onValueChange={onClassChange}>
      <GlassSelectTrigger
        className="min-w-[280px]"
        icon={<BookOpen className="w-5 h-5" />}
        aria-label="Seleccionar clase"
      >
        <GlassSelectValue placeholder="Seleccionar clase..." />
      </GlassSelectTrigger>
      <GlassSelectContent>
        {classes.clases.map((classInfo) => (
          <GlassSelectItem key={classInfo.idClase} value={classInfo.idClase}>
            {formatClassDisplay(
              classInfo.nombre,
              classInfo.horaInicio,
              classInfo.horaFin,
              classInfo.profesorPrincipal
            )}
          </GlassSelectItem>
        ))}
      </GlassSelectContent>
    </GlassSelect>
  )
}
