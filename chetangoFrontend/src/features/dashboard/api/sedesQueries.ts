// ============================================
// SEDES QUERIES & MUTATIONS - REACT QUERY HOOKS
// ============================================

import { httpClient } from '@/shared/api/httpClient'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { SedeConfig } from '../types/dashboard.types'

// ============================================
// QUERY KEYS
// ============================================

export const sedesKeys = {
  all:  ['sedes'] as const,
  list: () => [...sedesKeys.all, 'list'] as const,
}

// ============================================
// REQUEST TYPES
// ============================================

export interface CreateSedeRequest {
  nombre: string
  orden?: number
}

export interface UpdateSedeRequest {
  id:     string
  nombre: string
  orden:  number
}

// ============================================
// QUERY HOOKS
// ============================================

/**
 * Obtiene las sedes configuradas del tenant actual.
 * GET /api/sedes
 */
export function useSedesQuery() {
  return useQuery({
    queryKey: sedesKeys.list(),
    queryFn: async (): Promise<SedeConfig[]> => {
      const response = await httpClient.get<SedeConfig[]>('/api/sedes')
      return response.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutos (las sedes no cambian frecuentemente)
    retry: 2,
  })
}

// ============================================
// MUTATION HOOKS
// ============================================

/**
 * Crea una nueva sede para el tenant actual.
 * POST /api/sedes — Requiere AdminOnly. Valida MaxSedes del plan.
 */
export function useCreateSedeMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (request: CreateSedeRequest): Promise<SedeConfig> => {
      const { data } = await httpClient.post<SedeConfig>('/api/sedes', request)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sedesKeys.list() })
    },
  })
}

/**
 * Actualiza el nombre y/o el orden de una sede.
 * PUT /api/sedes/{id} — Requiere AdminOnly.
 * El SedeValor es inmutable (datos históricos lo referencian).
 */
export function useUpdateSedeMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (request: UpdateSedeRequest): Promise<SedeConfig> => {
      const { data } = await httpClient.put<SedeConfig>(`/api/sedes/${request.id}`, {
        id:     request.id,
        nombre: request.nombre,
        orden:  request.orden,
      })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sedesKeys.list() })
    },
  })
}

/**
 * Desactiva una sede (soft delete).
 * DELETE /api/sedes/{id} — Requiere AdminOnly.
 * No elimina datos históricos. No se puede eliminar la última sede activa.
 */
export function useDeleteSedeMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await httpClient.delete(`/api/sedes/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sedesKeys.list() })
    },
  })
}
