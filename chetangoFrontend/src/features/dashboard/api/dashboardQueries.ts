// ============================================
// DASHBOARD QUERIES - REACT QUERY HOOKS
// ============================================

import { httpClient } from '@/shared/api/httpClient'
import { useQuery } from '@tanstack/react-query'
import type { DashboardQueryParams, DashboardResponse } from '../types/dashboard.types'

// ============================================
// QUERY KEYS
// ============================================

export const dashboardKeys = {
  all: ['dashboard'] as const,
  data: (params?: DashboardQueryParams) => [...dashboardKeys.all, 'data', params] as const,
}

// ============================================
// QUERY HOOKS
// ============================================

/**
 * Fetches complete dashboard data with KPIs, charts, alerts, and recent activity
 * GET /api/reportes/dashboard
 * @param params - Optional query parameters (fechaDesde, fechaHasta, periodo)
 * @returns DashboardResponse with complete dashboard data
 * 
 * Backend cache: 5 minutes
 * Frontend cache: 5 minutes (staleTime)
 * Auto-refresh: Every 5 minutes (refetchInterval)
 */
export function useDashboardQuery(params?: DashboardQueryParams) {
  return useQuery({
    queryKey: dashboardKeys.data(params),
    queryFn: async (): Promise<DashboardResponse> => {
      const response = await httpClient.get<DashboardResponse>('/api/reportes/dashboard', {
        params
      })
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 5 * 60 * 1000, // Refetch cada 5 minutos
    retry: 2,
    refetchOnWindowFocus: true
  })
}
