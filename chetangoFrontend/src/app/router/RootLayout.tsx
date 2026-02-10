// ============================================
// ROOT LAYOUT - GLOBAL MODALS
// ============================================

import { UserQuickViewModal, UserQuickViewProvider } from '@/features/users'
import { Outlet } from 'react-router-dom'

/**
 * Layout raíz que envuelve toda la aplicación
 * Renderiza modales globales que necesitan acceso al Router
 */
export function RootLayout() {
  return (
    <UserQuickViewProvider>
      <Outlet />
      <UserQuickViewModal />
    </UserQuickViewProvider>
  )
}
