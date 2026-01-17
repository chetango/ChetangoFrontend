// ============================================
// CLASE FORM MODAL COMPONENT
// Modal for creating and editing classes
// Requirements: 5.1, 5.2, 5.4, 5.7, 6.1, 6.2, 10.3
// ============================================

import { useState, useEffect, useCallback, useMemo } from 'react'
import { X, Calendar, Clock, Users, FileText, Loader2 } from 'lucide-react'
import {
  GlassPanel,
  GlassButton,
  GlassInput,
  GlassSelect,
  GlassSelectTrigger,
  GlassSelectValue,
  GlassSelectContent,
  GlassSelectItem,
} from '@/design-system'
import type {
  TipoClaseDTO,
  ProfesorDTO,
  ClaseFormData,
  ClaseDetalleDTO,
} from '../types/classTypes'

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
}

export interface FormErrors {
  fecha?: string
  horaInicio?: string
  horaFin?: string
  idTipoClase?: string
  idProfesorPrincipal?: string
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
  return new Date().toISOString().split('T')[0]
}

/**
 * Formats time from HH:mm:ss to HH:mm
 */
function formatTimeForInput(time: string): string {
  if (!time) return ''
  return time.substring(0, 5)
}

/**
 * Formats date from ISO 8601 to YYYY-MM-DD
 */
function formatDateForInput(date: string): string {
  if (!date) return ''
  return date.split('T')[0]
}

// ============================================
// INITIAL FORM STATE
// ============================================

const getInitialFormData = (initialData?: ClaseDetalleDTO | null): ClaseFormData => {
  if (initialData) {
    return {
      fecha: formatDateForInput(initialData.fecha),
      horaInicio: formatTimeForInput(initialData.horaInicio),
      horaFin: formatTimeForInput(initialData.horaFin),
      idTipoClase: '', // Will need to be resolved from tipoClase name
      idProfesorPrincipal: initialData.idProfesorPrincipal,
      monitores: initialData.monitores?.map((m) => m.idProfesor) || [],
      cupoMaximo: initialData.cupoMaximo,
      observaciones: initialData.observaciones || '',
    }
  }

  return {
    fecha: '',
    horaInicio: '',
    horaFin: '',
    idTipoClase: '',
    idProfesorPrincipal: '',
    monitores: [],
    cupoMaximo: 10,
    observaciones: '',
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
}: ClaseFormModalProps) {
  // Form state
  const [formData, setFormData] = useState<ClaseFormData>(() =>
    getInitialFormData(initialData)
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      const newFormData = getInitialFormData(initialData)

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
  }, [isOpen, initialData, tiposClase])

  // Filter profesores to show only Titular for main professor
  const titularProfesores = useMemo(
    () => profesores.filter((p) => p.tipoProfesor === 'Titular'),
    [profesores]
  )

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

    if (!formData.idProfesorPrincipal) {
      newErrors.idProfesorPrincipal = 'El profesor es requerido'
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
    (field: keyof ClaseFormData, value: string | number | string[]) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      setTouched((prev) => ({ ...prev, [field]: true }))
    },
    []
  )

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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <GlassPanel className="relative z-10 w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">{modalTitle}</h2>
          <GlassButton
            variant="icon"
            onClick={onClose}
            disabled={isSubmitting}
            className="!p-2"
          >
            <X className="w-5 h-5" />
          </GlassButton>
        </div>

        {/* Form */}
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

          {/* Profesor Principal - Requirements: 5.2, 5.8 */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">
              Profesor Principal <span className="text-red-400">*</span>
            </label>
            {isCatalogsLoading ? (
              <div className="h-12 bg-white/5 rounded-xl animate-pulse" />
            ) : (
              <GlassSelect
                value={formData.idProfesorPrincipal}
                onValueChange={(value) =>
                  handleChange('idProfesorPrincipal', value)
                }
              >
                <GlassSelectTrigger
                  className={
                    touched.idProfesorPrincipal && errors.idProfesorPrincipal
                      ? 'border-red-500'
                      : ''
                  }
                >
                  <GlassSelectValue placeholder="Seleccionar profesor" />
                </GlassSelectTrigger>
                <GlassSelectContent>
                  {titularProfesores.map((profesor) => (
                    <GlassSelectItem
                      key={profesor.idProfesor}
                      value={profesor.idProfesor}
                    >
                      {profesor.nombreCompleto}
                    </GlassSelectItem>
                  ))}
                </GlassSelectContent>
              </GlassSelect>
            )}
            {touched.idProfesorPrincipal && errors.idProfesorPrincipal && (
              <p className="text-red-400 text-sm mt-1">
                {errors.idProfesorPrincipal}
              </p>
            )}
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
      </GlassPanel>
    </div>
  )
}
