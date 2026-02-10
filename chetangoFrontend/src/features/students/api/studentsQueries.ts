// ============================================
// STUDENTS API QUERIES
// ============================================

import { useQuery } from '@tanstack/react-query'
import { httpClient } from '../../../shared/api/httpClient'
import type { Student } from '../types/student.types'

/**
 * Hook para buscar alumnos con filtro opcional
 */
export const useStudentsSearchQuery = (filtro: string) => {
  return useQuery({
    queryKey: ['students', 'search', filtro],
    queryFn: async () => {
      const params = filtro.trim() ? `?filtro=${encodeURIComponent(filtro)}` : ''
      const response = await httpClient.get<Student[]>(`/api/alumnos${params}`)
      return response.data
    },
    enabled: filtro.trim().length >= 2, // Solo buscar con mínimo 2 caracteres
    staleTime: 30000, // Cache por 30 segundos
  })
}
