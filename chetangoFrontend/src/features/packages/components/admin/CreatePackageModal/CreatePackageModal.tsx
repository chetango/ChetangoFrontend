// ============================================
// CREATE PACKAGE MODAL COMPONENT
// Modal for creating new packages
// Requirements: 5.1, 5.2, 5.3, 5.5, 5.6, 5.7, 10.1, 10.3
// ============================================

import { useState, useEffect, useCallback, useMemo } from 'react'
import { X, Calendar, FileText, Loader2, User, Package } from 'lucide-react'
import {
  GlassPanel,
  GlassButton,
  GlassInput,
  GlassSelect,
  GlassSelectTrigger,
  GlassSelectValue,
  GlassSelectContent,
  GlassSelectItem,
  Skeleton,
  SkeletonText,
} from '@/design-system'
import type {
  AlumnoDTO,
  TipoPaqueteDTO,
  PaqueteFormData,
} from '../../../types/packageTypes'

// ============================================
// TYPES
// ============================================

export interface CreatePackageModalProps {
  /** Whether the modal is open */
  isOpen: boolean
  /** Callback to close the modal */
  onClose: () => void
  /** Callback when form is submitted */
  onSubmit: (data: PaqueteFormData) => Promise<void>
  /** Available students for dropdown */
  alumnos: AlumnoDTO[]
  /** Available package types for dropdown */
  tiposPaquete: TipoPaqueteDTO[]
  /** Whether catalogs are loading */
  isCatalogsLoading?: boolean
  /** Whether the form is submitting */
  isSubmitting?: boolean
  /** Pre-selected alumno ID (for renewal flow) */
  preselectedAlumnoId?: string
  /** Pre-selected tipo paquete ID (for renewal flow) */
  preselectedTipoPaqueteId?: string
}

export interface FormErrors {
  idAlumno?: string
  idTipoPaquete?: string
  fechaInicio?: string
  general?: string
}

// ============================================
// HELPER FUNCTIONS (exported for testing)
// ============================================

/**
 * Gets today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

/**
 * Calculates fecha fin based on fecha inicio and dias vigencia
 * Property 13: Fecha Fin Auto-Calculation
 * Requirements: 5.3
 */
export function calculateFechaFin(fechaInicio: string, diasVigencia: number): string {
  if (!fechaInicio || diasVigencia <= 0) return ''
  
  const startDate = new Date(fechaInicio)
  // Check for invalid date
  if (isNaN(startDate.getTime())) return ''
  
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + diasVigencia)
  
  return endDate.toISOString().split('T')[0]
}

/**
 * Validates required fields for form submission
 * Property 15: Form Validation - Required Fields
 * Requirements: 5.7
 */
export function validateRequiredFields(formData: PaqueteFormData): FormErrors {
  const errors: FormErrors = {}

  if (!formData.idAlumno || formData.idAlumno.trim() === '') {
    errors.idAlumno = 'El alumno es requerido'
  }

  if (!formData.idTipoPaquete || formData.idTipoPaquete.trim() === '') {
    errors.idTipoPaquete = 'El tipo de paquete es requerido'
  }

  if (!formData.fechaInicio || formData.fechaInicio.trim() === '') {
    errors.fechaInicio = 'La fecha de inicio es requerida'
  }

  return errors
}

/**
 * Formats alumno for dropdown display
 * Requirements: 2.5
 */
export function formatAlumnoDisplay(alumno: AlumnoDTO): string {
  return `${alumno.nombreCompleto} - ${alumno.documentoIdentidad}`
}

/**
 * Formats tipo paquete for dropdown display
 * Requirements: 2.6
 */
export function formatTipoPaqueteDisplay(tipo: TipoPaqueteDTO): string {
  return `${tipo.nombre} (${tipo.clasesDisponibles} clases)`
}

// ============================================
// INITIAL FORM STATE
// ============================================

const getInitialFormData = (
  preselectedAlumnoId?: string,
  preselectedTipoPaqueteId?: string
): PaqueteFormData => ({
  idAlumno: preselectedAlumnoId || '',
  idTipoPaquete: preselectedTipoPaqueteId || '',
  fechaInicio: getTodayDate(),
  fechaFin: '',
  notasInternas: '',
})


// ============================================
// COMPONENT
// ============================================

/**
 * CreatePackageModal - Modal for creating new packages
 *
 * Features:
 * - Dropdown de alumno con búsqueda
 * - Dropdown de tipo de paquete
 * - Date picker para fecha inicio
 * - Date picker para fecha fin (auto-calculada)
 * - Textarea para notas internas (opcional)
 * - Botones Cancelar y Crear Paquete
 * - Validación de campos requeridos
 *
 * Requirements: 5.1, 5.2, 5.3, 5.5, 5.6, 5.7
 */
