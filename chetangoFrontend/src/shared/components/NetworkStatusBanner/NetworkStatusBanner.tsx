/**
 * NETWORK STATUS BANNER
 * 
 * Componente para mostrar un banner cuando el dispositivo pierde conexión.
 * Se oculta automáticamente cuando se recupera la conexión.
 * 
 * Uso opcional: Agregar en MainLayout o AppProviders
 */

import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus'
import { Wifi, WifiOff } from 'lucide-react'
import { useEffect, useState } from 'react'

export const NetworkStatusBanner = () => {
  const { isOnline, wasOffline } = useNetworkStatus()
  const [showReconnected, setShowReconnected] = useState(false)

  // Mostrar mensaje de reconexión brevemente
  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowReconnected(true)
      const timer = setTimeout(() => {
        setShowReconnected(false)
      }, 3000) // Ocultar después de 3 segundos
      
      return () => clearTimeout(timer)
    }
  }, [isOnline, wasOffline])

  // Si está online y no necesita mostrar mensaje de reconexión, no renderizar nada
  if (isOnline && !showReconnected) {
    return null
  }

  // Mensaje de offline
  if (!isOnline) {
    return (
      <div 
        className="fixed top-0 left-0 right-0 z-[9999] bg-amber-500 text-white px-4 py-3 shadow-lg animate-slide-down"
        role="alert"
        aria-live="assertive"
      >
        <div className="container mx-auto flex items-center justify-center gap-3">
          <WifiOff className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">
            Sin conexión a internet. Verifica tu conexión y vuelve a intentarlo.
          </p>
        </div>
      </div>
    )
  }

  // Mensaje de reconexión exitosa
  return (
    <div 
      className="fixed top-0 left-0 right-0 z-[9999] bg-green-500 text-white px-4 py-3 shadow-lg animate-slide-down"
      role="alert"
      aria-live="polite"
    >
      <div className="container mx-auto flex items-center justify-center gap-3">
        <Wifi className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-medium">
          ✓ Conexión restablecida
        </p>
      </div>
    </div>
  )
}
