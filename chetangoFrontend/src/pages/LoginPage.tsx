import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LoginForm, useAuth } from '@/features/auth'
import { ROUTES, ROUTE_ACCESS } from '@/shared/constants/routes'

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
  
  // Determinar URL de destino según el rol del usuario
  const getDestinationUrl = () => {
    if (isValidReturnUrl(rawReturnUrl)) return rawReturnUrl
    if (session.user?.roles) {
      return ROUTE_ACCESS.getDefaultRoute(session.user.roles)
    }
    return ROUTES.DASHBOARD
  }

  // Redirect if already authenticated
  useEffect(() => {
    if (session.isAuthenticated) {
      const destinationUrl = getDestinationUrl()
      navigate(destinationUrl, { replace: true })
    }
  }, [session.isAuthenticated, navigate])

  const handleLoginSuccess = () => {
    const destinationUrl = getDestinationUrl()
    navigate(destinationUrl, { replace: true })
  }

  return <LoginForm onSuccess={handleLoginSuccess} />
}

export default LoginPage