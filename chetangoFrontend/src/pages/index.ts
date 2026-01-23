// ============================================
// BARREL EXPORT - PAGES
// ============================================
// Nota: Ahora las páginas usan export default para lazy loading
// Este archivo mantiene compatibilidad con imports existentes

export { default as LoginPage } from './LoginPage'
export { default as AuthCallbackPage } from './AuthCallbackPage'
export { default as DashboardPage } from './DashboardPage'
export { default as ClassesPage } from './admin/ClassesPage'
export { default as PaymentsPage } from './PaymentsPage'
export { default as UsersPage } from './UsersPage'
export { default as ReportsPage } from './ReportsPage'
export { default as NotFoundPage } from './NotFoundPage'
export { MainLayoutWrapper } from './layouts/MainLayoutWrapper'

// Admin Pages
export { default as AdminAttendancePage } from './admin/AdminAttendancePage'
export { default as AdminClassesPage } from './admin/ClassesPage'
export { default as AdminPackagesPage } from './admin/AdminPackagesPage'
export { default as AdminPaymentsPage } from './admin/AdminPaymentsPage'

// Profesor Pages
export { default as ProfesorAttendancePage } from './profesor/ProfesorAttendancePage'
export { default as ProfesorClassesPage } from './profesor/ProfesorClassesPage'

// Student Pages
export { default as StudentAttendancePage } from './student/StudentAttendancePage'
export { default as StudentClassesPage } from './student/StudentClassesPage'