// ============================================
// ALUMNO ATTENDANCE CONFIRMATION - API QUERIES
// ============================================

import { httpClient } from '@/shared/api/httpClient'
import type { AsistenciaPendiente } from '../types/confirmacion.types'

// ============================================
// QUERY KEYS
// ============================================

export const alumnoAttendanceKeys = {
  all: ['alumnoAttendance'] as const,
  pendientes: () => [...alumnoAttendanceKeys.all, 'pendientes'] as const,
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Obtener asistencias pendientes de confirmar del alumno autenticado
 * GET /api/alumnos/me/asistencias/pendientes
 */
export const getAsistenciasPendientes = async (): Promise<AsistenciaPendiente[]> => {
  const response = await httpClient.get<AsistenciaPendiente[]>(
    '/api/alumnos/me/asistencias/pendientes'
  )
  return response.data
}
