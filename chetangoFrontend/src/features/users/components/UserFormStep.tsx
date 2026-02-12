// ============================================
// CREATE/EDIT USER MODAL - STEP 1: FORM
// ============================================

import { useModalScroll } from '@/shared/hooks'
import { getToday } from '@/shared/utils/dateTimeHelper'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { CreateUserRequest, UserRole } from '../types/user.types'

interface UserFormStepProps {
  onNext: (data: Partial<CreateUserRequest>) => void
  onCancel: () => void
  initialData?: Partial<CreateUserRequest>
  mode?: 'create' | 'edit'
}

export const UserFormStep = ({ onNext, onCancel, initialData, mode = 'create' }: UserFormStepProps) => {
  const containerRef = useModalScroll(true)

  const [formData, setFormData] = useState<Partial<CreateUserRequest>>({
    rol: initialData?.rol || 'alumno',
    tipoDocumento: initialData?.tipoDocumento || 'Cédula de Ciudadanía',
    ...initialData,
  })

  // Actualizar el estado cuando initialData cambie (modo edición)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      console.log('DEBUG UserFormStep - Actualizando formData con initialData:', initialData)
      console.log('DEBUG UserFormStep - Rol detectado:', initialData.rol)
      setFormData((prev) => ({
        ...prev,
        rol: initialData.rol || prev.rol,
        tipoDocumento: initialData.tipoDocumento || prev.tipoDocumento,
        ...initialData,
      }))
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('DEBUG UserFormStep - formData al hacer submit:', formData)
    onNext(formData)
  }

  const updateField = (field: keyof CreateUserRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-[100] pt-20 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md -z-10"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative flex items-start justify-center p-4 min-h-full">
        <div className="bg-[rgba(26,26,26,0.98)] border border-[rgba(64,64,64,0.3)] rounded-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-[rgba(26,26,26,0.98)] border-b border-[rgba(64,64,64,0.3)] p-6 flex items-center justify-between">
          <h2 className="text-[#f9fafb] text-2xl font-semibold">
            ✨ {mode === 'edit' ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          </h2>
          <button
            onClick={onCancel}
            className="text-[#9ca3af] hover:text-[#f9fafb] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tipo de Usuario */}
          <div>
            <label className="block text-[#f9fafb] text-sm font-medium mb-3">
              Tipo de Usuario:
            </label>
            <div className="flex gap-3">
              {(['admin', 'profesor', 'alumno'] as UserRole[]).map((rol) => (
                <button
                  key={rol}
                  type="button"
                  onClick={() => mode === 'create' && updateField('rol', rol)}
                  disabled={mode === 'edit'}
                  className={`flex-1 py-3 px-4 rounded-lg border transition-all ${
                    formData.rol === rol
                      ? 'bg-[rgba(201,52,72,0.15)] border-[rgba(201,52,72,0.3)] text-[#c93448]'
                      : 'bg-[rgba(64,64,64,0.2)] border-[rgba(64,64,64,0.3)] text-[#9ca3af] hover:border-[rgba(201,52,72,0.2)]'
                  } ${mode === 'edit' ? 'cursor-not-allowed opacity-60' : ''}`}
                >
                  {rol === 'admin' && '👨‍💼 Admin'}
                  {rol === 'profesor' && '👨‍🏫 Profesor'}
                  {rol === 'alumno' && '🧑‍🎓 Alumno'}
                </button>
              ))}
            </div>
            {mode === 'edit' && (
              <p className="text-[#6b7280] text-xs mt-2">
                ℹ️ El rol no puede modificarse en modo edición
              </p>
            )}
          </div>

          {/* Datos Básicos */}
          <div>
            <h3 className="text-[#f9fafb] font-semibold mb-4 flex items-center gap-2">
              📋 DATOS BÁSICOS
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[#9ca3af] text-sm mb-2">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.nombreUsuario || ''}
                  onChange={(e) => updateField('nombreUsuario', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#c93448] transition-colors"
                  placeholder="Ej: Juan Pérez González"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-[#9ca3af] text-sm mb-2">Email *</label>
                <input
                  type="email"
                  required
                  disabled={mode === 'edit'}
                  value={formData.correo || ''}
                  onChange={(e) => updateField('correo', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#c93448] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="usuario@chetango.com"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-[#9ca3af] text-sm mb-2">Teléfono *</label>
                <input
                  type="tel"
                  required
                  value={formData.telefono || ''}
                  onChange={(e) => updateField('telefono', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#c93448] transition-colors"
                  placeholder="+57 300 123 4567"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-[#9ca3af] text-sm mb-2">Tipo Documento *</label>
                <select
                  required
                  disabled={mode === 'edit'}
                  value={formData.tipoDocumento || 'Cédula de Ciudadanía'}
                  onChange={(e) => updateField('tipoDocumento', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#c93448] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
                </select>
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-[#9ca3af] text-sm mb-2">Número Documento *</label>
                <input
                  type="text"
                  required
                  disabled={mode === 'edit'}
                  value={formData.numeroDocumento || ''}
                  onChange={(e) => updateField('numeroDocumento', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#c93448] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="1234567890"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-[#9ca3af] text-sm mb-2">Fecha Nacimiento</label>
                <input
                  type="date"
                  value={formData.fechaNacimiento || ''}
                  onChange={(e) => updateField('fechaNacimiento', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#c93448] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Datos de Alumno */}
          {formData.rol === 'alumno' && (
            <div>
              <h3 className="text-[#f9fafb] font-semibold mb-4 flex items-center gap-2">
                👤 DATOS DE ALUMNO
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[#9ca3af] text-sm mb-2">Contacto Emergencia</label>
                  <input
                    type="text"
                    value={formData.datosAlumno?.contactoEmergencia || ''}
                    onChange={(e) =>
                      updateField('datosAlumno', {
                        ...formData.datosAlumno,
                        contactoEmergencia: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#c93448] transition-colors"
                    placeholder="Nombre del contacto"
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[#9ca3af] text-sm mb-2">Teléfono Emergencia</label>
                  <input
                    type="tel"
                    value={formData.datosAlumno?.telefonoEmergencia || ''}
                    onChange={(e) =>
                      updateField('datosAlumno', {
                        ...formData.datosAlumno,
                        telefonoEmergencia: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#c93448] transition-colors"
                    placeholder="+57 300 123 4567"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[#9ca3af] text-sm mb-2">Observaciones Médicas</label>
                  <textarea
                    rows={3}
                    value={formData.datosAlumno?.observacionesMedicas || ''}
                    onChange={(e) =>
                      updateField('datosAlumno', {
                        ...formData.datosAlumno,
                        observacionesMedicas: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#c93448] transition-colors resize-none"
                    placeholder="Alergias, condiciones especiales..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Datos de Profesor */}
          {formData.rol === 'profesor' && (
            <div>
              <h3 className="text-[#f9fafb] font-semibold mb-4 flex items-center gap-2">
                🎓 DATOS DE PROFESOR
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[#9ca3af] text-sm mb-2">Tipo Profesor *</label>
                  <select
                    required
                    value={formData.datosProfesor?.tipoProfesor || ''}
                    onChange={(e) =>
                      updateField('datosProfesor', {
                        ...formData.datosProfesor,
                        tipoProfesor: e.target.value,
                        especialidades: formData.datosProfesor?.especialidades || [],
                        fechaIngreso: formData.datosProfesor?.fechaIngreso || getToday(),
                        tarifaActual: formData.datosProfesor?.tarifaActual || 0,
                      })
                    }
                    className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#c93448] transition-colors"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Principal">Principal</option>
                    <option value="Monitor">Monitor</option>
                  </select>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[#9ca3af] text-sm mb-2">Fecha Ingreso *</label>
                  <input
                    type="date"
                    required
                    value={formData.datosProfesor?.fechaIngreso || ''}
                    onChange={(e) =>
                      updateField('datosProfesor', {
                        ...formData.datosProfesor,
                        fechaIngreso: e.target.value,
                        especialidades: formData.datosProfesor?.especialidades || [],
                        tipoProfesor: formData.datosProfesor?.tipoProfesor || '',
                        tarifaActual: formData.datosProfesor?.tarifaActual || 0,
                      })
                    }
                    className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#c93448] transition-colors"
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[#9ca3af] text-sm mb-2">Tarifa por Hora (COP) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1000"
                    value={formData.datosProfesor?.tarifaActual || 0}
                    onChange={(e) =>
                      updateField('datosProfesor', {
                        ...formData.datosProfesor,
                        tarifaActual: parseFloat(e.target.value) || 0,
                        especialidades: formData.datosProfesor?.especialidades || [],
                        tipoProfesor: formData.datosProfesor?.tipoProfesor || '',
                        fechaIngreso: formData.datosProfesor?.fechaIngreso || '',
                      })
                    }
                    className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#c93448] transition-colors"
                    placeholder="50000"
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[#9ca3af] text-sm mb-2">Especialidades</label>
                  <input
                    type="text"
                    placeholder="Separadas por coma: Salsa, Bachata, Tango"
                    value={(formData.datosProfesor?.especialidades || []).join(', ')}
                    onChange={(e) => {
                      const especialidadesArray = e.target.value
                        .split(',')
                        .map(s => s.trim())
                        .filter(s => s.length > 0)
                      updateField('datosProfesor', {
                        ...formData.datosProfesor,
                        especialidades: especialidadesArray,
                        tipoProfesor: formData.datosProfesor?.tipoProfesor || '',
                        fechaIngreso: formData.datosProfesor?.fechaIngreso || '',
                        tarifaActual: formData.datosProfesor?.tarifaActual || 0,
                      })
                    }}
                    className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#c93448] transition-colors"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[#9ca3af] text-sm mb-2">Biografía</label>
                  <textarea
                    rows={3}
                    value={formData.datosProfesor?.biografia || ''}
                    onChange={(e) =>
                      updateField('datosProfesor', {
                        ...formData.datosProfesor,
                        biografia: e.target.value,
                        especialidades: formData.datosProfesor?.especialidades || [],
                        tipoProfesor: formData.datosProfesor?.tipoProfesor || '',
                        fechaIngreso: formData.datosProfesor?.fechaIngreso || '',
                        tarifaActual: formData.datosProfesor?.tarifaActual || 0,
                      })
                    }
                    className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#c93448] transition-colors resize-none"
                    placeholder="Breve descripción profesional..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-[#d1d5db] transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-lg bg-[#c93448] hover:bg-[#b02d3c] text-white font-medium transition-all"
            >
              Siguiente →
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}
