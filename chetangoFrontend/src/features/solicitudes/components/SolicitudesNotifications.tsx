// ============================================
// SOLICITUDES NOTIFICATIONS CONTAINER
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { Bell } from 'lucide-react'
import { useSolicitudesClasePrivadaPendientes, useSolicitudesRenovacionPendientes } from '../api/solicitudesQueries'
import type { SolicitudClasePrivadaDTO, SolicitudRenovacionPaqueteDTO } from '../types/solicitudesTypes'
import { SolicitudClasePrivadaNotification } from './SolicitudClasePrivadaNotification'
import { SolicitudRenovacionNotification } from './SolicitudRenovacionNotification'

interface SolicitudesNotificationsProps {
  maxItems?: number
  onOpenRenovacion?: (solicitud: SolicitudRenovacionPaqueteDTO) => void
  onOpenClasePrivada?: (solicitud: SolicitudClasePrivadaDTO) => void
}

export const SolicitudesNotifications = ({
  maxItems = 5,
  onOpenRenovacion,
  onOpenClasePrivada,
}: SolicitudesNotificationsProps) => {
  const { data: renovaciones = [], isLoading: loadingRenovaciones } = useSolicitudesRenovacionPendientes()
  const { data: clasesPrivadas = [], isLoading: loadingClases } = useSolicitudesClasePrivadaPendientes()

  const totalPendientes = renovaciones.length + clasesPrivadas.length

  if (loadingRenovaciones || loadingClases) {
    return (
      <GlassPanel className="p-6">
        <div className="flex items-center gap-3 text-[#9ca3af]">
          <Bell className="w-5 h-5 animate-pulse" />
          <span className="text-sm">Cargando notificaciones...</span>
        </div>
      </GlassPanel>
    )
  }

  if (totalPendientes === 0) {
    return (
      <GlassPanel className="p-6">
        <div className="flex items-center gap-3 text-[#9ca3af]">
          <Bell className="w-5 h-5" />
          <span className="text-sm">No hay solicitudes pendientes</span>
        </div>
      </GlassPanel>
    )
  }

  // Combinar y ordenar por fecha (más recientes primero)
  const todasSolicitudes = [
    ...renovaciones.map(s => ({ ...s, type: 'renovacion' as const })),
    ...clasesPrivadas.map(s => ({ ...s, type: 'clase-privada' as const }))
  ].sort((a, b) => 
    new Date(b.fechaSolicitud).getTime() - new Date(a.fechaSolicitud).getTime()
  ).slice(0, maxItems)

  return (
    <div className="mb-3 sm:mb-4">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="w-5 h-5 text-[#c93448]" />
        <h3 className="text-[#f9fafb] text-xl font-semibold">
          Solicitudes Pendientes
        </h3>
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#c93448] text-white text-xs font-bold">
          {totalPendientes}
        </div>
        <div className="flex-1 h-[2px] bg-gradient-to-r from-[rgba(255,255,255,0.08)] to-transparent" />
      </div>

      <div className="space-y-4">
        {todasSolicitudes.map((solicitud) => {
          if (solicitud.type === 'renovacion') {
            return (
              <SolicitudRenovacionNotification
                key={`renovacion-${solicitud.idSolicitud}`}
                solicitud={solicitud}
                onApprove={() => {
                  onOpenRenovacion?.(solicitud)
                }}
                onDismiss={() => {
                  console.log('Ignorar notificación:', solicitud.idSolicitud)
                  // TODO: Implementar dismiss local (no afecta backend)
                }}
              />
            )
          } else {
            return (
              <SolicitudClasePrivadaNotification
                key={`clase-${solicitud.idSolicitud}`}
                solicitud={solicitud}
                onApprove={() => {
                  onOpenClasePrivada?.(solicitud)
                }}
                onDismiss={() => {
                  console.log('Ignorar notificación:', solicitud.idSolicitud)
                  // TODO: Implementar dismiss local (no afecta backend)
                }}
              />
            )
          }
        })}
      </div>

      {totalPendientes > maxItems && (
        <div className="mt-4 text-center">
          <button className="text-[#c93448] hover:text-[#f9fafb] text-sm font-medium transition-colors">
            Ver todas ({totalPendientes})
          </button>
        </div>
      )}
    </div>
  )
}
