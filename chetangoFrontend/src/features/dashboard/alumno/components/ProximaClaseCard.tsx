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
      <GlassPanel className="p-3 sm:p-5 md:p-6 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Calendar className="w-4 h-4 text-[#7c5af8]" />
          <h3 className="text-[#f9fafb] text-sm sm:text-base md:text-lg font-semibold">Próxima Clase</h3>
        </div>
        <div className="text-center py-8 flex-1 flex items-center justify-center">
          <p className="text-[#9ca3af] text-xs sm:text-sm">No tienes clases programadas</p>
        </div>
      </GlassPanel>
    )
  }

  return (
    <GlassPanel className="p-3 sm:p-5 md:p-6 relative overflow-hidden h-full flex flex-col">
      <div className="absolute top-0 right-0 w-32 sm:w-40 md:w-48 h-32 sm:h-40 md:h-48 bg-[#7c5af8] opacity-[0.08] blur-[60px] sm:blur-[80px] rounded-full" />
      
      <div className="relative z-10 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Calendar className="w-4 h-4 text-[#7c5af8] flex-shrink-0" />
            <h3 className="text-[#f9fafb] text-sm sm:text-base md:text-lg font-semibold truncate">Próxima Clase</h3>
          </div>
          <span className="px-2 py-0.5 sm:py-1 rounded-full bg-[rgba(124,90,248,0.15)] border border-[rgba(124,90,248,0.3)] text-[#9b8afb] text-[10px] sm:text-xs whitespace-nowrap flex-shrink-0">
            {getTiempoRestante(clase.minutosParaInicio)}
          </span>
        </div>

        {/* Clase Info */}
        <div className="mb-3 sm:mb-4 flex-1">
          <h4 className="text-[#f9fafb] text-base sm:text-lg md:text-xl font-semibold mb-2">{clase.nombre}</h4>
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#9ca3af] flex-shrink-0" />
              <span className="text-[#d1d5db] text-xs sm:text-sm">
                {formatearFecha(clase.fecha)} - {formatearHora(clase.hora)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#9ca3af] flex-shrink-0" />
              <span className="text-[#d1d5db] text-xs sm:text-sm">Prof. {clase.profesor}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#9ca3af] flex-shrink-0" />
              <span className="text-[#d1d5db] text-xs sm:text-sm">{clase.ubicacion}</span>
            </div>
          </div>
        </div>

        {/* Badge Nivel */}
        <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-[rgba(124,90,248,0.15)] border border-[rgba(124,90,248,0.3)] mb-3 sm:mb-4">
          <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#7c5af8]" />
          <span className="text-[#9b8afb] text-[10px] sm:text-xs font-medium">{clase.nivel}</span>
        </div>

        {/* Actions - Más compactos */}
        <div className="flex gap-2">
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
