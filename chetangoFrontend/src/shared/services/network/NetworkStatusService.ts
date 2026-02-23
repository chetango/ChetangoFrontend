/**
 * NETWORK STATUS SERVICE
 * 
 * Servicio para monitorear el estado de conectividad de red.
 * Detecta cuando el usuario pierde/recupera conexión a internet.
 * 
 * Patrón: Observer/PubSub
 * Responsabilidad única: Monitorear conectividad y notificar cambios
 */

// ============================================
// TYPES
// ============================================

export type NetworkStatusCallback = (isOnline: boolean) => void

export interface NetworkStatus {
  isOnline: boolean
  wasOffline: boolean // Flag para saber si hubo desconexión previa
  lastOfflineAt: Date | null
  lastOnlineAt: Date | null
}

// ============================================
// NETWORK STATUS SERVICE (SINGLETON)
// ============================================

/**
 * Servicio centralizado para monitoreo de conectividad.
 * Implementa Singleton y patrón Observer para notificar cambios.
 */
export class NetworkStatusService {
  private static instance: NetworkStatusService
  
  private status: NetworkStatus = {
    isOnline: navigator.onLine,
    wasOffline: false,
    lastOfflineAt: null,
    lastOnlineAt: null,
  }
  
  private listeners: Set<NetworkStatusCallback> = new Set()
  private isInitialized = false

  private constructor() {
    // Constructor privado (Singleton)
  }

  /**
   * Obtiene la instancia única del servicio
   */
  public static getInstance(): NetworkStatusService {
    if (!NetworkStatusService.instance) {
      NetworkStatusService.instance = new NetworkStatusService()
    }
    return NetworkStatusService.instance
  }

  /**
   * Inicializa los listeners de eventos del navegador
   * Se debe llamar una vez al inicio de la aplicación
   */
  public initialize(): void {
    if (this.isInitialized) {
      console.warn('[NetworkStatusService] Already initialized')
      return
    }

    console.log('[NetworkStatusService] Initializing...')
    
    // Listeners de eventos del navegador
    window.addEventListener('online', this.handleOnline)
    window.addEventListener('offline', this.handleOffline)
    
    // Listener adicional para visibilitychange (detectar cuando vuelve de sleep)
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
    
    this.isInitialized = true
    console.log('[NetworkStatusService] Initialized. Current status:', this.status.isOnline ? 'ONLINE' : 'OFFLINE')
  }

  /**
   * Limpia los listeners (útil para cleanup)
   */
  public destroy(): void {
    window.removeEventListener('online', this.handleOnline)
    window.removeEventListener('offline', this.handleOffline)
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
    this.listeners.clear()
    this.isInitialized = false
    console.log('[NetworkStatusService] Destroyed')
  }

  /**
   * Obtiene el estado actual de red
   */
  public getStatus(): NetworkStatus {
    return { ...this.status }
  }

  /**
   * Verifica si hay conexión (incluye check de navigator.onLine)
   */
  public isOnline(): boolean {
    // Verificar tanto nuestro estado como navigator.onLine
    // por si hubo cambio que no capturamos
    const browserOnline = navigator.onLine
    
    if (browserOnline !== this.status.isOnline) {
      console.warn('[NetworkStatusService] Status mismatch detected, syncing...')
      this.updateStatus(browserOnline)
    }
    
    return this.status.isOnline
  }

  /**
   * Suscribirse a cambios de estado de red
   * Retorna función para desuscribirse
   */
  public subscribe(callback: NetworkStatusCallback): () => void {
    this.listeners.add(callback)
    
    // Notificar estado inicial inmediatamente
    callback(this.status.isOnline)
    
    // Retornar función de cleanup
    return () => {
      this.listeners.delete(callback)
    }
  }

  /**
   * Verifica conectividad haciendo ping real a un endpoint
   * Útil para casos donde navigator.onLine puede ser inexacto
   */
  public async checkConnectivity(url?: string): Promise<boolean> {
    const pingUrl = url || 'https://www.google.com/favicon.ico'
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5s timeout
      
      await fetch(pingUrl, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      
      const isOnline = true // Si llegó aquí, hay conexión
      
      if (isOnline !== this.status.isOnline) {
        this.updateStatus(isOnline)
      }
      
      return true
    } catch (error) {
      console.warn('[NetworkStatusService] Connectivity check failed:', error)
      
      if (this.status.isOnline) {
        this.updateStatus(false)
      }
      
      return false
    }
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private handleOnline = (): void => {
    console.log('[NetworkStatusService] Browser online event detected')
    this.updateStatus(true)
  }

  private handleOffline = (): void => {
    console.log('[NetworkStatusService] Browser offline event detected')
    this.updateStatus(false)
  }

  private handleVisibilityChange = (): void => {
    if (document.visibilityState === 'visible') {
      console.log('[NetworkStatusService] Page became visible, checking connectivity...')
      
      // Verificar conectividad cuando la página vuelve a ser visible
      // (puede haber perdido conexión mientras estaba en background)
      this.checkConnectivity().catch((error) => {
        console.error('[NetworkStatusService] Error checking connectivity on visibility change:', error)
      })
    }
  }

  private updateStatus(isOnline: boolean): void {
    const wasOnline = this.status.isOnline
    
    if (wasOnline === isOnline) {
      return // Sin cambios
    }

    console.log(`[NetworkStatusService] Status changed: ${wasOnline ? 'ONLINE' : 'OFFLINE'} → ${isOnline ? 'ONLINE' : 'OFFLINE'}`)

    // Actualizar estado
    this.status.isOnline = isOnline
    
    if (isOnline) {
      this.status.lastOnlineAt = new Date()
      // Marcar que hubo una desconexión previa (útil para reconexión)
      if (wasOnline === false) {
        this.status.wasOffline = true
      }
    } else {
      this.status.lastOfflineAt = new Date()
    }

    // Notificar a todos los listeners
    this.notifyListeners(isOnline)
  }

  private notifyListeners(isOnline: boolean): void {
    this.listeners.forEach((callback) => {
      try {
        callback(isOnline)
      } catch (error) {
        console.error('[NetworkStatusService] Error in listener callback:', error)
      }
    })
  }

  /**
   * Resetea el flag de "wasOffline" (útil después de reconexión exitosa)
   */
  public clearOfflineFlag(): void {
    this.status.wasOffline = false
  }
}

// ============================================
// EXPORT DEFAULT INSTANCE
// ============================================

export const networkStatusService = NetworkStatusService.getInstance()
