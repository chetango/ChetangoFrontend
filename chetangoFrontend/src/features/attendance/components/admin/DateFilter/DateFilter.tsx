// ============================================
// DATE FILTER COMPONENT
// ============================================

import { useState } from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from '@/design-system/atoms/Popover'
import { Calendar } from '@/design-system/molecules/Calendar'
import { Skeleton } from '@/design-system/atoms/Skeleton'
import { parseAPIDate, formatDateForAPI } from '@/shared/lib/dateUtils'
import type { DateRangeResponse } from '../../../types/attendanceTypes'

interface DateFilterProps {
  selectedDate: string // YYYY-MM-DD
  dateRange: DateRangeResponse | undefined
  onDateChange: (date: string) => void
  isLoading: boolean
}

/**
 * Date filter component with calendar popup
 * - Restricts calendar to 7-day range (desde to hasta)
 * - Enables only dates in diasConClases array
 * - Uses glass input styling
 * - Keyboard accessible with focus management
 *
 * Requirements: 1.2, 1.3, 1.4, 1.5, 7.3, 7.4
 */
export function DateFilter({
  selectedDate,
  dateRange,
  onDateChange,
  isLoading,
}: DateFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Parse dates for calendar
  const selectedDateObj = parseAPIDate(selectedDate)
  const fromDate = dateRange ? parseAPIDate(dateRange.desde) : undefined
  const toDate = dateRange ? parseAPIDate(dateRange.hasta) : undefined
  const enabledDates = dateRange
    ? dateRange.diasConClases.map((d) => parseAPIDate(d))
    : undefined

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onDateChange(formatDateForAPI(date))
      setIsOpen(false)
    }
  }

  // Format date for display (e.g., "18 dic 2025")
  const formatDisplayDate = (dateStr: string): string => {
    const date = parseAPIDate(dateStr)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div>
        <label className="block text-[#d1d5db] mb-2 text-[14px]">
          <CalendarIcon className="w-4 h-4 inline mr-2" />
          Fecha de la Clase
        </label>
        <Skeleton className="h-12 w-full" aria-label="Cargando selector de fecha" />
      </div>
    )
  }

  return (
    <div role="group" aria-label="Filtro de fecha">
      <label className="block text-[#d1d5db] mb-2 text-[14px]">
        <CalendarIcon className="w-4 h-4 inline mr-2" />
        Fecha de la Clase
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={`Fecha seleccionada: ${formatDisplayDate(selectedDate)}. Presiona para cambiar`}
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            className={`
              w-full
              flex items-center gap-3
              px-4 py-3
              backdrop-blur-xl
              bg-[rgba(30,30,36,0.6)]
              border border-[rgba(255,255,255,0.12)]
              rounded-xl
              text-[#f9fafb]
              transition-all duration-300
              shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]
              hover:border-[rgba(255,255,255,0.25)]
              focus:border-[#c93448]
              focus:ring-2 focus:ring-[rgba(201,52,72,0.3)]
              focus:outline-none
            `}
          >
            <CalendarIcon className="w-5 h-5 text-[#6b7280]" aria-hidden="true" />
            <span className="text-sm">{formatDisplayDate(selectedDate)}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            selected={selectedDateObj}
            onSelect={handleDateSelect}
            fromDate={fromDate}
            toDate={toDate}
            enabledDates={enabledDates}
            defaultMonth={selectedDateObj}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
