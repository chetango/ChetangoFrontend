import { useState } from 'react'
import { Button } from '@/design-system/atoms/Button'
import { FormField } from '@/design-system/molecules/FormField'
import { useAuth } from '@/features/auth'
import styles from './LoginForm.module.scss'

interface LoginFormProps {
  onSuccess?: () => void
  className?: string
}

export function LoginForm({ onSuccess, className = '' }: LoginFormProps) {
  const { login, authState } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}
    
    if (!email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Ingresa un email válido'
    }
    
    if (!password.trim()) {
      newErrors.password = 'La contraseña es requerida'
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
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
    <form className={wrapperClasses} onSubmit={handleSubmit} noValidate>
      <div className={styles['login-form__header']}>
        <h2 className={styles['login-form__title']}>
          Iniciar Sesión
        </h2>
        <p className={styles['login-form__subtitle']}>
          Accede a tu cuenta de Chetango
        </p>
      </div>

      <div className={styles['login-form__fields']}>
        <FormField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          placeholder="tu@email.com"
          isRequired
          disabled={authState.isLoading}
          leftIcon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          }
        />

        <FormField
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          placeholder="••••••••"
          isRequired
          disabled={authState.isLoading}
          leftIcon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18,8h-1V6c0-2.76-2.24-5-5-5S7,3.24,7,6v2H6c-1.1,0-2,0.9-2,2v10c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V10C20,8.9,19.1,8,18,8z M12,17c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S13.1,17,12,17z M15.1,8H8.9V6c0-1.71,1.39-3.1,3.1-3.1s3.1,1.39,3.1,3.1V8z"/>
            </svg>
          }
        />
      </div>

      {authState.error && (
        <div className={styles['login-form__error']} role="alert">
          {authState.error}
        </div>
      )}

      <div className={styles['login-form__actions']}>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={authState.isLoading}
          className={styles['login-form__submit']}
        >
          {authState.isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>
      </div>

      <div className={styles['login-form__footer']}>
        <p className={styles['login-form__help']}>
          ¿Primera vez en Chetango?{' '}
          <span className={styles['login-form__link']}>
            Regístrate aquí
          </span>
        </p>
      </div>
    </form>
  )
}