// ============================================
// VERIFY PAYMENT MODAL
// ============================================

import { Check, MessageSquare, X, ZoomIn } from 'lucide-react'
import { useState } from 'react'
import { useVerifyPaymentMutation } from '../api/paymentsQueries'
import type { Payment } from '../types/payment.types'

interface VerifyPaymentModalProps {
  payment: Payment | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const VerifyPaymentModal = ({ payment, isOpen, onClose, onSuccess }: VerifyPaymentModalProps) => {
  const [nota, setNota] = useState('')
  const [notificarAlumno, setNotificarAlumno] = useState(true)
  const [showFullImage, setShowFullImage] = useState(false)

  const verifyMutation = useVerifyPaymentMutation()

  if (!isOpen || !payment) return null

  const handleVerify = async (accion: 'aprobar' | 'rechazar') => {
    try {
      await verifyMutation.mutateAsync({
        idPago: payment.idPago,
        accion,
        nota: nota || undefined,
        notificarAlumno,
      })
      onSuccess?.()
      onClose()
      setNota('')
    } catch (error) {
      console.error('Error verificando pago:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[rgba(26,26,26,0.98)] border border-[rgba(64,64,64,0.3)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-[rgba(26,26,26,0.98)] border-b border-[rgba(64,64,64,0.3)] p-6 flex items-center justify-between">
            <h2 className="text-[#f9fafb] text-2xl font-semibold">🔍 Verificar Pago</h2>
            <button
              onClick={onClose}
              className="text-[#9ca3af] hover:text-[#f9fafb] transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Datos del Pago */}
            <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(64,64,64,0.3)] rounded-lg p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-[rgba(201,52,72,0.15)] border-2 border-[rgba(201,52,72,0.3)] flex items-center justify-center text-[#c93448] text-2xl font-bold">
                  {payment.nombreAlumno.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-[#f9fafb] text-xl font-semibold">{payment.nombreAlumno}</h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[#9ca3af]">Monto:</span>
                  <p className="text-[#f9fafb] text-2xl font-bold mt-1">{formatCurrency(payment.montoTotal)}</p>
                </div>
                <div>
                  <span className="text-[#9ca3af]">Método:</span>
                  <p className="text-[#f9fafb] font-medium mt-1">{payment.nombreMetodoPago}</p>
                </div>
                <div>
                  <span className="text-[#9ca3af]">Fecha:</span>
                  <p className="text-[#f9fafb] font-medium mt-1">
                    {new Date(payment.fechaPago).toLocaleDateString('es-CO', {
                      dateStyle: 'long',
                    })}
                  </p>
                </div>
                {payment.referenciaTransferencia && (
                  <div>
                    <span className="text-[#9ca3af]">Referencia:</span>
                    <p className="text-[#f9fafb] font-mono mt-1">{payment.referenciaTransferencia}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Comprobante */}
            {payment.urlComprobante && (
              <div>
                <label className="block text-[#f9fafb] text-sm font-medium mb-2">Comprobante</label>
                <div className="relative group">
                  <img
                    src={payment.urlComprobante}
                    alt="Comprobante de pago"
                    className="w-full rounded-lg border border-[rgba(255,255,255,0.1)] cursor-pointer hover:border-[#c93448] transition-colors"
                  />
                  <button
                    onClick={() => setShowFullImage(true)}
                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ZoomIn size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Paquetes Asociados */}
            {payment.cantidadPaquetes > 0 && (
              <div>
                <label className="block text-[#f9fafb] text-sm font-medium mb-2">
                  Paquetes Asociados
                </label>
                <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(64,64,64,0.3)] rounded-lg p-3">
                  <p className="text-[#f9fafb]">{payment.cantidadPaquetes} paquete(s) registrado(s)</p>
                </div>
              </div>
            )}

            {/* Nota */}
            <div>
              <label className="block text-[#f9fafb] text-sm font-medium mb-2">
                Nota de Verificación (opcional)
              </label>
              <textarea
                rows={3}
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#f9fafb] focus:outline-none focus:border-[#c93448] transition-colors resize-none"
                placeholder="Ej: Comprobante validado con el banco..."
              />
            </div>

            {/* Notificar Alumno */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={notificarAlumno}
                onChange={(e) => setNotificarAlumno(e.target.checked)}
                className="w-5 h-5 rounded border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.05)] checked:bg-[#c93448] checked:border-[#c93448] focus:ring-2 focus:ring-[rgba(201,52,72,0.3)] transition-all"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 text-[#f9fafb] group-hover:text-[#c93448] transition-colors">
                  <MessageSquare size={18} />
                  <span className="font-medium">Notificar al alumno por WhatsApp</span>
                </div>
                <p className="text-[#9ca3af] text-xs mt-0.5">
                  Se enviará un mensaje confirmando la recepción del pago
                </p>
              </div>
            </label>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => handleVerify('rechazar')}
                disabled={verifyMutation.isPending}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[rgba(239,68,68,0.15)] hover:bg-[rgba(239,68,68,0.25)] text-[#ef4444] border border-[rgba(239,68,68,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={18} />
                Rechazar
              </button>
              <button
                onClick={() => handleVerify('aprobar')}
                disabled={verifyMutation.isPending}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#10b981] hover:bg-[#059669] text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check size={18} />
                {verifyMutation.isPending ? 'Verificando...' : 'Aprobar Pago'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de imagen completa */}
      {showFullImage && payment.urlComprobante && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4"
          onClick={() => setShowFullImage(false)}
        >
          <img
            src={payment.urlComprobante}
            alt="Comprobante completo"
            className="max-w-full max-h-full object-contain"
          />
          <button
            onClick={() => setShowFullImage(false)}
            className="absolute top-4 right-4 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all"
          >
            <X size={24} />
          </button>
        </div>
      )}
    </>
  )
}
