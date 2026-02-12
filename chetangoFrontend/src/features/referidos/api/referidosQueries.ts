// ============================================
// REFERIDOS QUERIES - REACT QUERY HOOKS
// ============================================

import { httpClient } from '@/shared/api/httpClient'
import { useQuery } from '@tanstack/react-query'
import type { CodigoReferidoDTO } from '../types/referidosTypes'

// ============================================
// QUERY KEYS
// ============================================

export const referidosKeys = {
  all: ['referidos'] as const,
  miCodigo: () => [...referidosKeys.all, 'mi-codigo'] as const,
}

// ============================================
// QUERY HOOKS
// ============================================

/**
 * Obtiene el código de referido del alumno actual
 * GET /api/referidos/mi-codigo
 * 
 * Response: CodigoReferidoDTO | null
 * 
 * Requirements: Dashboard Alumno - "Invita un Amigo"
 * Authorization: ApiScope (Bearer token required)
 * Frontend cache: 10 minutes (staleTime)
 * 
 * Si el alumno no tiene código generado, retorna null
 * En ese caso, usar useMutation para generar uno
 */
export function useMiCodigoReferido() {
  return useQuery({
    queryKey: referidosKeys.miCodigo(),
    queryFn: async (): Promise<CodigoReferidoDTO | null> => {
      try {
        const response = await httpClient.get<CodigoReferidoDTO>(
          '/api/referidos/mi-codigo'
        )
        return response.data
      } catch (error: any) {
        // Si el error es 404, significa que el alumno no tiene código aún
        if (error.response?.status === 404) {
          return null
        }
        throw error
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    retry: 1,
    refetchOnWindowFocus: false,
  })
}
