// ============================================
// SUMMARY CARD COMPONENT - STUDENT VIEW
// ============================================

import type { ReactNode } from 'react'

/**
 * Variant types for the SummaryCard
 * Each variant has different color schemes based on Figma design
 */
export type SummaryCardVariant = 'clases_mes' | 'clases_restantes' | 'estado_paquete'

/**
 * Estado del paquete for the estado_paquete variant
 */
export type EstadoPaqueteVariant = 'activo' | 'agotado' | 'congelado' | 'sin_paquete'

interface SummaryCardProps {
  /** Icon to display in the card */
  icon: ReactNode
  /** Label text (e.g., "Clases asistidas") */
  label: string
  /** Main value to display */
  value: string | number
  /** Secondary value (e.g., "/ 8" for total classes) */
  secondaryValue?: string
  /** Badge text (e.g., "Este mes", "Disponibles", "Activo") */
  badge: string
  /** Card variant for styling */
  variant: SummaryCardVariant
  /** Estado del paquete (only used when variant is 'estado_paquete') */
  estadoPaquete?: EstadoPaqueteVariant
  /** Optional subtitle text (e.g., package name, expiration date) */
  subtitle?: string
  /** Optional secondary subtitle (e.g., expiration date) */
  secondarySubtitle?: string
}

/**
 * Color configuration for each variant
 */
const VARIANT_COLORS: Record<
  SummaryCardVariant,
  {
    gradient: string
    border: string
    iconBg: string
    iconColor: string
    badgeBg: string
    badgeBorder: string
    badgeText: string
    shadow: string
  }
> = {
  clases_mes: {
    gradient: 'from-[rgba(124,90,248,0.15)] to-[rgba(99,72,198,0.1)]',
    border: 'border-[rgba(124,90,248,0.3)]',
    iconBg: 'bg-[rgba(124,90,248,0.3)]',
    iconColor: 'text-[#9b8afb]',
    badgeBg: 'bg-[rgba(124,90,248,0.2)]',
    badgeBorder: 'border-[rgba(124,90,248,0.4)]',
    badgeText: 'text-[#9b8afb]',
    shadow: 'shadow-[0_8px_24px_rgba(124,90,248,0.2),inset_0_2px_4px_rgba(255,255,255,0.1)]',
  },
  clases_restantes: {
    gradient: 'from-[rgba(52,211,153,0.15)] to-[rgba(5,150,105,0.1)]',
    border: 'border-[rgba(52,211,153,0.3)]',
    iconBg: 'bg-[rgba(52,211,153,0.3)]',
    iconColor: 'text-[#34d399]',
    badgeBg: 'bg-[rgba(52,211,153,0.2)]',
    badgeBorder: 'border-[rgba(52,211,153,0.4)]',
    badgeText: 'text-[#34d399]',
    shadow: 'shadow-[0_8px_24px_rgba(52,211,153,0.2),inset_0_2px_4px_rgba(255,255,255,0.1)]',
  },
  estado_paquete: {
    // Default colors, will be overridden by estadoPaquete
    gradient: 'from-[rgba(52,211,153,0.15)] to-[rgba(5,150,105,0.1)]',
    border: 'border-[rgba(52,211,153,0.3)]',
    iconBg: 'bg-[rgba(52,211,153,0.3)]',
    iconColor: 'text-[#34d399]',
    badgeBg: 'bg-[rgba(52,211,153,0.2)]',
    badgeBorder: 'border-[rgba(52,211,153,0.4)]',
    badgeText: 'text-[#34d399]',
    shadow: 'shadow-[0_8px_24px_rgba(201,52,72,0.2),inset_0_2px_4px_rgba(255,255,255,0.1)]',
  },
}

/**
 * Color configuration for estado_paquete variant based on package state
 */
const ESTADO_PAQUETE_COLORS: Record<
  EstadoPaqueteVariant,
  {
    gradient: string
    border: string
    iconBg: string
    iconColor: string
    badgeBg: string
    badgeBorder: string
    badgeText: string
  }
