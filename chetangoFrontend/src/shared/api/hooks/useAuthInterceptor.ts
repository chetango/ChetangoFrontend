import { useEffect, useRef } from 'react'
import { useMsal } from '@azure/msal-react'
import { httpClient } from '@/shared/api/httpClient'
import { setupInterceptors } from '@/shared/api/interceptors'
import { tokenRequest } from '@/features/auth/api/msalConfig'

export const useAuthInterceptor = () => {
  const { instance, accounts } = useMsal()
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    // Limpiar interceptors anteriores
    if (cleanupRef.current) {
      cleanupRef.current()
    }

    // Solo configurar si hay cuentas autenticadas
    if (accounts.length > 0) {
      cleanupRef.current = setupInterceptors(httpClient, {
        msalInstance: instance,
        accounts,
        tokenRequest,
      })
    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }
    }
  }, [instance, accounts.length]) // Usar accounts.length para evitar loops pero detectar cambios
}
