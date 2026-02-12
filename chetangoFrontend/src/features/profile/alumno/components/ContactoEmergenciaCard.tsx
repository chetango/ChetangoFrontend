// ============================================
// CONTACTO EMERGENCIA CARD COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { AlertCircle, Phone, Save, User, X } from 'lucide-react'
import { useState } from 'react'
import { useUpdateContactoEmergenciaMutation } from '../api/profileQueries'
import type { AlumnoProfile } from '../types/profile.types'

interface ContactoEmergenciaCardProps {
  profile: AlumnoProfile
}

export const ContactoEmergenciaCard = ({ profile }: ContactoEmergenciaCardProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    nombreCompleto: profile.contactoEmergencia?.nombreCompleto || '',
    telefono: profile.contactoEmergencia?.telefono || '',
    relacion: profile.contactoEmergencia?.relacion || '',
  })

  const updateMutation = useUpdateContactoEmergenciaMutation()

  const handleSave = () => {
    updateMutation.mutate(formData, {
      onSuccess: () => {
        setIsEditing(false)
      },
    })
  }

  const handleCancel = () => {
    setFormData({
      nombreCompleto: profile.contactoEmergencia?.nombreCompleto || '',
      telefono: profile.contactoEmergencia?.telefono || '',
      relacion: profile.contactoEmergencia?.relacion || '',
    })
    setIsEditing(false)
  }

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-[#f59e0b]" />
          <h3 className="text-[#f9fafb] text-xl font-semibold">Contacto de Emergencia</h3>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-[#d1d5db] text-sm transition-all duration-300"
          >
            {profile.contactoEmergencia ? 'Editar' : 'Agregar'}
          </button>
        )}
      </div>

      {!profile.contactoEmergencia && !isEditing ? (
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-[#6b7280] mx-auto mb-3" />
          <p className="text-[#9ca3af] mb-4">No has configurado un contacto de emergencia</p>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 rounded-lg bg-[#f59e0b] text-white text-sm font-medium hover:bg-[#d97706] transition-colors"
          >
            Agregar Contacto
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-[#9ca3af] text-sm mb-2">Nombre Completo</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.nombreCompleto}
                onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                placeholder="Ej: María García"
                className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] placeholder:text-[#6b7280] focus:outline-none focus:border-[#f59e0b] transition-colors"
              />
            ) : (
              <div className="flex items-center gap-2 text-[#f9fafb]">
                <User className="w-4 h-4 text-[#9ca3af]" />
                <span>{profile.contactoEmergencia?.nombreCompleto}</span>
              </div>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-[#9ca3af] text-sm mb-2">Teléfono</label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="Ej: +54 9 11 1234-5678"
                className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] placeholder:text-[#6b7280] focus:outline-none focus:border-[#f59e0b] transition-colors"
              />
            ) : (
              <div className="flex items-center gap-2 text-[#f9fafb]">
                <Phone className="w-4 h-4 text-[#9ca3af]" />
                <span>{profile.contactoEmergencia?.telefono}</span>
              </div>
            )}
          </div>

          {/* Relación */}
          <div>
            <label className="block text-[#9ca3af] text-sm mb-2">Relación</label>
            {isEditing ? (
              <select
                value={formData.relacion}
                onChange={(e) => setFormData({ ...formData, relacion: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#f59e0b] transition-colors"
              >
                <option value="">Seleccionar...</option>
                <option value="Padre/Madre">Padre/Madre</option>
                <option value="Hermano/a">Hermano/a</option>
                <option value="Esposo/a">Esposo/a</option>
                <option value="Hijo/a">Hijo/a</option>
                <option value="Amigo/a">Amigo/a</option>
                <option value="Otro">Otro</option>
              </select>
            ) : (
              <p className="text-[#f9fafb]">{profile.contactoEmergencia?.relacion}</p>
            )}
          </div>

          {/* Botones de acción */}
          {isEditing && (
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {updateMutation.isPending ? 'Guardando...' : 'Guardar'}
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
      )}
    </GlassPanel>
  )
}
