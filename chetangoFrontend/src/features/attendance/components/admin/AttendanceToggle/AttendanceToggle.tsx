// ============================================
// ATTENDANCE TOGGLE COMPONENT
// ============================================

import { Check, Loader2 } from 'lucide-react'

interface AttendanceToggleProps {
  isPresent: boolean
  onToggle: () => void
  disabled?: boolean
  isLoading?: boolean
}

/**
 * Toggle button for attendance status
 * - Green filled with checkmark for "Presente"
 * - Empty outline for "Ausente"
 * - Shows loading spinner during updates
 * 
 * Requirements: 3.7, 4.1, 9.3
 */
export function AttendanceToggle({ 
  isPresent, 
  onToggle, 
  disabled = false,
  isLoading = false 
}: AttendanceToggleProps) {
  const isDisabled = disabled || isLoading

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isDisabled}
      aria-label={isPresent ? 'Marcar como ausente' : 'Marcar como presente'}
      aria-pressed={isPresent}
      className={`
        w-10 h-10
        rounded-xl
        border
        transition-all duration-300
        flex items-center justify-center
        backdrop-blur-xl
        ${
          isPresent
            ? `
              bg-[rgba(52,211,153,0.2)]
              border-[rgba(52,211,153,0.5)]
              text-[#6ee7b7]
              shadow-[0_4px_12px_rgba(52,211,153,0.3),inset_0_1px_1px_rgba(52,211,153,0.3)]
              hover:bg-[rgba(52,211,153,0.3)]
              hover:border-[rgba(52,211,153,0.7)]
              hover:shadow-[0_6px_16px_rgba(52,211,153,0.4)]
            `
            : `
              bg-[rgba(30,30,36,0.6)]
              border-[rgba(255,255,255,0.12)]
              text-[#6b7280]
              shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_1px_2px_rgba(255,255,255,0.05)]
              hover:border-[rgba(255,255,255,0.25)]
              hover:bg-[rgba(42,42,48,0.6)]
            `
        }
        ${
          isDisabled
            ? 'opacity-50 cursor-not-allowed'
            : 'cursor-pointer hover:scale-105'
        }
      `}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        isPresent && <Check className="w-5 h-5" strokeWidth={3} />
      )}
    </button>
  )
}
