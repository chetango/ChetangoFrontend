// ============================================
// SOLICITUDES QUERIES - REACT QUERY HOOKS
// ============================================

import { httpClient } from '@/shared/api/httpClient'
import { useQuery } from '@tanstack/react-query'
import type {
    SolicitudClasePrivadaDTO,
    SolicitudRenovacionPaqueteDTO,
} from '../types/solicitudesTypes'

// ============================================
// QUERY KEYS
// ============================================

export const solicitudesKeys = {
  all: ['solicitudes'] as const,
  renovacionPendientes: () => [...solicitudesKeys.all, 'renovacion', 'pendientes'] as const,
  clasePrivadaPendientes: () => [...solicitudesKeys.all, 'clase-privada', 'pendientes'] as const,
}

// ============================================
// QUERY HOOKS
// ============================================

/**
 * Obtiene solicitudes de renovación de paquete pendientes (admin)
 * GET /api/solicitudes/renovacion-paquete/pendientes
 * 
 * Response: Array<SolicitudRenovacionPaqueteDTO>
 * 
 * Requirements: Admin Dashboard - Notificaciones de solicitudes pendientes
 * Authorization: AdminOnly (Bearer token required)
 * Frontend cache: 2 minutes (staleTime)
 * Auto-refresh: Every 2 minutes (refetchInterval)
 * 
 * @param enabled - Si false, la query no se ejecuta (útil para condicionar por rol)
 */
export function useSolicitudesRenovacionPendientes(enabled = true) {
  return useQuery({
    queryKey: solicitudesKeys.renovacionPendientes(),
    queryFn: async (): Promise<SolicitudRenovacionPaqueteDTO[]> => {
      const response = await httpClient.get<SolicitudRenovacionPaqueteDTO[]>(
        '/api/solicitudes/renovacion-paquete/pendientes'
      )
      return response.data
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutos
    refetchInterval: 2 * 60 * 1000, // Refetch cada 2 minutos
    retry: 2,
    refetchOnWindowFocus: true,
  })
}

/**
 * Obtiene solicitudes de clase privada pendientes (admin)
 * GET /api/solicitudes/clase-privada/pendientes
 * 
 * Response: Array<SolicitudClasePrivadaDTO>
 * 
 * Requirements: Admin Dashboard - Notificaciones de solicitudes pendientes
 * Authorization: AdminOnly (Bearer token required)
 * Frontend cache: 2 minutes (staleTime)
 * Auto-refresh: Every 2 minutes (refetchInterval)
 * 
 * @param enabled - Si false, la query no se ejecuta (útil para condicionar por rol)
 */
export function useSolicitudesClasePrivadaPendientes(enabled = true) {
  return useQuery({
    queryKey: solicitudesKeys.clasePrivadaPendientes(),
    queryFn: async (): Promise<SolicitudClasePrivadaDTO[]> => {
      const response = await httpClient.get<SolicitudClasePrivadaDTO[]>(
        '/api/solicitudes/clase-privada/pendientes'
      )
      return response.data
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutos
    refetchInterval: 2 * 60 * 1000, // Refetch cada 2 minutos
    retry: 2,
    refetchOnWindowFocus: true,
  })
}
