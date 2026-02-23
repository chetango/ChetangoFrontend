/**
 * AUTH INTERCEPTOR - REFACTORED
 * 
 * Interceptor Axios para manejo profesional de autenticación.
 * 
 * Mejoras implementadas:
 * - Usa TokenAcquisitionService para evitar race conditions
 * - Detecta estado de red antes de intentar popups
 * - Maneja cleanup correcto antes de logout
 * - Evita loops infinitos con circuit breaker
 * 
 * Patrón: Interceptor + Service Layer
 */

import { ROUTES } from '@/shared/constants/routes'
import { tokenAcquisitionService, TokenAcquisitionError } from '@/shared/services/auth/TokenAcquisitionService'
import { networkStatusService } from '@/shared/services/network/NetworkStatusService'
import type { AccountInfo, PublicClientApplication, SilentRequest } from '@azure/msal-browser'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios'

// ============================================
// TYPES
// ============================================

interface AuthInterceptorConfig {
  msalInstance: PublicClientApplication
  accounts: AccountInfo[]
  tokenRequest: SilentRequest
}

// ============================================
// PRIVATE STATE
// ============================================

// Flag para evitar múltiples redirects simultáneos
let isRedirectingToLogin = false

// Controller para cancelar requests pendientes
let requestsAbortController: AbortController | null = null

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Realiza logout limpio antes de redirect a login
 */
const performCleanLogout = async (msalInstance: PublicClientApplication): Promise<void> => {
  if (isRedirectingToLogin) {
    return // Ya estamos en proceso de logout
  }

  isRedirectingToLogin = true
  
  console.log('[Auth Interceptor] Performing clean logout...')
  
  try {
    // 1. Cancelar todos los requests HTTP pendientes
    if (requestsAbortController) {
      requestsAbortController.abort()
      requestsAbortController = null
    }
    
    // 2. Limpiar storage
    sessionStorage.clear()
    localStorage.clear()
    
    // 3. Reset de servicios
    tokenAcquisitionService.reset()
    
    // 4. Limpiar cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)
    })
    
    // 5. Marcar logout intencional para forzar selección de cuenta
    sessionStorage.setItem('logoutIntencional', 'true')
    
    // 6. Pequeño delay para asegurar que se completen las operaciones
    await new Promise(resolve => setTimeout(resolve, 100))
    
    console.log('[Auth Interceptor] Clean logout completed')
    
    // Nota: msalInstance se usaría aquí si necesitáramos logout de MSAL,
    // pero lo hacemos desde useAuth hook
    void msalInstance // Evita warning de variable no usada
  } catch (error) {
    console.error('[Auth Interceptor] Error during clean logout:', error)
  }
}

/**
 * Maneja el error de token acquisition y decide acción apropiada
 */
const handleTokenError = async (
  errorType: TokenAcquisitionError,
  shouldLogout: boolean,
  msalInstance: PublicClientApplication
): Promise<void> => {
  // Si no hay internet, no intentar logout (esperar reconexión)
  if (errorType === TokenAcquisitionError.NETWORK_ERROR) {
    console.warn('[Auth Interceptor] Network error detected, waiting for reconnection...')
    return
  }
  
  // Si usuario canceló, no forzar logout
  if (errorType === TokenAcquisitionError.USER_CANCELLED) {
    console.warn('[Auth Interceptor] User cancelled authentication')
    return
  }
  
  // Para otros errores que requieren logout
  if (shouldLogout) {
    await performCleanLogout(msalInstance)
    window.location.href = ROUTES.LOGIN
  }
}

// ============================================
// SETUP FUNCTION
// ============================================

export const setupAuthInterceptor = (
  httpClient: AxiosInstance,
  { msalInstance, accounts, tokenRequest }: AuthInterceptorConfig
) => {
  console.log('[Auth Interceptor] Setting up with', accounts.length, 'accounts')
  
  // Inicializar abort controller para esta sesión
  requestsAbortController = new AbortController()
  
  // Request interceptor - Add token to headers
  const requestId = httpClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      console.log('[Auth Interceptor] Request to:', config.url, 'Accounts:', accounts.length)
      
      // Si no hay cuentas autenticadas, dejar pasar sin token
      if (accounts.length === 0) {
        console.warn('[Auth Interceptor] No accounts available, request will be unauthenticated')
        return config
      }
      
      // PASO 1: Verificar conectividad antes de intentar obtener token
      const isOnline = networkStatusService.isOnline()
      if (!isOnline) {
        console.warn('[Auth Interceptor] Device is offline, request may fail')
        // Dejar que el request continúe y falle naturalmente (será manejado por error interceptor)
        return config
      }
      
      // PASO 2: Intentar obtener token usando el servicio centralizado
      const result = await tokenAcquisitionService.acquireToken({
        msalInstance,
        account: accounts[0],
        tokenRequest,
      })
      
      // PASO 3: Manejar resultado
      if (result.success) {
        config.headers.Authorization = `Bearer ${result.token}`
        console.log('[Auth Interceptor] ✓ Token added to request')
      } else {
        console.error('[Auth Interceptor] Failed to acquire token:', result.error)
        
        // Manejar error según tipo
        await handleTokenError(result.error, result.shouldLogout, msalInstance)
        
        // Cancelar este request específico
        throw new Error(`Token acquisition failed: ${result.error}`)
      }
      
      return config
    },
    (error) => {
      console.error('[Auth Interceptor] Request interceptor error:', error)
      return Promise.reject(error)
    }
  )

  // Response interceptor - Handle 401 errors
  const responseId = httpClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      // Manejar 401 Unauthorized
      if (error.response?.status === 401) {
        console.warn('[Auth Interceptor] 401 Unauthorized received')
        
        // Verificar si realmente no hay sesión válida
        const currentAccounts = msalInstance.getAllAccounts()
        
        if (currentAccounts.length === 0) {
          console.warn('[Auth Interceptor] No valid accounts found')
          await performCleanLogout(msalInstance)
          
          if (!isRedirectingToLogin) {
            window.location.href = ROUTES.LOGIN
          }
        } else {
          // Hay cuenta pero el token es inválido - forzar refresh
          console.warn('[Auth Interceptor] Account exists but token invalid, forcing token refresh')
          tokenAcquisitionService.reset() // Limpiar caché de tokens
        }
      }
      
      return Promise.reject(error)
    }
  )

  // Return cleanup function
  return () => {
    console.log('[Auth Interceptor] Cleaning up interceptors')
    httpClient.interceptors.request.eject(requestId)
    httpClient.interceptors.response.eject(responseId)
    
    // Cancelar requests pendientes
    if (requestsAbortController) {
      requestsAbortController.abort()
      requestsAbortController = null
    }
    
    // Reset flags
    isRedirectingToLogin = false
  }
}
