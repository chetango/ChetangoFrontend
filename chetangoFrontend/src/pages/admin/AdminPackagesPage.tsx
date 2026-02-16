// ============================================
// ADMIN PACKAGES PAGE - CHETANGO
// Gestión de paquetes del panel de administración
// Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 5.1, 6.1
// ============================================

import {
    GlassButton,
    GlassPanel,
    Skeleton,
} from '@/design-system'
import {
    ConfigurePackagesModal,
    CongelarPaqueteDialog,
    CreatePackageModal,
    DescongelarPaqueteDialog,
    PackageDetailModal,
    PackageFilters,
    PackagesTable,
    PackageStatsCards,
} from '@/features/packages/components'
import { useAdminPackages } from '@/features/packages/hooks'
import type { CongelacionDTO, PaqueteFormData, PaqueteListItemDTO } from '@/features/packages/types/packageTypes'
import { AlertCircle, Package, Plus, RefreshCw } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

// ============================================
// SKELETON LOADERS
// Requirements: 10.1, 10.2, 10.5
// ============================================

/**
 * Skeleton loader for stats cards
 * Requirements: 10.2
 */
function StatsSkeletons() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="
            relative
            p-3 sm:p-4
            rounded-xl
            backdrop-blur-xl
            bg-[rgba(26,26,32,0.5)]
            border border-[rgba(255,255,255,0.1)]
          "
        >
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-3 sm:h-4 w-16 sm:w-20 rounded" />
            <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg" />
          </div>
          <Skeleton className="h-6 sm:h-8 w-10 sm:w-12 rounded" />
        </div>
      ))}
    </div>
  )
}

/**
 * Skeleton loader for filters section
 * Requirements: 10.1
 */
function FiltersSkeletons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      {/* Search Input Skeleton */}
      <div className="flex-1 min-w-0">
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
      {/* Estado Filter Skeleton */}
      <div className="w-full sm:w-48">
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
      {/* Tipo Paquete Filter Skeleton */}
      <div className="w-full sm:w-56">
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  )
}

/**
 * Skeleton loader for packages table
 * Requirements: 10.2
 */
function TableSkeletons() {
  return (
    <div className="space-y-4">
      {/* Table header skeleton */}
      <div className="flex gap-4 pb-4 border-b border-[rgba(255,255,255,0.1)]">
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-4 w-20 rounded" />
        <Skeleton className="h-4 w-20 rounded" />
        <Skeleton className="h-4 w-28 rounded" />
        <Skeleton className="h-4 w-16 rounded" />
      </div>
      {/* Table rows skeleton */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="
            flex items-center gap-4 p-4
            rounded-xl
            bg-[rgba(255,255,255,0.02)]
            border border-[rgba(255,255,255,0.05)]
          "
        >
          {/* Avatar skeleton */}
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
          {/* Name and document skeleton */}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-3 w-24 rounded" />
          </div>
          {/* Package type skeleton */}
          <div className="hidden sm:block space-y-2">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
          {/* Consumption skeleton */}
          <div className="hidden md:block space-y-2">
            <Skeleton className="h-4 w-16 rounded" />
            <Skeleton className="h-2 w-24 rounded-full" />
          </div>
          {/* Estado badge skeleton */}
          <Skeleton className="h-7 w-20 rounded-lg" />
          {/* Dates skeleton */}
          <div className="hidden lg:block space-y-2">
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="h-3 w-24 rounded" />
          </div>
          {/* Actions skeleton */}
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      ))}
    </div>
  )
}

// ============================================
// EMPTY STATE COMPONENT
// Requirements: 12.1, 12.2
// ============================================

interface EmptyStateProps {
  hasFilters: boolean
  onClearFilters: () => void
  onCreatePackage: () => void
}

function EmptyState({ hasFilters, onClearFilters, onCreatePackage }: EmptyStateProps) {
  return (
    <GlassPanel className="p-6 sm:p-8 md:p-12 text-center">
      <div className="flex justify-center mb-3 sm:mb-4">
        <div className="p-3 sm:p-4 rounded-full bg-white/5">
          <Package className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
        </div>
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
        {hasFilters ? 'No se encontraron paquetes' : 'No hay paquetes registrados'}
      </h3>
      <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 max-w-md mx-auto">
        {hasFilters
          ? 'No hay paquetes que coincidan con los filtros seleccionados. Intenta ajustar los criterios de búsqueda.'
          : 'Aún no hay paquetes registrados. Crea un nuevo paquete para comenzar.'}
      </p>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-3">
        {hasFilters && (
          <GlassButton variant="secondary" onClick={onClearFilters} className="min-h-[44px]">
            Limpiar filtros
          </GlassButton>
        )}
        <GlassButton variant="primary" onClick={onCreatePackage} className="min-h-[44px]">
          <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span className="text-sm sm:text-base">Asignar Paquete</span>
        </GlassButton>
      </div>
    </GlassPanel>
  )
}

