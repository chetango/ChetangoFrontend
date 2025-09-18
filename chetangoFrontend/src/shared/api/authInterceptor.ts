import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { useMsal } from '@azure/msal-react'
import { tokenRequest } from '@/features/auth/api/msalConfig'
import { ROUTES } from '@/shared/constants/routes'

// INTERCEPTOR PARA TOKENS MSAL
export const createAuthInterceptor = () => {
  const { instance, accounts } = useMsal()

  const requestInterceptor = async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
    if (accounts.length > 0) {
      try {
        const response = await instance.acquireTokenSilent({
          ...tokenRequest,
          account: accounts[0],
        })
        
        if (config.headers) {
          config.headers.Authorization = `Bearer ${response.accessToken}`
        }
      } catch (error) {
        console.warn('Failed to acquire token silently:', error)
      }
    }
    
    return config
  }

  const responseInterceptor = (response: AxiosResponse) => response

  const errorInterceptor = async (error: any) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, try to logout
      try {
        await instance.logoutPopup()
      } catch (logoutError) {
        console.error('Logout failed:', logoutError)
      }
      window.location.href = ROUTES.LOGIN
    }
    
    return Promise.reject(error)
  }

  return {
    requestInterceptor,
    responseInterceptor,
    errorInterceptor,
  }
}