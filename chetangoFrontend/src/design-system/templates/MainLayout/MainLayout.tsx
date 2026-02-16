// ============================================
// MAIN LAYOUT TEMPLATE - CHETANGO
// ============================================

import { ProfileDropdown } from '@/design-system/molecules/ProfileDropdown'
import { NotificationDropdown } from '@/features/notifications'
import { useGlobalSearch } from '@/features/search'
import { useSolicitudesClasePrivadaPendientes, useSolicitudesRenovacionPendientes } from '@/features/solicitudes/api/solicitudesQueries'
import type { SolicitudClasePrivadaDTO, SolicitudRenovacionPaqueteDTO } from '@/features/solicitudes/types/solicitudesTypes'
import { getPrimaryRoleText } from '@/shared/utils'
import { Bell, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import styles from './MainLayout.module.scss'

interface NavItem {
  label: string
  path: string
  icon?: any
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
  onOpenRenovacion?: (solicitud: SolicitudRenovacionPaqueteDTO) => void
  onOpenClasePrivada?: (solicitud: SolicitudClasePrivadaDTO) => void
}

const MainLayout = ({ 
  user, 
  onLogout, 
  navigationItems = [], 
  // roleSelector, // Commented: not used in current implementation
  onOpenRenovacion,
  onOpenClasePrivada 
}: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [hasViewedNotifications, setHasViewedNotifications] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  
  const isAdmin = user?.roles?.includes('admin')
  const userRole = isAdmin ? 'admin' : (user?.roles?.includes('profesor') ? 'profesor' : 'alumno')
  const { navigate: handleSearch } = useGlobalSearch(userRole)
  
  // Solo cargar solicitudes si es admin
  const { data: renovaciones = [] } = useSolicitudesRenovacionPendientes(isAdmin)
  const { data: clasesPrivadas = [] } = useSolicitudesClasePrivadaPendientes(isAdmin)

  const isActive = (path: string) => location.pathname === path
  const roleText = getPrimaryRoleText(user?.roles)
  const totalNotifications = renovaciones.length + clasesPrivadas.length
  
  // Mostrar badge solo si hay notificaciones Y no han sido vistas
  const showBadge = totalNotifications > 0 && !hasViewedNotifications

  // Resetear "vistas" cuando cambian las notificaciones (llegan nuevas)
  useEffect(() => {
    if (totalNotifications > 0) {
      setHasViewedNotifications(false)
    }
  }, [totalNotifications])

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false)
      }
    }

    if (showNotifications || showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications, showProfileDropdown])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      handleSearch(searchQuery)
      setSearchQuery('')
    }
  }

  const handleUserClick = () => {
    setShowProfileDropdown(!showProfileDropdown)
  }

  const handleToggleNotifications = () => {
    if (!showNotifications) {
      // Al abrir, marcar como vistas
      setHasViewedNotifications(true)
    }
    setShowNotifications(!showNotifications)
  }

  return (
    <div className={styles['main-layout']}>
      {/* Sidebar */}
      <aside className={`${styles['sidebar']} ${sidebarOpen ? styles['sidebar--open'] : styles['sidebar--closed']}`}>
        {/* Sidebar Header */}
        <div className={styles['sidebar__header']}>
          <div className={styles['sidebar__brand']}>
            <div className={styles['brand__icon']}>C</div>
            <div className={styles['brand__text']}>
              <h1 className={styles['brand__title']}>Chetango</h1>
              <p className={styles['brand__subtitle']}>{roleText}</p>
            </div>
          </div>
          {/* Línea horizontal del header (no llega al borde derecho) */}
          <div className={styles['sidebar__header-line']}></div>
        </div>

        {/* Línea vertical del sidebar (empieza después del header) */}
        <div className={styles['sidebar__vertical-line']}></div>

        {/* Navigation */}
        <nav className={styles['sidebar__nav']}>
          {navigationItems.map((item) => {
            const IconComponent = item.icon
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`${styles['nav-item']} ${isActive(item.path) ? styles['nav-item--active'] : ''}`}
              >
                {IconComponent && (
                  <span className={styles['nav-item__icon']}>
                    <IconComponent size={20} />
                  </span>
                )}
                {sidebarOpen && <span className={styles['nav-item__label']}>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Toggle Button at Bottom */}
        <button 
          className={styles['sidebar__toggle']}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </aside>

      {/* Main Container */}
      <div className={styles['main-container']}>
        {/* Top Header - Simplificado */}
        <header className={styles['header']}>
          <div className={styles['header__left']}>
            {/* Indicador Sistema Activo - Discreto */}
            <div className={styles['status-badge']}>
              <span className={styles['status-badge__dot']}></span>
              <span className={styles['status-badge__text']}>Sistema Activo</span>
            </div>
          </div>

          <div className={styles['header__right']}>
            {/* Búsqueda */}
            <form onSubmit={handleSearchSubmit} className={styles['header__search']}>
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Buscar..." 
                className={styles['search-input']}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            
            {/* Notificaciones - Solo Admin */}
            {isAdmin && (
              <div className={styles['header__icon-btn-wrapper']} ref={notificationRef}>
                <button 
                  className={styles['header__icon-btn']} 
                  aria-label="Notificaciones"
                  onClick={handleToggleNotifications}
                >
                  <Bell size={20} />
                  {showBadge && (
                    <span className={styles['notification-badge']}>{totalNotifications}</span>
                  )}
                </button>
                
                {showNotifications && (
                  <NotificationDropdown
                    onClose={() => setShowNotifications(false)}
                    onOpenRenovacion={onOpenRenovacion}
                    onOpenClasePrivada={onOpenClasePrivada}
                  />
                )}
              </div>
            )}
            
            {/* Perfil con Dropdown */}
            <div className={styles['header__icon-btn-wrapper']} ref={profileRef}>
              <button 
                className={styles['header__user']}
                onClick={handleUserClick}
              >
                <div className={styles['user-avatar']}>
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                {user && (
                  <span className={styles['user-name-compact']}>
                    {user.name?.split(' ')[0] || 'Usuario'}
                  </span>
                )}
              </button>
              
              {showProfileDropdown && onLogout && (
                <ProfileDropdown
                  userName={user?.name || user?.email || 'Usuario'}
                  userRole={roleText}
                  onLogout={onLogout}
                  onClose={() => setShowProfileDropdown(false)}
                />
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className={styles['main-content']}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout