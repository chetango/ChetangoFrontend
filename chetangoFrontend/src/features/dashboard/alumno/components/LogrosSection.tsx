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
    <div className="mb-6 sm:mb-8 md:mb-10">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-[#f59e0b]" />
        <h3 className="text-[#f9fafb] text-lg sm:text-xl font-semibold">Tus Logros</h3>
        <div className="flex-1 h-[2px] bg-gradient-to-r from-[rgba(255,255,255,0.08)] to-transparent" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {logros.map((logro) => {
          const Icon = iconMap[logro.icono] || Trophy
          
          return (
            <GlassPanel
              key={logro.id}
              className={`p-3 sm:p-4 md:p-6 text-center transition-all duration-300 ${
                logro.desbloqueado ? 'hover:scale-[1.05] active:scale-[0.98] cursor-pointer' : 'opacity-50'
              }`}
            >
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-2 sm:mb-3 md:mb-4 rounded-full flex items-center justify-center ${
                  logro.desbloqueado ? 'bg-gradient-to-br shadow-lg' : 'bg-[rgba(255,255,255,0.05)]'
                }`}
                style={logro.desbloqueado ? {
                  background: `linear-gradient(135deg, ${logro.color}40, ${logro.color}20)`,
                  boxShadow: `0 4px 16px ${logro.color}40`
                } : {}}
              >
                <Icon 
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" 
                  style={{ color: logro.desbloqueado ? logro.color : '#6b7280' }} 
                />
              </div>
              <h4 className="text-[#f9fafb] text-xs sm:text-sm md:text-base font-medium mb-1">{logro.nombre}</h4>
              <p className="text-[#9ca3af] text-xs sm:text-sm line-clamp-2">{logro.descripcion}</p>
              {!logro.desbloqueado && (
                <p className="text-[#6b7280] text-xs mt-1 sm:mt-2">🔒 Bloqueado</p>
              )}
            </GlassPanel>
          )
        })}
      </div>
    </div>
  )
}