export function CreatePackageModal({
  isOpen,
  onClose,
  onSubmit,
  alumnos,
  tiposPaquete,
  isCatalogsLoading = false,
  isSubmitting = false,
  preselectedAlumnoId,
  preselectedTipoPaqueteId,
}: CreatePackageModalProps) {
  // Form state
  const [formData, setFormData] = useState<PaqueteFormData>(() =>
    getInitialFormData(preselectedAlumnoId, preselectedTipoPaqueteId)
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Get selected tipo paquete for auto-calculation
  const selectedTipoPaquete = useMemo(() => {
    return tiposPaquete.find((t) => t.id === formData.idTipoPaquete)
  }, [tiposPaquete, formData.idTipoPaquete])

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData(preselectedAlumnoId, preselectedTipoPaqueteId))
      setErrors({})
      setTouched({})
    }
  }, [isOpen, preselectedAlumnoId, preselectedTipoPaqueteId])

  // Auto-calculate fecha fin when tipo paquete or fecha inicio changes
  // Property 13: Fecha Fin Auto-Calculation
  useEffect(() => {
    if (formData.fechaInicio && selectedTipoPaquete) {
      const calculatedFechaFin = calculateFechaFin(
        formData.fechaInicio,
        selectedTipoPaquete.diasVigencia
      )
      setFormData((prev) => ({ ...prev, fechaFin: calculatedFechaFin }))
    }
  }, [formData.fechaInicio, selectedTipoPaquete])

  // Validate form
  const validateForm = useCallback((): FormErrors => {
    return validateRequiredFields(formData)
  }, [formData])

  // Handle field change
  const handleChange = useCallback(
    (field: keyof PaqueteFormData, value: string) => {
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
      idAlumno: true,
      idTipoPaquete: true,
      fechaInicio: true,
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
        general: 'Error al crear el paquete. Intenta de nuevo.',
      }))
    }
  }

  // Don't render if not open
  if (!isOpen) return null

  const isFormValid = Object.keys(validateForm()).length === 0

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
          <h2 className="text-xl font-semibold text-white">Crear Paquete</h2>
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

          {/* Alumno Dropdown - Requirements: 5.2, 10.1 */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">
              Alumno <span className="text-red-400">*</span>
            </label>
            {isCatalogsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full rounded-xl" />
                <SkeletonText className="w-32" />
              </div>
            ) : (
              <GlassSelect
                value={formData.idAlumno}
                onValueChange={(value) => handleChange('idAlumno', value)}
              >
                <GlassSelectTrigger
                  className={
                    touched.idAlumno && errors.idAlumno ? 'border-red-500' : ''
                  }
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <GlassSelectValue placeholder="Seleccionar alumno" />
                  </div>
                </GlassSelectTrigger>
                <GlassSelectContent>
                  {alumnos.map((alumno) => (
                    <GlassSelectItem key={alumno.idAlumno} value={alumno.idAlumno}>
                      {formatAlumnoDisplay(alumno)}
                    </GlassSelectItem>
                  ))}
                </GlassSelectContent>
              </GlassSelect>
            )}
            {touched.idAlumno && errors.idAlumno && (
              <p className="text-red-400 text-sm mt-1">{errors.idAlumno}</p>
            )}
          </div>

          {/* Tipo de Paquete Dropdown - Requirements: 5.2, 10.1 */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">
              Tipo de Paquete <span className="text-red-400">*</span>
            </label>
            {isCatalogsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full rounded-xl" />
                <SkeletonText className="w-48" />
              </div>
            ) : (
              <GlassSelect
                value={formData.idTipoPaquete}
                onValueChange={(value) => handleChange('idTipoPaquete', value)}
              >
                <GlassSelectTrigger
                  className={
                    touched.idTipoPaquete && errors.idTipoPaquete
                      ? 'border-red-500'
                      : ''
                  }
                >
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <GlassSelectValue placeholder="Seleccionar tipo de paquete" />
                  </div>
                </GlassSelectTrigger>
                <GlassSelectContent>
                  {tiposPaquete.map((tipo) => (
                    <GlassSelectItem key={tipo.id} value={tipo.id}>
                      {formatTipoPaqueteDisplay(tipo)}
                    </GlassSelectItem>
                  ))}
                </GlassSelectContent>
              </GlassSelect>
            )}
            {touched.idTipoPaquete && errors.idTipoPaquete && (
              <p className="text-red-400 text-sm mt-1">{errors.idTipoPaquete}</p>
            )}
            {selectedTipoPaquete && (
              <p className="text-gray-400 text-xs mt-1">
                Vigencia: {selectedTipoPaquete.diasVigencia} días • Precio: $
                {selectedTipoPaquete.precio.toLocaleString()}
              </p>
            )}
          </div>

          {/* Fecha Inicio - Requirements: 5.2 */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">
              Fecha de Inicio <span className="text-red-400">*</span>
            </label>
            <GlassInput
              type="date"
              value={formData.fechaInicio}
              onChange={(e) => handleChange('fechaInicio', e.target.value)}
              onBlur={() => handleBlur('fechaInicio')}
              min={getTodayDate()}
              icon={<Calendar className="w-4 h-4" />}
              error={touched.fechaInicio ? errors.fechaInicio : undefined}
            />
          </div>

          {/* Fecha Fin (auto-calculated) - Requirements: 5.3 */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">
              Fecha de Vencimiento{' '}
              <span className="text-gray-500 text-xs">(calculada automáticamente)</span>
            </label>
            <GlassInput
              type="date"
              value={formData.fechaFin}
              disabled
              icon={<Calendar className="w-4 h-4" />}
              className="opacity-70"
            />
            {selectedTipoPaquete && formData.fechaFin && (
              <p className="text-gray-400 text-xs mt-1">
                Basado en {selectedTipoPaquete.diasVigencia} días de vigencia
              </p>
            )}
          </div>

          {/* Notas Internas (opcional) - Requirements: 5.2 */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">
              Notas Internas{' '}
              <span className="text-gray-500 text-xs">(opcional)</span>
            </label>
            <div className="relative">
              <div className="absolute left-4 top-3 text-gray-500">
                <FileText className="w-4 h-4" />
              </div>
              <textarea
                value={formData.notasInternas}
                onChange={(e) => handleChange('notasInternas', e.target.value)}
                placeholder="Notas adicionales sobre el paquete..."
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

          {/* Action Buttons - Requirements: 5.1 */}
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
                  <span>Creando...</span>
                </>
              ) : (
                'Crear Paquete'
              )}
            </GlassButton>
          </div>
        </form>
      </GlassPanel>
    </div>
  )
}
