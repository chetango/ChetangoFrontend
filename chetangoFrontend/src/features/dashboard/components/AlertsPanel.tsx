// ============================================
// ALERTS PANEL COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { AlertCircle, Bell, Calendar, Users } from 'lucide-react'
import type { Alerta, TipoAlerta } from '../types/dashboard.types'
import { AlertItem } from './AlertItem'

interface AlertsPanelProps {
  alertas: Alerta[]
}

export const AlertsPanel = ({ alertas }: AlertsPanelProps) => {
  // Mapeo de iconos por tipo de alerta
  const getIconoAlerta = (tipo: TipoAlerta) => {
    const iconos = {
      PaquetePorVencer: AlertCircle,
      AlumnoInactivo: Users,
      ClaseBajaAsistencia: Calendar,
      PagosPendientes: AlertCircle,
      ClasePocosCupos: Calendar,
      PagoPendiente: AlertCircle
    }
    return iconos[tipo] || AlertCircle
  }

  return (
    <div className="lg:col-span-1">
      <GlassPanel className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#f59e0b]" />
            <h3 className="text-[#f9fafb] text-xl font-bold">Alertas</h3>
          </div>
          {alertas.length > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.3)] text-[#fca5a5] text-xs">
              {alertas.length}
            </span>
          )}
        </div>

        {alertas.length > 0 ? (
          <div className="space-y-3">
            {alertas.map((alerta, index) => (
              <AlertItem
                key={index}
                tipo={alerta.tipo}
                titulo={alerta.titulo}
                descripcion={alerta.descripcion}
                prioridad={alerta.prioridad}
                icon={getIconoAlerta(alerta.tipo)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-[#4b5563] mx-auto mb-3" />
            <p className="text-[#9ca3af] text-sm">No hay alertas en este momento</p>
          </div>
        )}
      </GlassPanel>
    </div>
  )
}
