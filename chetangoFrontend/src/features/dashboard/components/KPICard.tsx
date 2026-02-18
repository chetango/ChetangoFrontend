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
    <div className="relative group">
      {/* Animated Border Glow */}
      <div 
        className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500"
        style={{ 
          background: `linear-gradient(135deg, ${glowColor}, transparent)`,
        }}
      />
      
      <GlassPanel 
        className="p-6 group-hover:scale-[1.05] hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${bgColor}15 0%, ${bgColor}08 50%, transparent 100%)`,
        }}
      >
        {/* Intense Glow Background - Multiple layers */}
        <div 
          className="absolute -top-10 -right-10 w-48 h-48 opacity-20 blur-[80px] rounded-full group-hover:opacity-40 group-hover:scale-125 transition-all duration-700"
          style={{ background: glowColor }}
        />
        <div 
          className="absolute top-0 right-0 w-32 h-32 opacity-15 blur-[50px] rounded-full group-hover:opacity-30 transition-all duration-500"
          style={{ background: glowColor }}
        />

        <div className="relative z-10">
          {/* Icon with gradient - More dramatic */}
          <div 
            className="inline-flex p-3 rounded-xl mb-4 relative overflow-hidden group-hover:scale-110 transition-transform duration-300"
            style={{ 
              background: `linear-gradient(135deg, ${color}25, ${color}15)`,
              boxShadow: `0 8px 24px ${color}30, inset 0 1px 2px rgba(255,255,255,0.1)`
            }}
          >
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ 
                background: `radial-gradient(circle at center, ${color}20, transparent)`,
              }}
            />
            <Icon 
              className="w-6 h-6 relative z-10" 
              style={{ 
                color: color,
                filter: `drop-shadow(0 0 8px ${color}80)`,
              }}
            />
          </div>

          {/* Value with glow */}
          <h3 
            className="text-[#f9fafb] text-3xl md:text-4xl font-bold mb-2 tracking-tight"
            style={{
              textShadow: `0 0 20px ${color}40, 0 0 40px ${color}20`
            }}
          >
            {value}
          </h3>

          {/* Label */}
          <p className="text-[#9ca3af] text-sm mb-4 font-medium">{title}</p>

          {/* Trend - More vibrant */}
          <div className="flex items-center gap-2">
            {change !== undefined && change !== 0 ? (
              <>
                {change > 0 ? (
                  <TrendingUp 
                    className="w-4 h-4 text-[#22c55e]" 
                    style={{ filter: 'drop-shadow(0 0 4px #22c55e80)' }}
                  />
                ) : (
                  <TrendingDown 
                    className="w-4 h-4 text-[#ef4444]" 
                    style={{ filter: 'drop-shadow(0 0 4px #ef444480)' }}
                  />
                )}
                <span 
                  className="text-sm font-bold"
                  style={{ 
                    color: change > 0 ? '#22c55e' : '#ef4444',
                    textShadow: change > 0 ? '0 0 8px #22c55e60' : '0 0 8px #ef444460'
                  }}
                >
                  {change > 0 ? '+' : ''}{change}%
                </span>
                <span className="text-[#6b7280] text-xs">{comparison}</span>
              </>
            ) : (
              <span className="text-[#6b7280] text-xs">{comparison}</span>
            )}
          </div>
        </div>
      </GlassPanel>
    </div>
  )
}
