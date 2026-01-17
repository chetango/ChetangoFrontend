// ============================================
// REGISTER PAYMENT FORM - CHETANGO ADMIN
// Requirements: 5.1, 5.2, 5.10, 5.11, 7.1, 7.2, 7.8
// ============================================

import { useState, useCallback, useMemo, useEffect } from 'react'
import { Calendar, FileText, Loader2 } from 'lucide-react'
import { GlassInput } from '@/design-system/atoms/GlassInput'
import { GlassButton } from '@/design-system/atoms/GlassButton'
import { PaymentMethodSelector } from './PaymentMethodSelector'
import { PackageSelector } from './PackageSelector'
import { PaymentTotalDisplay } from './PaymentTotalDisplay'
import type {
  MetodoPagoDTO,
  TipoPaqueteDTO,
  SelectedPaquete,
  PagoFormData,
} from '../types/paymentTypes'

/**
 * Initial values for pre-filling the form
 * Used when repeating the last payment
 * Requirements: 8.3, 8.4
 */
export interface PaymentFormInitialValues {
  idMetodoPago?: string
  selectedPaquetes?: SelectedPaquete[]
  montoTotal?: number
}

interface RegisterPaymentFormProps {
  idAlumno: string
  metodosPago: MetodoPagoDTO[]
  tiposPaquete: TipoPaqueteDTO[]
  isLoading?: boolean
  isSubmitting?: boolean
  initialValues?: PaymentFormInitialValues | null
  formatCurrency: (amount: number) => string
  calculateTotal: (paquetes: SelectedPaquete[]) => number
  onSubmit: (formData: PagoFormData) => Promise<unknown>
  onCancel: () => void
  onInitialValuesApplied?: () => void
}

/**
 * Main form for registering a new payment
 *
 * Requirements:
 * - 5.1: Display fields: fecha, método, paquetes, monto, referencia, observaciones
 * - 5.2: Default fecha to today
 * - 5.10: Referencia input with placeholder
 * - 5.11: Observaciones textarea with placeholder
 * - 7.1: Validate required fields before submission
 * - 7.2: Highlight missing fields and display error messages
 * - 7.8: Show loading state while mutation is in progress
 */
