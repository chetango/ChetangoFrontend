import { ROUTES } from '@/shared/constants/routes'
import type { AccountInfo, PublicClientApplication, SilentRequest } from '@azure/msal-browser'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

interface AuthInterceptorConfig {
  msalInstance: PublicClientApplication
  accounts: AccountInfo[]
  tokenRequest: SilentRequest
}

export const setupAuthInterceptor = (
  httpClient: AxiosInstance,
  { msalInstance, accounts, tokenRequest }: AuthInterceptorConfig
) => {
  console.log('[Auth Interceptor] Setting up with', accounts.length, 'accounts')
  
  // Request interceptor - Add token to headers
  const requestId = httpClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      console.log('[Auth Interceptor] Request to:', config.url, 'Accounts:', accounts.length)
      
      if (accounts.length > 0) {
        try {
          console.log('[Auth Interceptor] Acquiring token silently...')
          const response = await msalInstance.acquireTokenSilent({
            ...tokenRequest,
            account: accounts[0],
          })
          config.headers.Authorization = `Bearer ${response.accessToken}`
          console.log('[Auth Interceptor] Token added to request')
        } catch (error) {
          console.error('[Auth Interceptor] Silent token acquisition failed:', error)
          // Para CUALQUIER error de token (timeout, interacción requerida, etc.), intentar popup
          try {
            console.log('[Auth Interceptor] Attempting interactive token acquisition...')
            const response = await msalInstance.acquireTokenPopup({
              ...tokenRequest,
              account: accounts[0],
            })
            config.headers.Authorization = `Bearer ${response.accessToken}`
            console.log('[Auth Interceptor] Token from popup added successfully')
          } catch (popupError) {
            console.error('[Auth Interceptor] Interactive token acquisition failed:', popupError)
            // Si falla popup también, redirigir a login
            console.warn('[Auth Interceptor] Forcing re-login due to token acquisition failure')
            window.location.href = ROUTES.LOGIN
          }
        }
      } else {
        console.warn('[Auth Interceptor] No accounts available, request will be unauthenticated')
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  // Response interceptor - Handle 401 errors
  const responseId = httpClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        console.warn('[Auth Interceptor] 401 received')
        // Solo hacer logout si realmente no hay sesión válida
        const currentAccounts = msalInstance.getAllAccounts()
        if (currentAccounts.length === 0) {
          console.warn('[Auth Interceptor] No accounts, redirecting to login')
          window.location.href = ROUTES.LOGIN
        }
      }
      return Promise.reject(error)
    }
  )

  // Return cleanup function
  return () => {
    httpClient.interceptors.request.eject(requestId)
    httpClient.interceptors.response.eject(responseId)
  }
}
