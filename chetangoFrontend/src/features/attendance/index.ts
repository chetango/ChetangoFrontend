// ============================================
// ATTENDANCE FEATURE - PUBLIC EXPORTS
// ============================================

// Types - Admin
export type {
  DateRangeResponse,
  ClassesByDateResponse,
  ClassInfo,
  AttendanceSummaryResponse,
  StudentAttendance,
  StudentPackage,
  PackageState,
  AttendanceStatus,
  AttendanceRecord,
  UpdateAttendanceRequest,
  RegisterAttendanceRequest,
} from './types/attendanceTypes'

// Types - Profesor
export type {
  EstadoPaqueteProfesor,
  EstudianteProfesor,
  ClaseProfesor,
  ClasesProfesorResponse,
  ClaseProfesorItem,
  AsistenciasClaseResponse,
  ProfesorAttendanceState,
  ProfesorAttendanceCounters,
  TimeRange,
} from './types/profesorTypes'

export { isClassInProgress, findCurrentClass } from './types/profesorTypes'

// Hooks
export { useAdminAttendance } from './hooks/useAdminAttendance'
export type { UseAdminAttendanceReturn } from './hooks/useAdminAttendance'
export { useAttendanceSearch } from './hooks/useAttendanceSearch'
export type { UseAttendanceSearchReturn } from './hooks/useAttendanceSearch'
export { useProfesorAttendance, getCurrentTimeString } from './hooks/useProfesorAttendance'
export type { UseProfesorAttendanceReturn } from './hooks/useProfesorAttendance'
export { useStudentAttendance } from './hooks/useStudentAttendance'
export type { UseStudentAttendanceReturn } from './hooks/useStudentAttendance'

// Queries - Profesor
export {
  profesorAttendanceKeys,
  getTodayDateString,
  filterClassesByDate,
  useProfesorClasesQuery,
  useProfesorClasesDelDiaQuery,
  useAsistenciasClaseQuery,
} from './api/profesorQueries'

// Admin Components
export {
  AttendanceToggle,
  PackageStatusBadge,
  StudentSearch,
  StatsSummary,
  DateFilter,
  ClassSelector,
  formatClassDisplay,
  AttendanceRow,
  formatStudentInitials,
  AttendanceTable,
} from './components/admin'

// Profesor Components
export {
  ClassSelectorProfesor,
  AttendanceToggleProfesor,
  PackageStatusBadgeProfesor,
  getBadgeColorForEstado,
} from './components/profesor'

// Utils
export {
  filterStudentsBySearch,
  calculateAttendanceStats,
  serializeUpdateAttendanceRequest,
  serializeRegisterAttendanceRequest,
} from './utils/attendanceUtils'
