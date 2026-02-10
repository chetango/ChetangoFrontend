// ============================================
// REPORT QUERIES - REACT QUERY HOOKS
// API integration for reports
// ============================================

import { httpClient } from '@/shared/api/httpClient'
import { getToday } from '@/shared/utils/dateTimeHelper'
import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import type {
    AlumnosReporte,
    AsistenciasReporte,
    ClasesReporte,
    DateRangeFilter,
    GetReporteAlumnosRequest,
    GetReporteAsistenciasRequest,
    GetReporteClasesRequest,
    GetReporteIngresosRequest,
    GetReportePaquetesRequest,
    IngresosReporte,
    PaquetesReporte,
    ReporteAlumnosDTO,
    ReporteAsistenciasDTO,
    ReporteClasesDTO,
    ReporteIngresosDTO,
    ReportePaquetesDTO,
} from '../types/reportTypes'

// ============================================
// QUERY KEYS
// ============================================

export const reportKeys = {
  all: ['reports'] as const,
  alumnos: (filters: GetReporteAlumnosRequest) => 
    [...reportKeys.all, 'alumnos', filters] as const,
  clases: (filters: GetReporteClasesRequest) => 
    [...reportKeys.all, 'clases', filters] as const,
  asistencias: (filters: GetReporteAsistenciasRequest) => 
    [...reportKeys.all, 'asistencias', filters] as const,
  paquetes: (filters: GetReportePaquetesRequest) => 
    [...reportKeys.all, 'paquetes', filters] as const,
  ingresos: (filters: GetReporteIngresosRequest) => 
    [...reportKeys.all, 'ingresos', filters] as const,
}

// ============================================
// QUERY HOOKS
// ============================================

/**
 * Fetch Reporte de Alumnos
 */
