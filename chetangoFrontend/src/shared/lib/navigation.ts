// ============================================
// NAVIGATION HELPERS - CHETANGO
// ============================================

import { ROUTES } from '@/shared/constants/routes'

export interface NavItem {
  label: string
  path: string
  icon?: string
  roles?: string[]
}

// Definición de elementos de navegación por rol
const NAVIGATION_ITEMS: NavItem[] = [
  // Elementos comunes
  { label: 'Dashboard', path: ROUTES.DASHBOARD, roles: ['admin', 'alumno', 'profesor'] },
  
  // Elementos de Admin
  { label: 'Usuarios', path: ROUTES.ADMIN.USERS, roles: ['admin'] },
  { label: 'Asistencia', path: ROUTES.ADMIN.ATTENDANCE, roles: ['admin'] },
  { label: 'Pagos', path: ROUTES.ADMIN.PAYMENTS, roles: ['admin'] },
  { label: 'Clases', path: ROUTES.ADMIN.CLASSES, roles: ['admin'] },
  { label: 'Paquetes', path: ROUTES.ADMIN.PACKAGES, roles: ['admin'] },
  { label: 'Reportes', path: ROUTES.ADMIN.REPORTS, roles: ['admin'] },
  
  // Elementos de Estudiante
  { label: 'Mi Asistencia', path: ROUTES.STUDENT.ATTENDANCE, roles: ['alumno'] },
  { label: 'Mis Pagos', path: ROUTES.STUDENT.PAYMENTS, roles: ['alumno'] },
  { label: 'Mis Clases', path: ROUTES.STUDENT.CLASSES, roles: ['alumno'] },
  { label: 'Mi Perfil', path: ROUTES.STUDENT.PROFILE, roles: ['alumno'] },
  
  // Elementos de Profesor (futuro)
  { label: 'Registrar Asistencia', path: ROUTES.TEACHER.ATTENDANCE, roles: ['profesor'] },
  { label: 'Mis Clases', path: ROUTES.TEACHER.CLASSES, roles: ['profesor'] },
  { label: 'Mis Reportes', path: ROUTES.TEACHER.REPORTS, roles: ['profesor'] },
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
  if (path.startsWith('/teacher')) return activeRole === 'profesor'
  
  return false
}