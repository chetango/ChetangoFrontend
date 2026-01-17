// ============================================
// DATE FILTER COMPONENT
// ============================================

import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
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
 *
 * Requirements: 1.2, 1.3, 1.4, 1.5
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
    return <Skeleton className="h-12 w-48" />
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Seleccionar fecha"
          className={`
            flex items-center gap-3
            px-4 py-3
            min-w-[180px]
            backdrop-blur-xl
            bg-[rgba(30,30,36,0.6)]
            border border-[rgba(255,255,255,0.12)]
            rounded-xl
            text-[#f9fafb]
            transition-all duration-300
            shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_1px_2px_rgba(255,255,255,0.05)]
            hover:border-[rgba(255,255,255,0.25)]
            focus:border-[#c93448]
            focus:ring-2 focus:ring-[rgba(201,52,72,0.3)]
            focus:outline-none
            focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_0_0_3px_rgba(201,52,72,0.2)]
          `}
        >
          <CalendarIcon className="w-5 h-5 text-[#6b7280]" />
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
  )
}
