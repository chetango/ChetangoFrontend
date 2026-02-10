// ============================================
// PAYMENTS HEADER COMPONENT
// ============================================

import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { DollarSign, FileText, TrendingUp } from 'lucide-react'
import type { PaymentStats } from '../types/payments.types'
import { formatearMonto } from '../utils/paymentsUtils'

interface PaymentsHeaderProps {
  stats: PaymentStats
  isLoading?: boolean
}

export const PaymentsHeader = ({ stats, isLoading }: PaymentsHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-[#f9fafb] text-3xl font-bold mb-2">Mis Pagos</h1>
      <p className="text-[#9ca3af] text-lg mb-6">
        Historial completo de tus pagos y paquetes adquiridos
      </p>

      {/* Mini Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Pagado */}
        <GlassPanel className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-[rgba(16,185,129,0.1)]">
              <DollarSign className="w-6 h-6 text-[#10b981]" />
            </div>
            <div>
              <p className="text-[#9ca3af] text-sm">Total Pagado</p>
              {isLoading ? (
                <div className="h-7 w-24 bg-[rgba(255,255,255,0.05)] rounded animate-pulse" />
              ) : (
                <p className="text-[#f9fafb] text-2xl font-bold">
                  {formatearMonto(stats.totalPagado)}
                </p>
              )}
            </div>
          </div>
        </GlassPanel>

        {/* Cantidad de Pagos */}
        <GlassPanel className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-[rgba(59,130,246,0.1)]">
              <FileText className="w-6 h-6 text-[#3b82f6]" />
            </div>
            <div>
              <p className="text-[#9ca3af] text-sm">Pagos Realizados</p>
              {isLoading ? (
                <div className="h-7 w-16 bg-[rgba(255,255,255,0.05)] rounded animate-pulse" />
              ) : (
                <p className="text-[#f9fafb] text-2xl font-bold">{stats.cantidadPagos}</p>
              )}
            </div>
          </div>
        </GlassPanel>

        {/* Promedio */}
        <GlassPanel className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-[rgba(139,92,246,0.1)]">
              <TrendingUp className="w-6 h-6 text-[#8b5cf6]" />
            </div>
            <div>
              <p className="text-[#9ca3af] text-sm">Promedio por Pago</p>
              {isLoading ? (
                <div className="h-7 w-24 bg-[rgba(255,255,255,0.05)] rounded animate-pulse" />
              ) : (
                <p className="text-[#f9fafb] text-2xl font-bold">
                  {formatearMonto(stats.promedioMonto)}
                </p>
              )}
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  )
}
