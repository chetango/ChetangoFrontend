// ============================================
// STATS SUMMARY COMPONENT
// ============================================

import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

interface StatsSummaryProps {
  presentes: number
  ausentes: number
  sinPaquete: number
}

/**
 * Displays attendance statistics counters
 * - Presentes: green with CheckCircle2 icon
 * - Ausentes: gray with XCircle icon
 * - Sin Paquete: warning with AlertCircle icon
 * - Accessible with live region for screen readers
 * 
 * Requirements: 7.1, 7.3, 7.4, 7.5
 */
export function StatsSummary({ presentes, ausentes, sinPaquete }: StatsSummaryProps) {
  return (
    <div 
      className="flex flex-wrap gap-3 sm:gap-4"
      role="region"
      aria-label="Resumen de asistencias"
      aria-live="polite"
    >
      {/* Presentes counter */}
      <div
        className="
          flex items-center gap-2
          px-3 sm:px-4 py-2
          backdrop-blur-xl
          border
          rounded-xl
          bg-[rgba(52,211,153,0.1)]
          border-[rgba(52,211,153,0.3)]
        "
        role="status"
        aria-label={`${presentes} estudiantes presentes`}
      >
        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#6ee7b7]" aria-hidden="true" />
        <span className="text-[#6ee7b7] font-medium text-sm sm:text-base">{presentes}</span>
        <span className="text-[#9ca3af] text-xs sm:text-sm">Presentes</span>
      </div>

      {/* Ausentes counter */}
      <div
        className="
          flex items-center gap-2
          px-3 sm:px-4 py-2
          backdrop-blur-xl
          border
          rounded-xl
          bg-[rgba(156,163,175,0.1)]
          border-[rgba(156,163,175,0.3)]
        "
        role="status"
        aria-label={`${ausentes} estudiantes ausentes`}
      >
        <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#9ca3af]" aria-hidden="true" />
        <span className="text-[#d1d5db] font-medium text-sm sm:text-base">{ausentes}</span>
        <span className="text-[#9ca3af] text-xs sm:text-sm">Ausentes</span>
      </div>

      {/* Sin Paquete counter */}
      <div
        className="
          flex items-center gap-2
          px-3 sm:px-4 py-2
          backdrop-blur-xl
          border
          rounded-xl
          bg-[rgba(245,158,11,0.1)]
          border-[rgba(245,158,11,0.3)]
        "
        role="status"
        aria-label={`${sinPaquete} estudiantes sin paquete`}
      >
        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#fcd34d]" aria-hidden="true" />
        <span className="text-[#fcd34d] font-medium text-sm sm:text-base">{sinPaquete}</span>
        <span className="text-[#9ca3af] text-xs sm:text-sm">Sin Paquete</span>
      </div>
    </div>
  )
}
