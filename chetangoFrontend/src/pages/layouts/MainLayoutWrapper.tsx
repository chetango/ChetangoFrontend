// ============================================
// MAIN LAYOUT WRAPPER - CHETANGO
// ============================================
// Wrapper que conecta MainLayout con lógica de auth

import { useAuth } from '@/features/auth'
import { useActiveRole } from '@/features/auth/hooks/useActiveRole'
import { RoleSelector } from '@/features/auth/components/RoleSelector/RoleSelector'
import { MainLayout } from '@/design-system/templates/MainLayout'
import { getNavigationForUser } from '@/shared/lib/navigation'

export const MainLayoutWrapper = () => {
  const { logout, session } = useAuth()
  const { activeRole } = useActiveRole()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error al cerrar sesión:', error)
      }
    }
  }

  // Obtener navegación según el rol activo del usuario
  const navigationItems = getNavigationForUser(activeRole)

  return (
    <MainLayout 
      user={session.user} 
      onLogout={handleLogout}
      navigationItems={navigationItems}
      roleSelector={<RoleSelector />}
    />
  )
}