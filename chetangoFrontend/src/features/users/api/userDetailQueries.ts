// ============================================
// USER DETAIL QUERIES - FULL PROFILE DATA
// ============================================

import { httpClient } from '@/shared/api/httpClient'
import { useQuery } from '@tanstack/react-query'
import type { AlumnoDetailDTO, ProfesorDetailDTO } from '../types/userDetailTypes'

/**
 * Query keys para user detail
 */
export const userDetailKeys = {
  all: ['userDetail'] as const,
  alumno: (id: string) => [...userDetailKeys.all, 'alumno', id] as const,
  profesor: (id: string) => [...userDetailKeys.all, 'profesor', id] as const,
}

/**
 * Obtiene el detalle completo de un alumno
 * GET /api/alumnos/{idAlumno}/detail
 * 
 * @param idAlumno - ID del alumno
 * @param enabled - Si la query debe ejecutarse
 */
export function useAlumnoDetail(idAlumno: string | null | undefined, enabled = true) {
  return useQuery({
    queryKey: userDetailKeys.alumno(idAlumno || ''),
    queryFn: async (): Promise<AlumnoDetailDTO> => {
      if (!idAlumno) throw new Error('ID de alumno requerido')
      
      const response = await httpClient.get<AlumnoDetailDTO>(
        `/api/alumnos/${idAlumno}/detail`
      )
      return response.data
    },
    enabled: enabled && !!idAlumno,
    staleTime: 2 * 60 * 1000, // 2 minutos
    retry: 1,
  })
}

/**
 * Obtiene el detalle completo de un profesor
 * GET /api/profesores/{idProfesor}/detail
 * 
 * @param idProfesor - ID del profesor
 * @param enabled - Si la query debe ejecutarse
 */
export function useProfesorDetail(idProfesor: string | null | undefined, enabled = true) {
  return useQuery({
    queryKey: userDetailKeys.profesor(idProfesor || ''),
    queryFn: async (): Promise<ProfesorDetailDTO> => {
      if (!idProfesor) throw new Error('ID de profesor requerido')
      
      const response = await httpClient.get<ProfesorDetailDTO>(
        `/api/profesores/${idProfesor}/detail`
      )
      return response.data
    },
    enabled: enabled && !!idProfesor,
    staleTime: 2 * 60 * 1000, // 2 minutos
    retry: 1,
  })
}
