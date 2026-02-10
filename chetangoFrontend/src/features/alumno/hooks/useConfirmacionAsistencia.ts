// ============================================
// USE ALUMNO ATTENDANCE CONFIRMATION HOOK
// ============================================

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { alumnoAttendanceKeys, getAsistenciasPendientes } from '../api/confirmacionAsistencia'
import { confirmarAsistencia } from '../api/confirmacionMutations'
import type { AsistenciaPendiente } from '../types/confirmacion.types'

// ============================================
// HOOK RETURN TYPES
// ============================================

export interface UseAsistenciasPendientesReturn {
  asistenciasPendientes: AsistenciaPendiente[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

// ============================================
// QUERY HOOKS
// ============================================

/**
 * Hook para obtener asistencias pendientes de confirmar
 * Refetch automático cada 30 segundos para detectar nuevas asistencias
 */
export const useAsistenciasPendientes = () => {
  return useQuery({
    queryKey: alumnoAttendanceKeys.pendientes(),
    queryFn: getAsistenciasPendientes,
    refetchInterval: 30000, // Refetch cada 30 segundos
    staleTime: 20000,
  })
}

// ============================================
// MUTATION HOOKS
// ============================================

/**
 * Hook para confirmar una asistencia
 * Invalida la cache y muestra notificación de éxito
 */
export const useConfirmarAsistencia = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: confirmarAsistencia,
    onSuccess: () => {
      // Invalidar query para refrescar la lista
      queryClient.invalidateQueries({ queryKey: alumnoAttendanceKeys.pendientes() })
      toast.success('¡Asistencia confirmada! 🎉')
    },
    onError: (error: any) => {
      console.error('Error confirmando asistencia:', error)
      const errorMessage = error.response?.data?.error || 'Error al confirmar asistencia'
      toast.error(errorMessage)
    },
  })
}
