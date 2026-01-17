// ============================================
// ATTENDANCE FEATURE - PUBLIC EXPORTS
// ============================================

// Types
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

// Hooks
export { useAdminAttendance } from './hooks/useAdminAttendance'
export type { UseAdminAttendanceReturn } from './hooks/useAdminAttendance'
export { useAttendanceSearch } from './hooks/useAttendanceSearch'
export type { UseAttendanceSearchReturn } from './hooks/useAttendanceSearch'

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

// Utils
export {
  filterStudentsBySearch,
  calculateAttendanceStats,
  serializeUpdateAttendanceRequest,
  serializeRegisterAttendanceRequest,
} from './utils/attendanceUtils'
