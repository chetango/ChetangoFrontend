// ============================================
// PACKAGE STATS CARDS COMPONENT
// ============================================

import { AlertCircle, CheckCircle2, Snowflake, XCircle } from 'lucide-react'
import type { EstadoPaquete, PackagesStats } from '../../../types/packageTypes'

interface PackageStatsCardsProps {
  stats: PackagesStats
}

/**
 * Estado badge color configuration
 * Property 8: Estado Badge Color Mapping
 * - Activo: green
 * - Agotado: orange
 * - Congelado: blue
 * - Vencido: gray
 * Requirements: 3.2, 3.3, 3.8
 */
export const ESTADO_CARD_CONFIG: Record<
  EstadoPaquete,
  {
    color: string
    bgColor: string
    borderColor: string
    textColor: string
    icon: React.ReactNode
    label: string
  }
> = {
  Activo: {
    color: 'green',
    bgColor: 'bg-[rgba(52,211,153,0.1)]',
    borderColor: 'border-[rgba(52,211,153,0.3)]',
    textColor: 'text-[#6ee7b7]',
    icon: <CheckCircle2 className="w-5 h-5 text-[#6ee7b7]" />,
    label: 'Activos',
  },
  Agotado: {
    color: 'orange',
    bgColor: 'bg-[rgba(245,158,11,0.1)]',
    borderColor: 'border-[rgba(245,158,11,0.3)]',
    textColor: 'text-[#fcd34d]',
    icon: <AlertCircle className="w-5 h-5 text-[#fcd34d]" />,
    label: 'Agotados',
  },
  Congelado: {
    color: 'blue',
    bgColor: 'bg-[rgba(59,130,246,0.1)]',
    borderColor: 'border-[rgba(59,130,246,0.3)]',
    textColor: 'text-[#93c5fd]',
    icon: <Snowflake className="w-5 h-5 text-[#93c5fd]" />,
    label: 'Congelados',
  },
  Vencido: {
    color: 'gray',
    bgColor: 'bg-[rgba(156,163,175,0.1)]',
    borderColor: 'border-[rgba(156,163,175,0.3)]',
    textColor: 'text-[#d1d5db]',
    icon: <XCircle className="w-5 h-5 text-[#9ca3af]" />,
    label: 'Vencidos',
  },
}

/**
 * Get the color string for a given estado
 * Property 8: Estado Badge Color Mapping
 * Requirements: 3.8
 */
export function getEstadoColor(estado: EstadoPaquete): string {
  return ESTADO_CARD_CONFIG[estado].color
}

/**
 * Displays package statistics cards with glassmorphism design
 * - 4 cards: Activos (green), Agotados (orange), Congelados (blue), Vencidos (gray)
 * - Floating badge with total count
 * Requirements: 3.2, 3.3
 */
export function PackageStatsCards({ stats }: PackageStatsCardsProps) {
  const statsData: { estado: EstadoPaquete; count: number }[] = [
    { estado: 'Activo', count: stats.activos },
    { estado: 'Agotado', count: stats.agotados },
    { estado: 'Congelado', count: stats.congelados },
    { estado: 'Vencido', count: stats.vencidos },
  ]

  return (
    <div className="relative">
      {/* Stats cards grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {statsData.map(({ estado, count }) => {
          const config = ESTADO_CARD_CONFIG[estado]
          return (
            <div
              key={estado}
              className={`
                flex items-center gap-3
                px-5 py-4
                backdrop-blur-xl
                border
                rounded-xl
                transition-all duration-300
                hover:scale-[1.02]
                cursor-default
                min-w-0
                ${config.bgColor}
                ${config.borderColor}
              `}
            >
              {config.icon}
              <div className="flex flex-col min-w-0">
                <span className={`${config.textColor} font-semibold text-2xl`}>{count}</span>
                <span className="text-[#9ca3af] text-sm truncate">{config.label}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
