// ============================================
// PAYMENT DETAIL MODAL - CHETANGO ADMIN
// Requirements: 9.3, 9.4, 9.5, 9.6, 12.4
// ============================================

import { GlassButton } from '@/design-system/atoms/GlassButton'
import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { Skeleton } from '@/design-system/atoms/Skeleton'
import { CreditCard, Edit2, Package, User, X } from 'lucide-react'
import type { PaymentDetail } from '../types/payment.types'
import type { PagoDetalleDTO, PaquetePagoDTO } from '../types/paymentTypes'
import { PackageStatusBadge } from './PackageStatusBadge'

interface PaymentDetailModalProps {
  pago: PaymentDetail | PagoDetalleDTO | undefined
  isLoading?: boolean
  isOpen: boolean
  formatCurrency: (amount: number) => string
  onClose: () => void
  onEdit: () => void
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

const hasNota = (pago: PaymentDetail | PagoDetalleDTO): pago is PagoDetalleDTO => {
  return 'nota' in pago
}

const hasPaquetes = (pago: PaymentDetail | PagoDetalleDTO): pago is PagoDetalleDTO => {
  return 'paquetes' in pago && Array.isArray((pago as PagoDetalleDTO).paquetes)
}

/**
 * Modal displaying detailed payment information
 *
 * Requirements:
 * - 9.3: Display sections: Información del Pago, Información del Alumno
 * - 9.4: Display Paquetes Generados with details
 * - 9.5: Show estado badge for each paquete
 * - 9.6: Buttons: Editar Pago, Cerrar
 * - 12.4: Skeleton loader during loading
 */
export function PaymentDetailModal({
  pago,
  isLoading = false,
  isOpen,
  formatCurrency,
  onClose,
  onEdit,
}: PaymentDetailModalProps) {
  if (!isOpen) return null

  const paquetes: PaquetePagoDTO[] = pago && hasPaquetes(pago) ? pago.paquetes : []
  const pagoNota = pago && hasNota(pago) ? pago.nota : null

  const alumnosInfo: Array<[string, string | null]> = paquetes.length
    ? Array.from(new Map(paquetes.map((paquete) => [paquete.idAlumno, paquete.nombreAlumno])).entries())
    : pago && pago.nombreAlumno
    ? [[pago.idPago, pago.nombreAlumno]]
    : []

  return (
    <div className="absolute inset-0 z-[100] flex items-start justify-center pt-20 px-4 pb-8 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm -z-10"
        onClick={onClose}
      />

      {/* Modal */}
      <GlassPanel className="relative z-10 w-full max-w-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#f9fafb] text-xl font-semibold">
            Detalle del Pago
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

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-20 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
          </div>
        ) : pago ? (
          <div className="space-y-6">
            {/* Información del Pago */}
            <section>
              <h3 className="text-[#9ca3af] text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Información del Pago
              </h3>
              <div className="bg-white/5 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#9ca3af]">Fecha</span>
                  <span className="text-[#f9fafb]">
                    {formatDate(pago.fechaPago)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9ca3af]">Monto</span>
                  <span className="text-[#34d399] font-semibold">
                    {formatCurrency(pago.montoTotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9ca3af]">Método</span>
                  <span className="text-[#f9fafb]">{pago.nombreMetodoPago}</span>
                </div>
                {pagoNota && (
                  <div>
                    <span className="text-[#9ca3af] block mb-1">Nota</span>
                    <p className="text-[#f9fafb] text-sm bg-white/5 rounded p-2">
                      {pagoNota}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Información del Alumno */}
            <section>
              <h3 className="text-[#9ca3af] text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                {alumnosInfo.length > 1 ? 'Información de Alumnos' : 'Información del Alumno'}
              </h3>
              <div className="bg-white/5 rounded-lg p-4 space-y-2">
                {alumnosInfo.length ? (
                  alumnosInfo.map(([idAlumno, nombreAlumno], index) => {
                    const key = idAlumno || `alumno-${index}`
                    const paquetesAlumno = paquetes.filter((p) => p.idAlumno === idAlumno)
                    return (
                      <div key={key} className="pb-2 last:pb-0 border-b border-white/5 last:border-0">
                        <div className="flex items-center gap-2 text-[#f9fafb] font-medium">
                          <User className="w-4 h-4 text-[#c93448]" />
                          {nombreAlumno || 'Alumno sin nombre'}
                        </div>
                        {paquetes.length > 0 && (
                          <div className="text-xs text-[#9ca3af] mt-1 ml-6">
                            {paquetesAlumno.length} paquete(s)
                          </div>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <p className="text-[#9ca3af] text-sm">Sin información de alumnos</p>
                )}
              </div>
            </section>

            {/* Paquetes Generados */}
            <section>
              <h3 className="text-[#9ca3af] text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Paquetes Generados ({paquetes.length})
              </h3>
              <div className="space-y-2">
                {paquetes.length ? (
                  paquetes.map((paquete) => (
                    <div
                      key={paquete.idPaquete}
                      className="bg-white/5 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="w-3 h-3 text-[#c93448]" />
                            <span className="text-[#9ca3af] text-xs">{paquete.nombreAlumno}</span>
                          </div>
                          <span className="text-[#f9fafb] font-medium">
                            {paquete.nombreTipoPaquete}
                          </span>
                        </div>
                        <PackageStatusBadge estado={paquete.estado} />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-[#6b7280]">Clases: </span>
                          <span className="text-[#f9fafb]">
                            {paquete.clasesRestantes}/{paquete.clasesDisponibles}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#6b7280]">Valor: </span>
                          <span className="text-[#34d399]">
                            {formatCurrency(paquete.valorPaquete)}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[#6b7280]">Vence: </span>
                          <span className="text-[#f9fafb]">
                            {formatDate(paquete.fechaVencimiento)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[#9ca3af] text-sm">No se registraron paquetes para este pago.</p>
                )}
              </div>
            </section>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <GlassButton
                variant="ghost"
                onClick={onClose}
                className="flex-1"
              >
                Cerrar
              </GlassButton>
              <GlassButton
                variant="primary"
                onClick={onEdit}
                className="flex-1"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Editar Pago
              </GlassButton>
            </div>
          </div>
        ) : (
          <p className="text-[#9ca3af] text-center py-8">
            No se encontró el pago
          </p>
        )}
      </GlassPanel>
    </div>
  )
}
