// ============================================
// STUDENT ATTENDANCE QUERIES - REACT QUERY HOOKS
// ============================================

import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/httpClient'
import type {
  StudentAttendanceApiResponse,
  StudentPackagesApiResponse,
  AsistenciaRecord,
  EstadoPaquete,
} from '../types/studentTypes'
import {
  transformApiToAsistenciaRecord,
  transformApiToEstadoPaquete,
  sortAttendanceByDateDescending,
} from '../types/studentTypes'

// ============================================
// QUERY KEYS
// ============================================

export const studentAttendanceKeys = {
  all: ['studentAttendance'] as const,
  asistencias: (idAlumno: string) =>
    [...studentAttendanceKeys.all, 'asistencias', idAlumno] as const,
  asistenciasWithDates: (idAlumno: string, fechaDesde?: string, fechaHasta?: string) =>
    [...studentAttendanceKeys.all, 'asistencias', idAlumno, fechaDesde, fechaHasta] as const,
  paquetes: (idAlumno: string) =>
    [...studentAttendanceKeys.all, 'paquetes', idAlumno] as const,
  paqueteActivo: (idAlumno: string) =>
    [...studentAttendanceKeys.all, 'paqueteActivo', idAlumno] as const,
}

// ============================================
// QUERY HOOKS
// ============================================

/**
 * Fetches attendance history for a student
 * GET /api/alumnos/{idAlumno}/asistencias
 * @param idAlumno - Student's UUID
 * @param fechaDesde - Optional start date filter (YYYY-MM-DD)
 * @param fechaHasta - Optional end date filter (YYYY-MM-DD)
 * @returns List of attendance records sorted by date descending
 */
export function useStudentAsistenciasQuery(
  idAlumno: string | null,
  fechaDesde?: string,
  fechaHasta?: string
) {
  return useQuery({
    queryKey: studentAttendanceKeys.asistenciasWithDates(
      idAlumno ?? '',
      fechaDesde,
      fechaHasta
    ),
    queryFn: async (): Promise<AsistenciaRecord[]> => {
      const params: Record<string, string> = {}

      if (fechaDesde) {
        params.fechaDesde = fechaDesde
      }
      if (fechaHasta) {
        params.fechaHasta = fechaHasta
      }

      const response = await httpClient.get<StudentAttendanceApiResponse[]>(
        `/api/alumnos/${idAlumno}/asistencias`,
        { params }
      )

      // Transform API responses to frontend format
      const records = response.data.map(transformApiToAsistenciaRecord)

      // Sort by date descending (most recent first)
      return sortAttendanceByDateDescending(records)
    },
    enabled: !!idAlumno,
  })
}

/**
 * Fetches all packages for a student
 * GET /api/alumnos/{idAlumno}/paquetes
 * @param idAlumno - Student's UUID
 * @param soloActivos - Whether to filter only active packages (default: false)
 * @returns Paginated list of student's packages
 */
export function useStudentPaquetesQuery(
  idAlumno: string | null,
  soloActivos: boolean = false
) {
  return useQuery({
    queryKey: studentAttendanceKeys.paquetes(idAlumno ?? ''),
    queryFn: async (): Promise<StudentPackagesApiResponse> => {
      const response = await httpClient.get<StudentPackagesApiResponse>(
        `/api/alumnos/${idAlumno}/paquetes`,
        {
          params: {
            soloActivos,
            pageNumber: 1,
            pageSize: 50, // Get all packages
          },
        }
      )
      return response.data
    },
    enabled: !!idAlumno,
  })
}

/**
 * Fetches the active package for a student
 * Returns the first active package or null if none exists
 * GET /api/alumnos/{idAlumno}/paquetes?soloActivos=true
 * @param idAlumno - Student's UUID
 * @returns Active package state or null
 */
export function useStudentPaqueteActivoQuery(idAlumno: string | null) {
  return useQuery({
    queryKey: studentAttendanceKeys.paqueteActivo(idAlumno ?? ''),
    queryFn: async (): Promise<EstadoPaquete | null> => {
      const response = await httpClient.get<StudentPackagesApiResponse>(
        `/api/alumnos/${idAlumno}/paquetes`,
        {
          params: {
            soloActivos: true,
            pageNumber: 1,
            pageSize: 1, // Only need the first active package
          },
        }
      )

      // Return the first active package or null
      if (response.data.items.length === 0) {
        return null
      }

      return transformApiToEstadoPaquete(response.data.items[0])
    },
    enabled: !!idAlumno,
  })
}
