// ============================================
// PROXIMAS CLASES SECTION COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { ChevronRight, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { ClaseProxima } from '../types/dashboardProfesor.types'
import { formatearHora, obtenerDiaAbreviado, obtenerDiaCompleto, obtenerDiaMes } from '../utils/dashboardUtils'

interface ProximasClasesSectionProps {
  clases: ClaseProxima[]
}

export const ProximasClasesSection = ({ clases }: ProximasClasesSectionProps) => {
  const navigate = useNavigate()

  // Tomar solo las primeras 4
  const clasesAMostrar = clases.slice(0, 4)

  if (clasesAMostrar.length === 0) {
    return null
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-5 h-5 text-[#f59e0b]" />
        <h3 className="text-[#f9fafb] text-xl font-semibold">Próximas Clases</h3>
        <div className="flex-1 h-[2px] bg-gradient-to-r from-[rgba(255,255,255,0.08)] to-transparent" />
      </div>

      <GlassPanel className="p-6">
        <div className="space-y-3">
          {clasesAMostrar.map((clase) => (
            <div
              key={clase.idClase}
              className="flex items-center gap-4 p-4 rounded-xl bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.1)] transition-all duration-300 cursor-pointer group"
              onClick={() => navigate('/profesor/classes')}
            >
              {/* Date Badge */}
              <div className="flex-shrink-0 text-center p-3 rounded-lg bg-[rgba(124,90,248,0.15)] border border-[rgba(124,90,248,0.3)]">
                <p className="text-[#9b8afb] text-xs font-medium uppercase">
                  {obtenerDiaAbreviado(clase.fecha)}
                </p>
                <p className="text-[#7c5af8] font-semibold text-lg">
                  {obtenerDiaMes(clase.fecha)}
                </p>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-[#f9fafb] font-medium mb-1">{clase.tipoClase}</p>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#9ca3af]" />
                  <span className="text-[#9ca3af] text-sm">{formatearHora(clase.horaInicio)}</span>
                  <span className="w-1 h-1 rounded-full bg-[#6b7280]" />
                  <span className="text-[#9ca3af] text-sm">
                    {obtenerDiaCompleto(clase.fecha)}
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <ChevronRight className="w-5 h-5 text-[#6b7280] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0" />
            </div>
          ))}
        </div>

        {clases.length > 4 && (
          <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.08)] text-center">
            <button 
              onClick={() => navigate('/profesor/classes')}
              className="text-[#7c5af8] text-sm font-medium hover:underline"
            >
              Ver todas las clases →
            </button>
          </div>
        )}
      </GlassPanel>
    </div>
  )
}
