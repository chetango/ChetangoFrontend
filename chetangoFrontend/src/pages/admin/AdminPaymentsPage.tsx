// ============================================
// ADMIN PAYMENTS PAGE - CHETANGO ADMIN
// Requirements: 3.1, 3.2, 4.1, 5.1, 8.1, 9.1, 10.1
// ============================================

import { useState, useCallback, useEffect } from 'react'
import { CreditCard } from 'lucide-react'
import { PageLayout } from '../layouts/PageLayout'
import { GlassPanel } from '@/design-system/atoms/GlassPanel'
import { useAdminPayments } from '@/features/payments/hooks/useAdminPayments'
import {
  PaymentStatsCards,
  AlumnoCard,
  AlumnoSearchTabs,
  RegisterPaymentForm,
  RecentPaymentsList,
  QuickTemplateCard,
  PaymentDetailModal,
  EditPaymentModal,
} from '@/features/payments/components'
import type { EditarPagoRequest } from '@/features/payments/types/paymentTypes'
import type { PaymentFormInitialValues } from '@/features/payments/components/RegisterPaymentForm'

/**
 * Admin Payments Page - Gestión Financiera
 *
 * Requirements:
 * - 3.1, 3.2: Display stats cards
 * - 4.1: Alumno selection via search or QR
 * - 5.1: Payment registration form
 * - 8.1: Quick template for repeating last payment
 * - 9.1: Payment detail modal
 * - 10.1: Payment edit modal
 */
