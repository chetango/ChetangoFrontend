// ============================================
// PAYMENT MUTATIONS - REACT QUERY HOOKS
// ============================================

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/httpClient'
import { toast } from 'sonner'
import { paymentKeys } from './paymentQueries'
import type { ApiError } from '@/shared/api/interceptors'
import type {
  CrearPagoRequest,
  CrearPagoResponse,
  EditarPagoRequest,
} from '../types/paymentTypes'

// ============================================
// MUTATION TYPES
// ============================================

interface UpdatePagoParams {
  idPago: string
  data: EditarPagoRequest
}

// ============================================
// MUTATION HOOKS
// ============================================

/**
 * Creates a new payment with associated packages
 * POST /api/pagos
 *
 * Request body (CrearPagoRequest):
 * - idAlumno (string, required): Student UUID
 * - fechaPago (string, required): Payment date in ISO 8601 format
 * - montoTotal (number > 0, required): Total payment amount
 * - idMetodoPago (string, required): Payment method UUID
 * - nota (string | null, optional): Additional notes
 * - paquetes (array, required): At least one package with idTipoPaquete
 *
 * Response (CrearPagoResponse):
 * - idPago: Created payment UUID
 * - idPaquetesCreados: Array of created package UUIDs
 * - montoTotal: Total amount
 *
 * Requirements: 7.3, 7.5, 7.6
 * Error handling: 13.1, 13.2, 13.3, 13.4, 13.5
 * - 401: Redirect to login (handled by authInterceptor)
 * - 403: Toast "No tienes permisos..." (handled by errorInterceptor)
 * - 400: Toast with error message (e.g., "El alumno especificado no existe")
 */
export function useCreatePagoMutation() {
  const queryClient = useQueryClient()

  return useMutation<CrearPagoResponse, ApiError, CrearPagoRequest>({
    mutationFn: async (data: CrearPagoRequest): Promise<CrearPagoResponse> => {
      const response = await httpClient.post<CrearPagoResponse>('/api/pagos', data)
      return response.data
    },

    onSuccess: (data) => {
      const paquetesCount = data.idPaquetesCreados.length
      const message =
        paquetesCount === 1
          ? 'Pago registrado exitosamente. 1 paquete creado.'
          : `Pago registrado exitosamente. ${paquetesCount} paquetes creados.`
      toast.success(message)

      // Invalidate all payment queries to refresh lists and stats
      queryClient.invalidateQueries({ queryKey: paymentKeys.all })
    },

    onError: (error: ApiError) => {
      // Only show toast if error wasn't already handled by interceptor
      if (!error.handled) {
        const message = error.message || 'Error al registrar el pago'
        toast.error(message)
      }
    },
  })
}

/**
 * Updates an existing payment
 * PUT /api/pagos/{id}
 *
 * Request body (EditarPagoRequest):
 * - montoTotal (number > 0, required): Updated payment amount
 * - idMetodoPago (string, required): Updated payment method UUID
 * - nota (string | null, optional): Updated notes
 *
 * Note: idAlumno, fechaPago, and paquetes CANNOT be edited (as per API contract)
 *
 * Response: 204 No Content on success
 *
 * Requirements: 10.4, 10.5, 10.6
 * Error handling: 13.1, 13.2, 13.3, 13.4, 13.5
 * - 401: Redirect to login (handled by authInterceptor)
 * - 403: Toast "No tienes permisos..." (handled by errorInterceptor)
 * - 400: Toast with error message (e.g., "El monto total debe ser mayor a cero")
 * - 404: Toast "El pago especificado no existe"
 */
export function useUpdatePagoMutation() {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, UpdatePagoParams>({
    mutationFn: async ({ idPago, data }: UpdatePagoParams): Promise<void> => {
      await httpClient.put(`/api/pagos/${idPago}`, data)
    },

    onSuccess: (_data, variables) => {
      toast.success('Pago actualizado exitosamente')

      // Invalidate the specific payment detail and all payment lists
      queryClient.invalidateQueries({
        queryKey: paymentKeys.pagoDetail(variables.idPago),
      })
      queryClient.invalidateQueries({ queryKey: paymentKeys.all })
    },

    onError: (error: ApiError) => {
      // Only show toast if error wasn't already handled by interceptor
      if (!error.handled) {
        const message = error.message || 'Error al actualizar el pago'
        toast.error(message)
      }
    },
  })
}
