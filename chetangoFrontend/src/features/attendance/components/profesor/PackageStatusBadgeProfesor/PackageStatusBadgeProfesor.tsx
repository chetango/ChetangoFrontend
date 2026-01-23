// ============================================
// PACKAGE STATUS BADGE PROFESOR COMPONENT
// ============================================

import { AlertCircle, Sparkles, CheckCheck } from 'lucide-react'
import type { EstadoPaqueteProfesor } from '../../../types/profesorTypes'

interface PackageStatusBadgeProfesorProps {
  estado: EstadoPaqueteProfesor
}

/**
 * Badge configuration for each package status
 * Maps estado to colors, icon, and label
 */
const BADGE_CONFIG: Record<
  EstadoPaqueteProfesor,
  {
    bgColor: string
    borderColor: string
    textColor: string
    icon: React.ComponentType<{ className?: string }>
    label: string
  }
> = {
  activo: {
    bgColor: 'bg-[rgba(52,211,153,0.12)]',
    borderColor: 'border-[rgba(52,211,153,0.25)]',
    textColor: 'text-[#34d399]',
    icon: CheckCheck,
    label: 'Paquete activo',
  },
  agotado: {
    bgColor: 'bg-[rgba(239,68,68,0.15)]',
    borderColor: 'border-[rgba(239,68,68,0.3)]',
    textColor: 'text-[#fca5a5]',
    icon: AlertCircle,
    label: 'Agotado',
  },
  sin_paquete: {
    bgColor: 'bg-[rgba(245,158,11,0.15)]',
    borderColor: 'border-[rgba(245,158,11,0.3)]',
    textColor: 'text-[#fcd34d]',
    icon: AlertCircle,
    label: 'Sin paquete',
  },
  clase_prueba: {
    bgColor: 'bg-[rgba(124,90,248,0.15)]',
    borderColor: 'border-[rgba(124,90,248,0.3)]',
    textColor: 'text-[#9b8afb]',
    icon: Sparkles,
    label: 'Clase prueba',
  },
}

/**
 * Badge component for profesor view showing package status
 * - activo: green badge with checkmark
 * - agotado: red badge with alert icon
 * - sin_paquete: yellow badge with alert icon
 * - clase_prueba: purple badge with sparkles icon
 * 
 * Accessibility: Uses role="status" for screen reader announcements
 * 
 * Requirements: 3.9, 3.10, 3.11, 7.3
 */
export function PackageStatusBadgeProfesor({ estado }: PackageStatusBadgeProfesorProps) {
  const config = BADGE_CONFIG[estado]
  const Icon = config.icon

  return (
    <span
      className={`
        px-3 py-1.5 rounded-lg text-[12px] font-medium
        backdrop-blur-sm
        ${config.bgColor}
        border ${config.borderColor}
        ${config.textColor}
        flex items-center gap-1.5
      `}
      data-testid={`package-badge-${estado}`}
      data-estado={estado}
      role="status"
      aria-label={`Estado del paquete: ${config.label}`}
    >
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      {config.label}
    </span>
  )
}

/**
 * Utility function to get badge color for a given estado
 * Used for property testing
 */
export function getBadgeColorForEstado(estado: EstadoPaqueteProfesor): {
  bgColor: string
  borderColor: string
  textColor: string
} {
  const config = BADGE_CONFIG[estado]
  return {
    bgColor: config.bgColor,
    borderColor: config.borderColor,
    textColor: config.textColor,
  }
}
