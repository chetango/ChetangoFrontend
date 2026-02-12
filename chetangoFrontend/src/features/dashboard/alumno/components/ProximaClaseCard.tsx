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
      <GlassPanel className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-5 h-5 text-[#7c5af8]" />
          <h3 className="text-[#f9fafb] text-xl font-semibold">Próxima Clase</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-[#9ca3af]">No tienes clases programadas</p>
        </div>
      </GlassPanel>
    )
  }

  return (
    <GlassPanel className="p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#7c5af8] opacity-[0.08] blur-[80px] rounded-full" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-[#7c5af8]" />
            <h3 className="text-[#f9fafb] text-xl font-semibold">Próxima Clase</h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-[rgba(124,90,248,0.15)] border border-[rgba(124,90,248,0.3)] text-[#9b8afb] text-sm">
            {getTiempoRestante(clase.minutosParaInicio)}
          </span>
        </div>

        {/* Clase Info */}
        <div className="mb-6">
          <h4 className="text-[#f9fafb] text-2xl font-semibold mb-3">{clase.nombre}</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#9ca3af]" />
              <span className="text-[#d1d5db]">
                {formatearFecha(clase.fecha)} - {formatearHora(clase.hora)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-[#9ca3af]" />
              <span className="text-[#d1d5db]">Prof. {clase.profesor}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#9ca3af]" />
              <span className="text-[#d1d5db]">{clase.ubicacion}</span>
            </div>
          </div>
        </div>

        {/* Badge Nivel */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(124,90,248,0.15)] border border-[rgba(124,90,248,0.3)] mb-6">
          <Star className="w-4 h-4 text-[#7c5af8]" />
          <span className="text-[#9b8afb] text-sm font-medium">{clase.nivel}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#7c5af8] to-[#6938ef] text-white shadow-[0_4px_16px_rgba(124,90,248,0.4)] hover:shadow-[0_8px_24px_rgba(124,90,248,0.5)] transition-all duration-300 hover:scale-[1.02]">
            Ver Detalles
            <ChevronRight className="w-5 h-5" />
          </button>
          <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-[#d1d5db] transition-all duration-300">
            Reprogramar
          </button>
        </div>
      </div>
    </GlassPanel>
  )
}
