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
 * 
 * Requirements: 7.1, 7.3
 */
export function StatsSummary({ presentes, ausentes, sinPaquete }: StatsSummaryProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {/* Presentes counter */}
      <div
        className="
          flex items-center gap-2
          px-4 py-2
          backdrop-blur-xl
          border
          rounded-xl
          bg-[rgba(52,211,153,0.1)]
          border-[rgba(52,211,153,0.3)]
        "
      >
        <CheckCircle2 className="w-5 h-5 text-[#6ee7b7]" />
        <span className="text-[#6ee7b7] font-medium">{presentes}</span>
        <span className="text-[#9ca3af] text-sm">Presentes</span>
      </div>

      {/* Ausentes counter */}
      <div
        className="
          flex items-center gap-2
          px-4 py-2
          backdrop-blur-xl
          border
          rounded-xl
          bg-[rgba(156,163,175,0.1)]
          border-[rgba(156,163,175,0.3)]
        "
      >
        <XCircle className="w-5 h-5 text-[#9ca3af]" />
        <span className="text-[#d1d5db] font-medium">{ausentes}</span>
        <span className="text-[#9ca3af] text-sm">Ausentes</span>
      </div>

      {/* Sin Paquete counter */}
      <div
        className="
          flex items-center gap-2
          px-4 py-2
          backdrop-blur-xl
          border
          rounded-xl
          bg-[rgba(245,158,11,0.1)]
          border-[rgba(245,158,11,0.3)]
        "
      >
        <AlertCircle className="w-5 h-5 text-[#fcd34d]" />
        <span className="text-[#fcd34d] font-medium">{sinPaquete}</span>
        <span className="text-[#9ca3af] text-sm">Sin Paquete</span>
      </div>
    </div>
  )
}