> = {
  activo: {
    gradient: 'from-[rgba(52,211,153,0.15)] to-[rgba(5,150,105,0.1)]',
    border: 'border-[rgba(52,211,153,0.3)]',
    iconBg: 'bg-[rgba(52,211,153,0.3)]',
    iconColor: 'text-[#34d399]',
    badgeBg: 'bg-[rgba(52,211,153,0.2)]',
    badgeBorder: 'border-[rgba(52,211,153,0.4)]',
    badgeText: 'text-[#34d399]',
  },
  congelado: {
    gradient: 'from-[rgba(59,130,246,0.15)] to-[rgba(37,99,235,0.1)]',
    border: 'border-[rgba(59,130,246,0.3)]',
    iconBg: 'bg-[rgba(59,130,246,0.3)]',
    iconColor: 'text-[#3b82f6]',
    badgeBg: 'bg-[rgba(59,130,246,0.2)]',
    badgeBorder: 'border-[rgba(59,130,246,0.4)]',
    badgeText: 'text-[#3b82f6]',
  },
  agotado: {
    gradient: 'from-[rgba(239,68,68,0.15)] to-[rgba(220,38,38,0.1)]',
    border: 'border-[rgba(239,68,68,0.3)]',
    iconBg: 'bg-[rgba(239,68,68,0.3)]',
    iconColor: 'text-[#ef4444]',
    badgeBg: 'bg-[rgba(239,68,68,0.2)]',
    badgeBorder: 'border-[rgba(239,68,68,0.4)]',
    badgeText: 'text-[#ef4444]',
  },
  sin_paquete: {
    gradient: 'from-[rgba(156,163,175,0.15)] to-[rgba(107,114,128,0.1)]',
    border: 'border-[rgba(156,163,175,0.3)]',
    iconBg: 'bg-[rgba(156,163,175,0.3)]',
    iconColor: 'text-[#9ca3af]',
    badgeBg: 'bg-[rgba(156,163,175,0.2)]',
    badgeBorder: 'border-[rgba(156,163,175,0.4)]',
    badgeText: 'text-[#9ca3af]',
  },
}

/**
 * Get colors based on variant and estadoPaquete
 */
export function getCardColors(variant: SummaryCardVariant, estadoPaquete?: EstadoPaqueteVariant) {
  if (variant === 'estado_paquete' && estadoPaquete) {
    return {
      ...VARIANT_COLORS.estado_paquete,
      ...ESTADO_PAQUETE_COLORS[estadoPaquete],
    }
  }
  return VARIANT_COLORS[variant]
}

/**
 * SummaryCard component for student attendance view
 * Displays summary information with icon, label, value, and badge
 * 
 * Variants:
 * - clases_mes: Purple theme for "Clases este mes"
 * - clases_restantes: Green theme for "Clases restantes"
 * - estado_paquete: Dynamic theme based on package state
 * 
 * Requirements: 4.2, 7.1, 7.2
 */
export function SummaryCard({
  icon,
  label,
  value,
  secondaryValue,
  badge,
  variant,
  estadoPaquete,
  subtitle,
  secondarySubtitle,
}: SummaryCardProps) {
  const colors = getCardColors(variant, estadoPaquete)

  return (
    <div
      className={`
        backdrop-blur-2xl 
        bg-gradient-to-br ${colors.gradient}
        border ${colors.border}
        rounded-xl sm:rounded-2xl 
        p-4 sm:p-6
        ${colors.shadow}
      `}
      data-testid={`summary-card-${variant}`}
      data-variant={variant}
      data-estado-paquete={estadoPaquete}
      role="region"
      aria-label={label}
    >
      {/* Header with icon and badge */}
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${colors.iconBg} backdrop-blur-sm`}>
          <span className={colors.iconColor}>{icon}</span>
        </div>
        <span
          className={`
            px-2 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-[11px] font-bold uppercase
            ${colors.badgeBg} border ${colors.badgeBorder}
            ${colors.badgeText}
          `}
        >
          {badge}
        </span>
      </div>

      {/* Label */}
      <p className="text-[#9ca3af] text-xs sm:text-[13px] mb-1 sm:mb-2">{label}</p>

      {/* Value */}
      {variant === 'estado_paquete' ? (
        <>
          <p
            className="text-[#f9fafb] font-semibold text-sm sm:text-base"
            style={{ lineHeight: '1.4' }}
          >
            {value}
          </p>
          {subtitle && <p className="text-[#6b7280] text-xs sm:text-[13px] mt-1.5 sm:mt-2">{subtitle}</p>}
        </>
      ) : (
        <p className="text-[#f9fafb] font-bold text-2xl sm:text-4xl" style={{ lineHeight: '1' }}>
          {value}
          {secondaryValue && (
            <span className="text-[#6b7280] text-sm sm:text-lg ml-1 sm:ml-2">{secondaryValue}</span>
          )}
        </p>
      )}

      {/* Secondary subtitle (e.g., expiration date) */}
      {secondarySubtitle && variant !== 'estado_paquete' && (
        <p className="text-[#6b7280] text-xs sm:text-[13px] mt-1.5 sm:mt-2">{secondarySubtitle}</p>
      )}
    </div>
  )
}
