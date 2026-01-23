// ============================================
// ATTENDANCE QUERIES - REACT QUERY HOOKS
// ============================================

import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/httpClient'
import type {
  DateRangeResponse,
  ClassesByDateResponse,
  AttendanceSummaryResponse,
} from '../types/attendanceTypes'

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
      const response = await httpClient.get<AttendanceSummaryResponse>(
        `/api/admin/asistencias/clase/${idClase}/resumen`
      )
      
      // DEBUG: Log the response to see package data and idAsistencia
      console.log('=== ATTENDANCE SUMMARY RESPONSE ===')
      console.log('Full response:', JSON.stringify(response.data, null, 2))
      if (response.data.alumnos && response.data.alumnos.length > 0) {
        console.log('First student data:', {
          nombre: response.data.alumnos[0].nombreCompleto,
          paquete: response.data.alumnos[0].paquete,
          asistencia: response.data.alumnos[0].asistencia,
          idAsistencia: response.data.alumnos[0].asistencia?.idAsistencia
        })
      }
      console.log('===================================')
      
      return response.data
    },
    enabled: !!idClase,
  })
}
