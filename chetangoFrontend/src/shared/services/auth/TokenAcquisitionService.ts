/**
 * TOKEN ACQUISITION SERVICE
 * 
 * Servicio Singleton para manejar la adquisición de tokens de forma centralizada.
 * Previene race conditions cuando múltiples requests HTTP intentan obtener tokens simultáneamente.
 * 
 * Patrón: Singleton + Promise Caching
 * Responsabilidad única: Coordinar la obtención de tokens de acceso
 */

import type { PublicClientApplication, AccountInfo, SilentRequest } from '@azure/msal-browser'
import { BrowserAuthError, InteractionRequiredAuthError } from '@azure/msal-browser'

// ============================================
// TYPES
// ============================================

export interface TokenAcquisitionOptions {
  msalInstance: PublicClientApplication
  account: AccountInfo
  tokenRequest: SilentRequest
}

export type TokenAcquisitionResult = 
  | { success: true; token: string }
  | { success: false; error: TokenAcquisitionError; shouldLogout: boolean }

export const TokenAcquisitionError = {
  INTERACTION_REQUIRED: 'INTERACTION_REQUIRED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  USER_CANCELLED: 'USER_CANCELLED',
  INVALID_GRANT: 'INVALID_GRANT',
  UNKNOWN: 'UNKNOWN',
} as const

export type TokenAcquisitionError = typeof TokenAcquisitionError[keyof typeof TokenAcquisitionError]

// ============================================
// TOKEN ACQUISITION SERVICE (SINGLETON)
// ============================================

/**
 * Servicio centralizado para adquisición de tokens.
 * Implementa Singleton para evitar múltiples popups simultáneos.
 */
export class TokenAcquisitionService {
  private static instance: TokenAcquisitionService
  
  // Promise caching: si hay una adquisición en progreso, retornar la misma promise
  private ongoingAcquisition: Promise<TokenAcquisitionResult> | null = null
  
  // Flag para saber si ya mostramos popup (evitar spam)
  private isShowingInteractivePrompt = false
  
  // Contador de intentos fallidos (para circuit breaker simple)
  private consecutiveFailures = 0
  private readonly MAX_FAILURES = 3

  private constructor() {
    // Constructor privado (Singleton)
  }

  /**
   * Obtiene la instancia única del servicio
   */
  public static getInstance(): TokenAcquisitionService {
    if (!TokenAcquisitionService.instance) {
      TokenAcquisitionService.instance = new TokenAcquisitionService()
    }
    return TokenAcquisitionService.instance
  }

  /**
   * Adquiere un token de acceso, manejando reintentos y fallbacks
   * 
   * @returns Token de acceso o error con indicación de si debe hacer logout
   */
  public async acquireToken(
    options: TokenAcquisitionOptions
  ): Promise<TokenAcquisitionResult> {
    // Si ya hay una adquisición en progreso, retornar la misma promise
    // Esto evita múltiples popups cuando muchos requests fallan simultáneamente
    if (this.ongoingAcquisition) {
      console.log('[TokenAcquisitionService] Acquisition already in progress, reusing promise')
      return this.ongoingAcquisition
    }

    // Circuit breaker simple: si hubo muchos fallos consecutivos, fallar rápido
    if (this.consecutiveFailures >= this.MAX_FAILURES) {
      console.error('[TokenAcquisitionService] Circuit breaker open, too many failures')
      return {
        success: false,
        error: TokenAcquisitionError.UNKNOWN,
        shouldLogout: true,
      }
    }

    // Iniciar adquisición
    this.ongoingAcquisition = this.performTokenAcquisition(options)
    
    try {
      const result = await this.ongoingAcquisition
      
      // Reset failures on success
      if (result.success) {
        this.consecutiveFailures = 0
      } else {
        this.consecutiveFailures++
      }
      
      return result
    } finally {
      // Limpiar ongoing acquisition
      this.ongoingAcquisition = null
    }
  }

