// ============================================
// ACTIVITY TIMELINE COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { Clock, DollarSign, RefreshCw } from 'lucide-react'
import type { UltimoPago } from '../types/dashboard.types'
import { ActivityItem } from './ActivityItem'

interface ActivityTimelineProps {
  ultimosPagos: UltimoPago[]
  onRefresh?: () => void
}

export const ActivityTimeline = ({ ultimosPagos, onRefresh }: ActivityTimelineProps) => {
  // Convertir pagos a actividades
  const actividades = ultimosPagos.map(pago => ({
    id: pago.idPago,
    descripcion: `Pago registrado – ${pago.nombreAlumno} – $${pago.monto.toLocaleString('es-CL')}`,
    fecha: pago.fecha,
    icon: DollarSign,
    color: '#22c55e'
  }))

  return (
    <div className="lg:col-span-2">
      <GlassPanel className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#7c5af8]" />
            <h3 className="text-[#f9fafb] text-xl font-bold">Última Actividad</h3>
          </div>
          {onRefresh && (
            <button 
              onClick={onRefresh}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-[#d1d5db] text-sm transition-all duration-300"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Actualizar
            </button>
          )}
        </div>

        {actividades.length > 0 ? (
          <div className="space-y-4">
            {actividades.map((actividad) => (
              <ActivityItem
                key={actividad.id}
                descripcion={actividad.descripcion}
                fecha={actividad.fecha}
                icon={actividad.icon}
                color={actividad.color}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-[#4b5563] mx-auto mb-3" />
            <p className="text-[#9ca3af] text-sm">No hay actividad reciente</p>
          </div>
        )}

        {/* Footer */}
        {actividades.length > 0 && (
          <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between">
            <p className="text-[#6b7280] text-xs">
              Mostrando {actividades.length} actividades recientes
            </p>
            <button className="text-[#7c5af8] text-xs font-medium hover:underline">
              Ver todo el historial →
            </button>
          </div>
        )}
      </GlassPanel>
    </div>
  )
}
