// ============================================
// CLASE FORM MODAL COMPONENT
// Modal for creating and editing classes
// Requirements: 5.1, 5.2, 5.4, 5.7, 6.1, 6.2, 10.3
// ============================================

import {
    GlassButton,
    GlassInput,
    GlassPanel,
    GlassSelect,
    GlassSelectContent,
    GlassSelectItem,
    GlassSelectTrigger,
    GlassSelectValue,
} from '@/design-system'
import { useModalScroll } from '@/shared/hooks'
import { getToday } from '@/shared/utils/dateTimeHelper'
import { Calendar, Clock, FileText, Loader2, Plus, Trash2, Users, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import type {
    ClaseDetalleDTO,
    ClaseFormData,
    ProfesorClaseRequest,
    ProfesorDTO,
    TipoClaseDTO,
} from '../types/classTypes'
import {
    formatearFechaParaInput,
    formatearHoraParaInput,
    validarProfesores,
} from '../utils/claseHelpers'

// ============================================
// TYPES
// ============================================

export interface ClaseFormModalProps {
  /** Whether the modal is open */
  isOpen: boolean
  /** Callback to close the modal */
  onClose: () => void
  /** Callback when form is submitted */
  onSubmit: (data: ClaseFormData) => Promise<void>
  /** Available class types for dropdown */
  tiposClase: TipoClaseDTO[]
  /** Available professors for dropdown */
  profesores: ProfesorDTO[]
  /** Whether catalogs are loading */
  isCatalogsLoading?: boolean
  /** Whether the form is submitting */
  isSubmitting?: boolean
  /** Mode: 'create' or 'edit' */
  mode?: 'create' | 'edit'
  /** Initial data for edit mode */
  initialData?: ClaseDetalleDTO | null
  /** Prefill data for create mode */
  prefillData?: Partial<ClaseFormData>
}

export interface FormErrors {
  fecha?: string
  horaInicio?: string
  horaFin?: string
  idTipoClase?: string
  idProfesorPrincipal?: string
  profesores?: string
  cupoMaximo?: string
  general?: string
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Validates that a date/time is in the future
 * Requirements: 5.4
 */
export function isFutureDateTime(fecha: string, horaInicio: string): boolean {
  if (!fecha || !horaInicio) return false

  const now = new Date()
  const classDateTime = new Date(`${fecha}T${horaInicio}`)

  return classDateTime > now
}

/**
 * Validates that end time is after start time
 */
export function isValidTimeRange(horaInicio: string, horaFin: string): boolean {
  if (!horaInicio || !horaFin) return false

  const [startH, startM] = horaInicio.split(':').map(Number)
  const [endH, endM] = horaFin.split(':').map(Number)

  const startMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM

  return endMinutes > startMinutes
}

/**
 * Gets today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  return getToday()
}

// ============================================
// INITIAL FORM STATE
// ============================================

const getInitialFormData = (
  initialData?: ClaseDetalleDTO | null,
  prefillData?: Partial<ClaseFormData>
): ClaseFormData => {
  if (initialData) {
    // Usar el nuevo sistema de profesores si está disponible
    let profesores: ProfesorClaseRequest[] = []
    
    if (initialData.profesores && initialData.profesores.length > 0) {
      // NUEVO: Usar el campo profesores directamente
      profesores = initialData.profesores.map(p => ({
        idProfesor: p.idProfesor,
        rolEnClase: p.rolEnClase as 'Principal' | 'Monitor'
      }))
    } else {
      // RETROCOMPATIBILIDAD: Convertir del sistema antiguo
      if (initialData.idProfesorPrincipal) {
        profesores.push({
          idProfesor: initialData.idProfesorPrincipal,
          rolEnClase: 'Principal'
        })
      }
      
      // Agregar monitores del sistema antiguo
      if (initialData.monitores && initialData.monitores.length > 0) {
        initialData.monitores.forEach(monitor => {
          profesores.push({
            idProfesor: monitor.idProfesor,
            rolEnClase: 'Monitor'
          })
        })
      }
    }
    
    return {
      fecha: formatearFechaParaInput(initialData.fecha),
      horaInicio: formatearHoraParaInput(initialData.horaInicio),
      horaFin: formatearHoraParaInput(initialData.horaFin),
      idTipoClase: '', // Will need to be resolved from tipoClase name
      profesores: profesores,
      cupoMaximo: initialData.cupoMaximo,
      observaciones: initialData.observaciones || '',
    }
  }

  const baseData: ClaseFormData = {
    fecha: '',
    horaInicio: '',
    horaFin: '',
    idTipoClase: '',
    profesores: [],
    cupoMaximo: 10,
    observaciones: '',
  }

  return {
    ...baseData,
    ...(prefillData || {}),
  }
}

// ============================================
// COMPONENT
// ============================================

/**
 * ClaseFormModal - Modal for creating and editing classes
 *
 * Features:
 * - Create and edit modes
 * - Dropdowns connected to catalog data
 * - Future date validation
 * - Time range validation
 * - Loading states on buttons
 * - Form validation
 *
 * Requirements: 5.1, 5.2, 5.4, 5.7, 6.1, 6.2, 10.3
 */
export function ClaseFormModal({
  isOpen,
  onClose,
  onSubmit,
  tiposClase,
  profesores,
  isCatalogsLoading = false,
  isSubmitting = false,
  mode = 'create',
  initialData = null,
  prefillData,
}: ClaseFormModalProps) {
  const containerRef = useModalScroll(isOpen)

  // Form state
  const [formData, setFormData] = useState<ClaseFormData>(() =>
    getInitialFormData(initialData, prefillData)
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      const newFormData = getInitialFormData(initialData, prefillData)

      // If editing, resolve tipoClase name to ID
      if (initialData && tiposClase.length > 0) {
        const matchingTipo = tiposClase.find(
          (t) => t.nombre === initialData.tipoClase
        )
        if (matchingTipo) {
          newFormData.idTipoClase = matchingTipo.id
        }
      }

      setFormData(newFormData)
      setErrors({})
      setTouched({})
    }
  }, [isOpen, initialData, prefillData, tiposClase])

  // Validate form
  const validateForm = useCallback((): FormErrors => {
    const newErrors: FormErrors = {}

    // Required field validation - Requirements: 5.7
    if (!formData.fecha) {
      newErrors.fecha = 'La fecha es requerida'
    }

    if (!formData.horaInicio) {
      newErrors.horaInicio = 'La hora de inicio es requerida'
    }

    if (!formData.horaFin) {
      newErrors.horaFin = 'La hora de fin es requerida'
    }

    if (!formData.idTipoClase) {
      newErrors.idTipoClase = 'El tipo de clase es requerido'
    }

    // Validación de profesores (sistema nuevo)
    const validacionProfesores = validarProfesores(formData.profesores)
    if (!validacionProfesores.valido) {
      newErrors.idProfesorPrincipal = validacionProfesores.mensaje
    }

    if (!formData.cupoMaximo || formData.cupoMaximo < 1) {
      newErrors.cupoMaximo = 'El cupo debe ser al menos 1'
    }

    // Future date validation - Requirements: 5.4
    if (
      mode === 'create' &&
      formData.fecha &&
      formData.horaInicio &&
      !isFutureDateTime(formData.fecha, formData.horaInicio)
    ) {
      newErrors.fecha = 'La clase debe programarse para una fecha y hora futura'
    }

    // Time range validation
    if (
      formData.horaInicio &&
      formData.horaFin &&
      !isValidTimeRange(formData.horaInicio, formData.horaFin)
    ) {
      newErrors.horaFin = 'La hora de fin debe ser posterior a la hora de inicio'
    }

    return newErrors
  }, [formData, mode])

  // Handle field change
  const handleChange = useCallback(
    (field: keyof ClaseFormData, value: string | number | string[] | ProfesorClaseRequest[]) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      setTouched((prev) => ({ ...prev, [field]: true }))
    },
    []
  )
  
  // Manejar agregar/quitar profesores
  const agregarProfesor = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      profesores: [...prev.profesores, { idProfesor: '', rolEnClase: 'Monitor' }]
    }))
  }, [])
  
  const eliminarProfesor = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      profesores: prev.profesores.filter((_, i) => i !== index)
    }))
  }, [])
  
  const actualizarProfesor = useCallback((index: number, campo: 'idProfesor' | 'rolEnClase', valor: string) => {
    setFormData(prev => ({
      ...prev,
      profesores: prev.profesores.map((p, i) => 
        i === index ? { ...p, [campo]: valor } : p
      )
    }))
    setTouched(prev => ({ ...prev, profesores: true }))
  }, [])

  // Handle blur for validation
  const handleBlur = useCallback((field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }, [])

  // Validate on change
  useEffect(() => {
    const newErrors = validateForm()
    setErrors(newErrors)
  }, [validateForm])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Mark all fields as touched
    setTouched({
      fecha: true,
      horaInicio: true,
      horaFin: true,
      idTipoClase: true,
      idProfesorPrincipal: true,
      cupoMaximo: true,
    })

    const validationErrors = validateForm()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    try {
      await onSubmit(formData)
      onClose()
    } catch {
      setErrors((prev) => ({
        ...prev,
        general: 'Error al guardar la clase. Intenta de nuevo.',
      }))
    }
  }

  // Don't render if not open
  if (!isOpen) return null

  const isFormValid = Object.keys(validateForm()).length === 0
  const modalTitle = mode === 'create' ? 'Nueva Clase' : 'Editar Clase'
  const submitButtonText = mode === 'create' ? 'Crear Clase' : 'Guardar Cambios'

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] pt-20 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md -z-10"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative flex items-start justify-center p-4 min-h-full">
        <GlassPanel className="relative w-full max-w-lg flex flex-col my-8 overflow-hidden">
          {/* Header */}
          <div className="p-6 pb-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">{modalTitle}</h2>
              <GlassButton
                variant="icon"
                onClick={onClose}
                disabled={isSubmitting}
                className="!p-2"
              >
                <X className="w-5 h-5" />
              </GlassButton>
            </div>
          </div>

          {/* Form - Scrollable */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">{/* Form content unchanged */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* General Error */}
          {errors.general && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-sm">
              {errors.general}
            </div>
          )}

          {/* Fecha - Requirements: 5.2 */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">
              Fecha <span className="text-red-400">*</span>
            </label>
            <GlassInput
              type="date"
              value={formData.fecha}
              onChange={(e) => handleChange('fecha', e.target.value)}
              onBlur={() => handleBlur('fecha')}
              min={mode === 'create' ? getTodayDate() : undefined}
              icon={<Calendar className="w-4 h-4" />}
              error={touched.fecha ? errors.fecha : undefined}
            />
          </div>

          {/* Hora Inicio y Fin - Requirements: 5.2 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                Hora Inicio <span className="text-red-400">*</span>
              </label>
              <GlassInput
                type="time"
                value={formData.horaInicio}
                onChange={(e) => handleChange('horaInicio', e.target.value)}
                onBlur={() => handleBlur('horaInicio')}
                icon={<Clock className="w-4 h-4" />}
                error={touched.horaInicio ? errors.horaInicio : undefined}
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                Hora Fin <span className="text-red-400">*</span>
              </label>
              <GlassInput
                type="time"
                value={formData.horaFin}
                onChange={(e) => handleChange('horaFin', e.target.value)}
                onBlur={() => handleBlur('horaFin')}
                icon={<Clock className="w-4 h-4" />}
                error={touched.horaFin ? errors.horaFin : undefined}
              />
            </div>
          </div>

          {/* Tipo de Clase - Requirements: 5.2 */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">
              Tipo de Clase <span className="text-red-400">*</span>
            </label>
            {isCatalogsLoading ? (
              <div className="h-12 bg-white/5 rounded-xl animate-pulse" />
            ) : (
              <GlassSelect
                value={formData.idTipoClase}
                onValueChange={(value) => handleChange('idTipoClase', value)}
              >
                <GlassSelectTrigger
                  className={
                    touched.idTipoClase && errors.idTipoClase
                      ? 'border-red-500'
                      : ''
                  }
                >
                  <GlassSelectValue placeholder="Seleccionar tipo de clase" />
                </GlassSelectTrigger>
                <GlassSelectContent>
                  {tiposClase.map((tipo) => (
                    <GlassSelectItem key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </GlassSelectItem>
                  ))}
                </GlassSelectContent>
              </GlassSelect>
            )}
            {touched.idTipoClase && errors.idTipoClase && (
              <p className="text-red-400 text-sm mt-1">{errors.idTipoClase}</p>
            )}
          </div>

          {/* Profesores con Roles - NUEVO SISTEMA */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-gray-300 text-sm">
                Profesores <span className="text-red-400">*</span>
              </label>
              <GlassButton
                type="button"
                variant="secondary"
                onClick={agregarProfesor}
                disabled={isCatalogsLoading}
                className="!py-1 !px-3 !text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Agregar Profesor
              </GlassButton>
            </div>
            
            {isCatalogsLoading ? (
              <div className="h-12 bg-white/5 rounded-xl animate-pulse" />
            ) : (
              <div className="space-y-3">
                {formData.profesores.length === 0 ? (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center text-gray-400 text-sm">
                    No hay profesores agregados. Haz clic en "Agregar Profesor" para comenzar.
                  </div>
                ) : (
                  formData.profesores.map((profesor, index) => (
                    <div
                      key={index}
                      className="flex gap-2 items-start p-3 rounded-xl bg-white/5 border border-white/10"
                    >
                      {/* Selector de Profesor */}
                      <div className="flex-1">
                        <GlassSelect
                          value={profesor.idProfesor}
                          onValueChange={(value) => actualizarProfesor(index, 'idProfesor', value)}
                        >
                          <GlassSelectTrigger className="w-full">
                            <GlassSelectValue placeholder="Seleccionar profesor" />
                          </GlassSelectTrigger>
                          <GlassSelectContent>
                            {profesores.map((prof) => (
                              <GlassSelectItem
                                key={prof.idProfesor}
                                value={prof.idProfesor}
                                disabled={formData.profesores.some((p, i) => i !== index && p.idProfesor === prof.idProfesor)}
                              >
                                {prof.nombreCompleto}
                              </GlassSelectItem>
                            ))}
                          </GlassSelectContent>
                        </GlassSelect>
                      </div>
                      
                      {/* Selector de Rol */}
                      <div className="w-32">
                        <GlassSelect
                          value={profesor.rolEnClase}
                          onValueChange={(value) => actualizarProfesor(index, 'rolEnClase', value as 'Principal' | 'Monitor')}
                        >
                          <GlassSelectTrigger className="w-full">
                            <GlassSelectValue />
                          </GlassSelectTrigger>
                          <GlassSelectContent>
                            <GlassSelectItem value="Principal">Principal</GlassSelectItem>
                            <GlassSelectItem value="Monitor">Monitor</GlassSelectItem>
                          </GlassSelectContent>
                        </GlassSelect>
                      </div>
                      
                      {/* Botón Eliminar */}
                      <GlassButton
                        type="button"
                        variant="icon"
                        onClick={() => eliminarProfesor(index)}
                        className="!p-2 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </GlassButton>
                    </div>
                  ))
                )}
              </div>
            )}
            
            {/* Mensaje de error */}
            {touched.profesores && errors.idProfesorPrincipal && (
              <p className="text-red-400 text-sm mt-1">
                {errors.idProfesorPrincipal}
              </p>
            )}
            
            {/* Info Helper */}
            <p className="text-gray-400 text-xs mt-2">
              Debe haber al menos un profesor con rol "Principal". Puedes agregar varios profesores principales y monitores.
            </p>
          </div>

          {/* Cupo Máximo - Requirements: 5.2 */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">
              Cupo Máximo <span className="text-red-400">*</span>
            </label>
            <GlassInput
              type="number"
              min={1}
              max={100}
              value={formData.cupoMaximo.toString()}
              onChange={(e) =>
                handleChange('cupoMaximo', parseInt(e.target.value, 10) || 1)
              }
              onBlur={() => handleBlur('cupoMaximo')}
              icon={<Users className="w-4 h-4" />}
              error={touched.cupoMaximo ? errors.cupoMaximo : undefined}
            />
          </div>

          {/* Observaciones - Requirements: 5.2 */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">
              Observaciones
            </label>
            <div className="relative">
              <div className="absolute left-4 top-3 text-gray-500">
                <FileText className="w-4 h-4" />
              </div>
              <textarea
                value={formData.observaciones}
                onChange={(e) => handleChange('observaciones', e.target.value)}
                placeholder="Notas adicionales sobre la clase..."
                rows={3}
                className="
                  w-full pl-12 pr-4 py-3
                  backdrop-blur-xl
                  bg-[rgba(30,30,36,0.6)]
                  border border-[rgba(255,255,255,0.12)]
                  focus:border-[#c93448]
                  focus:ring-2 focus:ring-[rgba(201,52,72,0.3)]
                  rounded-xl
                  text-[#f9fafb]
                  placeholder-[#6b7280]
                  outline-none
                  transition-all duration-300
                  shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_1px_2px_rgba(255,255,255,0.05)]
                  focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_0_0_3px_rgba(201,52,72,0.2)]
                  resize-none
                "
              />
            </div>
          </div>

          {/* Action Buttons - Requirements: 10.3 */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <GlassButton
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </GlassButton>
            <GlassButton
              type="submit"
              variant="primary"
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                submitButtonText
              )}
            </GlassButton>
          </div>
        </form>
        </div>
      </GlassPanel>
      </div>
    </div>
  )
}
