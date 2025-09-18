import { useCallback } from 'react'
import { useMsal } from '@azure/msal-react'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { setLoading, setError, setInitialized, clearError } from '@/features/auth/store/authSlice'
import { loginRequest, tokenRequest } from '@/features/auth/api/msalConfig'
import { mapAccountToUser } from '@/features/auth/types/authTypes'
import type { SessionType, AuthContextType } from '@/features/auth/types/authTypes'

export const useAuth = (): AuthContextType => {
  const { instance, accounts } = useMsal()
  const dispatch = useAppDispatch()
  const authState = useAppSelector((state) => state.auth)

  // ESTADO DE SESIÓN DERIVADO DE MSAL
  const session: SessionType = {
    user: accounts.length > 0 ? mapAccountToUser(accounts[0]) : null,
    isAuthenticated: accounts.length > 0,
    accessToken: null, // Se obtiene dinámicamente
    expiresAt: null,
  }

  // LOGIN
  const login = useCallback(async () => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      await instance.loginPopup(loginRequest)
      
      dispatch(setInitialized(true))
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Error de login'))
    } finally {
      dispatch(setLoading(false))
    }
  }, [instance, dispatch])

  // LOGOUT
  const logout = useCallback(async () => {
    try {
      dispatch(setLoading(true))
      await instance.logoutPopup()
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Error de logout'))
    } finally {
      dispatch(setLoading(false))
    }
  }, [instance, dispatch])

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
        dispatch(setError('Error obteniendo token'))
        return null
      }
    }
  }, [instance, accounts, dispatch])

  return {
    session,
    authState,
    login,
    logout,
    getAccessToken,
  }
}