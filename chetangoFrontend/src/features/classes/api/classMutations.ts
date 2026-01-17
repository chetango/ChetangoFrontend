// ============================================
// CLASS MUTATIONS - REACT QUERY HOOKS
// ============================================

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/httpClient'
import { toast } from 'sonner'
import { classKeys } from './classQueries'
import type { ApiError } from '@/shared/api/interceptors'
import type {
  CrearClaseRequest,
  CrearClaseResponse,
  EditarClaseRequest,
} from '../types/classTypes'

// ============================================
// ERROR HANDLING HELPERS
// ============================================

/**
 * Extracts error message from API error response
 * Handles both ApiError format and raw axios error format
 * Requirements: 11.3, 11.4, 11.5
 */
function extractErrorMessage(error: unknown, defaultMessage: string): string {
  // Handle null/undefined errors
  if (!error) {
    return defaultMessage
  }

  // Check if it's an ApiError from our interceptor
  const apiError = error as ApiError
  if (apiError?.status && apiError?.message) {
    return apiError.message
  }

  // Fallback to axios error format
  const axiosError = error as { response?: { status?: number; data?: { error?: string; message?: string } } }
  const status = axiosError?.response?.status
  const responseMessage = axiosError?.response?.data?.error || axiosError?.response?.data?.message

  // For 400 errors, use the backend message if available
  if (status === 400 && responseMessage) {
    return responseMessage
  }

  // For 404 errors, use specific message
  if (status === 404) {
    return 'La clase especificada no existe'
  }

  // For 403 errors, use permission message
  if (status === 403) {
    return 'No tienes permisos para realizar esta acción'
  }

  // Use response message if available, otherwise default
  return responseMessage || defaultMessage
}

// ============================================
// MUTATION TYPES
// ============================================

interface UpdateClaseParams {
  idClase: string
  data: EditarClaseRequest
}

// ============================================
// CREATE CLASE MUTATION
// ============================================

/**
 * Creates a new class
 * POST /api/clases
 * Returns 201 Created with { idClase: string }
 *
 * Requirements: 5.3, 5.5, 5.6, 11.3, 11.4, 11.5
 */
export function useCreateClaseMutation() {
  const queryClient = useQueryClient()

  return useMutation<CrearClaseResponse, Error, CrearClaseRequest>({
    mutationFn: async (data: CrearClaseRequest): Promise<CrearClaseResponse> => {
      const response = await httpClient.post<CrearClaseResponse>('/api/clases', data)
      return response.data
    },

    onSuccess: () => {
      toast.success('Clase creada exitosamente')
      // Invalidate all class lists to refetch
      queryClient.invalidateQueries({ queryKey: classKeys.all })
    },

    onError: (error: unknown) => {
      // Error handling is done by the interceptor
      // The interceptor shows toast for 400, 404, 500 errors
      // 401 redirects to login, 403 is handled inline
      // We don't need to show additional toast here to avoid duplicates
      console.error('[CreateClase] Mutation error:', extractErrorMessage(error, 'Error al crear la clase'))
    },
  })
}

// ============================================
// UPDATE CLASE MUTATION
// ============================================

/**
 * Updates an existing class
 * PUT /api/clases/{id}
 * Returns 204 No Content on success
 *
 * Requirements: 6.3, 6.4, 6.5, 11.3, 11.4, 11.5
 */
export function useUpdateClaseMutation() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, UpdateClaseParams>({
    mutationFn: async ({ idClase, data }: UpdateClaseParams): Promise<void> => {
      await httpClient.put(`/api/clases/${idClase}`, data)
    },

    onSuccess: (_, variables) => {
      toast.success('Clase actualizada exitosamente')
      // Invalidate specific class detail and all lists
      queryClient.invalidateQueries({ queryKey: classKeys.claseDetail(variables.idClase) })
      queryClient.invalidateQueries({ queryKey: classKeys.all })
    },

    onError: (error: unknown) => {
      // Error handling is done by the interceptor
      // The interceptor shows toast for 400, 404, 500 errors
      // 401 redirects to login, 403 is handled inline
      // We don't need to show additional toast here to avoid duplicates
      console.error('[UpdateClase] Mutation error:', extractErrorMessage(error, 'Error al actualizar la clase'))
    },
  })
}

// ============================================
// DELETE CLASE MUTATION
// ============================================

/**
 * Cancels/deletes a class
 * DELETE /api/clases/{id}
 * Returns 204 No Content on success
 *
 * Requirements: 7.2, 7.3, 7.4, 11.3, 11.4, 11.5
 */
export function useDeleteClaseMutation() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: async (idClase: string): Promise<void> => {
      await httpClient.delete(`/api/clases/${idClase}`)
    },

    onSuccess: () => {
      toast.success('Clase cancelada exitosamente')
      // Invalidate all class queries
      queryClient.invalidateQueries({ queryKey: classKeys.all })
    },

    onError: (error: unknown) => {
      // Error handling is done by the interceptor
      // The interceptor shows toast for 400, 404, 500 errors
      // 401 redirects to login, 403 is handled inline
      // We don't need to show additional toast here to avoid duplicates
      console.error('[DeleteClase] Mutation error:', extractErrorMessage(error, 'Error al cancelar la clase'))
    },
  })
}

// ============================================
// EXPORTED ERROR HANDLING UTILITIES
// ============================================

export { extractErrorMessage }
