// ============================================
// DASHBOARD PROFESOR QUERIES
// ============================================

import { httpClient } from '@/shared/api/httpClient'
import { useQuery } from '@tanstack/react-query'
import type { DashboardProfesorResponse } from '../types/dashboardProfesor.types'

// ============================================
// QUERY KEYS
// ============================================

export const profesorDashboardKeys = {
  all: ['profesor-dashboard'] as const,
  data: () => [...profesorDashboardKeys.all, 'data'] as const,
}

// ============================================
// QUERY HOOKS
// ============================================

/**
 * Fetches dashboard del profesor con clases de hoy, KPIs y próximas clases
 * GET /api/reportes/dashboard/profesor
 * @returns DashboardProfesorResponse
 * 
 * Backend: Validación por email del token JWT
 * Frontend cache: 5 minutes (staleTime)
 * Auto-refresh: Every 5 minutes (refetchInterval)
 */
export function useDashboardProfesorQuery() {
  return useQuery({
    queryKey: profesorDashboardKeys.data(),
    queryFn: async (): Promise<DashboardProfesorResponse> => {
      const response = await httpClient.get<DashboardProfesorResponse>('/api/reportes/dashboard/profesor')
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 5 * 60 * 1000, // Refetch cada 5 minutos
    retry: 2,
    refetchOnWindowFocus: true
  })
}
