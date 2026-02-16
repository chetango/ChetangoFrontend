// ============================================
// ADMIN CLASSES PAGE - CHETANGO
// Gestión de clases del panel de administración
// Requirements: 3.3, 3.7, 3.8, 8.5, 8.6, 9.3, 10.1, 10.2
// ============================================

import {
    GlassButton,
    GlassInput,
    GlassPanel,
    GlassSelect,
    GlassSelectContent,
    GlassSelectItem,
    GlassSelectTrigger,
    GlassSelectValue,
    Skeleton,
    SkeletonCard,
    StatCard,
} from '@/design-system'
import { useCompletarClaseMutation } from '@/features/classes/api/classMutations'
import {
    ClaseCard,
    ClaseDetailModal,
    ClaseFormModal,
    formatDateDisplay,
} from '@/features/classes/components'
import { getClaseEstado, useAdminClasses } from '@/features/classes/hooks'
import type { ClaseDetalleDTO, ClaseFormData } from '@/features/classes/types/classTypes'
import { AlertCircle, Calendar, Plus, RefreshCw, Search, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

// ============================================
// CONFIRMATION DIALOG COMPONENT
// Requirements: 7.1, 7.6
// ============================================

interface ConfirmationDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <GlassPanel className="relative z-10 w-full max-w-md mx-4 p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">{title}</h3>
        <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">{message}</p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
          <GlassButton
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
            className="min-h-[44px]"
          >
            {cancelText}
          </GlassButton>
          <GlassButton
            variant="primary"
            onClick={onConfirm}
            disabled={isLoading}
            className="!bg-red-500/20 !border-red-500/40 hover:!bg-red-500/30 min-h-[44px]"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm sm:text-base">Procesando...</span>
              </>
            ) : (
              <span className="text-sm sm:text-base">{confirmText}</span>
            )}
          </GlassButton>
        </div>
      </GlassPanel>
    </div>
  )
}

// ============================================
// SKELETON LOADERS
// Requirements: 10.1, 10.2
// ============================================

function CatalogSkeletons() {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Skeleton className="h-12 w-64" />
      <Skeleton className="h-12 w-48" />
      <Skeleton className="h-12 w-48" />
      <Skeleton className="h-12 w-40" />
    </div>
  )
}

function ClassesSkeletons() {
  return (
    <div className="space-y-6">
      {/* Date header skeleton */}
      <Skeleton className="h-6 w-48 mb-4" />
      
      {/* Class cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} className="h-48" />
        ))}
      </div>

      {/* Another date group */}
      <Skeleton className="h-6 w-48 mb-4 mt-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[4, 5].map((i) => (
          <SkeletonCard key={i} className="h-48" />
        ))}
      </div>
    </div>
  )
}

function StatsSkeletons() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-24 sm:h-28" />
      ))}
    </div>
  )
}

// ============================================
// EMPTY STATE COMPONENT
// Requirements: 3.8
// ============================================

interface EmptyStateProps {
  hasFilters: boolean
  onClearFilters: () => void
  onCreateClass: () => void
}

function EmptyState({ hasFilters, onClearFilters, onCreateClass }: EmptyStateProps) {
  return (
    <GlassPanel className="p-6 sm:p-8 md:p-12 text-center">
      <div className="flex justify-center mb-3 sm:mb-4">
        <div className="p-3 sm:p-4 rounded-full bg-white/5">
          <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
        </div>
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
        {hasFilters ? 'No se encontraron clases' : 'No hay clases programadas'}
      </h3>
      <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 max-w-md mx-auto">
        {hasFilters
          ? 'No hay clases que coincidan con los filtros seleccionados. Intenta ajustar los criterios de búsqueda.'
          : 'Aún no hay clases programadas. Crea una nueva clase para comenzar.'}
      </p>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-3">
        {hasFilters && (
          <GlassButton variant="secondary" onClick={onClearFilters} className="min-h-[44px]">
            <X size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="text-sm sm:text-base">Limpiar filtros</span>
          </GlassButton>
        )}
        <GlassButton variant="primary" onClick={onCreateClass} className="min-h-[44px]">
          <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span className="text-sm sm:text-base">Nueva Clase</span>
        </GlassButton>
      </div>
    </GlassPanel>
  )
}

