import { Button } from '@/design-system/atoms/Button'
import { useAuth } from '@/features/auth'
import styles from './LoginForm.module.scss'

interface LoginFormProps {
  onSuccess?: () => void
  className?: string
}

export function LoginForm({ onSuccess, className = '' }: LoginFormProps) {
  const { login, authState } = useAuth()

  const handleLogin = async () => {
    try {
      await login()
      onSuccess?.()
    } catch (error) {
      // Error handling is managed by the auth hook
    }
  }

  const wrapperClasses = [
    styles['login-form'],
    authState.isLoading && styles['login-form--loading'],
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={wrapperClasses}>
      <div className={styles['login-form__header']}>
        <h2 className={styles['login-form__title']}>
          Iniciar Sesión
        </h2>
        <p className={styles['login-form__subtitle']}>
          Accede a tu cuenta de Chetango
        </p>
      </div>

      {authState.error && (
        <div className={styles['login-form__error']} role="alert">
          {authState.error}
        </div>
      )}

      <div className={styles['login-form__actions']}>
        <Button
          onClick={handleLogin}
          variant="primary"
          size="lg"
          disabled={authState.isLoading}
          className={styles['login-form__submit']}
        >
       
          {authState.isLoading ? 'Conectando...' : 'Continuar con Microsoft'}
        </Button>
      </div>

      <div className={styles['login-form__footer']}>
        <p className={styles['login-form__help']}>
          Usa tu cuenta de Microsoft para acceder a Chetango
        </p>
      </div>
    </div>
  )
}