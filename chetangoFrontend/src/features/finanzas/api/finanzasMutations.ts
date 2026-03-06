// ============================================
// FINANZAS API MUTATIONS - REACT QUERY HOOKS
// ============================================

import { httpClient } from '@/shared/api/httpClient'
import type { ApiError } from '@/shared/api/interceptors'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
    CrearOtroGastoDTO,
    CrearOtroIngresoDTO,
    OtroGastoDTO,
    OtroIngresoDTO,
} from '../types/finanzasTypes'
import { dashboardKeys } from '@/features/dashboard/api/dashboardQueries'
import { finanzasKeys } from './finanzasQueries'

// ============================================
// MUTATION HOOKS
// ============================================

/**
 * Creates a new otro ingreso
 * POST /api/finanzas/otros-ingresos
 */
export function useCrearOtroIngresoMutation() {
  const queryClient = useQueryClient()

  return useMutation<OtroIngresoDTO, ApiError, CrearOtroIngresoDTO>({
    mutationFn: async (data: CrearOtroIngresoDTO): Promise<OtroIngresoDTO> => {
      const response = await httpClient.post<OtroIngresoDTO>(
        '/api/finanzas/otros-ingresos',
        data
      )
      return response.data
    },
    onSuccess: () => {
      // Invalidate all otros-ingresos queries to refetch
      queryClient.invalidateQueries({ queryKey: finanzasKeys.all })
      // Invalidate dashboard so KPIs update immediately
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
      toast.success('Ingreso registrado exitosamente')
    },
    onError: (error) => {
      console.error('Error al registrar ingreso:', error)
      toast.error(error.message || 'Error al registrar el ingreso')
    },
  })
}

/**
 * Creates a new otro gasto
 * POST /api/finanzas/otros-gastos
 */
export function useCrearOtroGastoMutation() {
  const queryClient = useQueryClient()

  return useMutation<OtroGastoDTO, ApiError, CrearOtroGastoDTO>({
    mutationFn: async (data: CrearOtroGastoDTO): Promise<OtroGastoDTO> => {
      const response = await httpClient.post<OtroGastoDTO>(
        '/api/finanzas/otros-gastos',
        data
      )
      return response.data
    },
    onSuccess: () => {
      // Invalidate all otros-gastos queries to refetch
      queryClient.invalidateQueries({ queryKey: finanzasKeys.all })
      // Invalidate dashboard so KPIs update immediately
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
      toast.success('Gasto registrado exitosamente')
    },
    onError: (error) => {
      console.error('Error al registrar gasto:', error)
      toast.error(error.message || 'Error al registrar el gasto')
    },
  })
}

/**
 * Deletes an otro ingreso (soft delete)
 * DELETE /api/finanzas/otros-ingresos/{id}
 */
export function useEliminarOtroIngresoMutation() {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, string>({
    mutationFn: async (id: string): Promise<void> => {
      await httpClient.delete(`/api/finanzas/otros-ingresos/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: finanzasKeys.all })
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
      toast.success('Ingreso eliminado exitosamente')
    },
    onError: (error) => {
      console.error('Error al eliminar ingreso:', error)
      toast.error(error.message || 'Error al eliminar el ingreso')
    },
  })
}

/**
 * Deletes an otro gasto (soft delete)
 * DELETE /api/finanzas/otros-gastos/{id}
 */
export function useEliminarOtroGastoMutation() {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, string>({
    mutationFn: async (id: string): Promise<void> => {
      await httpClient.delete(`/api/finanzas/otros-gastos/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: finanzasKeys.all })
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
      toast.success('Gasto eliminado exitosamente')
    },
    onError: (error) => {
      console.error('Error al eliminar gasto:', error)
      toast.error(error.message || 'Error al eliminar el gasto')
    },
  })
}
