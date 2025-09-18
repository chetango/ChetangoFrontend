import { useEffect } from 'react'
import { useMsal } from '@azure/msal-react'
import { httpClient } from '@/shared/api/httpClient'
import { tokenRequest } from '@/features/auth/api/msalConfig'
import { ROUTES } from '@/shared/constants/routes'

export const useAuthInterceptor = () => {
  const { instance, accounts } = useMsal()

  useEffect(() => {
    // Request interceptor
    const requestInterceptor = httpClient.interceptors.request.use(
      async (config) => {
        if (accounts.length > 0) {
          try {
            const response = await instance.acquireTokenSilent({
              ...tokenRequest,
              account: accounts[0],
            })
            
            config.headers = config.headers || {}
            config.headers.Authorization = `Bearer ${response.accessToken}`
          } catch (error) {
            console.warn('Failed to acquire token silently:', error)
          }
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    const responseInterceptor = httpClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          try {
            await instance.logoutPopup()
          } catch (logoutError) {
            console.error('Logout failed:', logoutError)
          }
          window.location.href = ROUTES.LOGIN
        }
        return Promise.reject(error)
      }
    )

    // Cleanup interceptors on unmount
    return () => {
      httpClient.interceptors.request.eject(requestInterceptor)
      httpClient.interceptors.response.eject(responseInterceptor)
    }
  }, [instance, accounts])
}