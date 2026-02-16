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
    <div className="mb-6 sm:mb-8">
      <h1 className="text-[#f9fafb] text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Mis Pagos</h1>
      <p className="text-[#9ca3af] text-sm sm:text-base md:text-lg mb-4 sm:mb-6">
        Historial completo de tus pagos y paquetes adquiridos
      </p>

      {/* Mini Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Total Pagado */}
        <GlassPanel className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 rounded-lg bg-[rgba(16,185,129,0.1)] flex-shrink-0">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-[#10b981]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[#9ca3af] text-xs sm:text-sm">Total Pagado</p>
              {isLoading ? (
                <div className="h-6 sm:h-7 w-20 sm:w-24 bg-[rgba(255,255,255,0.05)] rounded animate-pulse" />
              ) : (
                <p className="text-[#f9fafb] text-xl sm:text-2xl font-bold truncate">
                  {formatearMonto(stats.totalPagado)}
                </p>
              )}
            </div>
          </div>
        </GlassPanel>

        {/* Cantidad de Pagos */}
        <GlassPanel className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 rounded-lg bg-[rgba(59,130,246,0.1)] flex-shrink-0">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-[#3b82f6]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[#9ca3af] text-xs sm:text-sm">Pagos Realizados</p>
              {isLoading ? (
                <div className="h-6 sm:h-7 w-12 sm:w-16 bg-[rgba(255,255,255,0.05)] rounded animate-pulse" />
              ) : (
                <p className="text-[#f9fafb] text-xl sm:text-2xl font-bold">{stats.cantidadPagos}</p>
              )}
            </div>
          </div>
        </GlassPanel>

        {/* Promedio */}
        <GlassPanel className="p-3 sm:p-4 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 rounded-lg bg-[rgba(139,92,246,0.1)] flex-shrink-0">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#8b5cf6]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[#9ca3af] text-xs sm:text-sm">Promedio por Pago</p>
              {isLoading ? (
                <div className="h-6 sm:h-7 w-20 sm:w-24 bg-[rgba(255,255,255,0.05)] rounded animate-pulse" />
              ) : (
                <p className="text-[#f9fafb] text-xl sm:text-2xl font-bold truncate">
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
