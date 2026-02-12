// ============================================
// USER QUICK VIEW API QUERIES
// ============================================

import { httpClient } from '@/shared/api/httpClient'
import { useQuery } from '@tanstack/react-query'
import type { AlumnoQuickView, ProfesorQuickView } from '../types/userQuickViewTypes'

// ============================================
// QUERY KEYS
// ============================================

export const userQuickViewKeys = {
  all: ['user-quick-view'] as const,
  alumno: (id: string) => [...userQuickViewKeys.all, 'alumno', id] as const,
  profesor: (id: string) => [...userQuickViewKeys.all, 'profesor', id] as const,
}

// ============================================
// ALUMNO QUICK VIEW
// ============================================

/**
 * Obtiene información rápida de un alumno
 * GET /api/alumnos/{idAlumno}/quick-view
 * 
 * @param idAlumno - ID del alumno
 * @param enabled - Si la query debe ejecutarse
 */
export function useAlumnoQuickView(idAlumno: string | null, enabled = true) {
  return useQuery({
    queryKey: userQuickViewKeys.alumno(idAlumno || ''),
    queryFn: async (): Promise<AlumnoQuickView> => {
      if (!idAlumno) throw new Error('ID de alumno requerido')
      
      const response = await httpClient.get<AlumnoQuickView>(
        `/api/alumnos/${idAlumno}/quick-view`
      )
      return response.data
    },
    enabled: enabled && !!idAlumno,
    staleTime: 1 * 60 * 1000, // 1 minuto
    retry: 1,
  })
}

// ============================================
// PROFESOR QUICK VIEW
// ============================================

/**
 * Obtiene información rápida de un profesor
 * GET /api/profesores/{idProfesor}/quick-view
 * 
 * @param idProfesor - ID del profesor
 * @param enabled - Si la query debe ejecutarse
 */
export function useProfesorQuickView(idProfesor: string | null, enabled = true) {
  return useQuery({
    queryKey: userQuickViewKeys.profesor(idProfesor || ''),
    queryFn: async (): Promise<ProfesorQuickView> => {
      if (!idProfesor) throw new Error('ID de profesor requerido')
      
      const response = await httpClient.get<ProfesorQuickView>(
        `/api/profesores/${idProfesor}/quick-view`
      )
      return response.data
    },
    enabled: enabled && !!idProfesor,
    staleTime: 1 * 60 * 1000, // 1 minuto
    retry: 1,
  })
}
