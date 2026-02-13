// ============================================
// EDIT PAYMENT MODAL - CHETANGO ADMIN
// Requirements: 10.1, 10.2, 10.3, 10.5, 10.6, 10.7
// ============================================

import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { GlassInput } from '@/design-system/atoms/GlassInput'
import { GlassButton } from '@/design-system/atoms/GlassButton'
import { PaymentMethodSelector } from './PaymentMethodSelector'
import type { PagoDetalleDTO, MetodoPagoDTO, EditarPagoRequest } from '../types/paymentTypes'

interface EditPaymentModalProps {
  pago: PagoDetalleDTO | undefined
  metodosPago: MetodoPagoDTO[]
  isOpen: boolean
  isSubmitting?: boolean
  formatCurrency?: (amount: number) => string
  onClose: () => void
  onSubmit: (idPago: string, data: EditarPagoRequest) => Promise<void>
}

/**
 * Formats date to readable format
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Modal for editing an existing payment
 *
 * Requirements:
 * - 10.1: Open when "Editar Pago" is clicked
 * - 10.2: Editable fields: montoTotal, idMetodoPago, nota
 * - 10.3: Non-editable fields (readonly): alumno, fecha, paquetes
 * - 10.5: Success toast and refresh on 204
 * - 10.6: Error toast on 400
 * - 10.7: Validation: montoTotal > 0
 */
export function EditPaymentModal({
  pago,
  metodosPago,
  isOpen,
  isSubmitting = false,
  onClose,
  onSubmit,
}: EditPaymentModalProps) {
  const [montoTotal, setMontoTotal] = useState(0)
  const [idMetodoPago, setIdMetodoPago] = useState('')
  const [nota, setNota] = useState('')
  const [error, setError] = useState('')

  // Initialize form when pago changes
  useEffect(() => {
    if (pago) {
      setMontoTotal(pago.montoTotal)
      setIdMetodoPago(pago.idMetodoPago)
      setNota(pago.nota || '')
      setError('')
    }
  }, [pago])

  if (!isOpen || !pago) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation (Requirement 10.7)
    if (montoTotal <= 0) {
      setError('El monto debe ser mayor a cero')
      return
    }

    if (!idMetodoPago) {
      setError('Debes seleccionar un método de pago')
      return
    }

    const data: EditarPagoRequest = {
      montoTotal,
      idMetodoPago,
      nota: nota || null,
    }

    try {
      await onSubmit(pago.idPago, data)
      onClose()
    } catch {
      // Error handled by mutation
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 pb-8 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm -z-10"
        onClick={onClose}
      />

      {/* Modal */}
      <GlassPanel className="relative w-full max-w-md max-h-[85vh] overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#f9fafb] text-xl font-semibold">
            Editar Pago
          </h2>
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </GlassButton>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Read-only fields */}
          <div className="bg-white/5 rounded-lg p-4 space-y-2">
            <p className="text-[#6b7280] text-xs uppercase tracking-wide mb-2">
              Información no editable
            </p>
            <div className="flex justify-between text-sm">
              <span className="text-[#9ca3af]">Alumno</span>
              <span className="text-[#f9fafb]">{pago.nombreAlumno}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#9ca3af]">Fecha</span>
              <span className="text-[#f9fafb]">{formatDate(pago.fechaPago)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#9ca3af]">Paquetes</span>
              <span className="text-[#f9fafb]">{pago.paquetes.length}</span>
            </div>
          </div>

          {/* Editable: Monto Total */}
          <div className="space-y-2">
            <label className="text-[#9ca3af] text-sm">Monto Total</label>
            <GlassInput
              type="number"
              value={montoTotal}
              onChange={(e) => {
                setMontoTotal(parseFloat(e.target.value) || 0)
                setError('')
              }}
              min="0"
              step="1000"
              className={error && montoTotal <= 0 ? 'ring-2 ring-red-500' : ''}
            />
          </div>

          {/* Editable: Método de Pago */}
          <PaymentMethodSelector
            metodosPago={metodosPago}
            selectedMetodoId={idMetodoPago}
            onSelect={(id) => {
              setIdMetodoPago(id)
              setError('')
            }}
          />

          {/* Editable: Nota */}
          <div className="space-y-2">
            <label className="text-[#9ca3af] text-sm">Nota (opcional)</label>
            <textarea
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              rows={3}
              placeholder="Notas adicionales..."
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-[#f9fafb] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#c93448] resize-none"
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <GlassButton
              type="button"
              variant="ghost"
              onClick={onClose}
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
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </GlassButton>
          </div>
        </form>
      </GlassPanel>
    </div>
  )
}
