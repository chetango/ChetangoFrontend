// ============================================
// PROFESOR ATTENDANCE QUERIES - REACT QUERY HOOKS
// ============================================

import { httpClient } from '@/shared/api/httpClient'
import { getToday } from '@/shared/utils/dateTimeHelper'
import { useQuery } from '@tanstack/react-query'
import type {
    AsistenciasClaseResponse,
    ClaseProfesorItem,
    ClasesProfesorResponse,
} from '../types/profesorTypes'

// ============================================
// QUERY KEYS
// ============================================

export const profesorAttendanceKeys = {
  all: ['profesorAttendance'] as const,
  clases: (idProfesor: string, fechaDesde?: string, fechaHasta?: string) => 
    [...profesorAttendanceKeys.all, 'clases', idProfesor, fechaDesde, fechaHasta] as const,
  clasesDelDia: (idProfesor: string, fecha: string) =>
    [...profesorAttendanceKeys.all, 'clasesDelDia', idProfesor, fecha] as const,
  asistenciasClase: (idClase: string) =>
    [...profesorAttendanceKeys.all, 'asistenciasClase', idClase] as const,
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Gets today's date in YYYY-MM-DD format
 */
export function getTodayDateString(): string {
  return getToday()
}

/**
 * Filters classes to only include those for today
 * @param clases - List of classes from API
 * @param fecha - Date to filter by (YYYY-MM-DD format)
 * @returns Classes that match the specified date
 */
export function filterClassesByDate(clases: ClaseProfesorItem[], fecha: string): ClaseProfesorItem[] {
  return clases.filter((clase) => {
    const claseDate = clase.fecha.split('T')[0]
    return claseDate === fecha
  })
}

// ============================================
// QUERY HOOKS
// ============================================

/**
 * Fetches all classes for a profesor with optional date filtering
 * GET /api/profesores/{idProfesor}/clases
 * @param idProfesor - Profesor's UUID
 * @param fechaDesde - Optional start date filter (YYYY-MM-DD)
 * @param fechaHasta - Optional end date filter (YYYY-MM-DD)
 * @returns Paginated list of profesor's classes
 */
export function useProfesorClasesQuery(
  idProfesor: string | null,
  fechaDesde?: string,
  fechaHasta?: string
) {
  return useQuery({
    queryKey: profesorAttendanceKeys.clases(idProfesor ?? '', fechaDesde, fechaHasta),
    queryFn: async (): Promise<ClasesProfesorResponse> => {
      const params: Record<string, string | number> = {
        pagina: 1,
        tamanoPagina: 100, // Get all classes for the day
      }

      if (fechaDesde) {
        params.fechaDesde = fechaDesde
      }
      if (fechaHasta) {
        params.fechaHasta = fechaHasta
      }

      const response = await httpClient.get<ClasesProfesorResponse>(
        `/api/profesores/${idProfesor}/clases`,
        { params }
      )
      return response.data
    },
    enabled: !!idProfesor,
  })
}

/**
 * Fetches profesor's classes for today only
 * Uses the general clases endpoint with date filtering
 * @param idProfesor - Profesor's UUID
 * @returns List of today's classes for the profesor
 */
export function useProfesorClasesDelDiaQuery(idProfesor: string | null) {
  const today = getTodayDateString()

  return useQuery({
    queryKey: profesorAttendanceKeys.clasesDelDia(idProfesor ?? '', today),
    queryFn: async (): Promise<ClaseProfesorItem[]> => {
      const response = await httpClient.get<ClasesProfesorResponse>(
        `/api/profesores/${idProfesor}/clases`,
        {
          params: {
            fechaDesde: today,
            fechaHasta: today,
            pagina: 1,
            tamanoPagina: 50,
          },
        }
      )
      // Filter to ensure only today's classes are returned
      return filterClassesByDate(response.data.items, today)
    },
    enabled: !!idProfesor,
  })
}

/**
 * Fetches attendance summary for a specific class
 * GET /api/clases/{idClase}/asistencias
 * @param idClase - Class UUID
 * @returns Attendance list for the class including ALL active students
 */
export function useAsistenciasClaseQuery(idClase: string | null) {
  return useQuery({
    queryKey: profesorAttendanceKeys.asistenciasClase(idClase ?? ''),
    queryFn: async (): Promise<AsistenciasClaseResponse[]> => {
      // Use profesor endpoint with ownership validation
      const response = await httpClient.get<any[]>(
        `/api/clases/${idClase}/asistencias`
      )
      
      // Transform response from new AsistenciaProfesorDto format
      const asistencias: AsistenciasClaseResponse[] = response.data.map((item: any) => ({
        idAsistencia: item.idAsistencia ?? null,  // Can be null for students without prior attendance
        idAlumno: item.idAlumno,
        nombreAlumno: item.nombreAlumno,
        presente: item.presente ?? false,  // Default to false if not set
        observacion: item.observacion ?? '',
        estadoPaquete: item.estadoPaquete ?? 'SinPaquete',  // 'Activo', 'Agotado', 'Congelado', 'SinPaquete'
        clasesRestantes: item.clasesRestantes ?? null,
        idPaquete: item.idPaquete ?? null,  // Include package ID for attendance registration
      }))
      
      return asistencias
    },
    enabled: !!idClase,
    retry: false, // Don't retry on authorization errors
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  })
}
