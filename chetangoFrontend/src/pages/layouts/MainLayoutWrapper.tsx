// ============================================
// MAIN LAYOUT WRAPPER - CHETANGO
// ============================================
// Wrapper que conecta MainLayout con lógica de auth

import { useAuth } from '@/features/auth'
import { MainLayout } from '@/design-system/templates/MainLayout'

export const MainLayoutWrapper = () => {
  const { logout, session } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error al cerrar sesión:', error)
      }
    }
  }

  return (
    <MainLayout 
      user={session.user} 
      onLogout={handleLogout}
    />
  )
}