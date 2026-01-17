// ============================================
// PAYMENT STATS CARDS - CHETANGO ADMIN
// Requirements: 3.2, 3.3, 3.4
// ============================================

import { DollarSign, CreditCard, Clock } from 'lucide-react'
import { StatCard } from '@/design-system/molecules/StatCard'
import { Skeleton } from '@/design-system/atoms/Skeleton'
import type { PaymentsStats } from '../types/paymentTypes'

interface PaymentStatsCardsProps {
  stats: PaymentsStats
  isLoading?: boolean
  formatCurrency: (amount: number) => string
}

/**
 * Displays payment statistics in 3 glassmorphism cards
 * - Pagos del Mes (green/success)
 * - Total Recaudado (red/primary)
 * - Pagos Hoy (yellow/warning)
 *
 * Requirements:
 * - 3.2: Display stats cards with pagos del mes, total recaudado
 * - 3.3: Use glassmorphism design with colors
 * - 3.4: Show badge with payments registered today
 */
export function PaymentStatsCards({
  stats,
  isLoading = false,
  formatCurrency,
}: PaymentStatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Pagos del Mes - Green/Success */}
      <StatCard
        icon={<CreditCard className="w-5 h-5" />}
        value={stats.pagosDelMes}
        label="PAGOS DEL MES"
        color="success"
      />

      {/* Total Recaudado - Red/Primary */}
      <StatCard
        icon={<DollarSign className="w-5 h-5" />}
        value={formatCurrency(stats.totalRecaudado)}
        label="TOTAL RECAUDADO"
        color="primary"
      />

      {/* Pagos Hoy - Yellow/Warning */}
      <div className="relative">
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          value={stats.pagosHoy}
          label="PAGOS HOY"
          color="warning"
        />
        {stats.pagosHoy > 0 && (
          <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            Hoy
          </span>
        )}
      </div>
    </div>
  )
}
