// ============================================
// NAVIGATION HELPERS - CHETANGO
// ============================================

import { ROUTES } from '@/shared/constants/routes'
import { BarChart3, Calendar, CheckCircle2, ClipboardCheck, DollarSign, Home, Package, User, Users, Wallet } from 'lucide-react'

export interface NavItem {
  label: string
  path: string
  icon?: any
  roles?: string[]
}

// Definición de elementos de navegación por rol
const NAVIGATION_ITEMS: NavItem[] = [
  // Dashboard por rol
  { label: 'Dashboard', path: ROUTES.ADMIN.ROOT, icon: Home, roles: ['admin'] },
  { label: 'Dashboard', path: ROUTES.TEACHER.ROOT, icon: Home, roles: ['profesor'] },
  { label: 'Dashboard', path: ROUTES.STUDENT.ROOT, icon: Home, roles: ['alumno'] },
  
  // Elementos de Admin
  { label: 'Asistencias', path: ROUTES.ADMIN.ATTENDANCE, icon: CheckCircle2, roles: ['admin'] },
  { label: 'Pagos Alumnos', path: ROUTES.ADMIN.PAYMENTS, icon: DollarSign, roles: ['admin'] },
  { label: 'Clases', path: ROUTES.ADMIN.CLASSES, icon: Calendar, roles: ['admin'] },
  { label: 'Paquetes', path: ROUTES.ADMIN.PACKAGES, icon: Package, roles: ['admin'] },
  { label: 'Nómina Profesores', path: ROUTES.ADMIN.PAYROLL, icon: Wallet, roles: ['admin'] },
  { label: 'Usuarios', path: ROUTES.ADMIN.USERS, icon: Users, roles: ['admin'] },
  { label: 'Reportes', path: ROUTES.ADMIN.REPORTS, icon: BarChart3, roles: ['admin'] },
  { label: 'Mi Perfil', path: ROUTES.ADMIN.PROFILE, icon: User, roles: ['admin'] },
  
  // Elementos de Estudiante
  { label: 'Mi Asistencia', path: ROUTES.STUDENT.ATTENDANCE, icon: CheckCircle2, roles: ['alumno'] },
  { label: 'Mis Pagos', path: ROUTES.STUDENT.PAYMENTS, icon: DollarSign, roles: ['alumno'] },
  { label: 'Mis Clases', path: ROUTES.STUDENT.CLASSES, icon: Calendar, roles: ['alumno'] },
  { label: 'Mi Perfil', path: ROUTES.STUDENT.PROFILE, icon: User, roles: ['alumno'] },
  
  // Elementos de Profesor
  { label: 'Registrar Asistencia', path: ROUTES.TEACHER.ATTENDANCE, icon: ClipboardCheck, roles: ['profesor'] },
  { label: 'Mis Clases', path: ROUTES.TEACHER.CLASSES, icon: Calendar, roles: ['profesor'] },
  { label: 'Mis Pagos', path: ROUTES.TEACHER.PAYMENTS, icon: Wallet, roles: ['profesor'] },
  { label: 'Mis Reportes', path: ROUTES.TEACHER.REPORTS, icon: BarChart3, roles: ['profesor'] },
  { label: 'Mi Perfil', path: ROUTES.TEACHER.PROFILE, icon: User, roles: ['profesor'] },
]

/**
 * Obtiene los elementos de navegación filtrados por el rol activo del usuario
 */
export function getNavigationForUser(activeRole: string | null): NavItem[] {
  if (!activeRole) return []
  
  return NAVIGATION_ITEMS.filter(item => {
    // Si no tiene roles definidos, es accesible para todos
    if (!item.roles || item.roles.length === 0) return true
    
    // Verificar si el rol activo tiene acceso
    return item.roles.includes(activeRole)
  })
}

/**
 * Obtiene la ruta por defecto según el rol activo del usuario
 */
export function getDefaultRouteForRole(activeRole: string | null): string {
  if (activeRole === 'admin') return ROUTES.ADMIN.ROOT
  if (activeRole === 'alumno') return ROUTES.STUDENT.ROOT
  if (activeRole === 'profesor') return ROUTES.TEACHER.ROOT
  return ROUTES.DASHBOARD
}

/**
 * Obtiene la ruta por defecto según los roles disponibles (para login inicial)
 */
export function getDefaultRouteForRoles(userRoles: string[] = []): string {
  // Prioridad: admin > profesor > alumno
  if (userRoles.includes('admin')) return ROUTES.ADMIN.ROOT
  if (userRoles.includes('profesor')) return ROUTES.TEACHER.ROOT
  if (userRoles.includes('alumno')) return ROUTES.STUDENT.ROOT
  return ROUTES.DASHBOARD
}

/**
 * Verifica si un usuario tiene acceso a una ruta específica con su rol activo
 */
export function hasAccessToRoute(path: string, activeRole: string | null): boolean {
  // Rutas públicas autenticadas
  const publicAuthRoutes = [ROUTES.DASHBOARD, ROUTES.PROFILE, ROUTES.NOTIFICATIONS] as const
  if (publicAuthRoutes.includes(path as any)) return true
  
  // Verificar rutas por rol activo
  if (path.startsWith('/admin')) return activeRole === 'admin'
  if (path.startsWith('/student')) return activeRole === 'alumno'
  if (path.startsWith('/profesor')) return activeRole === 'profesor'
  
  return false
}