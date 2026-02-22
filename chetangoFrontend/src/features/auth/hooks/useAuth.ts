import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { loginRequest, tokenRequest } from '@/features/auth/api/msalConfig'
import { clearError, setInitialized, setLoading } from '@/features/auth/store/authSlice'
import type { AuthContextType, SessionType } from '@/features/auth/types/authTypes'
import { mapAccountToUser } from '@/features/auth/types/authTypes'
import { useErrorHandler } from '@/shared/hooks/useErrorHandler'
import { useMsal } from '@azure/msal-react'
import { useCallback, useEffect } from 'react'

export const useAuth = (): AuthContextType => {
  const { instance, accounts, inProgress } = useMsal()
  const dispatch = useAppDispatch()
  const authState = useAppSelector((state) => state.auth)
  const { handleError } = useErrorHandler()

  // Inicializar cuando MSAL esté listo
  useEffect(() => {
    if (inProgress === 'none' && !authState.isInitialized) {
      dispatch(setInitialized(true))
    }
    
    // Timeout de seguridad: si después de 3 segundos no se inicializa, forzar inicialización
    // Esto previene que la app se quede en "Cargando..." indefinidamente
    if (!authState.isInitialized) {
      const timeout = setTimeout(() => {
        console.warn('[useAuth] Forcing initialization after timeout')
        dispatch(setInitialized(true))
      }, 3000)
      
      return () => clearTimeout(timeout)
    }
  }, [inProgress, authState.isInitialized, dispatch, accounts, instance])

  // ESTADO DE SESIÓN DERIVADO DE MSAL
  const session: SessionType = {
    user: accounts.length > 0 ? mapAccountToUser(accounts[0]) : null,
    isAuthenticated: accounts.length > 0,
  }

  // LOGIN
  const login = useCallback(async (returnUrl?: string, forceAccountSelection?: boolean) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      // Guardar URL de retorno si se proporciona
      if (returnUrl) {
        sessionStorage.setItem('returnUrl', returnUrl)
      }
      
      // Decidir si forzar selección de cuenta
      // - Si viene de logout (forceAccountSelection=true): Forzar selección
      // - Si es visita normal: Intentar login silencioso primero
      const loginConfig = forceAccountSelection 
        ? { ...loginRequest, prompt: 'select_account' as const }
        : loginRequest
      
      // Usar redirect para External ID
      await instance.loginRedirect(loginConfig)
      
      // No dispatch setInitialized aquí porque redirect cambia de página
    } catch (error) {
      handleError(error, { fallbackMessage: 'Error de login' })
      dispatch(setLoading(false))
    }
  }, [instance, dispatch, handleError])

  // LOGOUT COMPLETO - Limpia TODA la sesión para permitir cambio de usuario
  const logout = useCallback(async () => {
    try {
      dispatch(setLoading(true))
      
      // 1. Limpiar sessionStorage completamente
      sessionStorage.clear()
      
      // 2. Limpiar localStorage por si acaso (aunque no lo usamos)
      localStorage.clear()
      
      // 3. Limpiar cookies manualmente
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)
      })
      
      // 4. Marcar que el logout fue intencional (para forzar selección en próximo login)
      sessionStorage.setItem('logoutIntencional', 'true')
      
      // 5. Logout de Azure AD
      // Esto asegura que la próxima vez pregunte qué cuenta usar
      await instance.logoutRedirect({
        postLogoutRedirectUri: window.location.origin + '/login',
        // Opcional: descomentar si quieres que elimine la cuenta del browser también
        // account: accounts[0]
      })
      
      // NOTA: No necesitas dispatch(setLoading(false)) porque logoutRedirect
      // hace un redirect completo y la página se recarga
    } catch (error) {
      handleError(error, { fallbackMessage: 'Error de logout' })
      dispatch(setLoading(false))
      
      // Si falla el logout de Azure, al menos limpiamos local y redirigimos
      sessionStorage.clear()
      localStorage.clear()
      sessionStorage.setItem('logoutIntencional', 'true')
      window.location.href = '/login'
    }
  }, [instance, dispatch, handleError])

  // OBTENER ACCESS TOKEN
  const getAccessToken = useCallback(async (): Promise<string | null> => {
    if (accounts.length === 0) return null

    try {
      const response = await instance.acquireTokenSilent({
        ...tokenRequest,
        account: accounts[0],
      })
      return response.accessToken
    } catch (error) {
      // Si falla token silencioso, intentar popup
      try {
        const response = await instance.acquireTokenPopup(tokenRequest)
        return response.accessToken
      } catch (popupError) {
        handleError(popupError, { fallbackMessage: 'Error obteniendo token' })
        return null
      }
    }
  }, [instance, accounts, dispatch])

  // STATUS DERIVADO PARA GUARDS
  let status: 'unknown' | 'unauthenticated' | 'authenticated'
  if (!authState.isInitialized) {
    status = 'unknown'
  } else if (session.isAuthenticated) {
    status = 'authenticated'
  } else {
    status = 'unauthenticated'
  }

  return {
    session,
    authState,
    status,
    login,
    logout,
    getAccessToken,
  }
}