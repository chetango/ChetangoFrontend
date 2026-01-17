// ============================================
// PAYMENT QUERIES - REACT QUERY HOOKS
// ============================================

import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/httpClient'
import type { ApiError } from '@/shared/api/interceptors'
import type {
  MetodoPagoDTO,
  EstadisticasPagosDTO,
  PagoDetalleDTO,
  PagoListItemDTO,
  PaginatedResponse,
  PagosQueryParams,
  EstadisticasQueryParams,
  AlumnoDTO,
  TipoPaqueteDTO,
} from '../types/paymentTypes'

// ============================================
// QUERY KEYS
// ============================================

export const paymentKeys = {
  all: ['payments'] as const,
  metodosPago: () => [...paymentKeys.all, 'metodos-pago'] as const,
  estadisticas: (params: EstadisticasQueryParams) =>
    [...paymentKeys.all, 'estadisticas', params] as const,
  pagosByAlumno: (idAlumno: string, params: PagosQueryParams) =>
    [...paymentKeys.all, 'by-alumno', idAlumno, params] as const,
  pagoDetail: (idPago: string) => [...paymentKeys.all, 'detail', idPago] as const,
  alumnos: () => [...paymentKeys.all, 'alumnos'] as const,
  tiposPaquete: () => [...paymentKeys.all, 'tipos-paquete'] as const,
}

// ============================================
// QUERY HOOKS
// ============================================

/**
 * Fetches all payment methods
 * GET /api/pagos/metodos-pago
 * @returns MetodoPagoDTO[] with idMetodoPago, nombre, descripcion
 *
 * Requirements: 2.1, 2.2
 * Error handling: 13.1, 13.2, 13.3, 13.4, 13.5
 * - 401: Redirect to login (handled by authInterceptor)
 * - 403: Toast "No tienes permisos..." (handled by errorInterceptor)
 * - 400/404: Toast with error message (handled by errorInterceptor)
 */