// ============================================
// ERROR STATE COMPONENT
// Requirements: 3.7
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
      <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Error al cargar las clases</h3>
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

export default function AdminClassesPage() {
  // ============================================
  // HOOK INTEGRATION
  // ============================================

  const {
    // Catalogs
    tiposClase,
    profesores,
    isCatalogsLoading,

    // Classes
    clasesByDate,
    sortedDates,
    isClasesLoading,
    clasesError,

    // Detail
    claseDetail,
    setDetailClaseId,

    // Filters
    filters,
    setSearchTerm,
    setFilterProfesor,
    setFilterTipo,
    setFilterFecha,
    clearFilters,

    // Selected profesor
    selectedProfesorId,
    setSelectedProfesorId,

    // Stats
    stats,

    // Mutations
    handleCreateClase,
    handleUpdateClase,
    handleDeleteClase,
    isCreating,
    isUpdating,
    isDeleting,

    // Refetch
    refetchClases,
  } = useAdminClasses()

  // Complete class mutation
  const completarClaseMutation = useCompletarClaseMutation()

  // ============================================
  // LOCAL STATE
  // ============================================

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [editingClaseData, setEditingClaseData] = useState<ClaseDetalleDTO | null>(null)

  // Confirmation dialog state - Requirements: 7.1
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    claseId: string | null
    type: 'delete' | 'complete'
  }>({ isOpen: false, claseId: null, type: 'delete' })

  // Search debounce
  const [searchInput, setSearchInput] = useState(filters.searchTerm)

  // ============================================
  // EFFECTS
  // ============================================

  // Debounce search input - Requirements: 8.7
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput, setSearchTerm])

  // ============================================
  // HANDLERS
  // ============================================

  // Open create modal
  const handleOpenCreateModal = useCallback(() => {
    setFormMode('create')
    setEditingClaseData(null)
    setIsFormModalOpen(true)
  }, [])

  // Open edit modal
  const handleOpenEditModal = useCallback((idClase: string) => {
    setFormMode('edit')
    setDetailClaseId(idClase)
    // Wait for detail to load, then open form modal
    setIsFormModalOpen(true)
  }, [setDetailClaseId])

  // Update editing data when detail loads
  useEffect(() => {
    if (claseDetail && formMode === 'edit' && isFormModalOpen) {
      setEditingClaseData(claseDetail)
    }
  }, [claseDetail, formMode, isFormModalOpen])

  // Open detail modal
  const handleOpenDetailModal = useCallback((idClase: string) => {
    setDetailClaseId(idClase)
    setIsDetailModalOpen(true)
  }, [setDetailClaseId])

  // Close modals
  const handleCloseFormModal = useCallback(() => {
    setIsFormModalOpen(false)
    setEditingClaseData(null)
    setDetailClaseId(null)
  }, [setDetailClaseId])

  const handleCloseDetailModal = useCallback(() => {
    setIsDetailModalOpen(false)
    setDetailClaseId(null)
  }, [setDetailClaseId])

  // Form submit handler
  const handleFormSubmit = useCallback(async (formData: ClaseFormData) => {
    if (formMode === 'create') {
      await handleCreateClase(formData)
    } else if (editingClaseData) {
      await handleUpdateClase(editingClaseData.idClase, formData)
    }
    handleCloseFormModal()
  }, [formMode, editingClaseData, handleCreateClase, handleUpdateClase, handleCloseFormModal])

  // Open cancel confirmation - Requirements: 7.1
  const handleOpenCancelConfirmation = useCallback((idClase: string) => {
    setConfirmDialog({ isOpen: true, claseId: idClase, type: 'delete' })
  }, [])

  // Open complete confirmation
  const handleOpenCompleteConfirmation = useCallback((idClase: string) => {
    setConfirmDialog({ isOpen: true, claseId: idClase, type: 'complete' })
  }, [])

  // Confirm cancel - Requirements: 7.2
  const handleConfirmCancel = useCallback(async () => {
    if (confirmDialog.claseId) {
      if (confirmDialog.type === 'delete') {
        await handleDeleteClase(confirmDialog.claseId)
      } else if (confirmDialog.type === 'complete') {
        await completarClaseMutation.mutateAsync(confirmDialog.claseId)
      }
      setConfirmDialog({ isOpen: false, claseId: null, type: 'delete' })
    }
  }, [confirmDialog, handleDeleteClase, completarClaseMutation])

  // Close confirmation dialog
  const handleCloseConfirmation = useCallback(() => {
    setConfirmDialog({ isOpen: false, claseId: null, type: 'delete' })
  }, [])

  // Handle profesor filter change
  const handleProfesorChange = useCallback((value: string) => {
    setFilterProfesor(value)
    if (value !== 'todos') {
      setSelectedProfesorId(value)
    }
  }, [setFilterProfesor, setSelectedProfesorId])

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.searchTerm !== '' ||
      filters.filterTipo !== 'todos' ||
      filters.filterFecha !== ''
    )
  }, [filters])

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-[#f9fafb] text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Gestión de Clases</h1>
          <p className="text-[#9ca3af] text-sm sm:text-base">
            Administra las clases programadas de la academia
          </p>
        </div>
        <GlassButton variant="primary" onClick={handleOpenCreateModal} className="min-h-[44px] w-full sm:w-auto">
          <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span className="text-sm sm:text-base">Nueva Clase</span>
        </GlassButton>
      </div>

      {/* Stats Cards - Requirements: 9.3 */}
      {isClasesLoading ? (
        <StatsSkeletons />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <StatCard
            icon={<Calendar className="w-4 h-4 sm:w-5 sm:h-5" />}
            value={stats.clasesHoy}
            label="Clases Hoy"
            color="primary"
          />
          <StatCard
            icon={<Calendar className="w-4 h-4 sm:w-5 sm:h-5" />}
            value={stats.clasesSemana}
            label="Esta Semana"
            color="secondary"
          />
          <StatCard
            icon={<X className="w-4 h-4 sm:w-5 sm:h-5" />}
            value={stats.clasesCanceladas}
            label="Canceladas"
            color="warning"
          />
        </div>
      )}

      {/* Filters - Requirements: 8.5, 8.6 */}
      {isCatalogsLoading ? (
        <CatalogSkeletons />
      ) : (
        <GlassPanel className="p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            {/* Search Input - Requirements: 8.1 */}
            <div className="flex-1 min-w-[200px] max-w-md">
              <GlassInput
                type="text"
                placeholder="Buscar por tipo de clase..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>

            {/* Profesor Filter - Requirements: 8.3 */}
            <div className="min-w-[180px] w-full sm:w-auto">
              <GlassSelect
                value={filters.filterProfesor}
                onValueChange={handleProfesorChange}
              >
                <GlassSelectTrigger>
                  <GlassSelectValue placeholder="Profesor" />
                </GlassSelectTrigger>
                <GlassSelectContent>
                  <GlassSelectItem value="todos">Todos los profesores</GlassSelectItem>
                  {profesores.map((profesor) => (
                    <GlassSelectItem key={profesor.idProfesor} value={profesor.idProfesor}>
                      {profesor.nombreCompleto}
                    </GlassSelectItem>
                  ))}
                </GlassSelectContent>
              </GlassSelect>
            </div>

            {/* Tipo Filter - Requirements: 8.4 */}
            <div className="min-w-[160px] w-full sm:w-auto">
              <GlassSelect
                value={filters.filterTipo}
                onValueChange={setFilterTipo}
              >
                <GlassSelectTrigger>
                  <GlassSelectValue placeholder="Tipo" />
                </GlassSelectTrigger>
                <GlassSelectContent>
                  <GlassSelectItem value="todos">Todos los tipos</GlassSelectItem>
                  {tiposClase.map((tipo) => (
                    <GlassSelectItem key={tipo.id} value={tipo.nombre}>
                      {tipo.nombre}
                    </GlassSelectItem>
                  ))}
                </GlassSelectContent>
              </GlassSelect>
            </div>

            {/* Date Filter - Requirements: 8.2 */}
            <div className="min-w-[160px] w-full sm:w-auto">
              <GlassInput
                type="date"
                value={filters.filterFecha}
                onChange={(e) => setFilterFecha(e.target.value)}
                icon={<Calendar className="w-4 h-4" />}
              />
            </div>

            {/* Clear Filters - Requirements: 8.6 */}
            {hasActiveFilters && (
              <GlassButton variant="ghost" onClick={clearFilters} className="text-xs sm:text-sm min-h-[44px]">
                <X className="w-4 h-4" />
                <span>Limpiar</span>
              </GlassButton>
            )}

            {/* Refresh Button */}
            <GlassButton
              variant="icon"
              onClick={() => refetchClases()}
              title="Actualizar lista"
              className="!p-2.5 sm:!p-2 min-h-[44px] min-w-[44px]"
            >
              <RefreshCw className={`w-4 h-4 ${isClasesLoading ? 'animate-spin' : ''}`} />
            </GlassButton>
          </div>
        </GlassPanel>
      )}

      {/* Classes List - Requirements: 3.3 */}
      {isClasesLoading ? (
        <ClassesSkeletons />
      ) : clasesError ? (
        <ErrorState
          message="No se pudieron cargar las clases. Verifica tu conexión e intenta de nuevo."
          onRetry={() => refetchClases()}
        />
      ) : sortedDates.length === 0 ? (
        <EmptyState
          hasFilters={hasActiveFilters}
          onClearFilters={clearFilters}
          onCreateClass={handleOpenCreateModal}
        />
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {sortedDates.map((date) => (
            <div key={date}>
              {/* Date Header */}
              <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 capitalize">
                {formatDateDisplay(date)}
              </h2>

              {/* Classes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {clasesByDate[date].map((clase) => {
                  const estado = getClaseEstado(clase.fecha)
                  // Find profesor name
                  const profesor = profesores.find(
                    (p) => p.idProfesor === selectedProfesorId
                  )

                  return (
                    <ClaseCard
                      key={clase.idClase}
                      clase={clase}
                      estado={estado}
                      nombreProfesor={profesor?.nombreCompleto}
                      onEdit={handleOpenEditModal}
                      onCancel={handleOpenCancelConfirmation}
                      onComplete={handleOpenCompleteConfirmation}
                      onViewDetail={handleOpenDetailModal}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <ClaseFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSubmit={handleFormSubmit}
        tiposClase={tiposClase}
        profesores={profesores}
        isCatalogsLoading={isCatalogsLoading}
        isSubmitting={isCreating || isUpdating}
        mode={formMode}
        initialData={editingClaseData}
      />

      {/* Detail Modal */}
      <ClaseDetailModal
        idClase={isDetailModalOpen ? (claseDetail?.idClase || null) : null}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />

      {/* Confirmation Dialog - Requirements: 7.1, 7.6 */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.type === 'complete' ? 'Completar Clase' : 'Cancelar Clase'}
        message={
          confirmDialog.type === 'complete'
            ? '¿Estás seguro de que deseas completar esta clase? Se generarán los pagos automáticamente para el profesor y monitores.'
            : '¿Estás seguro de que deseas cancelar esta clase? Esta acción no se puede deshacer.'
        }
        confirmText={
          confirmDialog.type === 'complete' ? 'Sí, completar clase' : 'Sí, cancelar clase'
        }
        cancelText="No, mantener"
        isLoading={isDeleting || completarClaseMutation.isPending}
        onConfirm={handleConfirmCancel}
        onCancel={handleCloseConfirmation}
      />
    </div>
  )
}
