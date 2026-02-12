// ============================================
// INFORMACION PROFESIONAL CARD - ADMIN
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { Activity, Briefcase, Calendar, Shield } from 'lucide-react'
import type { AdminProfile } from '../types/profile.types'

interface InformacionProfesionalCardProps {
  profile: AdminProfile
}

export const InformacionProfesionalCard = ({ profile }: InformacionProfesionalCardProps) => {
  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'No disponible'
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Briefcase className="w-5 h-5 text-[#f59e0b]" />
        <h3 className="text-[#f9fafb] text-xl font-semibold">Información Profesional</h3>
      </div>

      <div className="space-y-4">
        {/* Cargo */}
        <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-4 h-4 text-[#9ca3af]" />
            <span className="text-[#9ca3af] text-sm">Cargo</span>
          </div>
          <p className="text-[#f9fafb] font-medium">{profile.cargo || 'No especificado'}</p>
        </div>

        {/* Departamento */}
        <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-4 h-4 text-[#9ca3af]" />
            <span className="text-[#9ca3af] text-sm">Departamento</span>
          </div>
          <p className="text-[#f9fafb] font-medium">{profile.departamento || 'No especificado'}</p>
        </div>

        {/* Fecha de Ingreso */}
        <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-[#9ca3af]" />
            <span className="text-[#9ca3af] text-sm">Fecha de Ingreso</span>
          </div>
          <p className="text-[#f9fafb] font-medium">
            {new Date(profile.fechaIngreso).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Última Actividad */}
        <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-[#9ca3af]" />
            <span className="text-[#9ca3af] text-sm">Última Actividad</span>
          </div>
          <p className="text-[#f9fafb] font-medium">{formatDateTime(profile.ultimaActividad)}</p>
        </div>

        {/* Permisos */}
        <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-[#9ca3af]" />
            <span className="text-[#9ca3af] text-sm">Permisos Asignados</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.permisos && profile.permisos.length > 0 ? (
              profile.permisos.map((permiso, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-lg bg-[rgba(201,52,72,0.15)] border border-[rgba(201,52,72,0.3)] text-[#c93448] text-xs font-medium"
                >
                  {permiso}
                </span>
              ))
            ) : (
              <span className="text-[#9ca3af] text-sm">No hay permisos asignados</span>
            )}
          </div>
        </div>
      </div>
    </GlassPanel>
  )
}