export function useMetodosPagoQuery() {
  return useQuery<MetodoPagoDTO[], ApiError>({
    queryKey: paymentKeys.metodosPago(),
    queryFn: async (): Promise<MetodoPagoDTO[]> => {
      const response = await httpClient.get<MetodoPagoDTO[]>('/api/pagos/metodos-pago')
      return response.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - payment methods rarely change
    retry: (failureCount, error) => {
      // Don't retry on 401, 403, 404 errors
      if (error.status === 401 || error.status === 403 || error.status === 404) {
        return false
      }
      return failureCount < 2
    },
  })
}

/**
 * Fetches payment statistics for a period
 * GET /api/pagos/estadisticas
 * @param params - Query parameters with fechaDesde and fechaHasta
 * @returns EstadisticasPagosDTO with totalRecaudado, cantidadPagos, promedioMonto, desgloseMetodosPago
 *
 * Requirements: 3.1, 3.2
 * Error handling: 13.1, 13.2, 13.3, 13.4, 13.5
 */
export function useEstadisticasQuery(params: EstadisticasQueryParams = {}) {
  return useQuery<EstadisticasPagosDTO, ApiError>({
    queryKey: paymentKeys.estadisticas(params),
    queryFn: async (): Promise<EstadisticasPagosDTO> => {
      const queryParams = new URLSearchParams()
      if (params.fechaDesde) queryParams.append('fechaDesde', params.fechaDesde)
      if (params.fechaHasta) queryParams.append('fechaHasta', params.fechaHasta)

      const queryString = queryParams.toString()
      const url = `/api/pagos/estadisticas${queryString ? `?${queryString}` : ''}`
      const response = await httpClient.get<EstadisticasPagosDTO>(url)
      return response.data
    },
    staleTime: 1 * 60 * 1000, // 1 minute - stats should be relatively fresh
    retry: (failureCount, error) => {
      // Don't retry on 401, 403, 404 errors
      if (error.status === 401 || error.status === 403 || error.status === 404) {
        return false
      }
      return failureCount < 2
    },
  })
}

/**
 * Fetches payments for a specific student with pagination
 * GET /api/alumnos/{idAlumno}/pagos
 * @param idAlumno - Student UUID
 * @param params - Query parameters for filtering and pagination
 * @param enabled - Whether the query should run
 * @returns PaginatedResponse<PagoListItemDTO>
 *
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5
 * Error handling: 13.1, 13.2, 13.3, 13.4, 13.5
 */
export function usePagosByAlumnoQuery(
  idAlumno: string,
  params: PagosQueryParams = {},
  enabled: boolean = true
) {
  return useQuery<PaginatedResponse<PagoListItemDTO>, ApiError>({
    queryKey: paymentKeys.pagosByAlumno(idAlumno, params),
    queryFn: async (): Promise<PaginatedResponse<PagoListItemDTO>> => {
      const queryParams = new URLSearchParams()
      if (params.fechaDesde) queryParams.append('fechaDesde', params.fechaDesde)
      if (params.fechaHasta) queryParams.append('fechaHasta', params.fechaHasta)
      if (params.idMetodoPago) queryParams.append('idMetodoPago', params.idMetodoPago)
      if (params.pageNumber !== undefined) {
        queryParams.append('pageNumber', params.pageNumber.toString())
      }
      if (params.pageSize !== undefined) {
        queryParams.append('pageSize', params.pageSize.toString())
      }

      const queryString = queryParams.toString()
      const url = `/api/alumnos/${idAlumno}/pagos${queryString ? `?${queryString}` : ''}`
      const response = await httpClient.get<PaginatedResponse<PagoListItemDTO>>(url)
      return response.data
    },
    enabled: enabled && !!idAlumno,
    retry: (failureCount, error) => {
      // Don't retry on 401, 403, 404 errors
      if (error.status === 401 || error.status === 403 || error.status === 404) {
        return false
      }
      return failureCount < 2
    },
  })
}

/**
 * Fetches detailed information for a specific payment
 * GET /api/pagos/{id}
 * @param idPago - Payment UUID
 * @param enabled - Whether the query should run
 * @returns PagoDetalleDTO with full payment details including paquetes
 *
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
 * Error handling: 13.1, 13.2, 13.3, 13.4, 13.5
 * - 404: Toast "El pago no existe" (handled by errorInterceptor)
 */
export function usePagoDetailQuery(idPago: string, enabled: boolean = true) {
  return useQuery<PagoDetalleDTO, ApiError>({
    queryKey: paymentKeys.pagoDetail(idPago),
    queryFn: async (): Promise<PagoDetalleDTO> => {
      const response = await httpClient.get<PagoDetalleDTO>(`/api/pagos/${idPago}`)
      return response.data
    },
    enabled: enabled && !!idPago,
    retry: (failureCount, error) => {
      // Don't retry on 401, 403, 404 errors
      if (error.status === 401 || error.status === 403 || error.status === 404) {
        return false
      }
      return failureCount < 2
    },
  })
}

/**
 * Fetches all active students for search
 * GET /api/alumnos
 * @returns AlumnoDTO[] with idAlumno, nombreCompleto, documentoIdentidad, correo
 *
 * Requirements: 2.5, 2.6
 * Error handling: 13.1, 13.2, 13.3, 13.4, 13.5
 */
export function useAlumnosForPaymentsQuery() {
  return useQuery<AlumnoDTO[], ApiError>({
    queryKey: paymentKeys.alumnos(),
    queryFn: async (): Promise<AlumnoDTO[]> => {
      const response = await httpClient.get<AlumnoDTO[]>('/api/alumnos')
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 401, 403, 404 errors
      if (error.status === 401 || error.status === 403 || error.status === 404) {
        return false
      }
      return failureCount < 2
    },
  })
}

/**
 * Fetches all package types for selection
 * GET /api/paquetes/tipos
 * @returns TipoPaqueteDTO[] with id, nombre, clasesDisponibles, diasVigencia, precio
 *
 * Requirements: 2.3, 2.4
 * Error handling: 13.1, 13.2, 13.3, 13.4, 13.5
 */
export function useTiposPaqueteForPaymentsQuery() {
  return useQuery<TipoPaqueteDTO[], ApiError>({
    queryKey: paymentKeys.tiposPaquete(),
    queryFn: async (): Promise<TipoPaqueteDTO[]> => {
      const response = await httpClient.get<TipoPaqueteDTO[]>('/api/paquetes/tipos')
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 401, 403, 404 errors
      if (error.status === 401 || error.status === 403 || error.status === 404) {
        return false
      }
      return failureCount < 2
    },
  })
}
