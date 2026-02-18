// ============================================
// NOTIFICATIONS DROPDOWN COMPONENT
// ============================================

import { useSolicitudesClasePrivadaPendientes, useSolicitudesRenovacionPendientes } from '@/features/solicitudes/api/solicitudesQueries'
import type { SolicitudClasePrivadaDTO, SolicitudRenovacionPaqueteDTO } from '@/features/solicitudes/types/solicitudesTypes'
import { ROUTES } from '@/shared/constants/routes'
import { Bell, Calendar, CheckCircle, Loader2, Package, Star, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface NotificationDropdownProps {
  onClose: () => void
  onOpenRenovacion?: (solicitud: SolicitudRenovacionPaqueteDTO) => void
  onOpenClasePrivada?: (solicitud: SolicitudClasePrivadaDTO) => void
}

export const NotificationDropdown = ({
  onClose,
  onOpenRenovacion,
  onOpenClasePrivada
}: NotificationDropdownProps) => {
  const navigate = useNavigate()
  const { data: renovaciones = [], isLoading: loadingRenovaciones } = useSolicitudesRenovacionPendientes()
  const { data: clasesPrivadas = [], isLoading: loadingClases } = useSolicitudesClasePrivadaPendientes()

  const totalPendientes = renovaciones.length + clasesPrivadas.length
  const isLoading = loadingRenovaciones || loadingClases

  const handleViewAll = () => {
    navigate(ROUTES.ADMIN.NOTIFICATIONS)
    onClose()
  }

  const handleNotificationClick = (
    type: 'renovacion' | 'clase-privada',
    solicitud: SolicitudRenovacionPaqueteDTO | SolicitudClasePrivadaDTO
  ) => {
    if (type === 'renovacion' && onOpenRenovacion) {
      onOpenRenovacion(solicitud as SolicitudRenovacionPaqueteDTO)
    } else if (type === 'clase-privada' && onOpenClasePrivada) {
      onOpenClasePrivada(solicitud as SolicitudClasePrivadaDTO)
    }
    onClose()
  }

  return (
    <div 
      className="absolute top-full mt-2 w-[calc(100vw-2rem)] sm:w-[360px] max-w-[360px] z-[100]"
      style={{
        left: window.innerWidth < 640 ? '50%' : 'auto',
        right: window.innerWidth >= 640 ? '0' : 'auto',
        transform: window.innerWidth < 640 ? 'translateX(-50%)' : 'none'
      }}
    >
      <div 
        className="max-h-[450px] overflow-hidden rounded-xl shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.98), rgba(13, 13, 13, 0.98))',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(124, 90, 248, 0.2)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(124, 90, 248, 0.1)'
        }}
      >
        {/* Header */}
        <div className="p-4 border-b border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#c93448]" />
              <h3 className="text-[#f9fafb] font-semibold">Notificaciones</h3>
              {totalPendientes > 0 && (
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#c93448] text-white text-xs font-bold">
                  {totalPendientes}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-[#9ca3af] hover:text-[#f9fafb] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 text-[#7c5af8] animate-spin mx-auto mb-2" />
              <p className="text-[#9ca3af] text-sm">Cargando notificaciones...</p>
            </div>
          ) : totalPendientes === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-[#4b5563] mx-auto mb-3" />
              <p className="text-[#9ca3af] text-sm">No hay notificaciones pendientes</p>
            </div>
          ) : (
            <div className="divide-y divide-[rgba(255,255,255,0.05)]">
              {/* Renovaciones */}
              {renovaciones.map((solicitud) => (
                <button
                  key={`renovacion-${solicitud.idSolicitud}`}
                  onClick={() => handleNotificationClick('renovacion', solicitud)}
                  className="w-full p-4 text-left hover:bg-[rgba(255,255,255,0.03)] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[rgba(201,52,72,0.15)] flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-[#c93448]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#f9fafb] text-sm font-medium mb-1">
                        {solicitud.nombreAlumno}
                      </p>
                      <p className="text-[#9ca3af] text-xs mb-1">
                        Solicita renovar paquete
                      </p>
                      {solicitud.clasesRestantes !== null && (
                        <p className="text-[#f59e0b] text-xs">
                          {solicitud.clasesRestantes} clases restantes
                        </p>
                      )}
                    </div>
                    <CheckCircle className="w-4 h-4 text-[#10b981] shrink-0" />
                  </div>
                </button>
              ))}

              {/* Clases Privadas */}
              {clasesPrivadas.map((solicitud) => (
                <button
                  key={`clase-${solicitud.idSolicitud}`}
                  onClick={() => handleNotificationClick('clase-privada', solicitud)}
                  className="w-full p-4 text-left hover:bg-[rgba(255,255,255,0.03)] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[rgba(124,90,248,0.15)] flex items-center justify-center shrink-0">
                      <Star className="w-5 h-5 text-[#7c5af8]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#f9fafb] text-sm font-medium mb-1">
                        {solicitud.nombreAlumno}
                      </p>
                      <p className="text-[#9ca3af] text-xs mb-1">
                        Solicita clase privada
                      </p>
                      {solicitud.fechaPreferida && (
                        <div className="flex items-center gap-1 text-[#7c5af8] text-xs">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(solicitud.fechaPreferida).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'short'
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                    <CheckCircle className="w-4 h-4 text-[#10b981] shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {totalPendientes > 0 && (
          <div className="p-3 border-t border-[rgba(255,255,255,0.1)]">
            <button
              onClick={handleViewAll}
              className="w-full py-2 text-center text-[#7c5af8] hover:text-[#6845e8] text-sm font-medium transition-colors"
            >
              Ver todas las notificaciones
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
