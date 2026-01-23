// ============================================
// CLASS SELECTOR PROFESOR COMPONENT
// ============================================

import { Package, Clock, CheckCircle2 } from 'lucide-react'
import type { ClaseProfesor } from '../../../types/profesorTypes'
import { isClassInProgress } from '../../../types/profesorTypes'

interface ClassSelectorProfesorProps {
  clases: ClaseProfesor[]
  selectedClassId: string | null
  onClassChange: (classId: string) => void
  currentTime: string // HH:mm:ss format for "En curso" detection
}

/**
 * Formats time from HH:mm:ss to 12h format (e.g., "5:00 PM")
 */
function formatearHora12(hora24: string): string {
  const [hours, minutes] = hora24.split(':')
  const h = parseInt(hours, 10)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${minutes} ${ampm}`
}

/**
 * Class selector for profesor view
 * - Displays classes as cards/buttons
 * - Shows "En curso" indicator for current class
 * - Shows time range for each class
 * - Responsive: horizontal scroll on mobile, wrap on desktop
 * 
 * Requirements: 3.2, 7.1, 7.2
 */
export function ClassSelectorProfesor({
  clases,
  selectedClassId,
  onClassChange,
  currentTime,
}: ClassSelectorProfesorProps) {
  if (clases.length === 0) {
    return (
      <div
        className="
          flex items-center gap-2 sm:gap-3
          px-3 sm:px-4 py-2.5 sm:py-3
          backdrop-blur-xl
          bg-[rgba(30,30,36,0.6)]
          border border-[rgba(255,255,255,0.12)]
          rounded-xl
          text-[#6b7280]
          text-xs sm:text-sm
        "
        role="status"
        aria-label="No hay clases programadas"
      >
        <Package className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" aria-hidden="true" />
        <span>No tienes clases programadas para hoy</span>
      </div>
    )
  }

  // Only show selector if there's more than one class
  if (clases.length === 1) {
    return null
  }

  return (
    <div className="mb-4 sm:mb-6" role="group" aria-label="Selector de clases">
      <p className="text-[#9ca3af] mb-2 sm:mb-3 text-xs sm:text-[14px] uppercase tracking-wide">
        Tus clases de hoy
      </p>
      {/* Horizontal scroll on mobile, wrap on larger screens */}
      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
        {clases.map((clase) => {
          const isSelected = clase.id === selectedClassId
          const isEnCurso = isClassInProgress(currentTime, clase)

          return (
            <button
              key={clase.id}
              onClick={() => onClassChange(clase.id)}
              aria-pressed={isSelected}
              aria-label={`Seleccionar clase ${clase.nombre}${isEnCurso ? ', en curso' : ''}`}
              className={`
                group
                px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl
                backdrop-blur-xl
                border-2
                transition-all duration-300
                flex items-center gap-3 sm:gap-4
                flex-shrink-0 sm:flex-shrink
                min-w-[200px] sm:min-w-0
                ${
                  isSelected
                    ? 'bg-gradient-to-br from-[rgba(201,52,72,0.2)] to-[rgba(168,36,58,0.15)] border-[rgba(201,52,72,0.5)] shadow-[0_8px_24px_rgba(201,52,72,0.3)]'
                    : 'bg-[rgba(42,42,48,0.6)] border-[rgba(255,255,255,0.15)] hover:border-[rgba(255,255,255,0.3)] hover:bg-[rgba(42,42,48,0.8)]'
                }
              `}
            >
              {/* Icon */}
              <div
                className={`
                  p-2 sm:p-2.5 rounded-lg sm:rounded-xl backdrop-blur-sm flex-shrink-0
                  ${isSelected ? 'bg-[rgba(201,52,72,0.3)]' : 'bg-[rgba(255,255,255,0.08)]'}
                `}
              >
                <Package
                  className={`
                    w-4 h-4 sm:w-5 sm:h-5
                    ${isSelected ? 'text-[#e54d5e]' : 'text-[#9ca3af]'}
                  `}
                  aria-hidden="true"
                />
              </div>

              {/* Class Info */}
              <div className="text-left min-w-0">
                <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                  <p
                    className={`
                      font-semibold text-sm sm:text-base truncate
                      ${isSelected ? 'text-[#f9fafb]' : 'text-[#d1d5db]'}
                    `}
                  >
                    {clase.nombre}
                  </p>

                  {isEnCurso && (
                    <span
                      className="
                        px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[11px] font-bold uppercase
                        bg-[rgba(201,52,72,0.3)] border border-[rgba(201,52,72,0.5)]
                        text-[#e54d5e] whitespace-nowrap flex-shrink-0
                      "
                      data-testid="en-curso-badge"
                      role="status"
                    >
                      En curso
                    </span>
                  )}
                </div>

                {/* Time Range */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Clock
                    className={`
                      w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0
                      ${isSelected ? 'text-[#9ca3af]' : 'text-[#6b7280]'}
                    `}
                    aria-hidden="true"
                  />
                  <p
                    className={`
                      text-xs sm:text-[13px]
                      ${isSelected ? 'text-[#d1d5db]' : 'text-[#9ca3af]'}
                    `}
                  >
                    {formatearHora12(clase.horaInicio)} - {formatearHora12(clase.horaFin)}
                  </p>
                </div>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="ml-auto flex-shrink-0">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-[#e54d5e] to-[#c93448] flex items-center justify-center shadow-[0_4px_12px_rgba(201,52,72,0.4)]">
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-white" strokeWidth={3} aria-hidden="true" />
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
