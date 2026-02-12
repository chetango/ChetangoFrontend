// ============================================
// BARREL EXPORT - PAGES
// ============================================
// Nota: Ahora las páginas usan export default para lazy loading
// Este archivo mantiene compatibilidad con imports existentes

export { default as ClassesPage } from './admin/ClassesPage'
export { default as AuthCallbackPage } from './AuthCallbackPage'
export { default as DashboardPage } from './DashboardPage'
export { MainLayoutWrapper } from './layouts/MainLayoutWrapper'
export { default as LoginPage } from './LoginPage'
export { default as NotFoundPage } from './NotFoundPage'
export { default as PaymentsPage } from './PaymentsPage'
export { default as ReportsPage } from './ReportsPage'
export { default as UsersPage } from './UsersPage'

// Admin Pages
export { default as AdminAttendancePage } from './admin/AdminAttendancePage'
export { default as AdminPackagesPage } from './admin/AdminPackagesPage'
export { default as AdminPaymentsPage } from './admin/AdminPaymentsPage'
export { default as AdminProfilePage } from './admin/AdminProfilePage'
export { default as AdminClassesPage } from './admin/ClassesPage'
export { default as NotificationsPage } from './admin/NotificationsPage'
export { UserDetailPage } from './admin/UserDetailPage'

// Profesor Pages
export { default as ProfesorAttendancePage } from './profesor/ProfesorAttendancePage'
export { default as ProfesorClassesPage } from './profesor/ProfesorClassesPage'
export { default as ProfesorDashboardPage } from './profesor/ProfesorDashboardPage'
export { default as ProfesorPaymentsPage } from './profesor/ProfesorPaymentsPage'
export { ProfesorProfilePage } from './profesor/ProfesorProfilePage'
export { default as ProfesorReportsPage } from './profesor/ProfesorReportsPage'

// Student Pages
export { default as StudentAttendancePage } from './student/StudentAttendancePage'
export { default as StudentClassesPage } from './student/StudentClassesPage'
export { default as StudentDashboardPage } from './student/StudentDashboardPage'
export { StudentPaymentsPage } from './student/StudentPaymentsPage'
export { StudentProfilePage } from './student/StudentProfilePage'

