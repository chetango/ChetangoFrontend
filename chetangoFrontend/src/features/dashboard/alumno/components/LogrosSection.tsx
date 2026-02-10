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
    <div className="mb-8 md:mb-10">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-5 h-5 text-[#f59e0b]" />
        <h3 className="text-[#f9fafb] text-xl font-semibold">Tus Logros</h3>
        <div className="flex-1 h-[2px] bg-gradient-to-r from-[rgba(255,255,255,0.08)] to-transparent" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {logros.map((logro) => {
          const Icon = iconMap[logro.icono] || Trophy
          
          return (
            <GlassPanel
              key={logro.id}
              className={`p-6 text-center transition-all duration-300 ${
                logro.desbloqueado ? 'hover:scale-[1.05] cursor-pointer' : 'opacity-50'
              }`}
            >
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  logro.desbloqueado ? 'bg-gradient-to-br shadow-lg' : 'bg-[rgba(255,255,255,0.05)]'
                }`}
                style={logro.desbloqueado ? {
                  background: `linear-gradient(135deg, ${logro.color}40, ${logro.color}20)`,
                  boxShadow: `0 4px 16px ${logro.color}40`
                } : {}}
              >
                <Icon 
                  className="w-8 h-8" 
                  style={{ color: logro.desbloqueado ? logro.color : '#6b7280' }} 
                />
              </div>
              <h4 className="text-[#f9fafb] font-medium mb-1">{logro.nombre}</h4>
              <p className="text-[#9ca3af] text-sm">{logro.descripcion}</p>
              {!logro.desbloqueado && (
                <p className="text-[#6b7280] text-xs mt-2">🔒 Bloqueado</p>
              )}
            </GlassPanel>
          )
        })}
      </div>
    </div>
  )
}
