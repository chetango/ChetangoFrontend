// ============================================
// LOGROS SECTION COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { Flame, Gift, Star, Target, Trophy, Zap } from 'lucide-react'
import type { Logro } from '../types/dashboardAlumno.types'

interface LogrosSectionProps {
  logros: Logro[]
}

// Mapeo de iconos
const iconMap = {
  flame: Flame,
  trophy: Trophy,
  target: Target,
  star: Star,
  gift: Gift,
  zap: Zap,
}

export const LogrosSection = ({ logros }: LogrosSectionProps) => {
  if (logros.length === 0) {
    return null
  }

  return (
    <div className="mb-3 sm:mb-4 md:mb-6">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Trophy className="w-4 h-4 text-[#f59e0b]" />
        <h3 className="text-[#f9fafb] text-base sm:text-lg font-semibold">Tus Logros</h3>
        <div className="flex-1 h-[2px] bg-gradient-to-r from-[rgba(255,255,255,0.08)] to-transparent" />
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {logros.map((logro) => {
          const Icon = iconMap[logro.icono] || Trophy
          
          return (
            <GlassPanel
              key={logro.id}
              className={`p-2 sm:p-3 text-center transition-all duration-300 ${
                logro.desbloqueado ? 'hover:scale-[1.05] active:scale-[0.98] cursor-pointer' : 'opacity-50'
              }`}
            >
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-1.5 sm:mb-2 rounded-full flex items-center justify-center ${
                  logro.desbloqueado ? 'bg-gradient-to-br shadow-lg' : 'bg-[rgba(255,255,255,0.05)]'
                }`}
                style={logro.desbloqueado ? {
                  background: `linear-gradient(135deg, ${logro.color}40, ${logro.color}20)`,
                  boxShadow: `0 4px 16px ${logro.color}40`
                } : {}}
              >
                <Icon 
                  className="w-5 h-5 sm:w-6 sm:h-6" 
                  style={{ color: logro.desbloqueado ? logro.color : '#6b7280' }} 
                />
              </div>
              <h4 className="text-[#f9fafb] text-[10px] sm:text-xs font-medium mb-0.5">{logro.nombre}</h4>
              <p className="text-[#9ca3af] text-[9px] sm:text-[10px] line-clamp-2">{logro.descripcion}</p>
              {!logro.desbloqueado && (
                <p className="text-[#6b7280] text-[9px] sm:text-[10px] mt-1">🔒 Bloqueado</p>
              )}
            </GlassPanel>
          )
        })}
      </div>
    </div>
  )
}
