// ============================================
// SOLICITUDES MUTATIONS - REACT QUERY HOOKS
// ============================================

import { httpClient } from '@/shared/api/httpClient'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
    SolicitarClasePrivadaRequest,
    SolicitarClasePrivadaResponse,
    SolicitarRenovacionPaqueteRequest,
    SolicitarRenovacionPaqueteResponse,
} from '../types/solicitudesTypes'

// ============================================
// MUTATION HOOKS
// ============================================

/**
 * Solicita renovación de paquete (alumno)
 * POST /api/solicitudes/renovar-paquete
 * 
 * Request body (SolicitarRenovacionPaqueteRequest):
 * - idTipoPaqueteDeseado (string | null, optional): UUID del tipo de paquete
 * - mensajeAlumno (string | null, optional): Mensaje adicional
 * 
 * Response (SolicitarRenovacionPaqueteResponse):
 * - idSolicitud: UUID de la solicitud creada
 * 
 * Requirements: Dashboard Alumno - "Renovar Paquete"
 * Authorization: ApiScope (Bearer token required)
 * Error handling:
 * - 401: Redirect to login (handled by authInterceptor)
 * - 400: Toast with error message (e.g., "Ya tienes una solicitud pendiente")
 */
export function useSolicitarRenovacionPaquete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      data: SolicitarRenovacionPaqueteRequest
    ): Promise<SolicitarRenovacionPaqueteResponse> => {
      const response = await httpClient.post<SolicitarRenovacionPaqueteResponse>(
        '/api/solicitudes/renovar-paquete',
        data
      )
      return response.data
    },
    onSuccess: () => {
      toast.success('Solicitud enviada', {
        description: 'Tu solicitud de renovación fue recibida. Te contactaremos pronto.',
      })
      
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['alumno-dashboard'] })
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'No se pudo enviar la solicitud. Intenta de nuevo.'

      toast.error('Error al solicitar renovación', {
        description: errorMessage,
      })
    },
  })
}

/**
 * Solicita clase privada (alumno)
 * POST /api/solicitudes/clase-privada
 * 
 * Request body (SolicitarClasePrivadaRequest):
 * - idTipoClaseDeseado (string | null, optional): UUID del tipo de clase
 * - fechaPreferida (string | null, optional): Fecha ISO 8601
 * - horaPreferida (string | null, optional): Hora HH:mm:ss
 * - observacionesAlumno (string | null, optional): Observaciones del alumno
 * 
 * Response (SolicitarClasePrivadaResponse):
 * - idSolicitud: UUID de la solicitud creada
 * 
 * Requirements: Dashboard Alumno - "Quiero Clase Privada"
 * Authorization: ApiScope (Bearer token required)
 * Error handling:
 * - 401: Redirect to login (handled by authInterceptor)
 * - 400: Toast with error message (e.g., "Ya tienes una solicitud pendiente en los últimos 7 días")
 */
export function useSolicitarClasePrivada() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      data: SolicitarClasePrivadaRequest
    ): Promise<SolicitarClasePrivadaResponse> => {
      const response = await httpClient.post<SolicitarClasePrivadaResponse>(
        '/api/solicitudes/clase-privada',
        data
      )
      return response.data
    },
    onSuccess: () => {
      toast.success('Solicitud enviada', {
        description: 'Tu solicitud de clase privada fue recibida. Te contactaremos para coordinar.',
      })
      
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['alumno-dashboard'] })
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'No se pudo enviar la solicitud. Intenta de nuevo.'

      toast.error('Error al solicitar clase privada', {
        description: errorMessage,
      })
    },
  })
}
