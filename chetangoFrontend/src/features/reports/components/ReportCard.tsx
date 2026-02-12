// ============================================
// REPORT CARD COMPONENT - CHETANGO
// Individual report card with quick stats
// ============================================

import { GlassButton, GlassPanel } from '@/design-system'
import { ArrowRight, type LucideIcon } from 'lucide-react'
import type { ReportType } from '../types/reportTypes'

// ============================================
// TYPES
// ============================================

export interface ReportCardProps {
  id: ReportType
  title: string
  description: string
  icon: LucideIcon
  color: string
  stats?: Array<{ label: string; value: string | number }>
  onView: (reportType: ReportType) => void
  isLoading?: boolean
}

// ============================================
// COMPONENT
// ============================================

export function ReportCard({
  id,
  title,
  description,
  icon: Icon,
  color,
  stats = [],
  onView,
  isLoading = false,
}: ReportCardProps) {
  return (
    <GlassPanel
      className="
        report-card
        relative
        p-6
        transition-all
        duration-300
        hover:translate-y-[-4px]
        hover:shadow-[0_8px_32px_rgba(201,52,72,0.2)]
        group
      "
    >
      {/* Icon */}
      <div
        className="
          w-12 h-12
          mb-4
          flex items-center justify-center
          rounded-xl
          transition-all
          duration-300
          group-hover:scale-110
        "
        style={{
          background: `${color}15`,
          color: color,
        } as React.CSSProperties}
      >
        <Icon className="w-6 h-6" />
      </div>

      {/* Title & Description */}
      <h3 className="text-xl font-semibold text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {description}
      </p>

      {/* Quick Stats */}
      {stats.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="
                px-3 py-1.5
                rounded-lg
                bg-white/5
                text-gray-300
                text-xs
                border border-white/10
              "
            >
              <span className="text-gray-500">{stat.label}:</span>{' '}
              <span className="font-semibold text-white">{stat.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Action Button */}
      <GlassButton
        variant="primary"
        onClick={() => onView(id)}
        disabled={isLoading}
        className="
          w-full
          !bg-transparent
          !border-white/20
          hover:!border-[color]
          hover:!bg-white/5
          transition-all
          duration-300
          group-hover:!border-[color]
        "
        style={{
          // @ts-ignore
          '--color': color,
        }}
      >
        <span>Ver Reporte</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </GlassButton>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white" />
        </div>
      )}
    </GlassPanel>
  )
}
