// ============================================
// ALUMNO ATTENDANCE CONFIRMATION - API MUTATIONS
// ============================================

import { httpClient } from '@/shared/api/httpClient'

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Confirmar una asistencia
 * POST /api/alumnos/asistencias/{idAsistencia}/confirmar
 */
export const confirmarAsistencia = async (idAsistencia: string): Promise<boolean> => {
  const response = await httpClient.post<boolean>(
    `/api/alumnos/asistencias/${idAsistencia}/confirmar`
  )
  return response.data
}