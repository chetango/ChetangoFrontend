// ============================================
// PAGO REALIZADO CARD - HISTORIAL DE NÓMINA
// ============================================

import { Calendar, CheckCircle, DollarSign, Eye } from 'lucide-react'
import type { LiquidacionMensual } from '../types/payroll.types'

interface PagoRealizadoCardProps {
  liquidacion: LiquidacionMensual
  onVerDetalle: (idLiquidacion: string) => void
  formatCurrency: (amount: number) => string
}

export const PagoRealizadoCard = ({
  liquidacion,
  onVerDetalle,
  formatCurrency,
}: PagoRealizadoCardProps) => {
  const mesNombre = new Date(0, liquidacion.mes - 1)
    .toLocaleString('es-CO', { month: 'long' })
    .charAt(0)
    .toUpperCase() +
    new Date(0, liquidacion.mes - 1)
      .toLocaleString('es-CO', { month: 'long' })
      .slice(1)

  const fechaPagoFormateada = liquidacion.fechaPago
    ? new Date(liquidacion.fechaPago).toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'N/A'

  return (
    <div className="bg-[rgba(26,26,26,0.7)] border border-[rgba(139,92,246,0.2)] rounded-lg p-3 hover:border-[rgba(139,92,246,0.4)] transition-colors">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-[#f9fafb] font-medium">{liquidacion.nombreProfesor}</h3>
          <p className="text-[#9ca3af] text-sm">
            {mesNombre} {liquidacion.año}
          </p>
        </div>
        <span className="text-xs bg-[rgba(139,92,246,0.15)] text-[#a78bfa] px-2 py-1 rounded-full flex items-center gap-1">
          <CheckCircle size={12} />
          Pagado
        </span>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div className="bg-[rgba(64,64,64,0.2)] rounded-lg p-2">
          <p className="text-[#9ca3af] mb-1">Clases</p>
          <p className="text-[#f9fafb] font-medium">{liquidacion.totalClases}</p>
        </div>
        <div className="bg-[rgba(64,64,64,0.2)] rounded-lg p-2">
          <p className="text-[#9ca3af] mb-1">Horas</p>
          <p className="text-[#f9fafb] font-medium">{liquidacion.totalHoras.toFixed(1)}h</p>
        </div>
      </div>

      {/* Total Pagado */}
      <div className="bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.2)] rounded-lg p-2 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#9ca3af] text-xs">
            <DollarSign size={14} />
            <span>Total Pagado</span>
          </div>
          <p className="text-[#a78bfa] font-bold text-lg">{formatCurrency(liquidacion.totalPagar)}</p>
        </div>
      </div>

      {/* Fecha de Pago */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-[rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-2 text-[#9ca3af] text-xs">
          <Calendar size={12} />
          <span>Fecha de pago</span>
        </div>
        <p className="text-[#f9fafb] text-xs font-medium">{fechaPagoFormateada}</p>
      </div>

      {/* Ver Detalle Button */}
      <button
        onClick={() => onVerDetalle(liquidacion.idLiquidacion)}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[rgba(139,92,246,0.1)] hover:bg-[rgba(139,92,246,0.2)] border border-[rgba(139,92,246,0.3)] rounded-lg text-[#a78bfa] text-sm font-medium transition-all"
      >
        <Eye size={16} />
        Ver Detalle
      </button>
    </div>
  )
}
