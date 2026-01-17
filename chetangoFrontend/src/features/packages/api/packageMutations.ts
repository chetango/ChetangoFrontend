// ============================================
// PACKAGE MUTATIONS - REACT QUERY HOOKS
// ============================================

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/httpClient'
import { toast } from 'sonner'
import { packageKeys } from './packageQueries'
import type { ApiError } from '@/shared/api/interceptors'
import type {
  CrearPaqueteRequest,
  CrearPaqueteResponse,
  EditarPaqueteRequest,
  CongelarPaqueteRequest,
} from '../types/packageTypes'

// ============================================
// MUTATION TYPES
// ============================================

interface UpdatePaqueteParams {
  idPaquete: string
  data: EditarPaqueteRequest
}

interface CongelarPaqueteParams {
  idPaquete: string
  data: CongelarPaqueteRequest
}

interface DescongelarPaqueteParams {
  idPaquete: string
  idCongelacion: string
}

// ============================================
// MUTATION HOOKS
// ============================================

/**
 * Creates a new package
 * POST /api/paquetes
 * Returns the new package ID on success (201 Created)
 *
 * Requirements: 5.4, 5.5, 5.6
 * Error handling: 11.1, 11.2, 11.3, 11.4, 11.5
 */
export function useCreatePaqueteMutation() {
  const queryClient = useQueryClient()

  return useMutation<CrearPaqueteResponse, ApiError, CrearPaqueteRequest>({
    mutationFn: async (data: CrearPaqueteRequest): Promise<CrearPaqueteResponse> => {
      const response = await httpClient.post<CrearPaqueteResponse>('/api/paquetes', data)
      return response.data
    },

    onSuccess: () => {
      toast.success('Paquete creado exitosamente')
      // Invalidate all package queries to refresh the list
      queryClient.invalidateQueries({ queryKey: packageKeys.all })
    },

    onError: (error: ApiError) => {
      // Only show toast if error wasn't already handled by interceptor
      if (!error.handled) {
        const message = error.message || 'Error al crear el paquete'
        toast.error(message)
      }
    },
  })
}

/**
 * Updates an existing package
 * PUT /api/paquetes/{id}
 *
 * Requirements: N/A (for future use)
 * Error handling: 11.1, 11.2, 11.3, 11.4, 11.5
 */
export function useUpdatePaqueteMutation() {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, UpdatePaqueteParams>({
    mutationFn: async ({ idPaquete, data }: UpdatePaqueteParams): Promise<void> => {
      await httpClient.put(`/api/paquetes/${idPaquete}`, data)
    },

    onSuccess: (_data, variables) => {
      toast.success('Paquete actualizado exitosamente')
      // Invalidate the specific package detail and all package lists
      queryClient.invalidateQueries({
        queryKey: packageKeys.paqueteDetail(variables.idPaquete),
      })
      queryClient.invalidateQueries({ queryKey: packageKeys.all })
    },

    onError: (error: ApiError) => {
      // Only show toast if error wasn't already handled by interceptor
      if (!error.handled) {
        const message = error.message || 'Error al actualizar el paquete'
        toast.error(message)
      }
    },
  })
}

/**
 * Freezes a package
 * POST /api/paquetes/{id}/congelar
 *
 * Requirements: 8.3, 8.4, 8.5
 * Error handling: 11.1, 11.2, 11.3, 11.4, 11.5
 */
export function useCongelarPaqueteMutation() {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, CongelarPaqueteParams>({
    mutationFn: async ({ idPaquete, data }: CongelarPaqueteParams): Promise<void> => {
      await httpClient.post(`/api/paquetes/${idPaquete}/congelar`, data)
    },

    onSuccess: (_data, variables) => {
      toast.success('Paquete congelado exitosamente')
      // Invalidate the specific package detail and all package lists
      queryClient.invalidateQueries({
        queryKey: packageKeys.paqueteDetail(variables.idPaquete),
      })
      queryClient.invalidateQueries({ queryKey: packageKeys.all })
    },

    onError: (error: ApiError) => {
      // Only show toast if error wasn't already handled by interceptor
      if (!error.handled) {
        const message = error.message || 'Error al congelar el paquete'
        toast.error(message)
      }
    },
  })
}

/**
 * Unfreezes a package
 * POST /api/paquetes/{id}/descongelar?idCongelacion={idCongelacion}
 *
 * Requirements: 9.3, 9.4, 9.5
 * Error handling: 11.1, 11.2, 11.3, 11.4, 11.5
 */
export function useDescongelarPaqueteMutation() {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, DescongelarPaqueteParams>({
    mutationFn: async ({ idPaquete, idCongelacion }: DescongelarPaqueteParams): Promise<void> => {
      await httpClient.post(
        `/api/paquetes/${idPaquete}/descongelar?idCongelacion=${idCongelacion}`
      )
    },

    onSuccess: (_data, variables) => {
      toast.success('Paquete descongelado exitosamente')
      // Invalidate the specific package detail and all package lists
      queryClient.invalidateQueries({
        queryKey: packageKeys.paqueteDetail(variables.idPaquete),
      })
      queryClient.invalidateQueries({ queryKey: packageKeys.all })
    },

    onError: (error: ApiError) => {
      // Only show toast if error wasn't already handled by interceptor
      if (!error.handled) {
        const message = error.message || 'Error al descongelar el paquete'
        toast.error(message)
      }
    },
  })
}