  /**
   * Lógica interna de adquisición de token
   */
  private async performTokenAcquisition(
    options: TokenAcquisitionOptions
  ): Promise<TokenAcquisitionResult> {
    const { msalInstance, account, tokenRequest } = options

    // PASO 1: Intentar silent acquisition
    try {
      console.log('[TokenAcquisitionService] Attempting silent token acquisition...')
      
      const response = await msalInstance.acquireTokenSilent({
        ...tokenRequest,
        account,
      })
      
      console.log('[TokenAcquisitionService] ✓ Silent acquisition successful')
      return { success: true, token: response.accessToken }
      
    } catch (silentError) {
      console.warn('[TokenAcquisitionService] Silent acquisition failed:', silentError)
      
      // PASO 2: Analizar tipo de error
      const errorType = this.classifyError(silentError)
      
      // PASO 3: Si requiere interacción, intentar popup (solo si no hay uno activo)
      if (errorType === TokenAcquisitionError.INTERACTION_REQUIRED) {
        return await this.attemptInteractiveAcquisition(options)
      }
      
      // PASO 4: Para otros errores, decidir si logout
      const shouldLogout = this.shouldLogoutOnError(errorType)
      
      return {
        success: false,
        error: errorType,
        shouldLogout,
      }
    }
  }

  /**
   * Intenta adquisición interactiva (popup)
   */
  private async attemptInteractiveAcquisition(
    options: TokenAcquisitionOptions
  ): Promise<TokenAcquisitionResult> {
    // Evitar múltiples popups simultáneos
    if (this.isShowingInteractivePrompt) {
      console.warn('[TokenAcquisitionService] Interactive prompt already showing, aborting')
      return {
        success: false,
        error: TokenAcquisitionError.INTERACTION_REQUIRED,
        shouldLogout: false,
      }
    }

    const { msalInstance, tokenRequest } = options

    try {
      this.isShowingInteractivePrompt = true
      console.log('[TokenAcquisitionService] Attempting interactive token acquisition (popup)...')
      
      const response = await msalInstance.acquireTokenPopup(tokenRequest)
      
      console.log('[TokenAcquisitionService] ✓ Interactive acquisition successful')
      return { success: true, token: response.accessToken }
      
    } catch (popupError) {
      console.error('[TokenAcquisitionService] Interactive acquisition failed:', popupError)
      
      const errorType = this.classifyError(popupError)
      const shouldLogout = errorType !== TokenAcquisitionError.USER_CANCELLED
      
      return {
        success: false,
        error: errorType,
        shouldLogout,
      }
    } finally {
      this.isShowingInteractivePrompt = false
    }
  }

  /**
   * Clasifica el error de MSAL en categorías manejables
   */
  private classifyError(error: unknown): TokenAcquisitionError {
    if (error instanceof InteractionRequiredAuthError) {
      return TokenAcquisitionError.INTERACTION_REQUIRED
    }
    
    if (error instanceof BrowserAuthError) {
      // Usuario canceló popup
      if (error.errorCode === 'user_cancelled' || error.errorCode === 'popup_window_error') {
        return TokenAcquisitionError.USER_CANCELLED
      }
      
      // Token inválido o revocado
      if (error.errorCode === 'invalid_grant') {
        return TokenAcquisitionError.INVALID_GRANT
      }
    }
    
    // Error de red (sin internet, timeout, etc.)
    if (
      error instanceof Error && 
      (error.message.includes('network') || 
       error.message.includes('timeout') ||
       error.message.includes('fetch'))
    ) {
      return TokenAcquisitionError.NETWORK_ERROR
    }
    
    return TokenAcquisitionError.UNKNOWN
  }

  /**
   * Determina si el error requiere logout completo
   */
  private shouldLogoutOnError(errorType: TokenAcquisitionError): boolean {
    switch (errorType) {
      case TokenAcquisitionError.INVALID_GRANT:
      case TokenAcquisitionError.UNKNOWN:
        return true
      
      case TokenAcquisitionError.USER_CANCELLED:
      case TokenAcquisitionError.NETWORK_ERROR:
        return false
      
      case TokenAcquisitionError.INTERACTION_REQUIRED:
        return false // Ya intentamos popup, no forzar logout
      
      default:
        return true
    }
  }

  /**
   * Reset del servicio (útil para logout o tests)
   */
  public reset(): void {
    this.ongoingAcquisition = null
    this.isShowingInteractivePrompt = false
    this.consecutiveFailures = 0
  }
}

// ============================================
// EXPORT DEFAULT INSTANCE
// ============================================

export const tokenAcquisitionService = TokenAcquisitionService.getInstance()
