import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMsal } from '@azure/msal-react'
import { useAppDispatch } from '@/app/store/hooks'
import { setLoading, setError, setInitialized } from '@/features/auth/store/authSlice'
import { ROUTES } from '@/shared/constants/routes'
import styles from './AuthCallback.module.scss'

export function AuthCallback() {
  const navigate = useNavigate()
  const { instance } = useMsal()
  const dispatch = useAppDispatch()
  
  const getReturnUrl = () => {
    const saved = sessionStorage.getItem('returnUrl')
    sessionStorage.removeItem('returnUrl')
    return saved || ROUTES.DASHBOARD
  }

  useEffect(() => {
    const handleCallback = async () => {
      try {
        dispatch(setLoading(true))
        await instance.initialize()
        
        const response = await instance.handleRedirectPromise()
        
        if (response?.account) {
          instance.setActiveAccount(response.account)
          dispatch(setInitialized(true))
          navigate(getReturnUrl(), { replace: true })
        } else {
          const accounts = instance.getAllAccounts()
          if (accounts.length > 0) {
            instance.setActiveAccount(accounts[0])
            dispatch(setInitialized(true))
            navigate(getReturnUrl(), { replace: true })
          } else {
            navigate(ROUTES.LOGIN, { replace: true })
          }
        }
      } catch (error) {
        dispatch(setError(error instanceof Error ? error.message : 'Error de autenticacion'))
        navigate(ROUTES.LOGIN, { replace: true })
      } finally {
        dispatch(setLoading(false))
      }
    }

    handleCallback()
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