// ============================================
// ADMIN PACKAGES COMPONENTS - BARREL EXPORT
// ============================================

export { ConfigurePackagesModal } from './ConfigurePackagesModal'
export {
    CreatePackageModal,
    calculateFechaFin, formatAlumnoDisplay,
    formatTipoPaqueteDisplay, getTodayDate, validateRequiredFields
} from './CreatePackageModal'
export type { CreatePackageModalProps, FormErrors } from './CreatePackageModal'
export { ESTADO_OPTIONS, PackageFilters } from './PackageFilters'
export { PackagesTable } from './PackagesTable'
export { ESTADO_CARD_CONFIG, PackageStatsCards, getEstadoColor } from './PackageStatsCards'
export {
    PackageTableRow,
    formatDate,
    getEstadoBadgeVariant,
    shouldShowCongelarButton,
    shouldShowDescongelarButton
} from './PackageTableRow'

// Package Detail Modal
export {
    ConsumptionHistoryItem, PackageDetailModal, calculateConsumoPercentage, formatDetailDate, formatHistorialDate, formatHorario, formatTimeSpan, getDescontadaBadgeConfig, getEstadoBadgeVariant as getDetailEstadoBadgeVariant, getProgressBarColor
} from './PackageDetailModal'
export type { PackageDetailModalProps } from './PackageDetailModal'

// Congelar Paquete Dialog
export {
    CongelarPaqueteDialog, calculateDaysCount, getTodayDate as getCongelarTodayDate, validateCongelarForm, validateFechaFin, validateFechaInicio
} from './CongelarPaqueteDialog'
export type {
    CongelarFormData, CongelarFormErrors, CongelarPaqueteDialogProps
} from './CongelarPaqueteDialog'

// Descongelar Paquete Dialog
export {
    DescongelarPaqueteDialog,
    calculateDiasCongelados,
    calculateNuevaFechaVencimiento,
    formatDisplayDate as formatDescongelarDisplayDate
} from './DescongelarPaqueteDialog'
export type { DescongelarPaqueteDialogProps } from './DescongelarPaqueteDialog'

