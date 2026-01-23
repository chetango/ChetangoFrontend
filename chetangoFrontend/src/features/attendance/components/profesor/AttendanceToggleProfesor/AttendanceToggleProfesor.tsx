// ============================================
// ATTENDANCE TOGGLE PROFESOR COMPONENT
// ============================================

import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

interface AttendanceToggleProfesorProps {
  isPresent: boolean
  onToggle: () => void
  disabled?: boolean
  isLoading?: boolean
}

/**
 * Simplified toggle button for profesor attendance view
 * - Pill button style according to Figma design
 * - Green with checkmark for "Presente"
 * - Gray with X for "Ausente"
 * - Shows loading spinner during updates
 * 
 * Requirements: 3.5
 */
export function AttendanceToggleProfesor({
  isPresent,
  onToggle,
  disabled = false,
  isLoading = false,
}: AttendanceToggleProfesorProps) {
  const isDisabled = disabled || isLoading

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isDisabled}
      aria-label={isPresent ? 'Marcar como ausente' : 'Marcar como presente'}
      aria-pressed={isPresent}
      className={`
        group/toggle
        px-5 py-2.5 rounded-xl
        border-2
        backdrop-blur-xl
        transition-all duration-300
        flex items-center justify-center gap-2
        min-w-[120px]
        shadow-[0_4px_12px_rgba(0,0,0,0.2)]
        ${
          isPresent
            ? `
              bg-gradient-to-br from-[rgba(52,211,153,0.2)] to-[rgba(5,150,105,0.15)]
              border-[#34d399]
              shadow-[0_4px_16px_rgba(52,211,153,0.3)]
            `
            : `
              bg-[rgba(30,30,36,0.6)]
              border-[rgba(255,255,255,0.15)]
              hover:border-[rgba(255,255,255,0.25)]
              hover:bg-[rgba(42,42,48,0.7)]
            `
        }
        ${
          isDisabled
            ? 'opacity-50 cursor-not-allowed'
            : 'cursor-pointer group-hover/toggle:scale-105'
        }
      `}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-[#9ca3af]" />
      ) : isPresent ? (
        <>
          <CheckCircle2 className="w-4 h-4 text-[#34d399]" strokeWidth={2.5} />
          <span className="text-[#34d399] font-semibold text-[13px] uppercase tracking-wide">
            Presente
          </span>
        </>
      ) : (
        <>
          <XCircle className="w-4 h-4 text-[#6b7280]" strokeWidth={2} />
          <span className="text-[#9ca3af] font-medium text-[13px] uppercase tracking-wide">
            Ausente
          </span>
        </>
      )}
    </button>
  )
}
