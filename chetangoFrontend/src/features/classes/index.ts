// ============================================
// CLASSES FEATURE - BARREL EXPORT
// ============================================

// Types
export * from './types/classTypes'

// API
export * from './api/classQueries'
export * from './api/classMutations'

// Store
export * from './store/classesSlice'

// Hooks
export * from './hooks'

// Components (excluding getEstadoBadgeVariant to avoid conflict with types)
export {
  ClaseCard,
  formatTime,
  calculateDuration,
  getEstadoText,
  calculateCapacityPercentage,
  getCapacityBarColor,
  type ClaseCardProps,
  ClaseFormModal,
  isFutureDateTime,
  isValidTimeRange,
  getTodayDate,
  type ClaseFormModalProps,
  type FormErrors,
  ClaseDetailModal,
  getClaseEstadoFromDate,
  formatDateDisplay,
  formatHorarioWithDuration,
  type ClaseDetailModalProps,
  ClaseCardProfesor,
  type ClaseCardProfesorProps,
  ClaseCardAlumno,
  type ClaseCardAlumnoProps,
  ResumenAsistenciaModal,
  type ResumenAsistenciaModalProps,
  ReprogramarModal,
  type ReprogramarModalProps,
} from './components'

// Utils
export * from './utils'
