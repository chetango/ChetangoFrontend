// ============================================
// PROXIMA CLASE CARD COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { Calendar, ChevronRight, Clock, MapPin, Star, User } from 'lucide-react'
import type { ProximaClase } from '../types/dashboardAlumno.types'
import { formatearFecha, formatearHora, getTiempoRestante } from '../utils/dashboardUtils'

interface ProximaClaseCardProps {
  clase: ProximaClase | null
}

export const ProximaClaseCard = ({ clase }: ProximaClaseCardProps) => {
  if (!clase) {
    return (
      <GlassPanel className="p-5 sm:p-6 md:p-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#7c5af8]" />
          <h3 className="text-[#f9fafb] text-lg sm:text-xl font-semibold">Próxima Clase</h3>
        </div>
        <div className="text-center py-6 sm:py-8">
          <p className="text-[#9ca3af] text-sm sm:text-base">No tienes clases programadas</p>
        </div>
      </GlassPanel>
    )
  }

  return (
    <GlassPanel className="p-5 sm:p-6 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 sm:w-40 md:w-48 h-32 sm:h-40 md:h-48 bg-[#7c5af8] opacity-[0.08] blur-[60px] sm:blur-[80px] rounded-full" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#7c5af8] flex-shrink-0" />
            <h3 className="text-[#f9fafb] text-lg sm:text-xl font-semibold truncate">Próxima Clase</h3>
          </div>
          <span className="px-2 sm:px-3 py-1 rounded-full bg-[rgba(124,90,248,0.15)] border border-[rgba(124,90,248,0.3)] text-[#9b8afb] text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
            {getTiempoRestante(clase.minutosParaInicio)}
          </span>
        </div>

        {/* Clase Info */}
        <div className="mb-4 sm:mb-6">
          <h4 className="text-[#f9fafb] text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">{clase.nombre}</h4>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#9ca3af] flex-shrink-0" />
              <span className="text-[#d1d5db] text-sm sm:text-base">
                {formatearFecha(clase.fecha)} - {formatearHora(clase.hora)}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#9ca3af] flex-shrink-0" />
              <span className="text-[#d1d5db] text-sm sm:text-base">Prof. {clase.profesor}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#9ca3af] flex-shrink-0" />
              <span className="text-[#d1d5db] text-sm sm:text-base">{clase.ubicacion}</span>
            </div>
          </div>
        </div>

        {/* Badge Nivel */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[rgba(124,90,248,0.15)] border border-[rgba(124,90,248,0.3)] mb-4 sm:mb-6">
          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#7c5af8]" />
          <span className="text-[#9b8afb] text-xs sm:text-sm font-medium">{clase.nivel}</span>
        </div>

        {/* Actions - Stack en móvil, inline en tablet+ */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#7c5af8] to-[#6938ef] text-white shadow-[0_4px_16px_rgba(124,90,248,0.4)] hover:shadow-[0_8px_24px_rgba(124,90,248,0.5)] active:scale-[0.98] transition-all duration-300 text-sm sm:text-base min-h-touch">
            <span>Ver Detalles</span>
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] active:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-[#d1d5db] transition-all duration-300 text-sm sm:text-base min-h-touch">
            Reprogramar
          </button>
        </div>
      </div>
    </GlassPanel>
  )
}
