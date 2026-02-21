// ============================================
// VERIFIED PAYMENT CARD
// ============================================

import { ClickableAvatar } from '@/features/users'
import { CheckCircle, Edit, Eye, FileText, Trash2 } from 'lucide-react'
import type { Payment } from '../types/payment.types'

interface VerifiedPaymentCardProps {
  payment: Payment
  onViewDetail: (payment: Payment) => void
  onEdit: (payment: Payment) => void
  onDelete: (payment: Payment) => void
}

export const VerifiedPaymentCard = ({
  payment,
  onViewDetail,
  onEdit,
  onDelete,
}: VerifiedPaymentCardProps) => {
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
    <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(34,197,94,0.3)] rounded-lg p-4 hover:border-[rgba(34,197,94,0.5)] transition-all">
      {/* Badge verificado */}
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[rgba(34,197,94,0.15)] text-[#4ade80] text-xs rounded-full border border-[rgba(34,197,94,0.3)]">
          <CheckCircle size={12} />
          {payment.estadoPago}
        </span>
        <span className="text-xs text-[#9ca3af]">{formatDate(payment.fechaPago)}</span>
      </div>

      {/* Alumno y Monto */}
      <div className="flex items-center gap-3 mb-3">
        <ClickableAvatar
          userId={payment.idAlumno}
          userType="alumno"
          nombre={payment.nombreAlumno}
          size="md"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-[#f9fafb] font-medium text-sm truncate">{payment.nombreAlumno}</h4>
          <div className="text-xl font-bold text-[#4ade80]">{formatCurrency(payment.montoTotal)}</div>
        </div>
      </div>

      {/* Método */}
      <div className="flex items-center gap-2 text-xs text-[#9ca3af] mb-3">
        <span className="text-base">{getMethodIcon(payment.nombreMetodoPago)}</span>
        <span>{payment.nombreMetodoPago}</span>
        {payment.referenciaTransferencia && (
          <>
            <span>•</span>
            <span className="font-mono">{payment.referenciaTransferencia}</span>
          </>
        )}
      </div>

      {/* Paquetes */}
      {payment.cantidadPaquetes > 0 && (
        <div className="text-xs text-[#9ca3af] mb-3">
          <FileText size={12} className="inline mr-1" />
          {payment.cantidadPaquetes} paquete(s)
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-2 pt-3 border-t border-[rgba(64,64,64,0.3)]">
        <button
          onClick={() => onViewDetail(payment)}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-[rgba(59,130,246,0.15)] hover:bg-[rgba(59,130,246,0.25)] text-[#60a5fa] rounded text-xs transition-all"
        >
          <Eye size={14} />
          Ver
        </button>
        <button
          onClick={() => onEdit(payment)}
          className="flex items-center justify-center px-2 py-1.5 bg-[rgba(156,163,175,0.15)] hover:bg-[rgba(156,163,175,0.25)] text-[#9ca3af] rounded transition-all"
        >
          <Edit size={14} />
        </button>
        <button
          onClick={() => onDelete(payment)}
          className="flex items-center justify-center px-2 py-1.5 bg-[rgba(239,68,68,0.15)] hover:bg-[rgba(239,68,68,0.25)] text-[#ef4444] rounded transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
