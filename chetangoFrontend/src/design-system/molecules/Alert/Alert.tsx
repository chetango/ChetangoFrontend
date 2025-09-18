import type { ReactNode } from 'react'
import styles from './Alert.module.scss'

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  children: ReactNode
  onClose?: () => void
  className?: string
}

export function Alert({
  variant = 'info',
  title,
  children,
  onClose,
  className = ''
}: AlertProps) {
  const wrapperClasses = [
    styles.alert,
    styles[`alert--${variant}`],
    className
  ].filter(Boolean).join(' ')

  const getIcon = () => {
    switch (variant) {
      case 'success':
        return '✓'
      case 'warning':
        return '⚠'
      case 'error':
        return '✕'
      default:
        return 'ℹ'
    }
  }

  return (
    <div className={wrapperClasses} role="alert">
      <div className={styles['alert__icon']}>
        {getIcon()}
      </div>
      
      <div className={styles['alert__content']}>
        {title && (
          <div className={styles['alert__title']}>
            {title}
          </div>
        )}
        <div className={styles['alert__message']}>
          {children}
        </div>
      </div>
      
      {onClose && (
        <button
          className={styles['alert__close']}
          onClick={onClose}
          aria-label="Cerrar alerta"
        >
          ✕
        </button>
      )}
    </div>
  )
}