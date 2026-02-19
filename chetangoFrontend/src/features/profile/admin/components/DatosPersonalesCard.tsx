// ============================================
// DATOS PERSONALES CARD COMPONENT - ADMIN
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { Calendar, Mail, MapPin, Phone, Save, User, X } from 'lucide-react'
import { useState } from 'react'
import { useUpdateDatosPersonalesAdminMutation } from '../api/profileQueries'
import type { AdminProfile } from '../types/profile.types'

interface DatosPersonalesCardProps {
  profile: AdminProfile
}

export const DatosPersonalesCard = ({ profile }: DatosPersonalesCardProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    nombreCompleto: profile.nombreCompleto || '',
    telefono: profile.telefono || '',
    direccionPersonal: profile.direccionPersonal || '',
    fechaNacimiento: profile.fechaNacimiento || '',
  })

  const updateMutation = useUpdateDatosPersonalesAdminMutation()

  const handleSave = () => {
    updateMutation.mutate(
      {
        ...formData,
        direccionPersonal: formData.direccionPersonal || null,
        fechaNacimiento: formData.fechaNacimiento || null,
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
      nombreCompleto: profile.nombreCompleto || '',
      telefono: profile.telefono || '',
      direccionPersonal: profile.direccionPersonal || '',
      fechaNacimiento: profile.fechaNacimiento || '',
    })
    setIsEditing(false)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No registrado'
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
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

        {/* Sede (no editable) */}
        <div>
          <label className="block text-[#9ca3af] text-sm mb-2">Sede</label>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#9ca3af]" />
            <span className="text-[#f9fafb] font-medium">{profile.sedeNombre}</span>
            <span className="px-2 py-1 rounded-full text-xs font-medium border" style={{
              backgroundColor: profile.sede === 1 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(59, 130, 246, 0.1)',
              borderColor: profile.sede === 1 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(59, 130, 246, 0.3)',
              color: profile.sede === 1 ? '#22c55e' : '#3b82f6'
            }}>
              {profile.sede === 1 ? '🏢 Principal' : '🏢 Sucursal'}
            </span>
          </div>
          <p className="text-[#6b7280] text-xs mt-1">La sede está definida por el administrador del sistema</p>
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

        {/* Dirección Personal */}
        <div>
          <label className="block text-[#9ca3af] text-sm mb-2">Dirección Personal</label>
          {isEditing ? (
            <input
              type="text"
              value={formData.direccionPersonal}
              onChange={(e) => setFormData({ ...formData, direccionPersonal: e.target.value })}
              placeholder="Ingrese su dirección"
              className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#c93448] transition-colors placeholder:text-[#6b7280]"
            />
          ) : (
            <div className="flex items-center gap-2 text-[#f9fafb]">
              <MapPin className="w-4 h-4 text-[#9ca3af]" />
              <span>{profile.direccionPersonal || 'No registrado'}</span>
            </div>
          )}
        </div>

        {/* Fecha de Nacimiento */}
        <div>
          <label className="block text-[#9ca3af] text-sm mb-2">Fecha de Nacimiento</label>
          {isEditing ? (
            <input
              type="date"
              value={formData.fechaNacimiento}
              onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#c93448] transition-colors"
            />
          ) : (
            <div className="flex items-center gap-2 text-[#f9fafb]">
              <Calendar className="w-4 h-4 text-[#9ca3af]" />
              <span>{formatDate(profile.fechaNacimiento || '')}</span>
            </div>
          )}
        </div>

        {/* Documento (no editable) */}
        <div>
          <label className="block text-[#9ca3af] text-sm mb-2">Documento de Identidad</label>
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
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#c93448] hover:bg-[#a8243a] text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
