// ============================================
// COMPLIANCE - API QUERIES
// ============================================

import { httpClient } from '@/shared/api/httpClient'
import { useQuery } from '@tanstack/react-query'
import type { AceptacionDocumentoDto, EstadoCumplimientoDto } from '../types/compliance.types'

export const COMPLIANCE_QUERY_KEYS = {
  estado: ['compliance', 'estado'] as const,
  historial: ['compliance', 'historial'] as const,
}

// ============================================
// QUERY: Estado de cumplimiento del tenant
// ============================================
export const useEstadoCumplimientoQuery = (enabled = true) => {
  return useQuery({
    queryKey: COMPLIANCE_QUERY_KEYS.estado,
    queryFn: async () => {
      const { data } = await httpClient.get<EstadoCumplimientoDto>('/api/compliance/estado')
      return data
    },
    staleTime: 60 * 1000,       // 1 minuto
    gcTime: 5 * 60 * 1000,      // 5 minutos en caché
    enabled,
    retry: 1,
  })
}

// ============================================
// QUERY: Historial de aceptaciones
// ============================================
export const useHistorialAceptacionesQuery = () => {
  return useQuery({
    queryKey: COMPLIANCE_QUERY_KEYS.historial,
    queryFn: async () => {
      const { data } = await httpClient.get<AceptacionDocumentoDto[]>('/api/compliance/historial')
      return data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  })
}