export function useReporteAlumnos(
  filters: GetReporteAlumnosRequest,
  enabled = true
) {
  return useQuery({
    queryKey: reportKeys.alumnos(filters),
    queryFn: async (): Promise<ReporteAlumnosDTO> => {
      const params = new URLSearchParams()
      if (filters.fechaInscripcionDesde) 
        params.append('fechaInscripcionDesde', filters.fechaInscripcionDesde)
      if (filters.fechaInscripcionHasta) 
        params.append('fechaInscripcionHasta', filters.fechaInscripcionHasta)
      if (filters.estado) 
        params.append('estado', filters.estado)

      const response = await httpClient.get<ReporteAlumnosDTO>(
        `/api/reportes/alumnos?${params.toString()}`
      )
      return response.data
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Fetch Reporte de Clases
 */
export function useReporteClases(
  filters: GetReporteClasesRequest,
  enabled = true
) {
  return useQuery({
    queryKey: reportKeys.clases(filters),
    queryFn: async (): Promise<ReporteClasesDTO> => {
      const params = new URLSearchParams()
      params.append('fechaDesde', filters.fechaDesde)
      params.append('fechaHasta', filters.fechaHasta)
      if (filters.idTipoClase) 
        params.append('idTipoClase', filters.idTipoClase)
      if (filters.idProfesor) 
        params.append('idProfesor', filters.idProfesor)

      const response = await httpClient.get<ReporteClasesDTO>(
        `/api/reportes/clases?${params.toString()}`
      )
      return response.data
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Fetch Reporte de Asistencias
 */
export function useReporteAsistencias(
  filters: GetReporteAsistenciasRequest,
  enabled = true
) {
  return useQuery({
    queryKey: reportKeys.asistencias(filters),
    queryFn: async (): Promise<ReporteAsistenciasDTO> => {
      const params = new URLSearchParams()
      params.append('fechaDesde', filters.fechaDesde)
      params.append('fechaHasta', filters.fechaHasta)
      if (filters.idAlumno) 
        params.append('idAlumno', filters.idAlumno)
      if (filters.idClase) 
        params.append('idClase', filters.idClase)

      const response = await httpClient.get<ReporteAsistenciasDTO>(
        `/api/reportes/asistencias?${params.toString()}`
      )
      return response.data
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Fetch Reporte de Paquetes
 */
export function useReportePaquetes(
  filters: GetReportePaquetesRequest,
  enabled = true
) {
  return useQuery({
    queryKey: reportKeys.paquetes(filters),
    queryFn: async (): Promise<ReportePaquetesDTO> => {
      const params = new URLSearchParams()
      params.append('fechaDesde', filters.fechaDesde)
      params.append('fechaHasta', filters.fechaHasta)
      if (filters.estado) 
        params.append('estado', filters.estado)
      if (filters.idTipoPaquete) 
        params.append('idTipoPaquete', filters.idTipoPaquete)

      const response = await httpClient.get<ReportePaquetesDTO>(
        `/api/reportes/paquetes?${params.toString()}`
      )
      return response.data
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Fetch Reporte de Ingresos
 */
export function useReporteIngresos(
  filters: GetReporteIngresosRequest,
  enabled = true
) {
  return useQuery({
    queryKey: reportKeys.ingresos(filters),
    queryFn: async (): Promise<ReporteIngresosDTO> => {
      const params = new URLSearchParams()
      params.append('fechaDesde', filters.fechaDesde)
      params.append('fechaHasta', filters.fechaHasta)
      if (filters.metodoPago) 
        params.append('metodoPago', filters.metodoPago)

      const response = await httpClient.get<ReporteIngresosDTO>(
        `/api/reportes/ingresos?${params.toString()}`
      )
      return response.data
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  })
}

// ============================================
// WRAPPER HOOKS FOR DETAILED REPORTS
// These hooks accept DateRangeFilter and return the extended report types
// ============================================

/**
 * Hook for Students Report (with extended data for charts)
 * El endpoint de alumnos usa fechaInscripcionDesde/Hasta como parámetros opcionales
 */
export function useAlumnosReport(
  filter: DateRangeFilter,
  options?: Partial<UseQueryOptions<AlumnosReporte>>
) {
  return useQuery<AlumnosReporte>({
    queryKey: ['reports', 'alumnos', 'detailed', filter],
    queryFn: async (): Promise<AlumnosReporte> => {
      const params = new URLSearchParams()
      
      // Parámetros opcionales para filtrar por fecha de inscripción
      if (filter.fechaDesde) {
        params.append('fechaInscripcionDesde', filter.fechaDesde)
      }
      if (filter.fechaHasta) {
        params.append('fechaInscripcionHasta', filter.fechaHasta)
      }

      const response = await httpClient.get<AlumnosReporte>(
        `/api/reportes/alumnos?${params.toString()}`
      )
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}

/**
 * Hook for Classes Report (with extended data for charts)
 */
export function useClasesReport(
  filter: DateRangeFilter,
  options?: Partial<UseQueryOptions<ClasesReporte>>
) {
  return useQuery<ClasesReporte>({
    queryKey: ['reports', 'clases', 'detailed', filter],
    queryFn: async (): Promise<ClasesReporte> => {
      const params = new URLSearchParams()
      
      // Fechas obligatorias - usar valores por defecto si no están presentes
      const today = getToday()
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const thirtyDaysAgoStr = `${thirtyDaysAgo.getFullYear()}-${String(thirtyDaysAgo.getMonth() + 1).padStart(2, '0')}-${String(thirtyDaysAgo.getDate()).padStart(2, '0')}`
      
      const fechaDesde = filter.fechaDesde || thirtyDaysAgoStr
      const fechaHasta = filter.fechaHasta || today
      
      params.append('fechaDesde', fechaDesde)
      params.append('fechaHasta', fechaHasta)

      const response = await httpClient.get<ClasesReporte>(
        `/api/reportes/clases?${params.toString()}`
      )
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}

/**
 * Hook for Attendance Report (with extended data for charts)
 */
export function useAsistenciasReport(
  filter: DateRangeFilter,
  options?: Partial<UseQueryOptions<AsistenciasReporte>>
) {
  return useQuery<AsistenciasReporte>({
    queryKey: ['reports', 'asistencias', 'detailed', filter],
    queryFn: async (): Promise<AsistenciasReporte> => {
      const params = new URLSearchParams()
      
      // Fechas obligatorias - usar valores por defecto si no están presentes
      const today = getToday()
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const thirtyDaysAgoStr = `${thirtyDaysAgo.getFullYear()}-${String(thirtyDaysAgo.getMonth() + 1).padStart(2, '0')}-${String(thirtyDaysAgo.getDate()).padStart(2, '0')}`
      
      const fechaDesde = filter.fechaDesde || thirtyDaysAgoStr
      const fechaHasta = filter.fechaHasta || today
      
      params.append('fechaDesde', fechaDesde)
      params.append('fechaHasta', fechaHasta)

      const response = await httpClient.get<AsistenciasReporte>(
        `/api/reportes/asistencias?${params.toString()}`
      )
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}

/**
 * Hook for Packages Report (with extended data for charts)
 */
export function usePaquetesReport(
  filter: DateRangeFilter,
  options?: Partial<UseQueryOptions<PaquetesReporte>>
) {
  return useQuery<PaquetesReporte>({
    queryKey: ['reports', 'paquetes', 'detailed', filter],
    queryFn: async (): Promise<PaquetesReporte> => {
      const params = new URLSearchParams()
      
      // Fechas obligatorias - usar valores por defecto si no están presentes
      const today = getToday()
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const thirtyDaysAgoStr = `${thirtyDaysAgo.getFullYear()}-${String(thirtyDaysAgo.getMonth() + 1).padStart(2, '0')}-${String(thirtyDaysAgo.getDate()).padStart(2, '0')}`
      
      const fechaDesde = filter.fechaDesde || thirtyDaysAgoStr
      const fechaHasta = filter.fechaHasta || today
      
      params.append('fechaDesde', fechaDesde)
      params.append('fechaHasta', fechaHasta)

      const response = await httpClient.get<PaquetesReporte>(
        `/api/reportes/paquetes?${params.toString()}`
      )
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}

/**
 * Hook for Income Report (with extended data for charts)
 */
export function useIngresosReport(
  filter: DateRangeFilter,
  options?: Partial<UseQueryOptions<IngresosReporte>>
) {
  return useQuery<IngresosReporte>({
    queryKey: ['reports', 'ingresos', 'detailed', filter],
    queryFn: async (): Promise<IngresosReporte> => {
      const params = new URLSearchParams()
      
      // Fechas obligatorias - usar valores por defecto si no están presentes
      const today = getToday()
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const thirtyDaysAgoStr = `${thirtyDaysAgo.getFullYear()}-${String(thirtyDaysAgo.getMonth() + 1).padStart(2, '0')}-${String(thirtyDaysAgo.getDate()).padStart(2, '0')}`
      
      const fechaDesde = filter.fechaDesde || thirtyDaysAgoStr
      const fechaHasta = filter.fechaHasta || today
      
      params.append('fechaDesde', fechaDesde)
      params.append('fechaHasta', fechaHasta)

      const response = await httpClient.get<IngresosReporte>(
        `/api/reportes/ingresos?${params.toString()}`
      )
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}
