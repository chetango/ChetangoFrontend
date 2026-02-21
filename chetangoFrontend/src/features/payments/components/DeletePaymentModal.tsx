// ============================================
// DELETE PAYMENT CONFIRMATION MODAL
// ============================================

import { GlassButton } from '@/design-system/atoms/GlassButton'
import { AlertTriangle, X } from 'lucide-react'
import type { Payment } from '../types/payment.types'

interface DeletePaymentModalProps {
  payment: Payment | null
  isOpen: boolean
  isDeleting?: boolean
  formatCurrency: (amount: number) => string
  onClose: () => void
  onConfirm: () => void
}

export const DeletePaymentModal = ({
  payment,
  isOpen,
  isDeleting = false,
  formatCurrency,
  onClose,
  onConfirm,
}: DeletePaymentModalProps) => {
  if (!isOpen || !payment) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 pt-20 px-4 pb-8 overflow-y-auto">
      <div className="bg-[rgba(26,26,26,0.98)] border border-[rgba(239,68,68,0.3)] rounded-2xl w-full max-w-md">
        {/* Header */}
        <div className="sticky top-0 bg-[rgba(26,26,26,0.98)] border-b border-[rgba(239,68,68,0.2)] rounded-t-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[rgba(239,68,68,0.15)] border-2 border-[rgba(239,68,68,0.3)] flex items-center justify-center">
              <AlertTriangle className="text-[#ef4444]" size={20} />
            </div>
            <h2 className="text-[#f9fafb] text-xl font-semibold">Eliminar Pago</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-[#9ca3af] hover:text-[#f9fafb] transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Warning Message */}
          <div className="bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] rounded-lg p-4">
            <p className="text-[#fca5a5] text-sm leading-relaxed">
              ⚠️ <strong>Esta acción no se puede deshacer.</strong> El pago será eliminado permanentemente del sistema.
            </p>
          </div>

          {/* Payment Details */}
          <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(64,64,64,0.3)] rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-[#9ca3af] text-sm">Alumno:</span>
              <span className="text-[#f9fafb] font-medium">{payment.nombreAlumno}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9ca3af] text-sm">Monto:</span>
              <span className="text-[#f9fafb] font-bold text-lg">{formatCurrency(payment.montoTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9ca3af] text-sm">Fecha:</span>
              <span className="text-[#f9fafb]">{formatDate(payment.fechaPago)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9ca3af] text-sm">Método:</span>
              <span className="text-[#f9fafb]">{payment.nombreMetodoPago}</span>
            </div>
            {payment.cantidadPaquetes > 0 && (
              <div className="flex justify-between">
                <span className="text-[#9ca3af] text-sm">Paquetes:</span>
                <span className="text-[#fbbf24] font-medium">{payment.cantidadPaquetes} paquete(s)</span>
              </div>
            )}
          </div>

          {/* Additional Info */}
          {payment.cantidadPaquetes > 0 && (
            <div className="bg-[rgba(251,191,36,0.1)] border border-[rgba(251,191,36,0.3)] rounded-lg p-4">
              <p className="text-[#fbbf24] text-sm leading-relaxed">
                ℹ️ Los {payment.cantidadPaquetes} paquete(s) asociado(s) a este pago serán marcados como inactivos. 
                Si algún paquete tiene asistencias registradas, la eliminación será rechazada.
              </p>
            </div>
          )}

          {/* Confirmation Question */}
          <div className="pt-2">
            <p className="text-[#f9fafb] font-medium text-center">
              ¿Estás seguro de que deseas eliminar este pago?
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-[rgba(64,64,64,0.3)]">
          <GlassButton
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1"
          >
            Cancelar
          </GlassButton>
          <GlassButton
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 bg-[#ef4444] hover:bg-[#dc2626] text-white border-[rgba(239,68,68,0.3)]"
          >
            {isDeleting ? 'Eliminando...' : 'Sí, Eliminar'}
          </GlassButton>
        </div>
      </div>
    </div>
  )
}
