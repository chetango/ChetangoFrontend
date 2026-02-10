// ============================================
// CONFIGURACION CARD COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { Bell, Settings } from 'lucide-react'
import { useState } from 'react'
import { useUpdateConfiguracionMutation } from '../api/profileQueries'
import type { AlumnoProfile } from '../types/profile.types'

interface ConfiguracionCardProps {
  profile: AlumnoProfile
}

export const ConfiguracionCard = ({ profile }: ConfiguracionCardProps) => {
  const [config, setConfig] = useState({
    notificacionesEmail: profile.configuracion?.notificacionesEmail ?? true,
    recordatoriosClase: profile.configuracion?.recordatoriosClase ?? true,
    alertasPaquete: profile.configuracion?.alertasPaquete ?? true,
  })

  const updateMutation = useUpdateConfiguracionMutation()

  const handleToggle = (key: keyof typeof config) => {
    const newConfig = { ...config, [key]: !config[key] }
    setConfig(newConfig)
    updateMutation.mutate(newConfig)
  }

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-5 h-5 text-[#6366f1]" />
        <h3 className="text-[#f9fafb] text-xl font-semibold">Configuración</h3>
      </div>

      <div className="space-y-4">
        {/* Notificaciones Email */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-[#9ca3af]" />
            <div>
              <p className="text-[#f9fafb] font-medium">Notificaciones por Email</p>
              <p className="text-[#9ca3af] text-sm">Recibe actualizaciones importantes</p>
            </div>
          </div>
          <button
            onClick={() => handleToggle('notificacionesEmail')}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
              config.notificacionesEmail ? 'bg-[#10b981]' : 'bg-[#4b5563]'
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                config.notificacionesEmail ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Recordatorios de Clase */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-[#9ca3af]" />
            <div>
              <p className="text-[#f9fafb] font-medium">Recordatorios de Clase</p>
              <p className="text-[#9ca3af] text-sm">Te avisamos 1 hora antes de tu clase</p>
            </div>
          </div>
          <button
            onClick={() => handleToggle('recordatoriosClase')}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
              config.recordatoriosClase ? 'bg-[#10b981]' : 'bg-[#4b5563]'
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                config.recordatoriosClase ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Alertas de Paquete */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-[#9ca3af]" />
            <div>
              <p className="text-[#f9fafb] font-medium">Alertas de Paquete</p>
              <p className="text-[#9ca3af] text-sm">Avisos cuando quedan pocas clases</p>
            </div>
          </div>
          <button
            onClick={() => handleToggle('alertasPaquete')}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
              config.alertasPaquete ? 'bg-[#10b981]' : 'bg-[#4b5563]'
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                config.alertasPaquete ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {updateMutation.isPending && (
        <div className="mt-4 text-center text-[#9ca3af] text-sm">
          Guardando configuración...
        </div>
      )}
    </GlassPanel>
  )
}
