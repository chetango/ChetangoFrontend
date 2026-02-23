/**
 * USE NETWORK STATUS HOOK
 * 
 * Hook React para usar el NetworkStatusService de forma reactiva.
 * Se actualiza automáticamente cuando cambia el estado de la red.
 */

import { useEffect, useState } from 'react'
import { networkStatusService, type NetworkStatus } from '@/shared/services/network/NetworkStatusService'

export const useNetworkStatus = () => {
  const [status, setStatus] = useState<NetworkStatus>(() => networkStatusService.getStatus())

  useEffect(() => {
    // Suscribirse a cambios de estado
    const unsubscribe = networkStatusService.subscribe((isOnline) => {
      setStatus(networkStatusService.getStatus())
      
      // Log para debugging
      if (isOnline) {
        console.log('[useNetworkStatus] 🟢 Device is now ONLINE')
      } else {
        console.log('[useNetworkStatus] 🔴 Device is now OFFLINE')
      }
    })

    return unsubscribe
  }, [])

  return status
}
