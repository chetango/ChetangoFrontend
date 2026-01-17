// ============================================
// CLASS QUERIES - REACT QUERY HOOKS
// ============================================

import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/httpClient'
import type {
  TipoClaseDTO,
  ProfesorDTO,
  ClaseDetalleDTO,
  ClaseListItemDTO,
  PaginatedResponse,
  ClasesQueryParams,
} from '../types/classTypes'

// ============================================
// QUERY KEYS
// ============================================

export const classKeys = {
  all: ['classes'] as const,
  tiposClase: () => [...classKeys.all, 'tipos-clase'] as const,
  profesores: () => [...classKeys.all, 'profesores'] as const,
  clasesByProfesor: (idProfesor: string, params: ClasesQueryParams) =>
    [...classKeys.all, 'by-profesor', idProfesor, params] as const,
  claseDetail: (idClase: string) => [...classKeys.all, 'detail', idClase] as const,
}

// ============================================
// CATALOG QUERY HOOKS
// ============================================

/**
 * Fetches all class types for dropdowns
 * GET /api/tipos-clase
 * @returns Array of TipoClaseDTO with id and nombre
 */
export function useTiposClaseQuery() {
  return useQuery({
    queryKey: classKeys.tiposClase(),
    queryFn: async (): Promise<TipoClaseDTO[]> => {
      const response = await httpClient.get<TipoClaseDTO[]>('/api/tipos-clase')
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - catalogs don't change often
  })
}

/**
 * Fetches all active professors for dropdowns (Admin only)
 * GET /api/profesores
 * @returns Array of ProfesorDTO with idProfesor, nombreCompleto, tipoProfesor
 */
export function useProfesoresQuery() {
  return useQuery({
    queryKey: classKeys.profesores(),
    queryFn: async (): Promise<ProfesorDTO[]> => {
      const response = await httpClient.get<ProfesorDTO[]>('/api/profesores')
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - catalogs don't change often
  })
}

// ============================================
// CLASS QUERY HOOKS
// ============================================

/**
 * Fetches classes for a specific professor with pagination
 * GET /api/profesores/{idProfesor}/clases
 * @param idProfesor - Professor UUID
 * @param params - Query parameters for filtering and pagination
 * @param enabled - Whether the query should be enabled
 * @returns PaginatedResponse with ClaseListItemDTO items
 */
export function useClasesByProfesorQuery(
  idProfesor: string,
  params: ClasesQueryParams,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: classKeys.clasesByProfesor(idProfesor, params),
    queryFn: async (): Promise<PaginatedResponse<ClaseListItemDTO>> => {
      const queryParams = new URLSearchParams()
      if (params.fechaDesde) queryParams.append('fechaDesde', params.fechaDesde)
      if (params.fechaHasta) queryParams.append('fechaHasta', params.fechaHasta)
      if (params.pagina) queryParams.append('pagina', params.pagina.toString())
      if (params.tamanoPagina) queryParams.append('tamanoPagina', params.tamanoPagina.toString())

      const queryString = queryParams.toString()
      const url = `/api/profesores/${idProfesor}/clases${queryString ? `?${queryString}` : ''}`
      const response = await httpClient.get<PaginatedResponse<ClaseListItemDTO>>(url)
      return response.data
    },
    enabled: enabled && !!idProfesor,
  })
}

/**
 * Fetches detailed information for a specific class
 * GET /api/clases/{id}
 * @param idClase - Class UUID
 * @param enabled - Whether the query should be enabled
 * @returns ClaseDetalleDTO with full class details
 */
export function useClaseDetailQuery(idClase: string, enabled: boolean = true) {
  return useQuery({
    queryKey: classKeys.claseDetail(idClase),
    queryFn: async (): Promise<ClaseDetalleDTO> => {
      const response = await httpClient.get<ClaseDetalleDTO>(`/api/clases/${idClase}`)
      return response.data
    },
    enabled: enabled && !!idClase,
  })
}