export function AdminPaymentsPage() {
  const {
    // UI State
    uiState,
    setSearchTerm,
    setSelectedAlumno,
    setActiveTab,
    clearSelection,

    // Catalogs
    metodosPago,
    tiposPaquete,
    alumnos,
    filteredAlumnos,
    selectedAlumno,
    isCatalogsLoading,

    // Stats
    stats,
    isStatsLoading,

    // Payments
    ultimosPagos,
    isPagosLoading,

    // Detail
    pagoDetail,
    isDetailLoading,
    setDetailPagoId,

    // Repeat Last Payment (Requirements: 8.2, 8.3, 8.4, 8.5)
    repeatPaymentData,
    isRepeatPaymentLoading,
    handleRepeatLastPayment,
    clearRepeatPaymentState,

    // Helpers
    getInitials,
    formatCurrency,
    calculateTotal,

    // Mutations
    handleCreatePago,
    isCreating,
    isUpdating,
    updateMutation,
  } = useAdminPayments()

  // Modal states
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Form initial values for repeat last payment
  // Requirements: 8.3, 8.4
  const [formInitialValues, setFormInitialValues] = useState<PaymentFormInitialValues | null>(null)

  // Watch for repeat payment data and apply to form
  // Requirements: 8.3, 8.4
  useEffect(() => {
    if (repeatPaymentData) {
      setFormInitialValues({
        idMetodoPago: repeatPaymentData.idMetodoPago,
        selectedPaquetes: repeatPaymentData.selectedPaquetes,
        montoTotal: repeatPaymentData.montoTotal,
      })
    }
  }, [repeatPaymentData])

  // Handle opening payment detail
  const handleOpenDetail = useCallback((idPago: string) => {
    setDetailPagoId(idPago)
    setIsDetailModalOpen(true)
  }, [setDetailPagoId])

  // Handle closing detail modal
  const handleCloseDetail = useCallback(() => {
    setIsDetailModalOpen(false)
    setDetailPagoId(null)
  }, [setDetailPagoId])

  // Handle opening edit modal from detail
  const handleOpenEdit = useCallback(() => {
    setIsDetailModalOpen(false)
    setIsEditModalOpen(true)
  }, [])

  // Handle closing edit modal
  const handleCloseEdit = useCallback(() => {
    setIsEditModalOpen(false)
    setDetailPagoId(null)
  }, [setDetailPagoId])

  // Handle edit submission
  const handleEditSubmit = useCallback(async (idPago: string, data: EditarPagoRequest) => {
    await updateMutation.mutateAsync({ idPago, data })
  }, [updateMutation])

  // Handle repeat last payment click
  // Requirements: 8.2, 8.3, 8.4
  const handleRepeatLastPaymentClick = useCallback(() => {
    handleRepeatLastPayment()
  }, [handleRepeatLastPayment])

  // Handle when initial values have been applied to the form
  // Requirements: 8.5
  const handleInitialValuesApplied = useCallback(() => {
    // Clear the initial values after they've been applied
    // This allows the user to modify the form freely
    setFormInitialValues(null)
    clearRepeatPaymentState()
  }, [clearRepeatPaymentState])

  return (
    <PageLayout
      title="Pagos"
      subtitle="GESTIÓN FINANCIERA"
      icon={<CreditCard className="w-6 h-6" />}
    >
      {/* Stats Cards */}
      <PaymentStatsCards
        stats={stats}
        isLoading={isStatsLoading}
        formatCurrency={formatCurrency}
      />

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Alumno Selection */}
          {selectedAlumno ? (
            <AlumnoCard
              alumno={selectedAlumno}
              getInitials={getInitials}
              onClear={clearSelection}
            />
          ) : (
            <AlumnoSearchTabs
              activeTab={uiState.activeTab}
              searchTerm={uiState.searchTerm}
              filteredAlumnos={filteredAlumnos}
              alumnos={alumnos}
              isLoading={isCatalogsLoading}
              onTabChange={setActiveTab}
              onSearchChange={setSearchTerm}
              onSelectAlumno={setSelectedAlumno}
              getInitials={getInitials}
            />
          )}

          {/* Payment Form - Only show when alumno is selected */}
          {selectedAlumno ? (
            <GlassPanel className="p-6">
              <h2 className="text-[#f9fafb] text-lg font-semibold mb-4">
                Registrar Pago
              </h2>
              <RegisterPaymentForm
                idAlumno={selectedAlumno.idAlumno}
                metodosPago={metodosPago}
                tiposPaquete={tiposPaquete}
                isLoading={isCatalogsLoading || isRepeatPaymentLoading}
                isSubmitting={isCreating}
                initialValues={formInitialValues}
                formatCurrency={formatCurrency}
                calculateTotal={calculateTotal}
                onSubmit={handleCreatePago}
                onCancel={clearSelection}
                onInitialValuesApplied={handleInitialValuesApplied}
              />
            </GlassPanel>
          ) : (
            <GlassPanel className="p-8 text-center">
              <CreditCard className="w-12 h-12 mx-auto text-[#6b7280] mb-4" />
              <h3 className="text-[#f9fafb] font-medium mb-2">
                Selecciona un alumno
              </h3>
              <p className="text-[#9ca3af] text-sm">
                Busca por nombre o documento, o escanea el código QR del alumno
              </p>
            </GlassPanel>
          )}
        </div>

        {/* Right Column - Side Panel (1/3 width) */}
        <div className="space-y-4">
          {/* Quick Template - Only show when alumno is selected */}
          {selectedAlumno && (
            <QuickTemplateCard
              hasLastPayment={ultimosPagos.length > 0}
              onRepeatLastPayment={handleRepeatLastPaymentClick}
            />
          )}

          {/* Recent Payments - Only show when alumno is selected */}
          {selectedAlumno && (
            <RecentPaymentsList
              pagos={ultimosPagos}
              isLoading={isPagosLoading}
              formatCurrency={formatCurrency}
              onSelectPago={handleOpenDetail}
            />
          )}
        </div>
      </div>

      {/* Payment Detail Modal */}
      <PaymentDetailModal
        pago={pagoDetail}
        isLoading={isDetailLoading}
        isOpen={isDetailModalOpen}
        formatCurrency={formatCurrency}
        onClose={handleCloseDetail}
        onEdit={handleOpenEdit}
      />

      {/* Edit Payment Modal */}
      <EditPaymentModal
        pago={pagoDetail}
        metodosPago={metodosPago}
        isOpen={isEditModalOpen}
        isSubmitting={isUpdating}
        formatCurrency={formatCurrency}
        onClose={handleCloseEdit}
        onSubmit={handleEditSubmit}
      />
    </PageLayout>
  )
}

export default AdminPaymentsPage
