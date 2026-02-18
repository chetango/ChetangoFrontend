// ============================================
// MI ASISTENCIA CARD COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { Flame, TrendingUp } from 'lucide-react'
import type { AsistenciaAlumno } from '../types/dashboardAlumno.types'
import { getAsistenciaBadge } from '../utils/dashboardUtils'

interface MiAsistenciaCardProps {
  asistencia: AsistenciaAlumno
}

export const MiAsistenciaCard = ({ asistencia }: MiAsistenciaCardProps) => {
  const badge = getAsistenciaBadge(asistencia.porcentaje)

  return (
    <GlassPanel className="p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#34d399]" />
          <h3 className="text-[#f9fafb] text-base sm:text-lg font-semibold">Mi Asistencia</h3>
        </div>
      </div>

      {/* Porcentaje - Responsive */}
      <div className="text-center mb-3">
        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[rgba(52,211,153,0.2)] to-[rgba(52,211,153,0.05)] border-[3px] border-[#34d399] mb-2 sm:mb-3">
          <span className="text-[#34d399] text-2xl sm:text-3xl font-bold">{asistencia.porcentaje}%</span>
        </div>
        <div
          className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-lg border text-[10px] sm:text-xs"
          style={{
            background: badge.bg,
            borderColor: badge.color + '40',
            color: badge.color
          }}
        >
          <span className="font-medium">{badge.label}</span>
        </div>
      </div>

      {/* Stats - Responsive grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 sm:p-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] text-center">
          <p className="text-[#9ca3af] text-[10px] sm:text-xs mb-1">Clases tomadas</p>
          <p className="text-[#f9fafb] text-lg sm:text-xl font-bold">{asistencia.clasesTomadas}</p>
        </div>
        <div className="p-2 sm:p-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#f59e0b]" />
            <p className="text-[#9ca3af] text-[10px] sm:text-xs">Racha</p>
          </div>
          <p className="text-[#f9fafb] text-lg sm:text-xl font-bold">{asistencia.rachaSemanas} sem</p>
        </div>
      </div>
    </GlassPanel>
  )
}
