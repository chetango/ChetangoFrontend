// ============================================
// DATOS ACADEMIA CARD - ADMIN
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { Building2, Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, Save, X } from 'lucide-react'
import { useState } from 'react'
import { useUpdateDatosAcademiaMutation } from '../api/profileQueries'
import type { AdminProfile } from '../types/profile.types'

interface DatosAcademiaCardProps {
  profile: AdminProfile
}

export const DatosAcademiaCard = ({ profile }: DatosAcademiaCardProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    nombreAcademia: profile.datosAcademia?.nombreAcademia || '',
    direccion: profile.datosAcademia?.direccion || '',
    telefono: profile.datosAcademia?.telefono || '',
    emailInstitucional: profile.datosAcademia?.emailInstitucional || '',
    instagram: profile.datosAcademia?.instagram || '',
    facebook: profile.datosAcademia?.facebook || '',
    whatsapp: profile.datosAcademia?.whatsapp || '',
  })

  const updateMutation = useUpdateDatosAcademiaMutation()

  const handleSave = () => {
    updateMutation.mutate(
      {
        ...formData,
        instagram: formData.instagram || null,
        facebook: formData.facebook || null,
        whatsapp: formData.whatsapp || null,
      },
      {
        onSuccess: () => {
          setIsEditing(false)
        },
      }
    )
  }

  const handleCancel = () => {
    setFormData({
      nombreAcademia: profile.datosAcademia?.nombreAcademia || '',
      direccion: profile.datosAcademia?.direccion || '',
      telefono: profile.datosAcademia?.telefono || '',
      emailInstitucional: profile.datosAcademia?.emailInstitucional || '',
      instagram: profile.datosAcademia?.instagram || '',
      facebook: profile.datosAcademia?.facebook || '',
      whatsapp: profile.datosAcademia?.whatsapp || '',
    })
    setIsEditing(false)
  }

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Building2 className="w-5 h-5 text-[#6366f1]" />
          <h3 className="text-[#f9fafb] text-xl font-semibold">Datos de la Academia</h3>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-[#d1d5db] text-sm transition-all duration-300"
          >
            Editar
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Nombre Academia */}
        <div>
          <label className="block text-[#9ca3af] text-sm mb-2">Nombre de la Academia</label>
          {isEditing ? (
            <input
              type="text"
              value={formData.nombreAcademia}
              onChange={(e) => setFormData({ ...formData, nombreAcademia: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#6366f1] transition-colors"
            />
          ) : (
            <div className="flex items-center gap-2 text-[#f9fafb]">
              <Building2 className="w-4 h-4 text-[#9ca3af]" />
              <span className="text-lg font-medium">{profile.datosAcademia?.nombreAcademia || 'No especificado'}</span>
            </div>
          )}
        </div>

        {/* Dirección */}
        <div>
          <label className="block text-[#9ca3af] text-sm mb-2">Dirección</label>
          {isEditing ? (
            <input
              type="text"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#6366f1] transition-colors"
            />
          ) : (
            <div className="flex items-center gap-2 text-[#f9fafb]">
              <MapPin className="w-4 h-4 text-[#9ca3af]" />
              <span>{profile.datosAcademia?.direccion || 'No especificado'}</span>
            </div>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-[#9ca3af] text-sm mb-2">Teléfono de Contacto</label>
          {isEditing ? (
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#6366f1] transition-colors"
            />
          ) : (
            <div className="flex items-center gap-2 text-[#f9fafb]">
              <Phone className="w-4 h-4 text-[#9ca3af]" />
              <span>{profile.datosAcademia?.telefono || 'No especificado'}</span>
            </div>
          )}
        </div>

        {/* Email Institucional */}
        <div>
          <label className="block text-[#9ca3af] text-sm mb-2">Email Institucional</label>
          {isEditing ? (
            <input
              type="email"
              value={formData.emailInstitucional}
              onChange={(e) => setFormData({ ...formData, emailInstitucional: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#6366f1] transition-colors"
            />
          ) : (
            <div className="flex items-center gap-2 text-[#f9fafb]">
              <Mail className="w-4 h-4 text-[#9ca3af]" />
              <span>{profile.datosAcademia?.emailInstitucional || 'No especificado'}</span>
            </div>
          )}
        </div>

        {/* Redes Sociales */}
        <div className="pt-4 border-t border-[rgba(255,255,255,0.1)]">
          <h4 className="text-[#f9fafb] font-medium mb-4">Redes Sociales</h4>
          
          <div className="space-y-3">
            {/* Instagram */}
            <div>
              <label className="block text-[#9ca3af] text-sm mb-2">Instagram</label>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-[#9ca3af]" />
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    placeholder="@usuario"
                    className="flex-1 px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#6366f1] transition-colors placeholder:text-[#6b7280]"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[#f9fafb]">
                  <Instagram className="w-4 h-4 text-[#9ca3af]" />
                  <span>{profile.datosAcademia?.instagram || 'No configurado'}</span>
                </div>
              )}
            </div>

            {/* Facebook */}
            <div>
              <label className="block text-[#9ca3af] text-sm mb-2">Facebook</label>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Facebook className="w-4 h-4 text-[#9ca3af]" />
                  <input
                    type="text"
                    value={formData.facebook}
                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                    placeholder="facebook.com/pagina"
                    className="flex-1 px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#6366f1] transition-colors placeholder:text-[#6b7280]"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[#f9fafb]">
                  <Facebook className="w-4 h-4 text-[#9ca3af]" />
                  <span>{profile.datosAcademia?.facebook || 'No configurado'}</span>
                </div>
              )}
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-[#9ca3af] text-sm mb-2">WhatsApp</label>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#9ca3af]" />
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="+57 3001234567"
                    className="flex-1 px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#6366f1] transition-colors placeholder:text-[#6b7280]"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[#f9fafb]">
                  <MessageCircle className="w-4 h-4 text-[#9ca3af]" />
                  <span>{profile.datosAcademia?.whatsapp || 'No configurado'}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        {isEditing && (
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button
              onClick={handleCancel}
              disabled={updateMutation.isPending}
              className="px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-[#d1d5db] transition-all duration-300 disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </GlassPanel>
  )
}
