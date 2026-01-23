// ============================================
// PACKAGE PROGRESS BAR COMPONENT - STUDENT VIEW
// ============================================

import { GlassPanel } from '@/design-system'
import { calculateProgressPercentage } from '../../../types/studentTypes'

interface PackageProgressBarProps {
  /** Number of classes used from the package */
  clasesUsadas: number
  /** Total number of classes in the package */
  clasesTotales: number
  /** Number of classes remaining (optional, calculated if not provided) */
  clasesRestantes?: number
}

/**
 * PackageProgressBar component for student attendance view
 * Displays a progress bar showing package usage with percentage
 * 
 * Features:
 * - Glassmorphism styled container
 * - Animated progress bar with gradient
 * - Shows percentage completed and classes available
 * - Responsive design for mobile and desktop
 * 
 * Requirements: 4.3, 7.1, 7.2
 */
export function PackageProgressBar({
  clasesUsadas,
  clasesTotales,
  clasesRestantes,
}: PackageProgressBarProps) {
  // Calculate progress percentage using the utility function
  const progresoPercentage = calculateProgressPercentage(clasesUsadas, clasesTotales)
  
  // Calculate remaining classes if not provided
  const remaining = clasesRestantes ?? Math.max(0, clasesTotales - clasesUsadas)

  return (
    <GlassPanel className="p-4 sm:p-6" data-testid="package-progress-bar">
      {/* Header with label and usage info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 mb-2 sm:mb-3">
        <p className="text-[#d1d5db] font-medium text-sm sm:text-[15px]">
          Progreso del paquete
        </p>
        <p className="text-[#9ca3af] text-xs sm:text-[13px]">
          {clasesUsadas} de {clasesTotales} clases usadas
        </p>
      </div>

      {/* Progress Bar */}
      <div 
        className="relative h-2.5 sm:h-3 rounded-full bg-[rgba(255,255,255,0.05)] overflow-hidden"
        role="progressbar"
        aria-valuenow={progresoPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progreso del paquete: ${progresoPercentage}% completado`}
      >
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#7c5af8] to-[#9b8afb] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(124,90,248,0.5)]"
          style={{ width: `${progresoPercentage}%` }}
          data-testid="progress-fill"
        />
      </div>

      {/* Footer with percentage and remaining classes */}
      <div className="flex items-center justify-between mt-2 sm:mt-3">
        <p className="text-[#7c5af8] text-xs sm:text-[13px] font-medium">
          {progresoPercentage}% completado
        </p>
        <p className="text-[#34d399] text-xs sm:text-[13px] font-medium">
          {remaining} clases disponibles
        </p>
      </div>
    </GlassPanel>
  )
}

/**
 * Utility function to get progress bar width style
 * Used for property testing
 */
export function getProgressWidth(clasesUsadas: number, clasesTotales: number): string {
  const percentage = calculateProgressPercentage(clasesUsadas, clasesTotales)
  return `${percentage}%`
}
