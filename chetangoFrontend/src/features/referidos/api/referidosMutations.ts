// ============================================
// REFERIDOS MUTATIONS - REACT QUERY HOOKS
// ============================================

import { httpClient } from '@/shared/api/httpClient'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { GenerarCodigoReferidoResponse } from '../types/referidosTypes'
import { referidosKeys } from './referidosQueries'

// ============================================
// MUTATION HOOKS
// ============================================

/**
 * Genera un código de referido para el alumno actual
 * POST /api/referidos/generar-codigo
 * 
 * No requiere request body (usa el email del JWT)
 * 
 * Response (GenerarCodigoReferidoResponse):
 * - idCodigo: UUID del código generado
 * - codigo: Código único (ej: JUAN2645)
 * - activo: true
 * - vecesUsado: 0
 * - beneficioReferidor: "1 clase gratis"
 * - beneficioNuevoAlumno: "10% descuento en primer paquete"
 * - fechaCreacion: ISO 8601 date
 * 
 * Requirements: Dashboard Alumno - "Invita un Amigo"
 * Authorization: ApiScope (Bearer token required)
 * Error handling:
 * - 401: Redirect to login (handled by authInterceptor)
 * - 400: Toast with error message (e.g., "Ya tienes un código de referido activo")
 */
export function useGenerarCodigoReferido() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (): Promise<GenerarCodigoReferidoResponse> => {
      const response = await httpClient.post<GenerarCodigoReferidoResponse>(
        '/api/referidos/generar-codigo'
      )
      return response.data
    },
    onSuccess: (data) => {
      toast.success('¡Código generado!', {
        description: `Tu código es: ${data.codigo}. Compártelo con tus amigos.`,
      })
      
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: referidosKeys.miCodigo() })
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'No se pudo generar el código. Intenta de nuevo.'

      toast.error('Error al generar código', {
        description: errorMessage,
      })
    },
  })
}
