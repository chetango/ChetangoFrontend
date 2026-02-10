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
      className="p-6 group hover:scale-[1.03] transition-all duration-300 cursor-pointer relative overflow-hidden"
    >
      {/* Glow Background */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 opacity-[0.08] blur-[60px] rounded-full group-hover:opacity-[0.15] transition-opacity duration-300"
        style={{ background: glowColor }}
      />

      <div className="relative z-10">
        {/* Icon */}
        <div 
          className="inline-flex p-3 backdrop-blur-md rounded-xl mb-4"
          style={{ 
            background: bgColor,
            color: color,
            boxShadow: `0 4px 12px ${glowColor}, inset 0 1px 2px rgba(255,255,255,0.1)`
          }}
        >
          <Icon className="w-5 h-5" />
        </div>

        {/* Value */}
        <h3 className="text-[#f9fafb] text-3xl font-bold mb-1">{value}</h3>

        {/* Label */}
        <p className="text-[#9ca3af] text-sm mb-3">{title}</p>

        {/* Trend */}
        <div className="flex items-center gap-2">
          {change !== undefined && change !== 0 && (
            <>
              {change > 0 ? (
                <TrendingUp className="w-4 h-4 text-[#34d399]" />
              ) : (
                <TrendingDown className="w-4 h-4 text-[#fca5a5]" />
              )}
              <span 
                className="text-sm font-medium"
                style={{ color: change > 0 ? '#34d399' : '#fca5a5' }}
              >
                {change > 0 ? '+' : ''}{change}%
              </span>
            </>
          )}
          <span className="text-[#6b7280] text-sm">{comparison}</span>
        </div>
      </div>
    </GlassPanel>
  )
}
