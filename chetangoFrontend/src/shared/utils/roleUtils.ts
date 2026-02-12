// ============================================
// ROLE UTILITIES
// Shared utilities for role mapping and display
// ============================================

/**
 * Maps a role key to its display text in Spanish
 * @param role - The role key (alumno, profesor, admin)
 * @returns The display text for the role
 */
export function getRoleDisplayText(role?: string): string {
  if (!role) return 'Panel'
  
  const normalizedRole = role.toLowerCase()
  
  const roleMap: Record<string, string> = {
    'alumno': 'Estudiante',
    'profesor': 'Profesor',
    'admin': 'Administrador',
    'administrador': 'Administrador',
  }
  
  return roleMap[normalizedRole] || 'Panel'
}

/**
 * Gets the display text for the first role in an array
 * @param roles - Array of role strings
 * @returns The display text for the first role
 */
export function getPrimaryRoleText(roles?: string[]): string {
  if (!roles || roles.length === 0) return 'Panel'
  return getRoleDisplayText(roles[0])
}
