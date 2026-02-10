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
      <GlassPanel className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Package className="w-5 h-5 text-[#c93448]" />
          <h3 className="text-[#f9fafb] text-xl font-semibold">Mi Paquete</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-[#9ca3af]">No tienes un paquete activo</p>
          <button className="mt-4 px-6 py-2 bg-[#c93448] text-white rounded-lg hover:bg-[#b32d40] transition-colors">
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
    <GlassPanel className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Package className="w-5 h-5 text-[#c93448]" />
          <h3 className="text-[#f9fafb] text-xl font-semibold">Mi Paquete</h3>
        </div>
        <span
          className="px-3 py-1 rounded-full text-xs font-medium border"
          style={{
            background: estadoBadge.bg,
            borderColor: estadoBadge.border,
            color: estadoBadge.text
          }}
        >
          {estadoBadge.label}
        </span>
      </div>

      <h4 className="text-[#f9fafb] text-xl mb-4">{paquete.tipo}</h4>

      {/* Clases Restantes */}
      <div className="mb-6">
        <div className="flex items-end justify-between mb-2">
          <span className="text-[#9ca3af] text-sm">Clases restantes</span>
          <span className="text-[#f9fafb] text-3xl font-bold">{paquete.clasesRestantes}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="relative h-3 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#c93448] to-[#e54d5e] rounded-full transition-all duration-500"
            style={{ width: `${porcentajeUsado}%` }}
          />
        </div>
        <p className="text-[#6b7280] text-xs mt-2">
          {clasesUsadas} de {paquete.clasesTotales} clases usadas
        </p>
      </div>

      {/* Vencimiento */}
      <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]">
        <div className="flex items-center justify-between">
          <span className="text-[#9ca3af] text-sm">Vence en</span>
          <span className="text-[#f9fafb] font-medium">{paquete.diasParaVencer} días</span>
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
