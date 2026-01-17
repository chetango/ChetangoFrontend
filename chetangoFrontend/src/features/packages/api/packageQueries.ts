// ============================================
// PACKAGE QUERIES - REACT QUERY HOOKS
// ============================================

import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/httpClient'
import type { ApiError } from '@/shared/api/interceptors'
import type {
  AlumnoDTO,
  TipoPaqueteDTO,
  PaqueteDetalleDTO,
  PaqueteListItemDTO,
  PaginatedResponse,
  PaquetesQueryParams,
} from '../types/packageTypes'

// ============================================
// QUERY KEYS
// ============================================

export const packageKeys = {
  all: ['packages'] as const,
  alumnos: () => [...packageKeys.all, 'alumnos'] as const,
  tiposPaquete: () => [...packageKeys.all, 'tipos-paquete'] as const,
  paquetesByAlumno: (idAlumno: string, params: PaquetesQueryParams) =>
    [...packageKeys.all, 'by-alumno', idAlumno, params] as const,
  allPaquetes: (params: PaquetesQueryParams) => [...packageKeys.all, 'list', params] as const,
  paqueteDetail: (idPaquete: string) => [...packageKeys.all, 'detail', idPaquete] as const,
}

// ============================================
// QUERY HOOKS
// ============================================

/**
 * Fetches all active students for dropdowns
 * GET /api/alumnos
 * @returns AlumnoDTO[] with idAlumno, nombreCompleto, documentoIdentidad
 * 
 * Error handling: 11.1, 11.2, 11.3, 11.4, 11.5
 * - 401: Redirect to login (handled by authInterceptor)
 * - 403: Toast "No tienes permisos..." (handled by errorInterceptor)
 * - 400/404: Toast with error message (handled by errorInterceptor)
 */
export function useAlumnosQuery() {
  return useQuery<AlumnoDTO[], ApiError>({
    queryKey: packageKeys.alumnos(),
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
 * Fetches all package types for dropdowns
 * GET /api/tipos-paquete
 * @returns TipoPaqueteDTO[] with id, nombre, clasesDisponibles, diasVigencia, precio
 * 
 * Error handling: 11.1, 11.2, 11.3, 11.4, 11.5
 */
export function useTiposPaqueteQuery() {
  return useQuery<TipoPaqueteDTO[], ApiError>({
    queryKey: packageKeys.tiposPaquete(),
    queryFn: async (): Promise<TipoPaqueteDTO[]> => {
      const response = await httpClient.get<TipoPaqueteDTO[]>('/api/tipos-paquete')
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
 * Fetches packages for a specific student with pagination
 * GET /api/alumnos/{idAlumno}/paquetes
 * @param idAlumno - Student UUID
 * @param params - Query parameters for filtering and pagination
 * @param enabled - Whether the query should run
 * @returns PaginatedResponse<PaqueteListItemDTO>
 * 
 * Error handling: 11.1, 11.2, 11.3, 11.4, 11.5
 */
export function usePaquetesByAlumnoQuery(
  idAlumno: string,
  params: PaquetesQueryParams = {},
  enabled: boolean = true
) {
  return useQuery<PaginatedResponse<PaqueteListItemDTO>, ApiError>({
    queryKey: packageKeys.paquetesByAlumno(idAlumno, params),
    queryFn: async (): Promise<PaginatedResponse<PaqueteListItemDTO>> => {
      const queryParams = new URLSearchParams()

      if (params.soloActivos !== undefined) {
        queryParams.append('soloActivos', params.soloActivos.toString())
      }
      if (params.estado !== undefined) {
        queryParams.append('estado', params.estado.toString())
      }
      if (params.fechaVencimientoDesde) {
        queryParams.append('fechaVencimientoDesde', params.fechaVencimientoDesde)
      }
      if (params.fechaVencimientoHasta) {
        queryParams.append('fechaVencimientoHasta', params.fechaVencimientoHasta)
      }
      if (params.pageNumber !== undefined) {
        queryParams.append('pageNumber', params.pageNumber.toString())
      }
      if (params.pageSize !== undefined) {
        queryParams.append('pageSize', params.pageSize.toString())
      }

      const queryString = queryParams.toString()
      const url = `/api/alumnos/${idAlumno}/paquetes${queryString ? `?${queryString}` : ''}`
      const response = await httpClient.get<PaginatedResponse<PaqueteListItemDTO>>(url)
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
 * Fetches detailed information for a specific package
 * GET /api/paquetes/{id}
 * @param idPaquete - Package UUID
 * @param enabled - Whether the query should run
 * @returns PaqueteDetalleDTO with full package details including congelaciones and historial
 * 
 * Error handling: 11.1, 11.2, 11.3, 11.4, 11.5
 * - 404: Toast "El paquete especificado no existe" (handled by errorInterceptor)
 */
export function usePaqueteDetailQuery(idPaquete: string, enabled: boolean = true) {
  return useQuery<PaqueteDetalleDTO, ApiError>({
    queryKey: packageKeys.paqueteDetail(idPaquete),
    queryFn: async (): Promise<PaqueteDetalleDTO> => {
      const response = await httpClient.get<PaqueteDetalleDTO>(`/api/paquetes/${idPaquete}`)
      return response.data
    },
    enabled: enabled && !!idPaquete,
    retry: (failureCount, error) => {
      // Don't retry on 401, 403, 404 errors
      if (error.status === 401 || error.status === 403 || error.status === 404) {
        return false
      }
      return failureCount < 2
    },
  })
}
