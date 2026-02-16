// ============================================
// MI PAQUETE CARD COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { Package } from 'lucide-react'
import type { PaqueteActivo } from '../types/dashboardAlumno.types'
import { getEstadoPaqueteBadge } from '../utils/dashboardUtils'

interface MiPaqueteCardProps {
  paquete: PaqueteActivo | null
}

export const MiPaqueteCard = ({ paquete }: MiPaqueteCardProps) => {
  if (!paquete) {
    return (
      <GlassPanel className="p-5 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Package className="w-4 h-4 sm:w-5 sm:h-5 text-[#c93448]" />
          <h3 className="text-[#f9fafb] text-lg sm:text-xl font-semibold">Mi Paquete</h3>
        </div>
        <div className="text-center py-6 sm:py-8">
          <p className="text-[#9ca3af] text-sm sm:text-base mb-3 sm:mb-4">No tienes un paquete activo</p>
          <button className="px-4 sm:px-6 py-2 sm:py-2.5 bg-[#c93448] text-white rounded-lg hover:bg-[#b32d40] active:bg-[#a12838] transition-colors text-sm sm:text-base min-h-touch">
            Comprar Paquete
          </button>
        </div>
      </GlassPanel>
    )
  }

  const estadoBadge = getEstadoPaqueteBadge(paquete.estado)
  const porcentajeUsado = ((paquete.clasesTotales - paquete.clasesRestantes) / paquete.clasesTotales) * 100
  const clasesUsadas = paquete.clasesTotales - paquete.clasesRestantes

  return (
    <GlassPanel className="p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Package className="w-4 h-4 sm:w-5 sm:h-5 text-[#c93448] flex-shrink-0" />
          <h3 className="text-[#f9fafb] text-lg sm:text-xl font-semibold truncate">Mi Paquete</h3>
        </div>
        <span
          className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap flex-shrink-0"
          style={{
            background: estadoBadge.bg,
            borderColor: estadoBadge.border,
            color: estadoBadge.text
          }}
        >
          {estadoBadge.label}
        </span>
      </div>

      <h4 className="text-[#f9fafb] text-lg sm:text-xl mb-3 sm:mb-4">{paquete.tipo}</h4>

      {/* Clases Restantes */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-end justify-between mb-2">
          <span className="text-[#9ca3af] text-xs sm:text-sm">Clases restantes</span>
          <span className="text-[#f9fafb] text-2xl sm:text-3xl font-bold">{paquete.clasesRestantes}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="relative h-2.5 sm:h-3 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#c93448] to-[#e54d5e] rounded-full transition-all duration-500"
            style={{ width: `${porcentajeUsado}%` }}
          />
        </div>
        <p className="text-[#6b7280] text-xs mt-1.5 sm:mt-2">
          {clasesUsadas} de {paquete.clasesTotales} clases usadas
        </p>
      </div>

      {/* Vencimiento */}
      <div className="p-3 sm:p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]">
        <div className="flex items-center justify-between">
          <span className="text-[#9ca3af] text-xs sm:text-sm">Vence en</span>
          <span className="text-[#f9fafb] text-sm sm:text-base font-medium">{paquete.diasParaVencer} días</span>
        </div>
        <p className="text-[#6b7280] text-xs mt-1">
          {new Date(paquete.fechaVencimiento).toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}
        </p>
      </div>
    </GlassPanel>
  )
}
