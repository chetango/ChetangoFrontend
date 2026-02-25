// ============================================
// KPI CARD WITH BREAKDOWN COMPONENT
// Tarjeta KPI con desglose interactivo
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { ROUTES } from '@/shared/constants/routes'
import type { LucideIcon } from 'lucide-react'
import { ChevronDown, TrendingDown, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

interface BreakdownItem {
  label: string
  value: number
  percentage: number
  icon: LucideIcon
}

interface KPICardWithBreakdownProps {
  title: string
  value: string
  change?: number
  comparison: string
  icon: LucideIcon
  color: string
  bgColor: string
  glowColor: string
  breakdown: BreakdownItem[]
  type: 'ingresos' | 'egresos'
}

export const KPICardWithBreakdown = ({
  title,
  value,
  change,
  comparison,
  icon: Icon,
  color,
  bgColor,
  glowColor,
  breakdown,
  type
}: KPICardWithBreakdownProps) => {
  const [showBreakdown, setShowBreakdown] = useState(false)

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
        className="p-2 sm:p-3 group-hover:scale-[1.01] hover:shadow-lg transition-all duration-200 relative overflow-hidden min-h-[90px] sm:min-h-[100px]"
        style={{
          background: `linear-gradient(135deg, ${bgColor}15 0%, ${bgColor}08 50%, transparent 100%)`,
        }}
      >
        {/* Intense Glow Background */}
        <div 
          className="absolute -top-10 -right-10 w-32 h-32 opacity-15 blur-[60px] rounded-full group-hover:opacity-30 group-hover:scale-110 transition-all duration-500"
          style={{ background: glowColor }}
        />
        <div 
          className="absolute top-0 right-0 w-24 h-24 opacity-10 blur-[40px] rounded-full group-hover:opacity-20 transition-all duration-300"
          style={{ background: glowColor }}
        />

        <div className="relative z-10">
          {/* Header con Icon y Botón Ver Más */}
          <div className="flex items-start justify-between mb-1.5 sm:mb-2">
            {/* Icon */}
            <div 
              className="inline-flex p-1.5 rounded-lg relative overflow-hidden group-hover:scale-105 transition-transform duration-200"
              style={{ 
                background: `linear-gradient(135deg, ${color}25, ${color}15)`,
                boxShadow: `0 8px 24px ${color}30, inset 0 1px 2px rgba(255,255,255,0.1)`
              }}
            >
              <Icon 
                className="w-4 h-4 sm:w-5 sm:h-5" 
                style={{ 
                  color: color,
                  filter: `drop-shadow(0 0 4px ${color}80)`,
                }}
              />
            </div>

            {/* Botón Ver Más */}
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] sm:text-xs font-medium transition-all duration-200 hover:scale-105"
              style={{
                background: `${color}20`,
                color: color,
                border: `1px solid ${color}30`
              }}
            >
              <span>Ver +</span>
              <ChevronDown 
                className={`w-3 h-3 transition-transform duration-300 ${showBreakdown ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {/* Value */}
          <h3 
            className="text-[#f9fafb] text-xl sm:text-2xl font-bold mb-0.5 sm:mb-1 tracking-tight"
            style={{
              textShadow: `0 0 15px ${color}30, 0 0 30px ${color}15`
            }}
          >
            {value}
          </h3>

          {/* Label */}
          <p className="text-[#9ca3af] text-[10px] sm:text-xs mb-1 sm:mb-1.5 font-medium">{title}</p>

          {/* Trend */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            {change !== undefined && change !== 0 ? (
              <>
                {change > 0 ? (
                  <TrendingUp 
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#22c55e]" 
                    style={{ filter: 'drop-shadow(0 0 2px #22c55e80)' }}
                  />
                ) : (
                  <TrendingDown 
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#ef4444]" 
                    style={{ filter: 'drop-shadow(0 0 2px #ef444480)' }}
                  />
                )}
                <span 
                  className="text-[10px] sm:text-xs font-bold"
                  style={{ 
                    color: change > 0 ? '#22c55e' : '#ef4444',
                    textShadow: change > 0 ? '0 0 8px #22c55e60' : '0 0 8px #ef444460'
                  }}
                >
                  {change > 0 ? '+' : ''}{change}%
                </span>
                <span className="text-[#6b7280] text-[9px] sm:text-[10px]">{comparison}</span>
              </>
            ) : (
              <span className="text-[#6b7280] text-xs">{comparison}</span>
            )}
          </div>
        </div>

        {/* Breakdown Expandible */}
        <div 
          className={`relative z-10 overflow-hidden transition-all duration-300 ${
            showBreakdown ? 'max-h-[300px] opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'
          }`}
        >
          <div className="pt-3 border-t border-[#374151]">
            <h4 className="text-[#9ca3af] text-[10px] sm:text-xs font-semibold mb-2 flex items-center gap-1">
              <span>📊</span> Desglose de {type === 'ingresos' ? 'Ingresos' : 'Egresos'}
            </h4>
            
            <div className="space-y-2">
              {breakdown.map((item, index) => (
                <div key={index} className="space-y-1">
                  {/* Label y Valor */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <item.icon className="w-3 h-3" style={{ color }} />
                      <span className="text-[10px] sm:text-xs text-[#e5e7eb]">{item.label}</span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-[#f9fafb]">
                      ${item.value.toLocaleString('es-CL')}
                    </span>
                  </div>
                  
                  {/* Barra de Progreso */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[#1f2937] rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${item.percentage}%`,
                          background: `linear-gradient(90deg, ${color}, ${color}80)`,
                          boxShadow: `0 0 8px ${color}60`
                        }}
                      />
                    </div>
                    <span className="text-[9px] sm:text-[10px] text-[#9ca3af] w-10 text-right">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Link a Finanzas */}
            <Link
              to={ROUTES.ADMIN.FINANZAS}
              className="mt-3 flex items-center justify-center gap-1 text-[10px] sm:text-xs font-medium py-1.5 px-3 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                background: `${color}15`,
                color: color,
                border: `1px solid ${color}30`
              }}
            >
              Ver detalle en Finanzas →
            </Link>
          </div>
        </div>
      </GlassPanel>
    </div>
  )
}
