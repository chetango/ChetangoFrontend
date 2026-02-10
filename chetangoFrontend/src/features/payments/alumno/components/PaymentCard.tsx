// ============================================
// PAYMENT CARD COMPONENT (Expandible)
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { ChevronDown, ChevronUp, Download, FileText } from 'lucide-react'
import { useState } from 'react'
import { usePaymentDetailQuery } from '../api/paymentsQueries'
import type { PagoResumen } from '../types/payments.types'
import {
    formatearFechaPago,
    formatearMonto,
    getEstadoPagoBadge,
    getMetodoPagoIcono,
    obtenerTiempoRelativo,
} from '../utils/paymentsUtils'
import { PaquetesTable } from './PaquetesTable'

interface PaymentCardProps {
  pago: PagoResumen
  onExportPDF: (idPago: string) => void
}

export const PaymentCard = ({ pago, onExportPDF }: PaymentCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { data: detalle, isLoading: isLoadingDetalle } = usePaymentDetailQuery(
    pago.idPago,
    isExpanded
  )

  const badge = getEstadoPagoBadge(pago.estadoPago)
  const icono = getMetodoPagoIcono(pago.nombreMetodoPago)

  return (
    <div className="mb-4">
      {/* Card Header - Siempre Visible */}
      <GlassPanel className="overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-5 text-left hover:bg-[rgba(255,255,255,0.02)] transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{icono}</span>
                <div>
                  <p className="text-[#f9fafb] text-lg font-semibold">
                    {formatearFechaPago(pago.fechaPago)}
                  </p>
                  <p className="text-[#9ca3af] text-sm">
                    {obtenerTiempoRelativo(pago.fechaPago)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <span className="text-[#9ca3af] text-sm">Método:</span>
                  <span className="text-[#d1d5db] text-sm ml-1 font-medium">
                    {pago.nombreMetodoPago}
                  </span>
                </div>

                <div>
                  <span className="text-[#9ca3af] text-sm">Paquetes:</span>
                  <span className="text-[#d1d5db] text-sm ml-1 font-medium">
                    {pago.cantidadPaquetes}
                  </span>
                </div>

                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${badge.color} ${badge.bgColor}`}
                >
                  {badge.label}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 ml-4">
              <div className="text-right">
                <p className="text-[#9ca3af] text-sm">Monto Total</p>
                <p className="text-[#f9fafb] text-2xl font-bold">
                  {formatearMonto(pago.montoTotal)}
                </p>
              </div>

              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-[#9ca3af]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#9ca3af]" />
              )}
            </div>
          </div>
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="px-5 pb-5 border-t border-[rgba(255,255,255,0.1)] pt-5">
            {isLoadingDetalle ? (
              <div className="space-y-3">
                <div className="h-8 bg-[rgba(255,255,255,0.05)] rounded animate-pulse" />
                <div className="h-32 bg-[rgba(255,255,255,0.05)] rounded animate-pulse" />
              </div>
            ) : detalle ? (
              <>
                {/* Título Sección */}
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-[#8b5cf6]" />
                  <h3 className="text-[#f9fafb] text-lg font-semibold">
                    Paquetes Generados
                  </h3>
                </div>

                {/* Tabla de Paquetes */}
                <div className="mb-4 rounded-lg bg-[rgba(255,255,255,0.02)] p-4">
                  <PaquetesTable paquetes={detalle.paquetes} />
                </div>

                {/* Información Adicional */}
                {(detalle.nota ||
                  detalle.referenciaTransferencia ||
                  detalle.notasVerificacion) && (
                  <div className="rounded-lg bg-[rgba(255,255,255,0.02)] p-4 mb-4">
                    <h4 className="text-[#f9fafb] font-medium mb-3">
                      Información del Pago
                    </h4>

                    {detalle.nota && (
                      <div className="mb-2">
                        <span className="text-[#9ca3af] text-sm">Nota:</span>
                        <p className="text-[#d1d5db] text-sm mt-1">{detalle.nota}</p>
                      </div>
                    )}

                    {detalle.referenciaTransferencia && (
                      <div className="mb-2">
                        <span className="text-[#9ca3af] text-sm">
                          Referencia de Transferencia:
                        </span>
                        <p className="text-[#d1d5db] text-sm mt-1 font-mono">
                          {detalle.referenciaTransferencia}
                        </p>
                      </div>
                    )}

                    {detalle.notasVerificacion && (
                      <div>
                        <span className="text-[#9ca3af] text-sm">
                          Notas de Verificación:
                        </span>
                        <p className="text-[#d1d5db] text-sm mt-1">
                          {detalle.notasVerificacion}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Botones de Acción */}
                <div className="flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onExportPDF(pago.idPago)
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(139,92,246,0.1)] hover:bg-[rgba(139,92,246,0.2)] border border-[rgba(139,92,246,0.2)] text-[#8b5cf6] transition-all duration-300"
                  >
                    <Download className="w-4 h-4" />
                    Exportar PDF
                  </button>

                  {detalle.urlComprobante && (
                    <a
                      href={detalle.urlComprobante}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(16,185,129,0.1)] hover:bg-[rgba(16,185,129,0.2)] border border-[rgba(16,185,129,0.2)] text-[#10b981] transition-all duration-300"
                    >
                      <Download className="w-4 h-4" />
                      Descargar Comprobante
                    </a>
                  )}
                </div>
              </>
            ) : (
              <p className="text-[#9ca3af] text-center py-4">
                Error al cargar detalles del pago
              </p>
            )}
          </div>
        )}
      </GlassPanel>
    </div>
  )
}
