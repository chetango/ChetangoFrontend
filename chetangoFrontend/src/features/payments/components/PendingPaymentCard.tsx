// ============================================
// PENDING PAYMENT CARD
// ============================================

import { ClickableAvatar } from '@/features/users'
import { Check, Clock, Eye, FileText, X } from 'lucide-react'
import type { Payment } from '../types/payment.types'

interface PendingPaymentCardProps {
  payment: Payment
  onVerify: (payment: Payment) => void
  onReject: (payment: Payment) => void
  onViewDetail: (payment: Payment) => void
}

export const PendingPaymentCard = ({
  payment,
  onVerify,
  onReject,
  onViewDetail,
}: PendingPaymentCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'transferencia':
        return '🏦'
      case 'efectivo':
        return '💵'
      case 'qr':
        return '📱'
      default:
        return '💳'
    }
  }

  return (
    <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(245,158,11,0.3)] rounded-lg p-4 hover:border-[rgba(245,158,11,0.5)] transition-all group">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <ClickableAvatar
          userId={payment.idAlumno}
          userType="alumno"
          nombre={payment.nombreAlumno}
          size="md"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-[#f9fafb] font-medium truncate">{payment.nombreAlumno}</h3>
          <div className="flex items-center gap-2 text-xs text-[#9ca3af]">
            <Clock size={12} />
            <span>{formatDate(payment.fechaPago)}</span>
          </div>
        </div>
      </div>

      {/* Monto */}
      <div className="mb-3">
        <div className="text-2xl font-bold text-[#f9fafb]">{formatCurrency(payment.montoTotal)}</div>
        <div className="flex items-center gap-2 text-sm text-[#9ca3af] mt-1">
          <span className="text-lg">{getMethodIcon(payment.nombreMetodoPago)}</span>
          <span>{payment.nombreMetodoPago}</span>
        </div>
      </div>

      {/* Referencia */}
      {payment.referenciaTransferencia && (
        <div className="mb-3 p-2 bg-[rgba(255,255,255,0.05)] rounded text-xs">
          <span className="text-[#9ca3af]">Ref:</span>{' '}
          <span className="text-[#f9fafb] font-mono">{payment.referenciaTransferencia}</span>
        </div>
      )}

      {/* Comprobante */}
      {payment.urlComprobante && (
        <div className="mb-3">
          <img
            src={payment.urlComprobante}
            alt="Comprobante"
            className="w-full h-32 object-cover rounded border border-[rgba(255,255,255,0.1)] cursor-pointer hover:border-[#c93448] transition-colors"
            onClick={() => onViewDetail(payment)}
          />
        </div>
      )}

      {/* Paquetes */}
      {payment.cantidadPaquetes > 0 && (
        <div className="mb-3 text-xs text-[#9ca3af]">
          <FileText size={12} className="inline mr-1" />
          {payment.cantidadPaquetes} paquete(s) asociado(s)
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-2 pt-3 border-t border-[rgba(64,64,64,0.3)]">
        <button
          onClick={() => onViewDetail(payment)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[rgba(59,130,246,0.15)] hover:bg-[rgba(59,130,246,0.25)] text-[#60a5fa] rounded-lg transition-all text-sm"
        >
          <Eye size={16} />
          Ver
        </button>
        <button
          onClick={() => onVerify(payment)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[rgba(34,197,94,0.15)] hover:bg-[rgba(34,197,94,0.25)] text-[#4ade80] rounded-lg transition-all text-sm"
        >
          <Check size={16} />
          Aprobar
        </button>
        <button
          onClick={() => onReject(payment)}
          className="flex items-center justify-center px-3 py-2 bg-[rgba(239,68,68,0.15)] hover:bg-[rgba(239,68,68,0.25)] text-[#ef4444] rounded-lg transition-all"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
