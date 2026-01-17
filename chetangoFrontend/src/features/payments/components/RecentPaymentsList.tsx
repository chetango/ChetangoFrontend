// ============================================
// RECENT PAYMENTS LIST - CHETANGO ADMIN
// Requirements: 3.5, 3.6, 11.3, 11.4, 11.5
// ============================================

import { CreditCard, ChevronRight } from 'lucide-react'
import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { Skeleton } from '@/design-system/atoms/Skeleton'
import type { PagoListItemDTO } from '../types/paymentTypes'

interface RecentPaymentsListProps {
  pagos: PagoListItemDTO[]
  isLoading?: boolean
  formatCurrency: (amount: number) => string
  onSelectPago: (idPago: string) => void
}

/**
 * Formats date to abbreviated format (e.g., "15 Ene")
 */
function formatDateShort(dateString: string): string {
  const date = new Date(dateString)
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  return `${date.getDate()} ${months[date.getMonth()]}`
}

/**
 * List of recent payments for the selected alumno
 *
 * Requirements:
 * - 3.5: Display list of recent payments with monto, tipo paquete, fecha
 * - 3.6: Scrollable if many payments
 * - 11.3: Display fechaPago, montoTotal, nombreMetodoPago, cantidadPaquetes
 * - 11.4: Scrollable with infinite scroll or pagination
 * - 11.5: Click to open PaymentDetailModal
 */
export function RecentPaymentsList({
  pagos,
  isLoading = false,
  formatCurrency,
  onSelectPago,
}: RecentPaymentsListProps) {
  if (isLoading) {
    return (
      <GlassPanel className="p-4">
        <h3 className="text-[#f9fafb] font-medium mb-3">Últimos Pagos</h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      </GlassPanel>
    )
  }

  if (pagos.length === 0) {
    return (
      <GlassPanel className="p-4">
        <h3 className="text-[#f9fafb] font-medium mb-3">Últimos Pagos</h3>
        <div className="text-center py-6">
          <CreditCard className="w-10 h-10 mx-auto text-[#6b7280] mb-2" />
          <p className="text-[#9ca3af]">No hay pagos recientes</p>
        </div>
      </GlassPanel>
    )
  }

  return (
    <GlassPanel className="p-4">
      <h3 className="text-[#f9fafb] font-medium mb-3">Últimos Pagos</h3>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {pagos.map((pago) => (
          <button
            key={pago.idPago}
            onClick={() => onSelectPago(pago.idPago)}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[#34d399] font-semibold">
                  {formatCurrency(pago.montoTotal)}
                </span>
                <span className="text-[#6b7280] text-xs">
                  {formatDateShort(pago.fechaPago)}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[#9ca3af] text-sm truncate">
                  {pago.nombreMetodoPago}
                </span>
                <span className="text-[#6b7280] text-xs">
                  {pago.cantidadPaquetes} paquete{pago.cantidadPaquetes !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#6b7280] group-hover:text-[#f9fafb] transition-colors" />
          </button>
        ))}
      </div>
    </GlassPanel>
  )
}
