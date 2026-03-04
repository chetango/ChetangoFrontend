// ============================================
// SUSCRIPCIONES - API MUTATIONS
// ============================================

import { httpClient } from '@/shared/api/httpClient'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type {
    AprobarPagoRequest,
    CrearAcademiaConAdminRequest,
    RechazarPagoRequest,
    SubirComprobanteRequest,
} from '../types/suscripcion.types'

// ============================================
// MUTATION: Subir comprobante de pago (Admin)
// ============================================
export const useSubirComprobanteMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (request: SubirComprobanteRequest) => {
      const formData = new FormData()
      formData.append('referencia', request.referencia)
      formData.append('metodoPago', request.metodoPago)
      formData.append('monto', request.monto.toString())
      formData.append('archivo', request.archivo)

      const { data } = await httpClient.post(
        '/api/suscripciones/comprobante',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return data
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['suscripciones', 'historial'] })
      queryClient.invalidateQueries({ queryKey: ['suscripciones', 'mi-estado'] })
    },
  })
}

// ============================================
// MUTATION: Aprobar pago (SuperAdmin)
// ============================================
export const useAprobarPagoMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      pagoId,
      request,
    }: {
      pagoId: string
      request: AprobarPagoRequest
    }) => {
      const { data } = await httpClient.post(
        `/api/suscripciones/admin/aprobar/${pagoId}`,
        request
      )
      return data
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['suscripciones', 'admin', 'pendientes'] })
      queryClient.invalidateQueries({ queryKey: ['suscripciones', 'admin', 'historial'] })
    },
  })
}

// ============================================
// MUTATION: Rechazar pago (SuperAdmin)
// ============================================
export const useRechazarPagoMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      pagoId,
      request,
    }: {
      pagoId: string
      request: RechazarPagoRequest
    }) => {
      const { data } = await httpClient.post(
        `/api/suscripciones/admin/rechazar/${pagoId}`,
        request
      )
      return data
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['suscripciones', 'admin', 'pendientes'] })
      queryClient.invalidateQueries({ queryKey: ['suscripciones', 'admin', 'historial'] })
    },
  })
}

// ============================================
// MUTATION: Crear academia con administrador (SuperAdmin)
// ============================================
export const useCrearAcademiaConAdminMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (request: CrearAcademiaConAdminRequest) => {
      const { data } = await httpClient.post(
        '/api/super-admin/academias',
        request
      )
      return data
    },
    onSuccess: () => {
      // Invalidar queries relacionadas (si existe listado de academias)
      queryClient.invalidateQueries({ queryKey: ['academias'] })
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
    },
  })
}

