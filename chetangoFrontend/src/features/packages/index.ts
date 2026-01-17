// ============================================
// PACKAGES FEATURE - PUBLIC EXPORTS
// ============================================

// ============================================
// TYPES
// ============================================
export type {
  // Catalog types
  AlumnoDTO,
  TipoPaqueteDTO,
  // Estado types
  EstadoPaquete,
  EstadoPaqueteId,
  // Package list types
  PaqueteListItemDTO,
  // Package detail types
  CongelacionDTO,
  AsistenciaHistorialDTO,
  PaqueteDetalleDTO,
  // Request types
  CrearPaqueteRequest,
  EditarPaqueteRequest,
  CongelarPaqueteRequest,
  // Response types
  CrearPaqueteResponse,
  PaginatedResponse,
  // Query params
  PaquetesQueryParams,
  // UI state types
  PaqueteFormData,
  PackagesFilters,
  PackagesStats,
} from './types/packageTypes'

export { ESTADO_PAQUETE_MAP, ESTADO_PAQUETE_COLORS } from './types/packageTypes'

// ============================================
// API - QUERIES
// ============================================
export {
  packageKeys,
  useAlumnosQuery,
  useTiposPaqueteQuery,
  usePaquetesByAlumnoQuery,
  usePaqueteDetailQuery,
} from './api/packageQueries'

// ============================================
// API - MUTATIONS
// ============================================
export {
  useCreatePaqueteMutation,
  useUpdatePaqueteMutation,
  useCongelarPaqueteMutation,
  useDescongelarPaqueteMutation,
} from './api/packageMutations'

// ============================================
// HOOKS
// ============================================
export {
  useAdminPackages,
  getInitials,
  getConsumoPercentage,
  calculateStats,
  filterBySearch,
  filterByEstado,
  filterByTipoPaquete,
  applyAllFilters,
} from './hooks'

export type { RenewalState } from './hooks'

// ============================================
// STORE
// ============================================
export {
  packagesSlice,
  setSearchTerm,
  setFilterEstado,
  setFilterTipoPaquete,
  clearFilters,
  packagesReducer,
} from './store'

export type { PackagesUIState } from './store'

// ============================================
// COMPONENTS
// ============================================
export {
  // Stats Cards
  PackageStatsCards,
  ESTADO_CARD_CONFIG,
  getEstadoColor,
  // Filters
  PackageFilters,
  ESTADO_OPTIONS,
  // Table
  PackagesTable,
  // Table Row
  PackageTableRow,
  formatDate,
  getEstadoBadgeVariant,
  shouldShowCongelarButton,
  shouldShowDescongelarButton,
  // Create Package Modal
  CreatePackageModal,
  calculateFechaFin,
  validateRequiredFields,
  getTodayDate,
  formatAlumnoDisplay,
  formatTipoPaqueteDisplay,
  // Package Detail Modal
  PackageDetailModal,
  getDetailEstadoBadgeVariant,
  formatDetailDate,
  calculateConsumoPercentage,
  getProgressBarColor,
  ConsumptionHistoryItem,
  formatHistorialDate,
  formatTimeSpan,
  formatHorario,
  getDescontadaBadgeConfig,
  // Congelar Dialog
  CongelarPaqueteDialog,
  getCongelarTodayDate,
  validateFechaInicio,
  validateFechaFin,
  validateCongelarForm,
  calculateDaysCount,
  // Descongelar Dialog
  DescongelarPaqueteDialog,
  calculateDiasCongelados,
  calculateNuevaFechaVencimiento,
  formatDescongelarDisplayDate,
} from './components'

export type {
  CreatePackageModalProps,
  FormErrors,
  PackageDetailModalProps,
  CongelarPaqueteDialogProps,
  CongelarFormErrors,
  CongelarFormData,
  DescongelarPaqueteDialogProps,
} from './components'
