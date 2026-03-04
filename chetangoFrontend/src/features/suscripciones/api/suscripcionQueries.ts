// ============================================
// SUSCRIPCIONES - API QUERIES
// ============================================

import { httpClient } from '@/shared/api/httpClient'
import { useQuery } from '@tanstack/react-query'
import type {
    ConfiguracionPagoDto,
    EstadoSuscripcionDto,
    PagoSuscripcionDto,
} from '../types/suscripcion.types'

// ============================================
// QUERY: Obtener estado de suscripción (Admin)
// ============================================
export const useEstadoSuscripcionQuery = () => {
  return useQuery({
    queryKey: ['suscripciones', 'mi-estado'],
    queryFn: async () => {
      const { data } = await httpClient.get<EstadoSuscripcionDto>(
        '/api/suscripciones/mi-estado'
      )
      return data
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  })
}

// ============================================
// QUERY: Obtener configuración de pago (Admin)
// ============================================
export const useConfiguracionPagoQuery = () => {
  return useQuery({
    queryKey: ['suscripciones', 'configuracion-pago'],
    queryFn: async () => {
      const { data } = await httpClient.get<ConfiguracionPagoDto>(
        '/api/suscripciones/configuracion-pago'
      )
      return data
    },
    staleTime: 30 * 60 * 1000, // 30 minutos (datos estáticos)
    gcTime: 60 * 60 * 1000, // 1 hora
  })
}

// ============================================
// QUERY: Obtener historial de pagos (Admin)
// ============================================
export const useHistorialPagosQuery = () => {
  return useQuery({
    queryKey: ['suscripciones', 'historial'],
    queryFn: async () => {
      const { data } = await httpClient.get<PagoSuscripcionDto[]>(
        '/api/suscripciones/historial'
      )
      return data
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
  })
}

// ============================================
// QUERY: Obtener pagos pendientes de aprobación (SuperAdmin)
// ============================================
export const usePagosPendientesAprobacionQuery = (enabled = true) => {
  return useQuery({
    queryKey: ['suscripciones', 'admin', 'pendientes'],
    queryFn: async () => {
      const { data } = await httpClient.get<PagoSuscripcionDto[]>(
        '/api/suscripciones/admin/pendientes'
      )
      return data
    },
    enabled, // Solo ejecutar si está habilitado (usuario es SuperAdmin)
    refetchInterval: 30000, // Refetch cada 30 segundos (polling para detectar nuevos pagos)
    staleTime: 20000, // 20 segundos
    gcTime: 3 * 60 * 1000, // 3 minutos
  })
}

// ============================================
// QUERY: Obtener historial de pagos con filtros (SuperAdmin)
// ============================================
export const useHistorialPagosAdminQuery = (
  fechaDesde?: Date,
  fechaHasta?: Date,
  estado?: string,
  enabled = true
) => {
  return useQuery({
    queryKey: ['suscripciones', 'admin', 'historial', fechaDesde, fechaHasta, estado],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (fechaDesde) params.append('fechaDesde', fechaDesde.toISOString())
      if (fechaHasta) params.append('fechaHasta', fechaHasta.toISOString())
      if (estado) params.append('estado', estado)

      const { data } = await httpClient.get<PagoSuscripcionDto[]>(
        `/api/suscripciones/admin/historial?${params.toString()}`
      )
      return data
    },
    enabled,
    staleTime: 30000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
  })
}

// ============================================
// QUERY: Listar todas las academias (SuperAdmin)
// ============================================
export const useListarAcademiasQuery = (enabled = true) => {
  return useQuery({
    queryKey: ['academias', 'todas'],
    queryFn: async () => {
      const { data } = await httpClient.get<Array<{
        id: string
        nombre: string
        subdomain: string
        dominio: string
        plan: string
        estado: string
        fechaRegistro: string
        maxSedes: number
        maxAlumnos: number
        maxProfesores: number
        maxStorageMB: number
        emailContacto: string
      }>>('/api/super-admin/academias')
      return data
    },
    enabled,
    staleTime: 60000, // 1 minuto
    gcTime: 5 * 60 * 1000, // 5 minutos
  })
}
