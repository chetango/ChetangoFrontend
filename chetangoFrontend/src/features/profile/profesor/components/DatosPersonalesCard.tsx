// ============================================
// DATOS PERSONALES CARD COMPONENT - PROFESOR
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { Mail, Phone, Save, User, X } from 'lucide-react'
import { useState } from 'react'
import type { ProfesorProfile } from '../types/profile.types'
import { useUpdateDatosPersonalesProfesorMutation } from '../api/profileQueries'

interface DatosPersonalesCardProps {
  profile: ProfesorProfile
}

export const DatosPersonalesCard = ({ profile }: DatosPersonalesCardProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    nombreCompleto: profile.nombreCompleto,
    telefono: profile.telefono,
  })

  const updateMutation = useUpdateDatosPersonalesProfesorMutation()

  const handleSave = () => {
    updateMutation.mutate(formData, {
      onSuccess: () => {
        setIsEditing(false)
      },
    })
  }

  const handleCancel = () => {
    setFormData({
      nombreCompleto: profile.nombreCompleto,
      telefono: profile.telefono,
    })
    setIsEditing(false)
  }

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-[#7c5af8]" />
          <h3 className="text-[#f9fafb] text-xl font-semibold">Datos Personales</h3>
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
        {/* Nombre */}
        <div>
          <label className="block text-[#9ca3af] text-sm mb-2">Nombre Completo</label>
          {isEditing ? (
            <input
              type="text"
              value={formData.nombreCompleto}
              onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#7c5af8] transition-colors"
            />
          ) : (
            <p className="text-[#f9fafb] text-lg">{profile.nombreCompleto}</p>
          )}
        </div>

        {/* Email (no editable) */}
        <div>
          <label className="block text-[#9ca3af] text-sm mb-2">Correo Electrónico</label>
          <div className="flex items-center gap-2 text-[#f9fafb]">
            <Mail className="w-4 h-4 text-[#9ca3af]" />
            <span>{profile.correo}</span>
          </div>
          <p className="text-[#6b7280] text-xs mt-1">El correo no puede ser modificado</p>
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-[#9ca3af] text-sm mb-2">Teléfono</label>
          {isEditing ? (
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#7c5af8] transition-colors"
            />
          ) : (
            <div className="flex items-center gap-2 text-[#f9fafb]">
              <Phone className="w-4 h-4 text-[#9ca3af]" />
              <span>{profile.telefono}</span>
            </div>
          )}
        </div>

        {/* Documento (no editable) */}
        <div>
          <label className="block text-[#9ca3af] text-sm mb-2">Documento</label>
          <p className="text-[#f9fafb]">
            {profile.tipoDocumento} {profile.numeroDocumento}
          </p>
        </div>

        {/* Tipo Profesor (no editable) */}
        <div>
          <label className="block text-[#9ca3af] text-sm mb-2">Tipo de Profesor</label>
          <p className="text-[#f9fafb]">{profile.tipoProfesor}</p>
        </div>

        {/* Botones de acción */}
        {isEditing && (
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#7c5af8] hover:bg-[#6845e8] text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
