// ============================================
// ADMIN PACKAGES COMPONENTS - BARREL EXPORT
// ============================================

export { PackageStatsCards, ESTADO_CARD_CONFIG, getEstadoColor } from './PackageStatsCards'
export { PackageFilters, ESTADO_OPTIONS } from './PackageFilters'
export { PackagesTable } from './PackagesTable'
export {
  PackageTableRow,
  formatDate,
  getEstadoBadgeVariant,
  shouldShowCongelarButton,
  shouldShowDescongelarButton,
} from './PackageTableRow'
export {
  CreatePackageModal,
  calculateFechaFin,
  validateRequiredFields,
  getTodayDate,
  formatAlumnoDisplay,
  formatTipoPaqueteDisplay,
} from './CreatePackageModal'
export type { CreatePackageModalProps, FormErrors } from './CreatePackageModal'

// Package Detail Modal
export {
  PackageDetailModal,
  getEstadoBadgeVariant as getDetailEstadoBadgeVariant,
  formatDetailDate,
  calculateConsumoPercentage,
  getProgressBarColor,
  ConsumptionHistoryItem,
  formatHistorialDate,
  formatTimeSpan,
  formatHorario,
  getDescontadaBadgeConfig,
} from './PackageDetailModal'
export type { PackageDetailModalProps } from './PackageDetailModal'

// Congelar Paquete Dialog
export {
  CongelarPaqueteDialog,
  getTodayDate as getCongelarTodayDate,
  validateFechaInicio,
  validateFechaFin,
  validateCongelarForm,
  calculateDaysCount,
} from './CongelarPaqueteDialog'
export type {
  CongelarPaqueteDialogProps,
  CongelarFormErrors,
  CongelarFormData,
} from './CongelarPaqueteDialog'

// Descongelar Paquete Dialog
export {
  DescongelarPaqueteDialog,
  calculateDiasCongelados,
  calculateNuevaFechaVencimiento,
  formatDisplayDate as formatDescongelarDisplayDate,
} from './DescongelarPaqueteDialog'
export type { DescongelarPaqueteDialogProps } from './DescongelarPaqueteDialog'
