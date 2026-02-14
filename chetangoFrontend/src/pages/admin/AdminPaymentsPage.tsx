// ============================================
// PAYMENTS DASHBOARD - ADMIN
// ============================================

import { AlertCircle, CheckCircle, Clock, DollarSign, Plus, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { useUpdatePagoMutation } from '../../features/payments/api/paymentMutations'
import { useMetodosPagoQuery, usePagoDetailQuery } from '../../features/payments/api/paymentQueries'
import {
    useAllVerifiedPaymentsQuery,
    usePaymentStatsQuery,
    usePendingPaymentsQuery,
    useVerifiedPaymentsQuery,
} from '../../features/payments/api/paymentsQueries'
import { EditPaymentModal } from '../../features/payments/components/EditPaymentModal'
import { HistorialPagosAlumnosSection } from '../../features/payments/components/HistorialPagosAlumnosSection'
import { PaymentDetailModal } from '../../features/payments/components/PaymentDetailModal'
import { PendingPaymentCard } from '../../features/payments/components/PendingPaymentCard'
import { RegisterPaymentModal } from '../../features/payments/components/RegisterPaymentModal'
import { VerifiedPaymentCard } from '../../features/payments/components/VerifiedPaymentCard'
import { VerifyPaymentModal } from '../../features/payments/components/VerifyPaymentModal'
import type { Payment } from '../../features/payments/types/payment.types'
import type { EditarPagoRequest } from '../../features/payments/types/paymentTypes'

const AdminPaymentsPage = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  const { data: pendingPayments, isLoading: loadingPending, refetch: refetchPending } = usePendingPaymentsQuery()
  const { data: verifiedPayments, isLoading: loadingVerified, refetch: refetchVerified } = useVerifiedPaymentsQuery()
  const { data: stats, refetch: refetchStats } = usePaymentStatsQuery()
  const { data: allVerifiedPayments, isLoading: loadingRecent, refetch: refetchAllVerified } = useAllVerifiedPaymentsQuery()
  const { data: paymentDetail, isLoading: isLoadingDetail } = usePagoDetailQuery(selectedPayment?.idPago || '', !!selectedPayment?.idPago)
  const { data: metodosPago } = useMetodosPagoQuery()
  
  const updatePagoMutation = useUpdatePagoMutation()

  const handleVerifyClick = (payment: Payment) => {
    setSelectedPayment(payment)
    setIsVerifyModalOpen(true)
  }

  const handleRejectClick = (payment: Payment) => {
    setSelectedPayment(payment)
    setIsVerifyModalOpen(true)
  }

  const handleViewDetail = (payment: Payment) => {
    setSelectedPayment(payment)
    setIsDetailModalOpen(true)
  }

  const handleEditPayment = () => {
    setIsDetailModalOpen(false)
    setIsEditModalOpen(true)
  }

  const handleSubmitEdit = async (idPago: string, data: EditarPagoRequest) => {
    await updatePagoMutation.mutateAsync({ idPago, data })
    setIsEditModalOpen(false)
    refetchPending()
    refetchVerified()
    refetchAllVerified()
    refetchStats()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-[#f9fafb] text-3xl font-bold mb-2">💰 Gestión de Pagos</h1>
            <p className="text-[#9ca3af]">Verifica y administra los pagos de los alumnos</p>
          </div>
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#c93448] hover:bg-[#b02d3c] text-white rounded-lg font-medium transition-all"
          >
            <Plus size={20} />
            Registrar Pago
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(34,197,94,0.3)] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#9ca3af] text-sm">Ingresos Hoy</span>
                <DollarSign className="text-[#4ade80]" size={20} />
              </div>
              <p className="text-[#f9fafb] text-2xl font-bold">{formatCurrency(stats.totalIngresos)}</p>
              <p className="text-[#4ade80] text-xs mt-1">
                {stats.totalPagosHoy} pago(s) registrado(s)
              </p>
            </div>

            <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(245,158,11,0.3)] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#9ca3af] text-sm">Pendientes</span>
                <Clock className="text-[#fbbf24]" size={20} />
              </div>
              <p className="text-[#f9fafb] text-2xl font-bold">{stats.totalPendientesVerificacion}</p>
              <p className="text-[#fbbf24] text-xs mt-1">
                Requieren verificación
              </p>
            </div>

            <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(59,130,246,0.3)] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#9ca3af] text-sm">Verificados Hoy</span>
                <CheckCircle className="text-[#60a5fa]" size={20} />
              </div>
              <p className="text-[#f9fafb] text-2xl font-bold">{stats.totalVerificadosHoy}</p>
              <p className="text-[#60a5fa] text-xs mt-1">
                Pagos confirmados
              </p>
            </div>

            <div className="bg-[rgba(64,64,64,0.2)] border border-[rgba(139,92,246,0.3)] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#9ca3af] text-sm">Mes Actual</span>
                <TrendingUp className="text-[#a78bfa]" size={20} />
              </div>
              <p className="text-[#f9fafb] text-2xl font-bold">{formatCurrency(stats.ingresosMesActual)}</p>
              <p className={`text-xs mt-1 ${stats.comparacionMesAnterior >= 0 ? 'text-[#4ade80]' : 'text-[#ef4444]'}`}>
                {stats.comparacionMesAnterior >= 0 ? '+' : ''}{stats.comparacionMesAnterior.toFixed(1)}% vs mes anterior
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Dashboard Kanban */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna 1: Pendientes de Verificación */}
        <div className="bg-[rgba(26,26,26,0.5)] border border-[rgba(245,158,11,0.3)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-[#fbbf24]" size={20} />
            <h2 className="text-[#f9fafb] text-lg font-semibold">Pendientes</h2>
            <span className="ml-auto bg-[rgba(245,158,11,0.15)] text-[#fbbf24] px-2 py-1 rounded-full text-sm font-medium">
              {pendingPayments?.length || 0}
            </span>
          </div>

          <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
            {loadingPending ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-[#fbbf24]/30 border-t-[#fbbf24] rounded-full animate-spin" />
              </div>
            ) : pendingPayments && pendingPayments.length > 0 ? (
              pendingPayments.map((payment) => (
                <PendingPaymentCard
                  key={payment.idPago}
                  payment={payment}
                  onVerify={handleVerifyClick}
                  onReject={handleRejectClick}
                  onViewDetail={handleViewDetail}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto text-[#6b7280] mb-3" size={48} />
                <p className="text-[#9ca3af]">No hay pagos pendientes</p>
                <p className="text-[#6b7280] text-sm mt-1">Los pagos por verificar aparecerán aquí</p>
              </div>
            )}
          </div>
        </div>

        {/* Columna 2: Verificados Hoy */}
        <div className="bg-[rgba(26,26,26,0.5)] border border-[rgba(34,197,94,0.3)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="text-[#4ade80]" size={20} />
            <h2 className="text-[#f9fafb] text-lg font-semibold">Verificados Hoy</h2>
            <span className="ml-auto bg-[rgba(34,197,94,0.15)] text-[#4ade80] px-2 py-1 rounded-full text-sm font-medium">
              {verifiedPayments?.length || 0}
            </span>
          </div>

          <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
            {loadingVerified ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-[#4ade80]/30 border-t-[#4ade80] rounded-full animate-spin" />
              </div>
            ) : verifiedPayments && verifiedPayments.length > 0 ? (
              verifiedPayments.map((payment) => (
                <VerifiedPaymentCard
                  key={payment.idPago}
                  payment={payment}
                  onViewDetail={handleViewDetail}
                  onEdit={(p) => console.log('Edit', p)}
                  onDelete={(p) => console.log('Delete', p)}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="mx-auto text-[#6b7280] mb-3" size={48} />
                <p className="text-[#9ca3af]">No hay pagos verificados hoy</p>
                <p className="text-[#6b7280] text-sm mt-1">Los pagos aprobados aparecerán aquí</p>
              </div>
            )}
          </div>
        </div>

        {/* Columna 3: Todos los Pagos (últimos) */}
        <div className="bg-[rgba(26,26,26,0.5)] border border-[rgba(64,64,64,0.3)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="text-[#9ca3af]" size={20} />
            <h2 className="text-[#f9fafb] text-lg font-semibold">Últimos Pagos</h2>
          </div>

          <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
            {loadingRecent ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-[#9ca3af]/30 border-t-[#9ca3af] rounded-full animate-spin" />
              </div>
            ) : allVerifiedPayments && allVerifiedPayments.length > 0 ? (
              allVerifiedPayments.slice(0, 10).map((payment) => (
                <VerifiedPaymentCard
                  key={payment.idPago}
                  payment={payment}
                  onViewDetail={handleViewDetail}
                  onEdit={(p) => console.log('Edit', p)}
                  onDelete={(p) => console.log('Delete', p)}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <DollarSign className="mx-auto text-[#6b7280] mb-3" size={48} />
                <p className="text-[#9ca3af]">No hay pagos registrados</p>
                <p className="text-[#6b7280] text-sm mt-1">Los pagos aparecerán aquí</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Historial de Pagos de Alumnos */}
      <HistorialPagosAlumnosSection
        pagos={allVerifiedPayments || []}
        isLoading={loadingRecent}
        formatCurrency={formatCurrency}
        onVerDetalle={handleViewDetail}
      />

      {/* Modals */}
      <RegisterPaymentModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={() => {
          // Refetch automático por React Query
        }}
      />

      <VerifyPaymentModal
        payment={selectedPayment}
        isOpen={isVerifyModalOpen}
        onClose={() => {
          setIsVerifyModalOpen(false)
          setSelectedPayment(null)
        }}
        onSuccess={() => {
          // Refetch manual para actualización inmediata
          refetchPending()
          refetchVerified()
          refetchAllVerified()
          refetchStats()
        }}
      />

      <PaymentDetailModal
        pago={paymentDetail}
        isLoading={isLoadingDetail}
        isOpen={isDetailModalOpen}
        formatCurrency={formatCurrency}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedPayment(null)
        }}
        onEdit={handleEditPayment}
      />

      <EditPaymentModal
        pago={paymentDetail}
        metodosPago={metodosPago || []}
        isOpen={isEditModalOpen}
        isSubmitting={updatePagoMutation.isPending}
        onClose={() => {
          setIsEditModalOpen(false)
        }}
        onSubmit={handleSubmitEdit}
      />
    </div>
  )
}

export default AdminPaymentsPage
