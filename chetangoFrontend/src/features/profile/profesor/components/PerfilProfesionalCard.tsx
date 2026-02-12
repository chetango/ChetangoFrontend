// ============================================
// PERFIL PROFESIONAL CARD COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { Briefcase, Save, X } from 'lucide-react'
import { useState } from 'react'
import type { ProfesorProfile } from '../types/profile.types'
import { useUpdatePerfilProfesionalMutation } from '../api/profileQueries'

interface PerfilProfesionalCardProps {
  profile: ProfesorProfile
}

const ESPECIALIDADES_DISPONIBLES = [
  'Salón',
  'Escenario',
  'Privadas',
  'Coreografía',
  'Técnica',
  'Iniciación',
  'Avanzado',
]

export const PerfilProfesionalCard = ({ profile }: PerfilProfesionalCardProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    biografia: profile.biografia || '',
    especialidades: profile.especialidades || [],
  })

  const updateMutation = useUpdatePerfilProfesionalMutation()

  const handleSave = () => {
    updateMutation.mutate(
      {
        biografia: formData.biografia || null,
        especialidades: formData.especialidades,
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
      biografia: profile.biografia || '',
      especialidades: profile.especialidades || [],
    })
    setIsEditing(false)
  }

  const toggleEspecialidad = (especialidad: string) => {
    setFormData((prev) => ({
      ...prev,
      especialidades: prev.especialidades.includes(especialidad)
        ? prev.especialidades.filter((e) => e !== especialidad)
        : [...prev.especialidades, especialidad],
    }))
  }

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Briefcase className="w-5 h-5 text-[#10b981]" />
          <h3 className="text-[#f9fafb] text-xl font-semibold">Perfil Profesional</h3>
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

      <div className="space-y-6">
        {/* Biografía */}
        <div>
          <label className="block text-[#9ca3af] text-sm mb-2">Biografía</label>
          {isEditing ? (
            <textarea
              value={formData.biografia}
              onChange={(e) => setFormData({ ...formData, biografia: e.target.value })}
              placeholder="Cuéntanos sobre tu experiencia, estilo y pasión por la danza..."
              maxLength={500}
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#7c5af8] transition-colors resize-none"
            />
          ) : (
            <p className="text-[#d1d5db] text-sm leading-relaxed">
              {profile.biografia || 'Sin biografía registrada'}
            </p>
          )}
          {isEditing && (
            <p className="text-[#6b7280] text-xs mt-1">
              {formData.biografia.length}/500 caracteres
            </p>
          )}
        </div>

        {/* Especialidades */}
        <div>
          <label className="block text-[#9ca3af] text-sm mb-3">Especialidades</label>
          {isEditing ? (
            <div className="flex flex-wrap gap-2">
              {ESPECIALIDADES_DISPONIBLES.map((especialidad) => (
                <button
                  key={especialidad}
                  onClick={() => toggleEspecialidad(especialidad)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    formData.especialidades.includes(especialidad)
                      ? 'bg-[#7c5af8] text-white'
                      : 'bg-[rgba(255,255,255,0.05)] text-[#d1d5db] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)]'
                  }`}
                >
                  {especialidad}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.especialidades.length > 0 ? (
                profile.especialidades.map((especialidad) => (
                  <span
                    key={especialidad}
                    className="px-4 py-2 rounded-lg bg-[rgba(124,90,248,0.15)] border border-[rgba(124,90,248,0.3)] text-[#7c5af8] text-sm font-medium"
                  >
                    {especialidad}
                  </span>
                ))
              ) : (
                <p className="text-[#6b7280] text-sm">Sin especialidades registradas</p>
              )}
            </div>
          )}
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
