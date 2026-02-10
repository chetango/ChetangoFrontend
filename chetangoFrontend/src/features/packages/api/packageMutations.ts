// ============================================
// PACKAGE MUTATIONS - REACT QUERY HOOKS
// ============================================

import { httpClient } from '@/shared/api/httpClient'
import type { ApiError } from '@/shared/api/interceptors'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
    CongelarPaqueteRequest,
    CrearPaqueteRequest,
    CrearPaqueteResponse,
    EditarPaqueteRequest,
} from '../types/packageTypes'
import { packageKeys } from './packageQueries'

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

// ============================================
// TIPO PAQUETE MUTATIONS
// ============================================

interface CrearTipoPaqueteParams {
  nombre: string
  numeroClases: number
  precio: number
  diasVigencia: number
  descripcion?: string
}

interface ActualizarTipoPaqueteParams {
  idTipoPaquete: string
  nombre: string
  numeroClases: number
  precio: number
  diasVigencia: number
  descripcion?: string
}

/**
 * Creates a new package type
 * POST /api/tipos-paquete
 */
export function useCreateTipoPaqueteMutation() {
  const queryClient = useQueryClient()

  return useMutation<{ id: string }, ApiError, CrearTipoPaqueteParams>({
    mutationFn: async (data: CrearTipoPaqueteParams) => {
      const response = await httpClient.post<{ id: string }>('/api/tipos-paquete', data)
      return response.data
    },

    onSuccess: () => {
      toast.success('Tipo de paquete creado exitosamente')
      queryClient.invalidateQueries({ queryKey: packageKeys.tiposPaquete() })
    },

    onError: (error: ApiError) => {
      if (!error.handled) {
        toast.error(error.message || 'Error al crear tipo de paquete')
      }
    },
  })
}

/**
 * Updates a package type
 * PUT /api/tipos-paquete/{id}
 */
export function useUpdateTipoPaqueteMutation() {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, ActualizarTipoPaqueteParams>({
    mutationFn: async ({ idTipoPaquete, ...data }: ActualizarTipoPaqueteParams) => {
      await httpClient.put(`/api/tipos-paquete/${idTipoPaquete}`, data)
    },

    onSuccess: () => {
      toast.success('Tipo de paquete actualizado exitosamente')
      queryClient.invalidateQueries({ queryKey: packageKeys.tiposPaquete() })
    },

    onError: (error: ApiError) => {
      if (!error.handled) {
        toast.error(error.message || 'Error al actualizar tipo de paquete')
      }
    },
  })
}

/**
 * Toggles package type active status
 * PATCH /api/tipos-paquete/{id}/toggle-active
 */
export function useToggleTipoPaqueteActivoMutation() {
  const queryClient = useQueryClient()

  return useMutation<{ activo: boolean }, ApiError, string>({
    mutationFn: async (idTipoPaquete: string) => {
      const response = await httpClient.patch<{ activo: boolean }>(
        `/api/tipos-paquete/${idTipoPaquete}/toggle-active`
      )
      return response.data
    },

    onSuccess: (data) => {
      toast.success(data.activo ? 'Tipo de paquete activado' : 'Tipo de paquete desactivado')
      queryClient.invalidateQueries({ queryKey: packageKeys.tiposPaquete() })
    },

    onError: (error: ApiError) => {
      if (!error.handled) {
        toast.error(error.message || 'Error al cambiar estado del tipo de paquete')
      }
    },
  })
}
