// ============================================
// CLASS SELECTOR COMPONENT
// ============================================

import { Clock } from 'lucide-react'
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
 * - Keyboard accessible
 *
 * Requirements: 2.2, 2.4, 7.3, 7.4
 */
export function ClassSelector({
  selectedClassId,
  classes,
  onClassChange,
  isLoading,
}: ClassSelectorProps) {
  if (isLoading) {
    return (
      <div>
        <label className="block text-[#d1d5db] mb-2 text-[14px]">
          <Clock className="w-4 h-4 inline mr-2" />
          Clase del Día
        </label>
        <Skeleton className="h-12 w-full" aria-label="Cargando selector de clases" />
      </div>
    )
  }

  const hasClasses = classes && classes.clases.length > 0

  if (!hasClasses) {
    return (
      <div>
        <label className="block text-[#d1d5db] mb-2 text-[14px]">
          <Clock className="w-4 h-4 inline mr-2" />
          Clase del Día
        </label>
        <div
          className="
            flex items-center gap-3
            px-4 py-3
            w-full
            backdrop-blur-xl
            bg-[rgba(30,30,36,0.6)]
            border border-[rgba(255,255,255,0.12)]
            rounded-xl
            text-[#6b7280]
            text-sm
          "
          role="status"
          aria-label="No hay clases disponibles para esta fecha"
        >
          <Clock className="w-5 h-5" aria-hidden="true" />
          <span>No hay clases para esta fecha</span>
        </div>
      </div>
    )
  }

  // Find selected class name for better aria-label
  const selectedClass = classes.clases.find(c => c.idClase === selectedClassId)
  const selectedClassName = selectedClass ? selectedClass.nombre : 'ninguna'

  return (
    <div role="group" aria-label="Selector de clase">
      <label className="block text-[#d1d5db] mb-2 text-[14px]">
        <Clock className="w-4 h-4 inline mr-2" />
        Clase del Día
      </label>
      <GlassSelect value={selectedClassId || undefined} onValueChange={onClassChange}>
        <GlassSelectTrigger
          className="w-full"
          icon={<Clock className="w-5 h-5" aria-hidden="true" />}
          aria-label={`Clase seleccionada: ${selectedClassName}. Presiona para cambiar`}
        >
          <GlassSelectValue placeholder="Seleccionar clase..." />
        </GlassSelectTrigger>
        <GlassSelectContent>
          {classes.clases.map((classInfo) => (
            <GlassSelectItem 
              key={classInfo.idClase} 
              value={classInfo.idClase}
              aria-label={`${classInfo.nombre}, ${formatTimeForDisplay(classInfo.horaInicio)} a ${formatTimeForDisplay(classInfo.horaFin)}, profesor ${classInfo.profesorPrincipal}`}
            >
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
    </div>
  )
}
