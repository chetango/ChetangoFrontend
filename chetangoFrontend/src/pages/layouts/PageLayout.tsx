// ============================================
// PAGE LAYOUT - CHETANGO ADMIN
// Layout wrapper for admin pages with title and header
// ============================================

import type { ReactNode } from 'react'
import styles from '../PageStyles.module.scss'

interface PageLayoutProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  children: ReactNode
  actions?: ReactNode
}

/**
 * Page layout wrapper for admin pages
 * Provides consistent header with title, subtitle, and optional icon
 */
export function PageLayout({
  title,
  subtitle,
  icon,
  children,
  actions,
}: PageLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="p-2 rounded-lg bg-[#c93448]/20 text-[#c93448]">
              {icon}
            </div>
          )}
          <div>
            <h1 className={styles['page-title']}>{title}</h1>
            {subtitle && (
              <p className={styles['page-description']}>{subtitle}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Content */}
      {children}
    </div>
  )
}
