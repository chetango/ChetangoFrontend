// ============================================
// PROFILE PROFESOR QUERIES
// ============================================

import { httpClient } from '@/shared/api/httpClient'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  ProfesorProfile,
  UpdateConfiguracionProfesorRequest,
  UpdateDatosPersonalesProfesorRequest,
  UpdatePerfilProfesionalRequest,
} from '../types/profile.types'

// ============================================
// QUERY KEYS
// ============================================

export const profesorProfileKeys = {
  all: ['profesor-profile'] as const,
  profile: () => [...profesorProfileKeys.all, 'data'] as const,
}

// ============================================
// QUERIES
// ============================================

/**
 * Obtiene el perfil completo del profesor autenticado
 * GET /api/profesores/me/perfil
 */
export function useProfesorProfileQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: profesorProfileKeys.profile(),
    queryFn: async (): Promise<ProfesorProfile> => {
      const response = await httpClient.get<ProfesorProfile>('/api/profesores/me/perfil')
      return response.data
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// ============================================
// MUTATIONS
// ============================================

/**
 * Actualiza los datos personales del profesor
 * PUT /api/profesores/me/perfil
 */
export function useUpdateDatosPersonalesProfesorMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateDatosPersonalesProfesorRequest) => {
      const response = await httpClient.put('/api/profesores/me/perfil', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profesorProfileKeys.profile() })
      toast.success('Datos personales actualizados correctamente')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al actualizar datos personales')
    },
  })
}

/**
 * Actualiza el perfil profesional (biografía y especialidades)
 * PUT /api/profesores/me/perfil-profesional
 */
export function useUpdatePerfilProfesionalMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdatePerfilProfesionalRequest) => {
      const response = await httpClient.put('/api/profesores/me/perfil-profesional', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profesorProfileKeys.profile() })
      toast.success('Perfil profesional actualizado correctamente')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al actualizar perfil profesional')
    },
  })
}

/**
 * Actualiza la configuración de notificaciones
 * PUT /api/profesores/me/configuracion
 */
export function useUpdateConfiguracionProfesorMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateConfiguracionProfesorRequest) => {
      const response = await httpClient.put('/api/profesores/me/configuracion', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profesorProfileKeys.profile() })
      toast.success('Configuración actualizada correctamente')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al actualizar configuración')
    },
  })
}
