// ============================================
// MAIN LAYOUT TEMPLATE - CHETANGO
// ============================================

import { Outlet, Link } from 'react-router-dom'
import { Button } from '@/design-system/atoms/Button'
import { SYMBOLS } from '@/design-system/tokens'
import styles from './MainLayout.module.scss'

interface NavItem {
  label: string
  path: string
  icon?: string
}

interface MainLayoutProps {
  user?: {
    name?: string
    email: string
    roles?: string[]
  } | null
  onLogout?: () => void
  navigationItems?: NavItem[]
  roleSelector?: React.ReactNode
}

const MainLayout = ({ user, onLogout, navigationItems = [], roleSelector }: MainLayoutProps) => {

  return (
    <div className={styles['main-layout']}>
      {/* Header */}
      <header className={styles['header']}>
        <div className={styles['header__brand']}>
          <h1 className={styles['header__title']}>Chetango</h1>
        </div>
        
        <nav className={styles['header__nav']}>
          {navigationItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={styles['nav-link']}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles['header__user']}>
          {roleSelector}
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