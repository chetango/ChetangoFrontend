import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthLayout } from '@/design-system/templates/AuthLayout'
import { LoginForm } from '@/design-system/organisms/LoginForm'
import { useAuth } from '@/features/auth'
import { ROUTES } from '@/shared/constants/routes'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { session } = useAuth()
  
  // Obtener URL de retorno del state
  const returnUrl = location.state?.returnUrl || ROUTES.DASHBOARD

  // Redirect if already authenticated
  useEffect(() => {
    if (session.isAuthenticated) {
      navigate(returnUrl, { replace: true })
    }
  }, [session.isAuthenticated, navigate, returnUrl])

  const handleLoginSuccess = () => {
    navigate(returnUrl, { replace: true })
  }

  return (
    <AuthLayout>
      <LoginForm onSuccess={handleLoginSuccess} />
    </AuthLayout>
  )
}