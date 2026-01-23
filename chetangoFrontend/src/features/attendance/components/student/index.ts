// ============================================
// STUDENT ATTENDANCE COMPONENTS - BARREL EXPORT
// ============================================

export { SummaryCard, getCardColors } from './SummaryCard'
export type { SummaryCardVariant, EstadoPaqueteVariant } from './SummaryCard'

export { PackageProgressBar, getProgressWidth } from './PackageProgressBar'

export {
  AttendanceHistoryCard,
  getEstadoInfo,
  getTipoInfo,
  formatearFecha,
  formatearHora12,
} from './AttendanceHistoryCard'

export { AttendanceDetailModal, formatearFechaLarga } from './AttendanceDetailModal'
