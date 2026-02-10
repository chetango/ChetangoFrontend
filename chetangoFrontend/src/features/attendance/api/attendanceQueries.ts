// ============================================
// ATTENDANCE QUERIES - REACT QUERY HOOKS
// ============================================

import { httpClient } from '@/shared/api/httpClient'
import { useQuery } from '@tanstack/react-query'
import type {
    AttendanceSummaryResponse,
    ClassesByDateResponse,
    DateRangeResponse,
} from '../types/attendanceTypes'

// ============================================
// TYPES
// ============================================

/**
 * Backend response type before transformation
 * Enums come as numbers from the backend
 */
interface AttendanceSummaryBackendResponse {
  idClase: string
  fecha: string
  nombreClase: string
  profesorPrincipal: string
  alumnos: Array<{
    idAlumno: string
    nombreCompleto: string
    documentoIdentidad: string
    avatarIniciales: string
    paquete: {
      idPaquete: string | null
      estado: number
      descripcion: string | null
      clasesTotales: number | null
      clasesUsadas: number | null
      clasesRestantes: number | null
    } | null
    asistencia: {
      idAsistencia: string | null
      estado: number
      observacion: string | null
    }
  }>
  presentes: number
  ausentes: number
  sinPaquete: number
}

// ============================================
// QUERY KEYS
// ============================================

export const attendanceKeys = {
  all: ['attendance'] as const,
  dateRange: () => [...attendanceKeys.all, 'dateRange'] as const,
  classesByDate: (fecha: string) => [...attendanceKeys.all, 'classes', fecha] as const,
  summary: (idClase: string) => [...attendanceKeys.all, 'summary', idClase] as const,
}

// ============================================
// QUERY HOOKS
// ============================================

/**
 * Fetches the date range with days that have classes
 * GET /api/admin/asistencias/dias-con-clases
 * @returns DateRangeResponse with hoy, desde, hasta, and diasConClases
 */
export function useDateRangeQuery() {
  return useQuery({
    queryKey: attendanceKeys.dateRange(),
    queryFn: async (): Promise<DateRangeResponse> => {
      const response = await httpClient.get<DateRangeResponse>(
        '/api/admin/asistencias/dias-con-clases'
      )
      return response.data
    },
  })
}

/**
 * Fetches classes for a specific date
 * GET /api/admin/asistencias/clases-del-dia?fecha={fecha}
 * @param fecha - Date in YYYY-MM-DD format
 * @returns ClassesByDateResponse with fecha and clases array
 */
export function useClassesByDateQuery(fecha: string) {
  return useQuery({
    queryKey: attendanceKeys.classesByDate(fecha),
    queryFn: async (): Promise<ClassesByDateResponse> => {
      const response = await httpClient.get<ClassesByDateResponse>(
        '/api/admin/asistencias/clases-del-dia',
        { params: { fecha } }
      )
      return response.data
    },
    enabled: !!fecha,
  })
}

/**
 * Fetches attendance summary for a specific class
 * GET /api/admin/asistencias/clase/{idClase}/resumen
 * @param idClase - Class UUID
 * @returns AttendanceSummaryResponse with class details and student attendance
 */
export function useAttendanceSummaryQuery(idClase: string | null) {
  return useQuery({
    queryKey: attendanceKeys.summary(idClase ?? ''),
    queryFn: async (): Promise<AttendanceSummaryResponse> => {
      const response = await httpClient.get<AttendanceSummaryBackendResponse>(
        `/api/admin/asistencias/clase/${idClase}/resumen`
      )
      
      // Transform enum numbers to strings for frontend compatibility
      const transformedData: AttendanceSummaryResponse = {
        ...response.data,
        alumnos: response.data.alumnos.map((alumno) => ({
          ...alumno,
          paquete: alumno.paquete ? {
            ...alumno.paquete,
            estado: transformPackageState(alumno.paquete.estado)
          } : null,
          asistencia: {
            ...alumno.asistencia,
            estado: transformAttendanceState(alumno.asistencia.estado)
          }
        }))
      }
      
      return transformedData
    },
    enabled: !!idClase,
  })
}

// ============================================
// TRANSFORMATION HELPERS
// ============================================

/**
 * Transforms package state enum from backend (number) to frontend (string)
 * Backend enum: 0=Activo, 1=Agotado, 2=Congelado, 3=SinPaquete
 */
function transformPackageState(estado: number | string): 'Activo' | 'Agotado' | 'Congelado' | 'SinPaquete' {
  if (typeof estado === 'string') return estado as 'Activo' | 'Agotado' | 'Congelado' | 'SinPaquete'
  
  switch (estado) {
    case 0: return 'Activo'
    case 1: return 'Agotado'
    case 2: return 'Congelado'
    case 3: return 'SinPaquete'
    default: return 'SinPaquete'
  }
}

/**
 * Transforms attendance state enum from backend (number) to frontend (string)
 * Backend enum: 0=Ausente, 1=Presente
 */
function transformAttendanceState(estado: number | string): 'Ausente' | 'Presente' {
  if (typeof estado === 'string') return estado as 'Ausente' | 'Presente'
  
  switch (estado) {
    case 0: return 'Ausente'
    case 1: return 'Presente'
    default: return 'Ausente'
  }
}
