// ============================================
// ROLE SELECTOR COMPONENT - CHETANGO
// ============================================

import { useActiveRole } from '@/features/auth/hooks/useActiveRole'
import { Button } from '@/design-system/atoms/Button'
import styles from './RoleSelector.module.scss'

const ROLE_LABELS = {
  admin: 'Administrador',
  alumno: 'Estudiante',
  profesor: 'Profesor',
} as const

interface RoleSelectorProps {
  className?: string
}

export const RoleSelector = ({ className }: RoleSelectorProps) => {
  const { activeRole, availableRoles, switchRole, hasMultipleRoles } = useActiveRole()

  // Si solo tiene un rol, no mostrar selector
  if (!hasMultipleRoles) return null

  return (
    <div className={`${styles['role-selector']} ${className || ''}`}>
      <span className={styles['role-selector__label']}>
        Rol activo:
      </span>
      <div className={styles['role-selector__buttons']}>
        {availableRoles.map((role) => (
          <Button
            key={role}
            onClick={() => switchRole(role)}
            variant={activeRole === role ? 'primary' : 'secondary'}
            size="sm"
            className={styles['role-button']}
          >
            {ROLE_LABELS[role as keyof typeof ROLE_LABELS] || role}
          </Button>
        ))}
      </div>
    </div>
  )
}