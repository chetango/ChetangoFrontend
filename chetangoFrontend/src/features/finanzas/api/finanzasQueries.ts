// ============================================
// FINANZAS API QUERIES - REACT QUERY HOOKS
// ============================================

import { httpClient } from '@/shared/api/httpClient'
import type { ApiError } from '@/shared/api/interceptors'
import { useQuery } from '@tanstack/react-query'
import type {
    CategoriaGastoDTO,
    CategoriaIngresoDTO,
    FinanzasQueryParams,
    OtroGastoDTO,
    OtroIngresoDTO,
} from '../types/finanzasTypes'

// ============================================
// QUERY KEYS
// ============================================

export const finanzasKeys = {
  all: ['finanzas'] as const,
  otrosIngresos: (params: FinanzasQueryParams = {}) =>
    [...finanzasKeys.all, 'otros-ingresos', params] as const,
  otrosGastos: (params: FinanzasQueryParams = {}) =>
    [...finanzasKeys.all, 'otros-gastos', params] as const,
  categoriasIngreso: () => [...finanzasKeys.all, 'categorias-ingreso'] as const,
  categoriasGasto: () => [...finanzasKeys.all, 'categorias-gasto'] as const,
}

// ============================================
// QUERY HOOKS
// ============================================

/**
 * Fetches otros ingresos with optional filters
 * GET /api/finanzas/otros-ingresos
 */
export function useOtrosIngresosQuery(params: FinanzasQueryParams = {}) {
  return useQuery<OtroIngresoDTO[], ApiError>({
    queryKey: finanzasKeys.otrosIngresos(params),
    queryFn: async (): Promise<OtroIngresoDTO[]> => {
      const queryParams = new URLSearchParams()
      if (params.fechaDesde) queryParams.append('fechaDesde', params.fechaDesde)
      if (params.fechaHasta) queryParams.append('fechaHasta', params.fechaHasta)
      if (params.sede !== undefined) queryParams.append('sede', params.sede.toString())
      if (params.idCategoria) queryParams.append('idCategoriaIngreso', params.idCategoria)

      const queryString = queryParams.toString()
      const url = `/api/finanzas/otros-ingresos${queryString ? `?${queryString}` : ''}`
      const response = await httpClient.get<OtroIngresoDTO[]>(url)
      return response.data
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: (failureCount, error) => {
      if (error.status === 401 || error.status === 403 || error.status === 404) {
        return false
      }
      return failureCount < 2
    },
  })
}

/**
 * Fetches otros gastos with optional filters
 * GET /api/finanzas/otros-gastos
 */
export function useOtrosGastosQuery(params: FinanzasQueryParams = {}) {
  return useQuery<OtroGastoDTO[], ApiError>({
    queryKey: finanzasKeys.otrosGastos(params),
    queryFn: async (): Promise<OtroGastoDTO[]> => {
      const queryParams = new URLSearchParams()
      if (params.fechaDesde) queryParams.append('fechaDesde', params.fechaDesde)
      if (params.fechaHasta) queryParams.append('fechaHasta', params.fechaHasta)
      if (params.sede !== undefined) queryParams.append('sede', params.sede.toString())
      if (params.idCategoria) queryParams.append('idCategoriaGasto', params.idCategoria)

      const queryString = queryParams.toString()
      const url = `/api/finanzas/otros-gastos${queryString ? `?${queryString}` : ''}`
      const response = await httpClient.get<OtroGastoDTO[]>(url)
      return response.data
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: (failureCount, error) => {
      if (error.status === 401 || error.status === 403 || error.status === 404) {
        return false
      }
      return failureCount < 2
    },
  })
}

/**
 * Fetches categorías de ingresos
 * GET /api/finanzas/categorias-ingreso
 */
export function useCategoriasIngresoQuery() {
  return useQuery<CategoriaIngresoDTO[], ApiError>({
    queryKey: finanzasKeys.categoriasIngreso(),
    queryFn: async (): Promise<CategoriaIngresoDTO[]> => {
      const response = await httpClient.get<CategoriaIngresoDTO[]>(
        '/api/finanzas/categorias-ingreso'
      )
      return response.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - rarely change
    retry: (failureCount, error) => {
      if (error.status === 401 || error.status === 403 || error.status === 404) {
        return false
      }
      return failureCount < 2
    },
  })
}

/**
 * Fetches categorías de gastos
 * GET /api/finanzas/categorias-gasto
 */
export function useCategoriasGastoQuery() {
  return useQuery<CategoriaGastoDTO[], ApiError>({
    queryKey: finanzasKeys.categoriasGasto(),
    queryFn: async (): Promise<CategoriaGastoDTO[]> => {
      const response = await httpClient.get<CategoriaGastoDTO[]>(
        '/api/finanzas/categorias-gasto'
      )
      return response.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - rarely change
    retry: (failureCount, error) => {
      if (error.status === 401 || error.status === 403 || error.status === 404) {
        return false
      }
      return failureCount < 2
    },
  })
}
