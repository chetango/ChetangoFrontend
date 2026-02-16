// ============================================
// KPI CARD COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import type { LucideIcon } from 'lucide-react'
import { TrendingDown, TrendingUp } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  change?: number
  comparison: string
  icon: LucideIcon
  color: string
  bgColor: string
  glowColor: string
}

export const KPICard = ({
  title,
  value,
  change,
  comparison,
  icon: Icon,
  color,
  bgColor,
  glowColor
}: KPICardProps) => {
  return (
    <GlassPanel 
      className="p-5 group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
    >
      {/* Glow Background - Más visible */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 opacity-[0.08] blur-[60px] rounded-full group-hover:opacity-[0.15] transition-opacity duration-500"
        style={{ background: glowColor }}
      />

      <div className="relative z-10">
        {/* Icon - Con más presencia */}
        <div 
          className="inline-flex p-2.5 rounded-lg mb-4"
          style={{ 
            background: bgColor,
            color: color
          }}
        >
          <Icon className="w-5 h-5" />
        </div>

        {/* Value */}
        <h3 className="text-[#f9fafb] text-2xl md:text-3xl font-bold mb-1 tracking-tight">{value}</h3>

        {/* Label */}
        <p className="text-[#6b7280] text-sm mb-3">{title}</p>

        {/* Trend - Colores más visibles */}
        <div className="flex items-center gap-2">
          {change !== undefined && change !== 0 && (
            <>
              {change > 0 ? (
                <TrendingUp className="w-3.5 h-3.5 text-[#10b981]" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-[#ef4444]" />
              )}
              <span 
                className="text-xs font-medium"
                style={{ color: change > 0 ? '#10b981' : '#ef4444' }}
              >
                {change > 0 ? '+' : ''}{change}%
              </span>
            </>
          )}
          <span className="text-[#6b7280] text-xs">{comparison}</span>
        </div>
      </div>
    </GlassPanel>
  )
}
