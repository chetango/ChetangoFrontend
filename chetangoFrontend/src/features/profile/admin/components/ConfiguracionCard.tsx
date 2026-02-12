// ============================================
// CONFIGURACION CARD COMPONENT - ADMIN
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { AlertTriangle, BarChart3, Bell, DollarSign, Package, Settings, UserX } from 'lucide-react'
import { useState } from 'react'
import { useUpdateConfiguracionAdminMutation } from '../api/profileQueries'
import type { AdminProfile } from '../types/profile.types'

interface ConfiguracionCardProps {
  profile: AdminProfile
}

export const ConfiguracionCard = ({ profile }: ConfiguracionCardProps) => {
  const [config, setConfig] = useState({
    notificacionesEmail: profile.configuracion?.notificacionesEmail ?? true,
    alertasPagosPendientes: profile.configuracion?.alertasPagosPendientes ?? true,
    reportesAutomaticos: profile.configuracion?.reportesAutomaticos ?? true,
    alertasPaquetesVencer: profile.configuracion?.alertasPaquetesVencer ?? true,
    alertasAsistenciaBaja: profile.configuracion?.alertasAsistenciaBaja ?? true,
    notificacionesNuevosRegistros: profile.configuracion?.notificacionesNuevosRegistros ?? true,
  })

  const updateMutation = useUpdateConfiguracionAdminMutation()

  const handleToggle = (key: keyof typeof config) => {
    const newConfig = { ...config, [key]: !config[key] }
    setConfig(newConfig)
    updateMutation.mutate(newConfig)
  }

  const configuraciones = [
    {
      key: 'notificacionesEmail' as const,
      icon: Bell,
      titulo: 'Notificaciones por Email',
      descripcion: 'Recibe actualizaciones importantes del sistema',
      color: '#10b981',
    },
    {
      key: 'alertasPagosPendientes' as const,
      icon: DollarSign,
      titulo: 'Alertas de Pagos Pendientes',
      descripcion: 'Notificaciones cuando hay pagos sin registrar',
      color: '#c93448',
    },
    {
      key: 'reportesAutomaticos' as const,
      icon: BarChart3,
      titulo: 'Reportes Semanales Automáticos',
      descripcion: 'Recibe reportes de rendimiento cada semana',
      color: '#6366f1',
    },
    {
      key: 'alertasPaquetesVencer' as const,
      icon: Package,
      titulo: 'Alertas de Paquetes por Vencer',
      descripcion: 'Te avisamos cuando paquetes están próximos a vencer',
      color: '#f59e0b',
    },
    {
      key: 'alertasAsistenciaBaja' as const,
      icon: AlertTriangle,
      titulo: 'Alertas de Asistencia Baja',
      descripcion: 'Notificaciones cuando hay clases con poca asistencia',
      color: '#ef4444',
    },
    {
      key: 'notificacionesNuevosRegistros' as const,
      icon: UserX,
      titulo: 'Notificaciones de Nuevos Registros',
      descripcion: 'Te informamos cuando hay nuevos alumnos o profesores',
      color: '#8b5cf6',
    },
  ]

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-5 h-5 text-[#10b981]" />
        <h3 className="text-[#f9fafb] text-xl font-semibold">Configuración de Notificaciones</h3>
      </div>

      <div className="space-y-4">
        {configuraciones.map(({ key, icon: Icon, titulo, descripcion, color }) => (
          <div
            key={key}
            className="flex items-center justify-between p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.05)] transition-all duration-300"
          >
            <div className="flex items-center gap-3 flex-1">
              <div
                className="p-2 rounded-lg"
                style={{
                  background: `${color}20`,
                }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div className="flex-1">
                <p className="text-[#f9fafb] font-medium">{titulo}</p>
                <p className="text-[#9ca3af] text-sm mt-0.5">{descripcion}</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle(key)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                config[key] ? 'bg-[#10b981]' : 'bg-[#4b5563]'
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                  config[key] ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Nota informativa */}
      <div className="mt-6 p-4 rounded-lg bg-[rgba(99,102,241,0.1)] border border-[rgba(99,102,241,0.2)]">
        <p className="text-[#93c5fd] text-sm">
          <strong>Nota:</strong> Los cambios se guardan automáticamente. Puedes modificar estas
          preferencias en cualquier momento.
        </p>
      </div>
    </GlassPanel>
  )
}
