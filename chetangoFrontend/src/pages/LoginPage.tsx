import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthLayout } from '@/design-system/templates/AuthLayout'
import { LoginForm, useAuth } from '@/features/auth'
import { ROUTES } from '@/shared/constants/routes'

// Validar que la URL sea interna y segura
function isValidReturnUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false
  // Solo permitir rutas internas que empiecen con /
  return url.startsWith('/') && !url.startsWith('//')
}

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { session } = useAuth()
  
  // Obtener URL de retorno del state con validación
  const rawReturnUrl = location.state?.returnUrl
  const returnUrl = isValidReturnUrl(rawReturnUrl) ? rawReturnUrl : ROUTES.DASHBOARD

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

export default LoginPage