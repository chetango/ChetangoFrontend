// ============================================
// MAIN LAYOUT TEMPLATE - CHETANGO
// ============================================

import { Outlet, Link } from 'react-router-dom'
import { Button } from '@/design-system/atoms/Button'
import { SYMBOLS } from '@/design-system/tokens'
import styles from './MainLayout.module.scss'

// Rutas locales para evitar dependencia de shared
const ROUTES = {
  DASHBOARD: '/dashboard',
  ATTENDANCE: '/attendance',
  CLASSES: '/classes',
  PAYMENTS: '/payments',
  USERS: '/users',
  REPORTS: '/reports',
} as const

interface MainLayoutProps {
  user?: {
    name?: string
    email: string
  } | null
  onLogout?: () => void
}

const MainLayout = ({ user, onLogout }: MainLayoutProps) => {

  return (
    <div className={styles['main-layout']}>
      {/* Header */}
      <header className={styles['header']}>
        <div className={styles['header__brand']}>
          <h1 className={styles['header__title']}>Chetango</h1>
        </div>
        
        <nav className={styles['header__nav']}>
          <Link to={ROUTES.DASHBOARD} className={styles['nav-link']}>Dashboard</Link>
          <Link to={ROUTES.ATTENDANCE} className={styles['nav-link']}>Asistencia</Link>
          <Link to={ROUTES.CLASSES} className={styles['nav-link']}>Clases</Link>
          <Link to={ROUTES.PAYMENTS} className={styles['nav-link']}>Pagos</Link>
          <Link to={ROUTES.USERS} className={styles['nav-link']}>Usuarios</Link>
          <Link to={ROUTES.REPORTS} className={styles['nav-link']}>Reportes</Link>
        </nav>

        <div className={styles['header__user']}>
          {user && (
            <span className={styles['user-info']}>
              {user.name || user.email}
            </span>
          )}
          {onLogout && (
            <Button 
              onClick={onLogout} 
              variant="secondary" 
              size="sm"
              className={styles['logout-btn']}
            >
              Cerrar Sesión
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className={styles['main-content']}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className={styles['footer']}>
        <p>{SYMBOLS.COPYRIGHT} 2025 Chetango - Sistema de Gestión</p>
      </footer>
    </div>
  )
}

export default MainLayout