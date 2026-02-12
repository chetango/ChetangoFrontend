// ============================================
// DASHBOARD ALUMNO QUERIES
// ============================================

import { httpClient } from '@/shared/api/httpClient'
import { useQuery } from '@tanstack/react-query'
import type { DashboardAlumnoResponse } from '../types/dashboardAlumno.types'

// ============================================
// QUERY KEYS
// ============================================

export const alumnoDashboardKeys = {
  all: ['alumno-dashboard'] as const,
  data: () => [...alumnoDashboardKeys.all, 'data'] as const,
}

// ============================================
// QUERY HOOKS
// ============================================

/**
 * Fetches dashboard del alumno con progreso, próximas clases y logros
 * GET /api/reportes/dashboard/alumno
 * @returns DashboardAlumnoResponse
 * 
 * Backend: Validación por email del token JWT
 * Frontend cache: 5 minutes (staleTime)
 * Auto-refresh: Every 5 minutes (refetchInterval)
 */
export function useDashboardAlumnoQuery() {
  return useQuery({
    queryKey: alumnoDashboardKeys.data(),
    queryFn: async (): Promise<DashboardAlumnoResponse> => {
      const response = await httpClient.get<DashboardAlumnoResponse>('/api/reportes/dashboard/alumno')
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 5 * 60 * 1000, // Refetch cada 5 minutos
    retry: 2,
    refetchOnWindowFocus: true
  })
}
