// ============================================
// CLICKABLE AVATAR COMPONENT
// ============================================

import { useUserQuickView } from '../../hooks/useUserQuickView'
import type { UserType } from '../../types/userQuickViewTypes'
import styles from './ClickableAvatar.module.scss'

interface ClickableAvatarProps {
  /** ID del usuario (alumno o profesor) */
  userId: string
  /** Tipo de usuario */
  userType: UserType
  /** Nombre del usuario para mostrar iniciales */
  nombre: string
  /** Texto secundario (ej: documento) */
  secondaryText?: string
  /** Tamaño del avatar */
  size?: 'sm' | 'md' | 'lg'
  /** Si se muestra información adicional al lado del avatar */
  showInfo?: boolean
  /** Clase CSS adicional */
  className?: string
}

/**
 * Avatar clicable que abre el Quick View Modal
 * Reutilizable en cualquier parte de la app donde aparezcan usuarios
 * 
 * @example
 * <ClickableAvatar 
 *   userId={alumno.idAlumno}
 *   userType="alumno"
 *   nombre={alumno.nombre}
 *   secondaryText={alumno.documento}
 *   showInfo
 * />
 */
export function ClickableAvatar({
  userId,
  userType,
  nombre,
  secondaryText,
  size = 'md',
  showInfo = false,
  className = '',
}: ClickableAvatarProps) {
  const { openQuickView } = useUserQuickView()
  
  const getInitials = (name: string) => {
    if (!name) return '??'
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  
  const initials = getInitials(nombre)
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    openQuickView(userId, userType)
  }
  
  const sizeClass = styles[`avatar--${size}`]
  
  return (
    <div 
      className={`${styles.container} ${showInfo ? styles['container--with-info'] : ''} ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e as any)
        }
      }}
      aria-label={`Ver información de ${nombre}`}
    >
      <div className={`${styles.avatar} ${sizeClass}`}>
        {initials}
      </div>
      
      {showInfo && (
        <div className={styles.info}>
          <span className={styles.info__name}>{nombre}</span>
          {secondaryText && (
            <span className={styles.info__secondary}>{secondaryText}</span>
          )}
        </div>
      )}
    </div>
  )
}
