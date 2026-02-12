// ============================================
// PROFILE ALUMNO QUERIES
// ============================================

import { httpClient } from '@/shared/api/httpClient'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
    AlumnoProfile,
    PaqueteHistorial,
    UpdateConfiguracionRequest,
    UpdateContactoEmergenciaRequest,
    UpdateDatosPersonalesRequest
} from '../types/profile.types'

// ============================================
// QUERY KEYS
// ============================================

export const alumnoProfileKeys = {
  all: ['alumno-profile'] as const,
  profile: () => [...alumnoProfileKeys.all, 'data'] as const,
  paquetes: () => [...alumnoProfileKeys.all, 'paquetes'] as const,
}

// ============================================
// QUERIES
// ============================================

/**
 * Obtiene el perfil completo del alumno autenticado
 * GET /api/alumnos/me/perfil
 */
export function useAlumnoProfileQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: alumnoProfileKeys.profile(),
    queryFn: async (): Promise<AlumnoProfile> => {
      const response = await httpClient.get<AlumnoProfile>('/api/alumnos/me/perfil')
      return response.data
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
  })
}

/**
 * Obtiene el historial de paquetes del alumno
 * GET /api/alumnos/me/paquetes/historial
 */
export function usePaquetesHistorialQuery() {
  return useQuery({
    queryKey: alumnoProfileKeys.paquetes(),
    queryFn: async (): Promise<PaqueteHistorial[]> => {
      const response = await httpClient.get<PaqueteHistorial[]>('/api/alumnos/me/paquetes/historial')
      return response.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    retry: 1,
  })
}

// ============================================
// MUTATIONS
// ============================================

/**
 * Actualiza los datos personales del alumno
 * PUT /api/alumnos/me/perfil
 */
export function useUpdateDatosPersonalesMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateDatosPersonalesRequest) => {
      const response = await httpClient.put('/api/alumnos/me/perfil', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alumnoProfileKeys.profile() })
      toast.success('Datos personales actualizados correctamente')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al actualizar datos personales')
    },
  })
}

/**
 * Actualiza el contacto de emergencia
 * PUT /api/alumnos/me/contacto-emergencia
 */
export function useUpdateContactoEmergenciaMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateContactoEmergenciaRequest) => {
      const response = await httpClient.put('/api/alumnos/me/contacto-emergencia', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alumnoProfileKeys.profile() })
      toast.success('Contacto de emergencia actualizado correctamente')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al actualizar contacto de emergencia')
    },
  })
}

/**
 * Actualiza la configuración de notificaciones
 * PUT /api/alumnos/me/configuracion
 */
export function useUpdateConfiguracionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateConfiguracionRequest) => {
      const response = await httpClient.put('/api/alumnos/me/configuracion', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alumnoProfileKeys.profile() })
      toast.success('Configuración actualizada correctamente')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al actualizar configuración')
    },
  })
}

/**
 * Sube una foto de perfil
 * POST /api/alumnos/me/avatar
 */
export function useUploadAvatarMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('avatar', file)
      const response = await httpClient.post('/api/alumnos/me/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alumnoProfileKeys.profile() })
      toast.success('Foto de perfil actualizada correctamente')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al subir foto de perfil')
    },
  })
}