// ============================================
// ERROR STATE COMPONENT
// Requirements: 11.3, 11.5
// ============================================

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <GlassPanel className="p-6 sm:p-8 text-center border-red-500/30">
      <div className="flex justify-center mb-3 sm:mb-4">
        <div className="p-3 sm:p-4 rounded-full bg-red-500/10">
          <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" />
        </div>
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Error al cargar los paquetes</h3>
      <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4">{message}</p>
      <GlassButton variant="secondary" onClick={onRetry} className="min-h-[44px]">
        <RefreshCw size={16} className="sm:w-[18px] sm:h-[18px]" />
        <span className="text-sm sm:text-base">Reintentar</span>
      </GlassButton>
    </GlassPanel>
  )
}


// ============================================
// MAIN COMPONENT
// ============================================

export default function AdminPackagesPage() {
  // ============================================
  // HOOK INTEGRATION
  // ============================================

  const {
    // Catalogs
    alumnos,
    tiposPaquete,
    isCatalogsLoading,

    // Packages
    paquetes,
    isPaquetesLoading,
    paquetesError,

    // Detail
    paqueteDetail,
    isDetailLoading,
    setDetailPaqueteId,

    // Filters
    filters,
    setSearchTerm,
    setFilterEstado,
    setFilterTipoPaquete,
    clearFilters,

    // Stats
    stats,

    // Helpers
    getInitials,
    getConsumoPercentage,

    // Mutations
    handleCreatePaquete,
    handleCongelarPaquete,
    handleDescongelarPaquete,
    isCreating,
    isCongelando,
    isDescongelando,

    // Renewal
    renewalState,
    handleStartRenewal,
    handleCancelRenewal,
    handleCompleteRenewal,

    // Refetch
    refetchPaquetes,
  } = useAdminPackages()

  // ============================================
  // LOCAL STATE
  // ============================================

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)

  // Congelar dialog state
  const [congelarDialog, setCongelarDialog] = useState<{
    isOpen: boolean
    paqueteId: string
    nombreAlumno: string
    nombreTipoPaquete: string
  }>({ isOpen: false, paqueteId: '', nombreAlumno: '', nombreTipoPaquete: '' })

  // Descongelar dialog state
  const [descongelarDialog, setDescongelarDialog] = useState<{
    isOpen: boolean
    paqueteId: string
    nombreAlumno: string
    nombreTipoPaquete: string
    congelacion: CongelacionDTO | null
    fechaVencimiento: string
  }>({
    isOpen: false,
    paqueteId: '',
    nombreAlumno: '',
    nombreTipoPaquete: '',
    congelacion: null,
    fechaVencimiento: '',
  })

  // Search debounce
  const [searchInput, setSearchInput] = useState(filters.searchTerm)

  // ============================================
  // EFFECTS
  // ============================================

  // Debounce search input - Requirements: 4.6
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput, setSearchTerm])

  // Handle renewal state - open create modal when renewal starts
  useEffect(() => {
    if (renewalState.isRenewing) {
      setIsCreateModalOpen(true)
    }
  }, [renewalState.isRenewing])

  // ============================================
  // HANDLERS
  // ============================================

  // Open create modal - Requirements: 5.1
  const handleOpenCreateModal = useCallback(() => {
    setIsCreateModalOpen(true)
  }, [])

  // Close create modal
  const handleCloseCreateModal = useCallback(() => {
    setIsCreateModalOpen(false)
    // If we were in renewal mode, cancel it
    if (renewalState.isRenewing) {
      handleCancelRenewal()
    }
  }, [renewalState.isRenewing, handleCancelRenewal])

  // Handle form submit - Requirements: 5.4, 5.5
  const handleFormSubmit = useCallback(
    async (formData: PaqueteFormData) => {
      await handleCreatePaquete(formData)
      setIsCreateModalOpen(false)
      // If we were in renewal mode, complete it
      if (renewalState.isRenewing) {
        handleCompleteRenewal()
      }
    },
    [handleCreatePaquete, renewalState.isRenewing, handleCompleteRenewal]
  )

  // Open detail modal - Requirements: 6.1
  const handleOpenDetailModal = useCallback(
    (idPaquete: string) => {
      setDetailPaqueteId(idPaquete)
      setIsDetailModalOpen(true)
    },
    [setDetailPaqueteId]
  )

  // Close detail modal
  const handleCloseDetailModal = useCallback(() => {
    setIsDetailModalOpen(false)
    setDetailPaqueteId(null)
  }, [setDetailPaqueteId])

  // Handle renewal from detail modal - Requirements: 7.1, 7.2, 7.3
  const handleRenewal = useCallback(
    (idAlumno: string, idTipoPaquete: string) => {
      handleStartRenewal(idAlumno, idTipoPaquete)
      setIsDetailModalOpen(false)
    },
    [handleStartRenewal]
  )

  // Open congelar dialog - Requirements: 8.1
  const handleOpenCongelarDialog = useCallback(
    (idPaquete: string) => {
      const paquete = paquetes.find(p => p.idPaquete === idPaquete)
      if (paquete) {
        setCongelarDialog({
          isOpen: true,
          paqueteId: idPaquete,
          nombreAlumno: paquete.nombreAlumno,
          nombreTipoPaquete: paquete.nombreTipoPaquete,
        })
      }
    },
    [paquetes]
  )

  // Close congelar dialog
  const handleCloseCongelarDialog = useCallback(() => {
    setCongelarDialog({ isOpen: false, paqueteId: '', nombreAlumno: '', nombreTipoPaquete: '' })
  }, [])

  // Handle congelar submit - Requirements: 8.3
  const handleCongelarSubmit = useCallback(
    async (fechaInicio: string, fechaFin: string, motivo?: string) => {
      if (congelarDialog.paqueteId) {
        await handleCongelarPaquete(congelarDialog.paqueteId, fechaInicio, fechaFin, motivo)
        handleCloseCongelarDialog()
      }
    },
    [congelarDialog.paqueteId, handleCongelarPaquete, handleCloseCongelarDialog]
  )

  // Open descongelar dialog - Requirements: 9.1
  const handleOpenDescongelarDialog = useCallback(
    (idPaquete: string) => {
      const paquete = paquetes.find(p => p.idPaquete === idPaquete)
      // For descongelar, we need to fetch the detail to get congelaciones
      if (paquete && paqueteDetail && paqueteDetail.idPaquete === idPaquete && paqueteDetail.congelaciones.length > 0) {
        const activeCongelacion = paqueteDetail.congelaciones[paqueteDetail.congelaciones.length - 1]
        setDescongelarDialog({
          isOpen: true,
          paqueteId: idPaquete,
          nombreAlumno: paquete.nombreAlumno,
          nombreTipoPaquete: paquete.nombreTipoPaquete,
          congelacion: activeCongelacion,
          fechaVencimiento: paquete.fechaVencimiento,
        })
      } else {
        // Fetch detail first, then open dialog
        setDetailPaqueteId(idPaquete)
      }
    },
    [paquetes, paqueteDetail, setDetailPaqueteId]
  )

  // Close descongelar dialog
  const handleCloseDescongelarDialog = useCallback(() => {
    setDescongelarDialog({
      isOpen: false,
      paqueteId: '',
      nombreAlumno: '',
      nombreTipoPaquete: '',
      congelacion: null,
      fechaVencimiento: '',
    })
  }, [])

  // Handle descongelar submit - Requirements: 9.3
  const handleDescongelarSubmit = useCallback(async () => {
    if (descongelarDialog.paqueteId && descongelarDialog.congelacion) {
      await handleDescongelarPaquete(
        descongelarDialog.paqueteId,
        descongelarDialog.congelacion.idCongelacion
      )
      handleCloseDescongelarDialog()
    }
  }, [
    descongelarDialog.paqueteId,
    descongelarDialog.congelacion,
    handleDescongelarPaquete,
    handleCloseDescongelarDialog,
  ])

  // Check if any filters are active
  const hasActiveFilters =
    filters.searchTerm !== '' ||
    filters.filterEstado !== 'todos' ||
    filters.filterTipoPaquete !== 'todos'

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
      {/* Header - Requirements: 3.1 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-[#f9fafb] text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Gestión de Paquetes</h1>
          <p className="text-[#9ca3af] text-sm sm:text-base">
            Administra los paquetes de clases de los alumnos
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <GlassButton variant="secondary" onClick={() => setIsConfigModalOpen(true)} className="min-h-[44px]">
            <Package size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="text-sm sm:text-base">Configurar Paquetes</span>
          </GlassButton>
          <GlassButton variant="primary" onClick={handleOpenCreateModal} className="min-h-[44px]">
            <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="text-sm sm:text-base">Asignar Paquete</span>
          </GlassButton>
        </div>
      </div>

      {/* Stats Cards - Requirements: 3.2, 3.3 */}
      <div className="mb-6 sm:mb-8">
        {isPaquetesLoading ? (
          <StatsSkeletons />
        ) : (
          <PackageStatsCards stats={stats} />
        )}
      </div>

      {/* Filters - Requirements: 4.1, 4.2, 4.3, 10.1 */}
      <GlassPanel className="p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {isCatalogsLoading ? (
            <FiltersSkeletons />
          ) : (
            <>
              <PackageFilters
                searchTerm={searchInput}
                onSearchChange={setSearchInput}
                filterEstado={filters.filterEstado}
                onEstadoChange={setFilterEstado}
                filterTipoPaquete={filters.filterTipoPaquete}
                onTipoPaqueteChange={setFilterTipoPaquete}
                tiposPaquete={tiposPaquete}
                isLoading={isCatalogsLoading}
              />
              {hasActiveFilters && (
                <GlassButton variant="ghost" onClick={clearFilters} className="text-xs sm:text-sm min-h-[44px]">
                  Limpiar
                </GlassButton>
              )}
              <GlassButton
                variant="icon"
                onClick={refetchPaquetes}
                title="Actualizar lista"
                className="!p-2.5 sm:!p-2 min-h-[44px] min-w-[44px]"
              >
                <RefreshCw className={`w-4 h-4 ${isPaquetesLoading ? 'animate-spin' : ''}`} />
              </GlassButton>
            </>
          )}
        </div>
      </GlassPanel>

      {/* Packages Table - Requirements: 3.4, 10.2 */}
      <GlassPanel className="p-3 sm:p-4 md:p-6">
        {paquetesError ? (
          <ErrorState
            message="No se pudieron cargar los paquetes. Verifica tu conexión e intenta de nuevo."
            onRetry={refetchPaquetes}
          />
        ) : isPaquetesLoading ? (
          <TableSkeletons />
        ) : paquetes.length === 0 ? (
          <EmptyState
            hasFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            onCreatePackage={handleOpenCreateModal}
          />
        ) : (
          <PackagesTable
            paquetes={paquetes}
            isLoading={false}
            searchTerm={filters.searchTerm}
            hasFilters={hasActiveFilters}
            onViewDetail={handleOpenDetailModal}
            onCongelar={handleOpenCongelarDialog}
            onDescongelar={handleOpenDescongelarDialog}
            getInitials={getInitials}
            getConsumoPercentage={(paquete: PaqueteListItemDTO) => getConsumoPercentage(paquete.clasesUsadas, paquete.clasesDisponibles)}
          />
        )}
      </GlassPanel>

      {/* Create Package Modal - Requirements: 5.1, 5.2, 5.3 */}
      <CreatePackageModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSubmit={handleFormSubmit}
        alumnos={alumnos}
        tiposPaquete={tiposPaquete}
        isCatalogsLoading={isCatalogsLoading}
        isSubmitting={isCreating}
        preselectedAlumnoId={renewalState.preselectedAlumnoId ?? undefined}
        preselectedTipoPaqueteId={renewalState.preselectedTipoPaqueteId ?? undefined}
      />

      {/* Package Detail Modal - Requirements: 6.1, 6.3, 6.4, 6.5 */}
      <PackageDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        paqueteDetail={paqueteDetail ?? null}
        isLoading={isDetailLoading}
        onRenovar={paqueteDetail ? () => handleRenewal(paqueteDetail.idAlumno, paqueteDetail.idTipoPaquete) : undefined}
        getInitials={getInitials}
      />

      {/* Congelar Paquete Dialog - Requirements: 8.1, 8.2, 8.4 */}
      <CongelarPaqueteDialog
        isOpen={congelarDialog.isOpen}
        onClose={handleCloseCongelarDialog}
        onSubmit={handleCongelarSubmit}
        idPaquete={congelarDialog.paqueteId}
        nombreAlumno={congelarDialog.nombreAlumno}
        nombreTipoPaquete={congelarDialog.nombreTipoPaquete}
        isSubmitting={isCongelando}
      />

      {/* Descongelar Paquete Dialog - Requirements: 9.1, 9.2, 9.4 */}
      {descongelarDialog.congelacion && (
        <DescongelarPaqueteDialog
          isOpen={descongelarDialog.isOpen}
          onClose={handleCloseDescongelarDialog}
          onConfirm={handleDescongelarSubmit}
          idPaquete={descongelarDialog.paqueteId}
          nombreAlumno={descongelarDialog.nombreAlumno}
          nombreTipoPaquete={descongelarDialog.nombreTipoPaquete}
          fechaVencimiento={descongelarDialog.fechaVencimiento}
          congelacion={descongelarDialog.congelacion}
          isSubmitting={isDescongelando}
        />
      )}

      {/* Configure Packages Modal */}
      <ConfigurePackagesModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        tiposPaquete={tiposPaquete}
        isLoading={isCatalogsLoading}
      />
    </div>
  )
}
