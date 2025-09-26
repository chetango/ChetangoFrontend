import { useCallback, useEffect } from 'react'
import { useMsal } from '@azure/msal-react'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { setLoading, setInitialized, clearError } from '@/features/auth/store/authSlice'
import { loginRequest, tokenRequest } from '@/features/auth/api/msalConfig'
import { mapAccountToUser } from '@/features/auth/types/authTypes'
import { useErrorHandler } from '@/shared/hooks/useErrorHandler'
import type { SessionType, AuthContextType } from '@/features/auth/types/authTypes'

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
  }, [inProgress, authState.isInitialized, dispatch, accounts, instance])

  // ESTADO DE SESIÓN DERIVADO DE MSAL
  const session: SessionType = {
    user: accounts.length > 0 ? mapAccountToUser(accounts[0]) : null,
    isAuthenticated: accounts.length > 0,
    accessToken: null, // Se obtiene dinámicamente
    expiresAt: null,
  }

  // LOGIN
  const login = useCallback(async (returnUrl?: string) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      // Guardar URL de retorno si se proporciona
      if (returnUrl) {
        sessionStorage.setItem('returnUrl', returnUrl)
      }
      
      // Usar redirect para External ID
      await instance.loginRedirect(loginRequest)
      
      // No dispatch setInitialized aquí porque redirect cambia de página
    } catch (error) {
      handleError(error, { fallbackMessage: 'Error de login' })
      dispatch(setLoading(false))
    }
  }, [instance, dispatch, handleError])

  // LOGOUT
  const logout = useCallback(async () => {
    try {
      dispatch(setLoading(true))
      // Usar redirect para External ID
      await instance.logoutRedirect({
        postLogoutRedirectUri: window.location.origin + '/login'
      })
    } catch (error) {
      handleError(error, { fallbackMessage: 'Error de logout' })
      dispatch(setLoading(false))
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