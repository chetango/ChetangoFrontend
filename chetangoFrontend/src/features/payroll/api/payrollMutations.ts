// ============================================
// PAYROLL MUTATIONS - REACT QUERY HOOKS
// ============================================

import { httpClient } from '@/shared/api/httpClient'
import type { ApiError } from '@/shared/api/interceptors/errorInterceptor'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
    AprobarPagoRequest,
    LiquidarMesRequest,
    RegistrarPagoRequest,
} from '../types/payroll.types'
import { payrollKeys } from './payrollQueries'

// ============================================
// MUTATION HOOKS
// ============================================

/**
 * Aprobar pago de una clase
 * POST /api/nomina/aprobar-pago
 */
export function useAprobarPagoMutation() {
  const queryClient = useQueryClient()

  return useMutation<{ success: boolean }, ApiError, AprobarPagoRequest>({
    mutationFn: async (data: AprobarPagoRequest) => {
      const response = await httpClient.post<{ success: boolean }>('/api/nomina/aprobar-pago', data)
      return response.data
    },

    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: payrollKeys.all })
      toast.success('Pago aprobado exitosamente')
    },

    onError: (error: any) => {
      const message = error.response?.data?.error || 'Error al aprobar el pago'
      toast.error(message)
    },
  })
}

/**
 * Liquidar mes de un profesor
 * POST /api/nomina/liquidar-mes
 */
export function useLiquidarMesMutation() {
  const queryClient = useQueryClient()

  return useMutation<{ success: boolean; idLiquidacion: string }, ApiError, LiquidarMesRequest>({
    mutationFn: async (data: LiquidarMesRequest) => {
      const response = await httpClient.post<{ success: boolean; idLiquidacion: string }>(
        '/api/nomina/liquidar-mes',
        data
      )
      return response.data
    },

    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: payrollKeys.all })
      toast.success('Liquidación mensual generada exitosamente')
    },

    onError: (error: any) => {
      const message = error.response?.data?.error || 'Error al generar la liquidación'
      toast.error(message)
    },
  })
}

/**
 * Registrar pago de una liquidación
 * POST /api/nomina/registrar-pago
 */
export function useRegistrarPagoMutation() {
  const queryClient = useQueryClient()

  return useMutation<{ success: boolean }, ApiError, RegistrarPagoRequest>({
    mutationFn: async (data: RegistrarPagoRequest) => {
      const response = await httpClient.post<{ success: boolean }>('/api/nomina/registrar-pago', data)
      return response.data
    },

    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: payrollKeys.all })
      toast.success('Pago registrado exitosamente')
    },

    onError: (error: any) => {
      const message = error.response?.data?.error || 'Error al registrar el pago'
      toast.error(message)
    },
  })
}

/**
 * Eliminar liquidación
 * DELETE /api/nomina/liquidacion/{id}
 */
export function useEliminarLiquidacionMutation() {
  const queryClient = useQueryClient()

  return useMutation<{ success: boolean }, ApiError, string>({
    mutationFn: async (idLiquidacion: string) => {
      const response = await httpClient.delete<{ success: boolean }>(
        `/api/nomina/liquidacion/${idLiquidacion}`
      )
      return response.data
    },

    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: payrollKeys.all })
      toast.success('Liquidación eliminada exitosamente')
    },

    onError: (error: any) => {
      const message = error.response?.data?.error || 'Error al eliminar la liquidación'
      toast.error(message)
    },
  })
}
