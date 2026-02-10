// ============================================
// CLASES HOY SECTION COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { Calendar } from 'lucide-react'
import type { ClaseHoy } from '../types/dashboardProfesor.types'
import { ClaseHoyCard } from './ClaseHoyCard'

interface ClasesHoySectionProps {
  clases: ClaseHoy[]
  onRegistrarAsistencia: (claseId: string) => void
}

export const ClasesHoySection = ({ clases, onRegistrarAsistencia }: ClasesHoySectionProps) => {
  return (
    <div className="mb-8 md:mb-10">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-[#7c5af8]" />
        <h2 className="text-[#f9fafb] text-2xl font-bold">Clases de Hoy</h2>
        <span className="px-3 py-1 rounded-full bg-[rgba(124,90,248,0.15)] border border-[rgba(124,90,248,0.3)] text-[#9b8afb] text-sm font-medium">
          {clases.length} {clases.length === 1 ? 'clase' : 'clases'}
        </span>
        <div className="flex-1 h-[2px] bg-gradient-to-r from-[rgba(255,255,255,0.08)] to-transparent" />
      </div>

      {clases.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {clases.map((clase) => (
            <ClaseHoyCard
              key={clase.idClase}
              clase={clase}
              onRegistrarAsistencia={onRegistrarAsistencia}
            />
          ))}
        </div>
      ) : (
        <GlassPanel className="p-12 text-center">
          <Calendar className="w-16 h-16 text-[#6b7280] mx-auto mb-4" />
          <h3 className="text-[#f9fafb] text-xl font-semibold mb-2">Hoy no tienes clases programadas</h3>
          <p className="text-[#9ca3af]">¡Disfruta tu día!</p>
        </GlassPanel>
      )}
    </div>
  )
}
