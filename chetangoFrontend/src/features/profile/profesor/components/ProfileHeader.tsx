// ============================================
// PROFILE HEADER COMPONENT - PROFESOR
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { Calendar, Mail, Phone, User } from 'lucide-react'
import type { ProfesorProfile } from '../types/profile.types'

interface ProfileHeaderProps {
  profile: ProfesorProfile
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
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
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#7c5af8] to-[#6845e8] flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-[rgba(124,90,248,0.3)]">
            {getInitials(profile.nombreCompleto)}
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#10b981] rounded-full border-4 border-[#1e1e2f] flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-[#f9fafb] mb-2">
            {profile.nombreCompleto}
          </h1>
          
          <div className="inline-block px-4 py-1.5 rounded-full bg-[rgba(124,90,248,0.15)] border border-[rgba(124,90,248,0.3)] mb-4">
            <span className="text-[#7c5af8] text-sm font-medium">{profile.tipoProfesor}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <div className="flex items-center gap-2 text-[#d1d5db] justify-center md:justify-start">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Miembro desde {formatDate(profile.fechaIngreso)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-[#d1d5db] justify-center md:justify-start">
              <User className="w-4 h-4" />
              <span className="text-sm">{profile.tipoDocumento} {profile.numeroDocumento}</span>
            </div>

            <div className="flex items-center gap-2 text-[#d1d5db] justify-center md:justify-start">
              <Mail className="w-4 h-4" />
              <span className="text-sm">{profile.correo}</span>
            </div>

            <div className="flex items-center gap-2 text-[#d1d5db] justify-center md:justify-start">
              <Phone className="w-4 h-4" />
              <span className="text-sm">{profile.telefono || 'No registrado'}</span>
            </div>
          </div>
        </div>
      </div>
    </GlassPanel>
  )
}
