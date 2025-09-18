import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMsal } from '@azure/msal-react'
import { useAppDispatch } from '@/app/store/hooks'
import { setLoading, setError, setInitialized } from '@/features/auth'
import { ROUTES } from '@/shared/constants/routes'
import styles from './AuthCallbackPage.module.scss'

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const { instance } = useMsal()
  const dispatch = useAppDispatch()
  
  // Obtener URL de retorno del sessionStorage (guardada antes del login)
  const getReturnUrl = () => {
    const saved = sessionStorage.getItem('returnUrl')
    sessionStorage.removeItem('returnUrl') // Limpiar después de usar
    return saved || ROUTES.DASHBOARD
  }

  useEffect(() => {
    const handleCallback = async () => {
      try {
     
        dispatch(setLoading(true))
        
        // Verificar si MSAL está inicializado
        const config = instance.getConfiguration()
        if (!config) {
          throw new Error('MSAL no está configurado correctamente')
        }
                
        // Handle redirect response
        const response = await instance.handleRedirectPromise()
                
        if (response && response.account) {
          // Login successful
          instance.setActiveAccount(response.account)
          dispatch(setInitialized(true))
          const returnUrl = getReturnUrl()
          navigate(returnUrl, { replace: true })
        } else {
          // Check if there's already an active account
          const accounts = instance.getAllAccounts()
          
          if (accounts.length > 0) {
            instance.setActiveAccount(accounts[0])
            dispatch(setInitialized(true))
            const returnUrl = getReturnUrl()
            navigate(returnUrl, { replace: true })
          } else {
            // No account, redirect to login
            navigate(ROUTES.LOGIN, { replace: true })
          }
        }
      } catch (error) {
        dispatch(setError(error instanceof Error ? error.message : 'Error de autenticación'))
        navigate(ROUTES.LOGIN, { replace: true })
      } finally {
        dispatch(setLoading(false))
      }
    }

    // Pequeño delay para asegurar que MSAL esté listo
    const timer = setTimeout(handleCallback, 100)
    return () => clearTimeout(timer)
  }, [instance, navigate, dispatch])

  return (
    <div className={styles['auth-callback']}>
      <div className={styles['auth-callback__container']}>
        <div className={styles['auth-callback__spinner']}>
          <div className={styles['spinner']} />
        </div>
        <h2 className={styles['auth-callback__title']}>
          Procesando autenticación...
        </h2>
        <p className={styles['auth-callback__subtitle']}>
          Por favor espera mientras completamos tu inicio de sesión
        </p>
      </div>
    </div>
  )
}