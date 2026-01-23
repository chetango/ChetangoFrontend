// ============================================
// ATTENDANCE TOGGLE COMPONENT
// ============================================

import { CheckCircle2, Loader2 } from 'lucide-react'

interface AttendanceToggleProps {
  isPresent: boolean
  onToggle: () => void
  disabled?: boolean
  isLoading?: boolean
}

/**
 * Toggle button for attendance status - Premium checkbox style per Figma
 * - Green filled with checkmark for "Presente"
 * - Empty outline with inner box for "Ausente"
 * - Shows loading spinner during updates
 * - Label below the checkbox
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
    <div className="flex justify-center">
      <button
        type="button"
        onClick={onToggle}
        disabled={isDisabled}
        aria-label={isPresent ? 'Marcar como ausente' : 'Marcar como presente'}
        aria-pressed={isPresent}
        className="group/check relative"
      >
        {/* Checkbox custom - Premium style per Figma */}
        <div className={`
          w-11 h-11
          rounded-xl
          border-2
          backdrop-blur-xl
          transition-all duration-300
          flex items-center justify-center
          shadow-[0_4px_16px_rgba(0,0,0,0.2)]
          ${isPresent 
            ? 'bg-gradient-to-br from-[#34d399] to-[#059669] border-[#34d399] shadow-[0_8px_24px_rgba(52,211,153,0.4)]' 
            : 'bg-[rgba(30,30,36,0.6)] border-[rgba(255,255,255,0.15)] hover:border-[rgba(255,255,255,0.3)] hover:bg-[rgba(42,42,48,0.8)]'
          }
          ${isDisabled
            ? 'opacity-50 cursor-not-allowed'
            : 'cursor-pointer group-hover/check:scale-110'
          }
        `}>
          {isLoading ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : isPresent ? (
            <CheckCircle2 className="w-6 h-6 text-white" strokeWidth={2.5} />
          ) : (
            <div className="w-4 h-4 rounded-sm border-2 border-[#6b7280] group-hover/check:border-[#9ca3af]" />
          )}
        </div>
        
        {/* Label below */}
        <p className={`
          text-[11px] mt-1.5 uppercase tracking-wider font-medium text-center
          ${isPresent ? 'text-[#34d399]' : 'text-[#6b7280] group-hover/check:text-[#9ca3af]'}
        `}>
          {isPresent ? 'Presente' : 'Ausente'}
        </p>
      </button>
    </div>
  )
}
