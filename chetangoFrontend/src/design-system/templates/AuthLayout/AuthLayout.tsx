import type { ReactNode } from 'react'
import styles from './AuthLayout.module.scss'

interface AuthLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
  showLogo?: boolean
  className?: string
}

export function AuthLayout({ 
  children, 
  title = "Chetango",
  subtitle = "Academia de Baile",
  showLogo = true,
  className = '' 
}: AuthLayoutProps) {
  const wrapperClasses = [
    styles['auth-layout'],
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={wrapperClasses}>
      {/* Animated background */}
      <div className={styles['auth-layout__background']}>
        <div className={styles['auth-layout__background-pattern']} />
        <div className={styles['auth-layout__background-glow']} />
      </div>

      {/* Main content */}
      <div className={styles['auth-layout__content']}>
        {showLogo && (
          <div className={styles['auth-layout__brand']}>
            <div className={styles['auth-layout__logo']}>
              <div className={styles['auth-layout__logo-icon']}>
                <span className={styles['auth-layout__logo-text']}>C</span>
              </div>
            </div>
            <div className={styles['auth-layout__brand-text']}>
              <h1 className={styles['auth-layout__title']}>{title}</h1>
              <p className={styles['auth-layout__subtitle']}>{subtitle}</p>
            </div>
          </div>
        )}

        <div className={styles['auth-layout__form-container']}>
          {children}
        </div>
      </div>

      {/* Footer */}
      <footer className={styles['auth-layout__footer']}>
        <p className={styles['auth-layout__footer-text']}>
          © 2025 Chetango. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  )
}