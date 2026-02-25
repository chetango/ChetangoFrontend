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

interface ValidationErrors {
  telefono?: string
  fechaNacimiento?: string
  numeroDocumento?: string
}

export const UserFormStep = ({ onNext, onCancel, initialData, mode = 'create' }: UserFormStepProps) => {
  const containerRef = useModalScroll(true)

  const [formData, setFormData] = useState<Partial<CreateUserRequest>>({
    rol: initialData?.rol || 'alumno',
    tipoDocumento: initialData?.tipoDocumento || 'Cédula de Ciudadanía',
    ...initialData,
  })

  const [errors, setErrors] = useState<ValidationErrors>({})

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

  // Validar teléfono
  const validateTelefono = (telefono: string): string | undefined => {
    if (!telefono) return undefined
    
    // Remover caracteres no numéricos para contar dígitos
    const digitsOnly = telefono.replace(/\D/g, '')
    
    if (digitsOnly.length < 7) {
      return 'El teléfono debe tener al menos 7 dígitos'
    }
    
    // Validar formato básico (solo números, +, -, espacios)
    const phoneRegex = /^[+\d\s-]+$/
    if (!phoneRegex.test(telefono)) {
      return 'Formato inválido. Solo números, +, - y espacios'
    }
    
    return undefined
  }

  // Validar fecha de nacimiento
  const validateFechaNacimiento = (fecha: string | undefined): string | undefined => {
    if (!fecha) return undefined
    
    const fechaSeleccionada = new Date(fecha)
    const hoy = new Date()
    
    if (fechaSeleccionada > hoy) {
      return 'La fecha de nacimiento no puede ser futura'
    }
    
    // Validar que no sea menor a 1900
    const año = fechaSeleccionada.getFullYear()
    if (año < 1900) {
      return 'Fecha inválida (mínimo año 1900)'
    }
    
    return undefined
  }

  // Validar número de documento
  const validateNumeroDocumento = (numero: string): string | undefined => {
    if (!numero) return undefined
    
    // Remover espacios y guiones
    const numeroLimpio = numero.replace(/[\s-]/g, '')
    
    // Validar que solo contenga números
    if (!/^\d+$/.test(numeroLimpio)) {
      return 'El documento solo debe contener números'
    }
    
    // Validar longitud mínima (5 dígitos) y máxima (15 dígitos)
    if (numeroLimpio.length < 5) {
      return 'El documento debe tener al menos 5 dígitos'
    }
    
    if (numeroLimpio.length > 15) {
      return 'El documento no debe exceder 15 dígitos'
    }
    
    return undefined
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar campos antes de continuar
    const newErrors: ValidationErrors = {}
    
    const telefonoError = validateTelefono(formData.telefono || '')
    if (telefonoError) newErrors.telefono = telefonoError
    
    const fechaError = validateFechaNacimiento(formData.fechaNacimiento)
    if (fechaError) newErrors.fechaNacimiento = fechaError
    
    const documentoError = validateNumeroDocumento(formData.numeroDocumento || '')
    if (documentoError) newErrors.numeroDocumento = documentoError
    
    setErrors(newErrors)
    
    // Si hay errores, no continuar
    if (Object.keys(newErrors).length > 0) {
      return
    }
    
    console.log('DEBUG UserFormStep - formData al hacer submit:', formData)
    onNext(formData)
  }

  const updateField = (field: keyof CreateUserRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    
    // Limpiar error del campo cuando el usuario modifique
    if (field === 'telefono' && errors.telefono) {
      setErrors(prev => ({ ...prev, telefono: undefined }))
    }
    if (field === 'fechaNacimiento' && errors.fechaNacimiento) {
      setErrors(prev => ({ ...prev, fechaNacimiento: undefined }))
    }
    if (field === 'numeroDocumento' && errors.numeroDocumento) {
      setErrors(prev => ({ ...prev, numeroDocumento: undefined }))
    }
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
                  className={`flex-1 py-3.5 px-4 rounded-lg border-2 transition-all font-medium relative ${
                    formData.rol === rol
                      ? 'bg-[rgba(201,52,72,0.25)] border-[#c93448] text-white shadow-lg shadow-[rgba(201,52,72,0.3)] scale-105'
                      : 'bg-[rgba(64,64,64,0.2)] border-[rgba(255,255,255,0.15)] text-[#9ca3af] hover:border-[rgba(201,52,72,0.4)] hover:text-[#f9fafb]'
                  } ${mode === 'edit' ? 'cursor-not-allowed opacity-60' : ''}`}
                >
                  <span className="flex items-center justify-center gap-2">
                    {rol === 'admin' && '👨‍💼 Admin'}
                    {rol === 'profesor' && '👨‍🏫 Profesor'}
                    {rol === 'alumno' && '🧑‍🎓 Alumno'}
                    {formData.rol === rol && (
                      <span className="text-white text-lg">✓</span>
                    )}
                  </span>
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
                  className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border-2 border-[rgba(255,255,255,0.35)] text-[#f9fafb] placeholder:text-[#6b7280] focus:outline-none focus:border-[#c93448] focus:bg-[rgba(255,255,255,0.08)] transition-all hover:border-[rgba(255,255,255,0.5)]"
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
                  className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border-2 border-[rgba(255,255,255,0.35)] text-[#f9fafb] placeholder:text-[#6b7280] focus:outline-none focus:border-[#c93448] focus:bg-[rgba(255,255,255,0.08)] transition-all hover:border-[rgba(255,255,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:border-[rgba(255,255,255,0.1)]"
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
                  className={`w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border-2 text-[#f9fafb] placeholder:text-[#6b7280] focus:outline-none focus:bg-[rgba(255,255,255,0.08)] transition-all ${
                    errors.telefono 
                      ? 'border-[#ef4444] focus:border-[#ef4444]' 
                      : 'border-[rgba(255,255,255,0.35)] focus:border-[#c93448] hover:border-[rgba(255,255,255,0.5)]'
                  }`}
                  placeholder="+57 300 123 4567"
                />
                {errors.telefono && (
                  <p className="text-[#ef4444] text-xs mt-1.5 flex items-center gap-1">
                    <span>⚠️</span> {errors.telefono}
                  </p>
                )}
                {!errors.telefono && (
                  <p className="text-[#6b7280] text-xs mt-1">Mínimo 7 dígitos</p>
                )}
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-[#9ca3af] text-sm mb-2">Tipo Documento *</label>
                <select
                  required
                  disabled={mode === 'edit'}
                  value={formData.tipoDocumento || 'Cédula de Ciudadanía'}
                  onChange={(e) => updateField('tipoDocumento', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border-2 border-[rgba(255,255,255,0.35)] text-[#f9fafb] focus:outline-none focus:border-[#c93448] focus:bg-[rgba(255,255,255,0.08)] transition-all hover:border-[rgba(255,255,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:border-[rgba(255,255,255,0.1)]"
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
                  className={`w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border-2 text-[#f9fafb] placeholder:text-[#6b7280] focus:outline-none focus:bg-[rgba(255,255,255,0.08)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:border-[rgba(255,255,255,0.1)] ${
                    errors.numeroDocumento
                      ? 'border-[#ef4444] focus:border-[#ef4444]'
                      : 'border-[rgba(255,255,255,0.35)] focus:border-[#c93448] hover:border-[rgba(255,255,255,0.5)]'
                  }`}
                  placeholder="1234567890"
                />
                {errors.numeroDocumento && (
                  <p className="text-[#ef4444] text-xs mt-1.5 flex items-center gap-1">
                    <span>⚠️</span> {errors.numeroDocumento}
                  </p>
                )}
                {!errors.numeroDocumento && (
                  <p className="text-[#6b7280] text-xs mt-1">Entre 5 y 15 dígitos</p>
                )}
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-[#9ca3af] text-sm mb-2 flex items-center gap-2">
                  Fecha Nacimiento 
                  <span className="text-xs text-[#6b7280]">📅</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.fechaNacimiento || ''}
                    max={getToday()}
                    onChange={(e) => updateField('fechaNacimiento', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border-2 text-[#f9fafb] focus:outline-none focus:bg-[rgba(255,255,255,0.08)] transition-all [color-scheme:dark] cursor-pointer ${
                      errors.fechaNacimiento
                        ? 'border-[#ef4444] focus:border-[#ef4444]'
                        : 'border-[rgba(255,255,255,0.35)] focus:border-[#c93448] hover:border-[rgba(255,255,255,0.5)]'
                    }`}
                    style={{
                      colorScheme: 'dark'
                    }}
                  />
                </div>
                {errors.fechaNacimiento && (
                  <p className="text-[#ef4444] text-xs mt-1.5 flex items-center gap-1">
                    <span>⚠️</span> {errors.fechaNacimiento}
                  </p>
                )}
                <p className="text-[#6b7280] text-xs mt-1">No puede ser fecha futura</p>
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
