// ============================================
// STUDENT PAYMENTS PAGE
// ============================================

import { AmbientGlows } from '@/design-system/decorative/AmbientGlows'
import { useAuth } from '@/features/auth'
import { useMyPaymentsQuery, usePaymentStats } from '@/features/payments/alumno/api/paymentsQueries'
import {
    EmptyStatePayments,
    Pagination,
    PaymentCard,
    PaymentsFilters,
    PaymentsHeader,
} from '@/features/payments/alumno/components'
import type { PaymentFilters } from '@/features/payments/alumno/types/payments.types'
import { exportarPagoPDF } from '@/features/payments/alumno/utils/pdfExport'
import { useState } from 'react'
import { toast } from 'sonner'

export const StudentPaymentsPage = () => {
  const { session } = useAuth()

  const [filters, setFilters] = useState<PaymentFilters>({
    pageNumber: 1,
    pageSize: 10,
  })

  const { data: payments, isLoading, error } = useMyPaymentsQuery(
    filters,
    session.isAuthenticated
  )

  const stats = usePaymentStats(payments)

  const handleExportPDF = async (idPago: string) => {
    try {
      // Buscar el detalle del pago en cache o hacer fetch
      const pago = payments?.items.find((p) => p.idPago === idPago)
      if (!pago) {
        toast.error('No se pudo encontrar el pago')
        return
      }

      // Obtener detalle completo
      const response = await fetch(`/api/pagos/${idPago}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!response.ok) throw new Error('Error al obtener detalle del pago')

      const detalle = await response.json()
      await exportarPagoPDF(detalle)
      toast.success('PDF descargado correctamente')
    } catch (error) {
      console.error('Error al exportar PDF:', error)
      toast.error('Error al generar el PDF')
    }
  }

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, pageNumber: newPage }))
  }

  const handlePageSizeChange = (newSize: number) => {
    setFilters((prev) => ({ ...prev, pageSize: newSize, pageNumber: 1 }))
  }

  if (!session.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f1419] flex items-center justify-center">
        <p className="text-[#9ca3af] text-lg">Por favor inicia sesión</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f1419] py-4 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <div className="h-8 sm:h-10 w-40 sm:w-48 bg-[rgba(255,255,255,0.05)] rounded animate-pulse mb-3 sm:mb-4" />
            <div className="h-5 sm:h-6 w-64 sm:w-96 bg-[rgba(255,255,255,0.05)] rounded animate-pulse mb-4 sm:mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 sm:h-24 bg-[rgba(255,255,255,0.05)] rounded-lg animate-pulse"
                />
              ))}
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 sm:h-32 bg-[rgba(255,255,255,0.05)] rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f1419] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#ef4444] text-xl mb-4">Error al cargar los pagos</p>
          <p className="text-[#9ca3af]">Por favor, intenta nuevamente</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f1419] py-4 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient Glows */}
      <AmbientGlows variant="warm" />

      {/* Typography Backdrop */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden">
        <div className="text-[200px] font-bold text-white absolute top-20 -left-20 rotate-[-15deg]">
          PAGOS
        </div>
        <div className="text-[150px] font-bold text-white absolute bottom-20 -right-20 rotate-[15deg]">
          HISTORIAL
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header con Estadísticas */}
        <PaymentsHeader stats={stats} isLoading={isLoading} />

        {/* Filtros */}
        <PaymentsFilters filters={filters} onFiltersChange={setFilters} />

        {/* Lista de Pagos */}
        {!payments || payments.items.length === 0 ? (
          <EmptyStatePayments />
        ) : (
          <>
            <div className="space-y-4">
              {payments.items.map((pago) => (
                <PaymentCard
                  key={pago.idPago}
                  pago={pago}
                  onExportPDF={handleExportPDF}
                />
              ))}
            </div>

            {/* Paginación */}
            {payments.totalPages > 1 && (
              <Pagination
                currentPage={payments.pageNumber}
                totalPages={payments.totalPages}
                pageSize={filters.pageSize}
                totalCount={payments.totalCount}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
