// ============================================
// CONGELAR PAQUETE DIALOG COMPONENT
// Dialog for freezing a package with date range
// Requirements: 8.1, 8.2, 8.4, 8.5
// ============================================

import { useState, useEffect, useCallback, useMemo } from 'react'
import { X, Calendar, FileText, Loader2, Snowflake } from 'lucide-react'
import { GlassPanel, GlassButton, GlassInput } from '@/design-system'

// ============================================
// TYPES
// ============================================

export interface CongelarPaqueteDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean
  /** Callback to close the dialog */
  onClose: () => void
  /** Callback when form is submitted */
  onSubmit: (fechaInicio: string, fechaFin: string, motivo?: string) => Promise<void>
  /** Package ID being frozen */
  idPaquete: string
  /** Student name for display */
  nombreAlumno: string
  /** Package type name for display */
  nombreTipoPaquete: string
  /** Whether the form is submitting */
  isSubmitting?: boolean
}

export interface CongelarFormErrors {
  fechaInicio?: string
  fechaFin?: string
  general?: string
}

export interface CongelarFormData {
  fechaInicio: string
  fechaFin: string
  motivo: string
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
 * Validates that fechaInicio is >= today
 * Requirements: 8.2
 */
export function validateFechaInicio(fechaInicio: string): string | undefined {
  if (!fechaInicio || fechaInicio.trim() === '') {
    return 'La fecha de inicio es requerida'
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const startDate = new Date(fechaInicio)
  startDate.setHours(0, 0, 0, 0)

  if (startDate < today) {
    return 'La fecha de inicio debe ser hoy o posterior'
  }

  return undefined
}

/**
 * Validates that fechaFin is > fechaInicio
 * Requirements: 8.2
 */
export function validateFechaFin(fechaInicio: string, fechaFin: string): string | undefined {
  if (!fechaFin || fechaFin.trim() === '') {
    return 'La fecha de fin es requerida'
  }

  if (!fechaInicio) {
    return undefined // Can't validate without fechaInicio
  }

  const startDate = new Date(fechaInicio)
  const endDate = new Date(fechaFin)

  if (endDate <= startDate) {
    return 'La fecha de fin debe ser posterior a la fecha de inicio'
  }

  return undefined
}

/**
 * Validates all form fields
 * Requirements: 8.2
 */
export function validateCongelarForm(formData: CongelarFormData): CongelarFormErrors {
  const errors: CongelarFormErrors = {}

  const fechaInicioError = validateFechaInicio(formData.fechaInicio)
  if (fechaInicioError) {
    errors.fechaInicio = fechaInicioError
  }

  const fechaFinError = validateFechaFin(formData.fechaInicio, formData.fechaFin)
  if (fechaFinError) {
    errors.fechaFin = fechaFinError
  }

  return errors
}

/**
 * Calculates the number of days between two dates
 */
export function calculateDaysCount(fechaInicio: string, fechaFin: string): number {
  if (!fechaInicio || !fechaFin) return 0

  const startDate = new Date(fechaInicio)
  const endDate = new Date(fechaFin)

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 0

  const diffTime = endDate.getTime() - startDate.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return Math.max(0, diffDays)
}

// ============================================
// INITIAL FORM STATE
// ============================================

const getInitialFormData = (): CongelarFormData => ({
  fechaInicio: getTodayDate(),
  fechaFin: '',
  motivo: '',
})

// ============================================
// COMPONENT
// ============================================

/**
 * CongelarPaqueteDialog - Dialog for freezing a package
 *
 * Features:
 * - Date picker para fecha inicio (>= hoy)
 * - Date picker para fecha fin (> fecha inicio)
 * - Input para motivo (opcional)
 * - Validación de fechas
 * - Botones Cancelar y Congelar
 *
 * Requirements: 8.1, 8.2, 8.4, 8.5
 */
export function CongelarPaqueteDialog({
  isOpen,
  onClose,
  onSubmit,
  nombreAlumno,
  nombreTipoPaquete,
  isSubmitting = false,
}: CongelarPaqueteDialogProps) {
  // Form state
  const [formData, setFormData] = useState<CongelarFormData>(getInitialFormData)
  const [errors, setErrors] = useState<CongelarFormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Calculate days count for display
  const daysCount = useMemo(() => {
    return calculateDaysCount(formData.fechaInicio, formData.fechaFin)
  }, [formData.fechaInicio, formData.fechaFin])

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData())
      setErrors({})
      setTouched({})
    }
  }, [isOpen])

  // Validate form
  const validateForm = useCallback((): CongelarFormErrors => {
    return validateCongelarForm(formData)
  }, [formData])

  // Handle field change
  const handleChange = useCallback(
    (field: keyof CongelarFormData, value: string) => {
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
      fechaInicio: true,
      fechaFin: true,
    })

    const validationErrors = validateForm()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    try {
      await onSubmit(
        formData.fechaInicio,
        formData.fechaFin,
        formData.motivo.trim() || undefined
      )
      onClose()
    } catch {
      setErrors((prev) => ({
        ...prev,
        general: 'Error al congelar el paquete. Intenta de nuevo.',
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

      {/* Dialog */}
      <GlassPanel className="relative z-10 w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/40">
              <Snowflake className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Congelar Paquete</h2>
          </div>
          <GlassButton
            variant="icon"
            onClick={onClose}
            disabled={isSubmitting}
            className="!p-2"
          >
            <X className="w-5 h-5" />
          </GlassButton>
        </div>

        {/* Package Info */}
        <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-gray-300 text-sm">
            <span className="text-gray-500">Alumno:</span>{' '}
            <span className="font-medium text-white">{nombreAlumno}</span>
          </p>
          <p className="text-gray-300 text-sm mt-1">
            <span className="text-gray-500">Paquete:</span>{' '}
            <span className="font-medium text-white">{nombreTipoPaquete}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* General Error */}
          {errors.general && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-sm">
              {errors.general}
            </div>
          )}

          {/* Fecha Inicio - Requirements: 8.2 */}
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
            {touched.fechaInicio && errors.fechaInicio && (
              <p className="text-red-400 text-sm mt-1">{errors.fechaInicio}</p>
            )}
          </div>

          {/* Fecha Fin - Requirements: 8.2 */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">
              Fecha de Fin <span className="text-red-400">*</span>
            </label>
            <GlassInput
              type="date"
              value={formData.fechaFin}
              onChange={(e) => handleChange('fechaFin', e.target.value)}
              onBlur={() => handleBlur('fechaFin')}
              min={formData.fechaInicio || getTodayDate()}
              icon={<Calendar className="w-4 h-4" />}
              error={touched.fechaFin ? errors.fechaFin : undefined}
            />
            {touched.fechaFin && errors.fechaFin && (
              <p className="text-red-400 text-sm mt-1">{errors.fechaFin}</p>
            )}
            {daysCount > 0 && (
              <p className="text-blue-400 text-xs mt-1">
                Duración: {daysCount} día{daysCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Motivo (opcional) - Requirements: 8.2 */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">
              Motivo{' '}
              <span className="text-gray-500 text-xs">(opcional)</span>
            </label>
            <div className="relative">
              <div className="absolute left-4 top-3 text-gray-500">
                <FileText className="w-4 h-4" />
              </div>
              <textarea
                value={formData.motivo}
                onChange={(e) => handleChange('motivo', e.target.value)}
                placeholder="Motivo de la congelación..."
                rows={3}
                className="
                  w-full pl-12 pr-4 py-3
                  backdrop-blur-xl
                  bg-[rgba(30,30,36,0.6)]
                  border border-[rgba(255,255,255,0.12)]
                  focus:border-blue-500
                  focus:ring-2 focus:ring-blue-500/30
                  rounded-xl
                  text-[#f9fafb]
                  placeholder-[#6b7280]
                  outline-none
                  transition-all duration-300
                  shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_1px_2px_rgba(255,255,255,0.05)]
                  focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_0_0_3px_rgba(59,130,246,0.2)]
                  resize-none
                "
              />
            </div>
          </div>

          {/* Info Note */}
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm">
            <p>
              Al congelar el paquete, la fecha de vencimiento se extenderá automáticamente
              por la cantidad de días congelados cuando se descongele.
            </p>
          </div>

          {/* Action Buttons - Requirements: 8.1 */}
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
              className="!bg-blue-600 hover:!bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Congelando...</span>
                </>
              ) : (
                <>
                  <Snowflake className="w-4 h-4" />
                  <span>Congelar</span>
                </>
              )}
            </GlassButton>
          </div>
        </form>
      </GlassPanel>
    </div>
  )
}
