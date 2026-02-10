// ============================================
// PROFILE ADMIN API QUERIES
// ============================================

import { useAuth } from '@/features/auth'
import { httpClient as api } from '@/shared/api/httpClient'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
    AdminProfile,
    CambiarPasswordRequest,
    SeguridadInfo,
    UpdateConfiguracionAdminRequest,
    UpdateDatosAcademiaRequest,
    UpdateDatosPersonalesAdminRequest,
} from '../types/profile.types'

// ============================================
// QUERY KEYS
// ============================================

export const adminProfileKeys = {
  all: ['admin-profile'] as const,
  detail: () => [...adminProfileKeys.all, 'detail'] as const,
  seguridad: () => [...adminProfileKeys.all, 'seguridad'] as const,
}

// ============================================
// QUERIES
// ============================================

/**
 * Get admin profile
 */
export const useAdminProfileQuery = () => {
  const { session } = useAuth()
  
  return useQuery({
    queryKey: adminProfileKeys.detail(),
    queryFn: async () => {
      const response = await api.get<AdminProfile>('/api/admin/me/perfil')
      return response.data
    },
    enabled: !!session.user,
  })
}

/**
 * Get admin security info
 * TODO: Implementar endpoint /api/admin/me/seguridad en el backend
 * Por ahora retorna datos mock
 */
export const useAdminSeguridadQuery = () => {
  const { session } = useAuth()
  
  return useQuery({
    queryKey: adminProfileKeys.seguridad(),
    queryFn: async () => {
      // TODO: Descomentar cuando el endpoint esté disponible
      // const response = await api.get<SeguridadInfo>('/api/admin/me/seguridad')
      // return response.data
      
      // Mock data
      const mockSeguridad: SeguridadInfo = {
        ultimoCambioPassword: new Date().toISOString(),
        autenticacionDosFactor: false,
        sesionesActivas: 1,
        ultimoAcceso: new Date().toISOString(),
      }
      
      return mockSeguridad
    },
    enabled: !!session.user,
  })
}

// ============================================
// MUTATIONS
// ============================================

/**
 * Update datos personales
 */
export const useUpdateDatosPersonalesAdminMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateDatosPersonalesAdminRequest) => {
      const response = await api.put('/api/admin/me/datos-personales', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminProfileKeys.detail() })
    },
  })
}

/**
 * Update datos academia
 */
export const useUpdateDatosAcademiaMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateDatosAcademiaRequest) => {
      const response = await api.put('/api/admin/me/datos-academia', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminProfileKeys.detail() })
    },
  })
}

/**
 * Update configuración
 */
export const useUpdateConfiguracionAdminMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateConfiguracionAdminRequest) => {
      const response = await api.put('/api/admin/me/configuracion', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminProfileKeys.detail() })
    },
  })
}

/**
 * Cambiar contraseña
 */
export const useCambiarPasswordMutation = () => {
  return useMutation({
    mutationFn: async (data: CambiarPasswordRequest) => {
      const response = await api.post('/api/admin/me/cambiar-password', data)
      return response.data
    },
  })
}

/**
 * Cerrar sesión en otros dispositivos
 */
export const useCerrarOtrasSesionesMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/api/admin/me/cerrar-otras-sesiones')
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminProfileKeys.seguridad() })
    },
  })
}
