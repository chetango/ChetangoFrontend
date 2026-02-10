// ============================================
// DATOS PERSONALES CARD COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { Mail, Phone, Save, User, X } from 'lucide-react'
import { useState } from 'react'
import { useUpdateDatosPersonalesMutation } from '../api/profileQueries'
import type { AlumnoProfile } from '../types/profile.types'

interface DatosPersonalesCardProps {
  profile: AlumnoProfile
}

export const DatosPersonalesCard = ({ profile }: DatosPersonalesCardProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    nombreCompleto: profile.nombreCompleto,
    telefono: profile.telefono,
  })

  const updateMutation = useUpdateDatosPersonalesMutation()

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
          <User className="w-5 h-5 text-[#c93448]" />
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
              className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#c93448] transition-colors"
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
              className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#c93448] transition-colors"
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

        {/* Botones de acción */}
        {isEditing && (
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-[#c93448] to-[#e54d5e] text-white font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button
              onClick={handleCancel}
              disabled={updateMutation.isPending}
              className="px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-[#d1d5db] transition-all duration-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </GlassPanel>
  )
}
