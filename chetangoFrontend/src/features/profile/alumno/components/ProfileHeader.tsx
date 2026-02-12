// ============================================
// PROFILE HEADER COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { Badge, Calendar, User } from 'lucide-react'
import { useRef } from 'react'
import { useUploadAvatarMutation } from '../api/profileQueries'
import type { AlumnoProfile } from '../types/profile.types'

interface ProfileHeaderProps {
  profile: AlumnoProfile
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadAvatarMutation = useUploadAvatarMutation()

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no puede superar los 5MB')
        return
      }
      // Validar tipo
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        alert('Solo se permiten imágenes JPG, PNG o WEBP')
        return
      }
      uploadAvatarMutation.mutate(file)
    }
  }

  const getInitials = () => {
    const names = profile.nombreCompleto.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return profile.nombreCompleto.substring(0, 2).toUpperCase()
  }

  const formatFechaInscripcion = () => {
    const fecha = new Date(profile.fechaInscripcion)
    return fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
  }

  return (
    <GlassPanel className="p-8 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#c93448] opacity-[0.08] blur-[100px] rounded-full" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div
              onClick={handleAvatarClick}
              className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#c93448] to-[#a8243a] flex items-center justify-center shadow-[0_8px_32px_rgba(201,52,72,0.4)] cursor-pointer transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.nombreCompleto}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-4xl">{getInitials()}</span>
              )}
            </div>
            <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer">
              <User className="w-8 h-8 text-white" />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-[#f9fafb] text-3xl font-bold mb-2">{profile.nombreCompleto}</h1>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-[rgba(124,90,248,0.15)] border border-[rgba(124,90,248,0.3)] text-[#9b8afb] text-sm font-medium">
                Estudiante
              </span>
            </div>
            <div className="flex flex-col gap-2 text-[#9ca3af]">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Miembro desde {formatFechaInscripcion()}</span>
              </div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Badge className="w-4 h-4" />
                <span className="text-sm">{profile.numeroDocumento}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassPanel>
  )
}
