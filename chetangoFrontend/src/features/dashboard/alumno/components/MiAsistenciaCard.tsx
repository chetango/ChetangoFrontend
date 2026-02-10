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
    <GlassPanel className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-[#34d399]" />
          <h3 className="text-[#f9fafb] text-xl font-semibold">Mi Asistencia</h3>
        </div>
      </div>

      {/* Porcentaje */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-[rgba(52,211,153,0.2)] to-[rgba(52,211,153,0.05)] border-4 border-[#34d399] mb-4">
          <span className="text-[#34d399] text-4xl font-bold">{asistencia.porcentaje}%</span>
        </div>
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border"
          style={{
            background: badge.bg,
            borderColor: badge.color + '40',
            color: badge.color
          }}
        >
          <span className="font-medium">{badge.label}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] text-center">
          <p className="text-[#9ca3af] text-sm mb-1">Clases tomadas</p>
          <p className="text-[#f9fafb] text-2xl font-bold">{asistencia.clasesTomadas}</p>
        </div>
        <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-[#f59e0b]" />
            <p className="text-[#9ca3af] text-sm">Racha</p>
          </div>
          <p className="text-[#f9fafb] text-2xl font-bold">{asistencia.rachaSemanas} sem</p>
        </div>
      </div>
    </GlassPanel>
  )
}