export function RegisterPaymentForm({
  idAlumno,
  metodosPago,
  tiposPaquete,
  isLoading = false,
  isSubmitting = false,
  initialValues,
  formatCurrency,
  calculateTotal,
  onSubmit,
  onCancel,
  onInitialValuesApplied,
}: RegisterPaymentFormProps) {
  // Form state
  const [fechaPago, setFechaPago] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [idMetodoPago, setIdMetodoPago] = useState('')
  const [selectedPaquetes, setSelectedPaquetes] = useState<SelectedPaquete[]>([])
  const [montoTotal, setMontoTotal] = useState(0)
  const [montoManual, setMontoManual] = useState(false)
  const [referencia, setReferencia] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Apply initial values when they change (for repeat last payment)
  // Requirements: 8.3, 8.4
  useEffect(() => {
    if (initialValues) {
      if (initialValues.idMetodoPago) {
        setIdMetodoPago(initialValues.idMetodoPago)
      }
      if (initialValues.selectedPaquetes && initialValues.selectedPaquetes.length > 0) {
        setSelectedPaquetes(initialValues.selectedPaquetes)
      }
      if (initialValues.montoTotal !== undefined && initialValues.montoTotal > 0) {
        setMontoTotal(initialValues.montoTotal)
        // Mark as manual if the total doesn't match calculated
        const calculatedFromPaquetes = initialValues.selectedPaquetes
          ? calculateTotal(initialValues.selectedPaquetes)
          : 0
        setMontoManual(initialValues.montoTotal !== calculatedFromPaquetes)
      }
      // Fecha de pago remains as today (Requirement 8.4)
      // Clear any previous errors
      setErrors({})
      // Notify parent that initial values have been applied
      onInitialValuesApplied?.()
    }
  }, [initialValues, calculateTotal, onInitialValuesApplied])

  // Calculate total from selected packages
  const calculatedTotal = useMemo(
    () => calculateTotal(selectedPaquetes),
    [selectedPaquetes, calculateTotal]
  )

  // Update monto when packages change (if not manual)
  const handlePaqueteToggle = useCallback((paquete: SelectedPaquete) => {
    setSelectedPaquetes((prev) => {
      const exists = prev.some((p) => p.idTipoPaquete === paquete.idTipoPaquete)
      const newPaquetes = exists
        ? prev.filter((p) => p.idTipoPaquete !== paquete.idTipoPaquete)
        : [...prev, paquete]

      // Auto-update total if not manual
      if (!montoManual) {
        const newTotal = calculateTotal(newPaquetes)
        setMontoTotal(newTotal)
      }

      return newPaquetes
    })
    setErrors((prev) => ({ ...prev, paquetes: '' }))
  }, [montoManual, calculateTotal])

  const handleTotalChange = useCallback((total: number, isManual: boolean) => {
    setMontoTotal(total)
    setMontoManual(isManual)
    setErrors((prev) => ({ ...prev, monto: '' }))
  }, [])

  const handleMetodoChange = useCallback((id: string) => {
    setIdMetodoPago(id)
    setErrors((prev) => ({ ...prev, metodo: '' }))
  }, [])

  // Validation (Requirement 7.1)
  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {}

    if (!idMetodoPago) {
      newErrors.metodo = 'Debes seleccionar un método de pago'
    }
    if (selectedPaquetes.length === 0) {
      newErrors.paquetes = 'Debes seleccionar al menos un paquete'
    }
    if (montoTotal <= 0) {
      newErrors.monto = 'El monto debe ser mayor a cero'
    }
    if (!fechaPago) {
      newErrors.fecha = 'La fecha de pago es requerida'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [idMetodoPago, selectedPaquetes, montoTotal, fechaPago])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    const formData: PagoFormData = {
      idAlumno,
      fechaPago: new Date(fechaPago).toISOString(),
      idMetodoPago,
      selectedPaquetes,
      montoTotal,
      montoManual,
      referencia,
      observaciones,
    }

    try {
      await onSubmit(formData)
      // Reset form on success
      setSelectedPaquetes([])
      setMontoTotal(0)
      setMontoManual(false)
      setReferencia('')
      setObservaciones('')
      setIdMetodoPago('')
    } catch {
      // Error handled by mutation
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Fecha de Pago */}
      <div className="space-y-2">
        <label className="text-[#9ca3af] text-sm flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Fecha de Pago
        </label>
        <GlassInput
          type="date"
          value={fechaPago}
          onChange={(e) => {
            setFechaPago(e.target.value)
            setErrors((prev) => ({ ...prev, fecha: '' }))
          }}
          className={errors.fecha ? 'ring-2 ring-red-500' : ''}
        />
        {errors.fecha && (
          <p className="text-red-400 text-sm">{errors.fecha}</p>
        )}
      </div>

      {/* Método de Pago */}
      <div>
        <PaymentMethodSelector
          metodosPago={metodosPago}
          selectedMetodoId={idMetodoPago}
          onSelect={handleMetodoChange}
          isLoading={isLoading}
        />
        {errors.metodo && (
          <p className="text-red-400 text-sm mt-1">{errors.metodo}</p>
        )}
      </div>

      {/* Paquetes */}
      <div>
        <PackageSelector
          tiposPaquete={tiposPaquete}
          selectedPaquetes={selectedPaquetes}
          onToggle={handlePaqueteToggle}
          formatCurrency={formatCurrency}
          isLoading={isLoading}
        />
        {errors.paquetes && (
          <p className="text-red-400 text-sm mt-1">{errors.paquetes}</p>
        )}
      </div>

      {/* Total */}
      <PaymentTotalDisplay
        calculatedTotal={calculatedTotal}
        currentTotal={montoTotal}
        isManual={montoManual}
        formatCurrency={formatCurrency}
        onTotalChange={handleTotalChange}
      />
      {errors.monto && (
        <p className="text-red-400 text-sm">{errors.monto}</p>
      )}

      {/* Referencia (opcional) */}
      <div className="space-y-2">
        <label className="text-[#9ca3af] text-sm">
          Referencia (opcional)
        </label>
        <GlassInput
          type="text"
          placeholder="Número de comprobante..."
          value={referencia}
          onChange={(e) => setReferencia(e.target.value)}
        />
      </div>

      {/* Observaciones (opcional) */}
      <div className="space-y-2">
        <label className="text-[#9ca3af] text-sm flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Observaciones (opcional)
        </label>
        <textarea
          placeholder="Notas adicionales..."
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-[#f9fafb] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#c93448] resize-none"
        />
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 pt-4">
        <GlassButton
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1"
        >
          Cancelar
        </GlassButton>
        <GlassButton
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Registrando...
            </>
          ) : (
            'Registrar Pago'
          )}
        </GlassButton>
      </div>
    </form>
  )
}
