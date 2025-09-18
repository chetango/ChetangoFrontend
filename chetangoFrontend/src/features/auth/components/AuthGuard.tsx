import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ROUTES } from '@/shared/constants/routes'
import styles from './AuthGuard.module.scss'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
}

export function AuthGuard({ 
  children, 
  fallback,
  redirectTo = ROUTES.LOGIN 
}: AuthGuardProps) {
  const { session, authState } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (authState.isInitialized && !session.isAuthenticated) {
      // Guardar la URL actual para redirigir después del login
      const returnUrl = location.pathname + location.search
      navigate(redirectTo, { 
        replace: true,
        state: { returnUrl }
      })
    }
  }, [session.isAuthenticated, authState.isInitialized, navigate, redirectTo, location])

  // Show loading while initializing
  if (!authState.isInitialized || authState.isLoading) {
    return fallback || (
      <div className={styles['auth-guard']}>
        <div className={styles['auth-guard__container']}>
          <div className={styles['auth-guard__spinner']}>
            <div className={styles['spinner']} />
          </div>
          <p className={styles['auth-guard__text']}>
            Verificando autenticación...
          </p>
        </div>
      </div>
    )
  }

  // Show nothing while redirecting
  if (!session.isAuthenticated) {
    return null
  }

  // Show protected content
  return <>{children}</>
}