// ============================================
// PROFILE HEADER COMPONENT - ADMIN
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { Building2, Calendar, Mail, Phone, User } from 'lucide-react'
import type { AdminProfile } from '../types/profile.types'

interface ProfileHeaderProps {
  profile: AdminProfile
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  // Get initials from name
  const getInitials = (name: string) => {
    if (!name) return 'AD'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Fecha no disponible'
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
    })
  }

  return (
    <GlassPanel className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        {/* Avatar */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#c93448] to-[#a8243a] flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-[rgba(201,52,72,0.3)]">
            {getInitials(profile.nombreCompleto)}
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#10b981] rounded-full border-4 border-[#1e1e2f] flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-[#f9fafb] mb-2">
            {profile.nombreCompleto || 'Nombre no disponible'}
          </h1>
          
          <div className="inline-block px-4 py-1.5 rounded-full bg-[rgba(201,52,72,0.15)] border border-[rgba(201,52,72,0.3)] mb-4">
            <span className="text-[#c93448] text-sm font-medium">{profile.cargo || 'Administrador'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <div className="flex items-center gap-2 text-[#d1d5db] justify-center md:justify-start">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Miembro desde {formatDate(profile.fechaIngreso)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-[#d1d5db] justify-center md:justify-start">
              <User className="w-4 h-4" />
              <span className="text-sm">{profile.tipoDocumento || ''} {profile.numeroDocumento || 'No registrado'}</span>
            </div>

            <div className="flex items-center gap-2 text-[#d1d5db] justify-center md:justify-start">
              <Mail className="w-4 h-4" />
              <span className="text-sm">{profile.correo || 'No registrado'}</span>
            </div>

            <div className="flex items-center gap-2 text-[#d1d5db] justify-center md:justify-start">
              <Phone className="w-4 h-4" />
              <span className="text-sm">{profile.telefono || 'No registrado'}</span>
            </div>

            <div className="flex items-center gap-2 text-[#d1d5db] justify-center md:justify-start md:col-span-2">
              <Building2 className="w-4 h-4" />
              <span className="text-sm">{profile.datosAcademia?.nombreAcademia || 'Academia no registrada'}</span>
            </div>
          </div>
        </div>
      </div>
    </GlassPanel>
  )
}
