// ============================================
// USE STUDENT CLASSES HOOK
// Hook for student classes page integration
// Requirements: 3.3
// ============================================

import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { useAuth } from '@/features/auth'
import { useUserProfileQuery } from '@/features/auth/api/profileQueries'
import { httpClient } from '@/shared/api/httpClient'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
    selectStudentState,
    setReprogramarClaseId,
    setSelectedClaseId,
} from '../store/classesSlice'
import type { ClaseAlumno } from '../types/classTypes'
import {
    esHoy,
    estaEnCurso,
    formatearFecha,
    getDiaSemana,
    getHoyISO,
    minutosParaInicio,
} from '../utils/dateUtils'
import { separateClasesByTime } from '../utils/filterUtils'

// ============================================
// API TYPES
// ============================================

interface ClaseAlumnoDTO {
  idClase: string
  fecha: string
  horaInicio: string
  horaFin: string
  tipoClase: string
  nombreProfesor: string
  cupoMaximo: number
  totalAsistencias: number
  puedeReprogramar?: boolean
  horasParaReprogramar?: number
  resultado?: 'asistida' | 'ausente' | 'reprogramada'
  descontada?: boolean
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Transforms API data to ClaseAlumno format
 */
function transformToClaseAlumno(clase: ClaseAlumnoDTO): ClaseAlumno {
  const isHoy = esHoy(clase.fecha)
  const enCurso = isHoy && estaEnCurso(clase.horaInicio, clase.horaFin)
  const minParaInicio = minutosParaInicio(clase.fecha, clase.horaInicio)

  let estado: ClaseAlumno['estado'] = 'programada'
  if (enCurso) {
    estado = 'en_curso'
  } else if (isHoy) {
    const now = new Date()
    const [endH, endM] = clase.horaFin.split(':').map(Number)
    const endMinutes = endH * 60 + endM
    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    if (currentMinutes > endMinutes) {
      estado = 'finalizada'
    }
  } else {
    const fechaClase = new Date(clase.fecha.split('T')[0])
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    if (fechaClase < hoy) {
      estado = 'finalizada'
    }
  }

  // Check if reprogramada
  if (clase.resultado === 'reprogramada') {
    estado = 'reprogramada'
  }

  return {
    id: clase.idClase,
    fecha: clase.fecha,
    diaSemana: getDiaSemana(clase.fecha),
    horaInicio: clase.horaInicio,
    horaFin: clase.horaFin,
    nombre: clase.tipoClase,
    tipo: clase.tipoClase as ClaseAlumno['tipo'],
    profesor: clase.nombreProfesor,
    estado,
    ubicacion: 'Estudio Principal', // Default location
    puedeReprogramar: clase.puedeReprogramar,
    horasParaReprogramar: clase.horasParaReprogramar,
    minutosParaInicio: minParaInicio > 0 ? minParaInicio : undefined,
    resultado: clase.resultado,
    descontada: clase.descontada,
  }
}

// ============================================
// QUERY KEYS
// ============================================

const studentClassesKeys = {
  all: ['student-classes'] as const,
  list: (alumnoId: string) => [...studentClassesKeys.all, 'list', alumnoId] as const,
}

// ============================================
// MAIN HOOK
// ============================================

/**
 * Hook for student classes page
 * Fetches and manages student's classes
 * Requirements: 3.3
 */
export function useStudentClasses() {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { session } = useAuth()
  const studentState = useAppSelector(selectStudentState)

  // Get user profile to obtain alumnoId
  const { data: profile } = useUserProfileQuery(session.isAuthenticated)
  const alumnoId = profile?.idAlumno || ''

  // Local state for collapsible section
  const [showClasesAnteriores, setShowClasesAnteriores] = useState(false)

  // ============================================
  // QUERIES
  // ============================================

  const clasesQuery = useQuery({
    queryKey: studentClassesKeys.list(alumnoId),
    queryFn: async (): Promise<ClaseAlumnoDTO[]> => {
      if (!alumnoId) {
        return []
      }
      try {
        const response = await httpClient.get<ClaseAlumnoDTO[]>(
          `/api/alumnos/${alumnoId}/clases`
        )
        return response.data
      } catch (error) {
        console.error('Error fetching student classes:', error)
        return []
      }
    },
    enabled: !!alumnoId, // Only run query if alumnoId is available
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })

  // ============================================
  // MUTATIONS
  // ============================================

  // Reprogramar clase mutation
  const reprogramarMutation = useMutation({
    mutationFn: async ({
      claseId,
      nuevaFecha,
    }: {
      claseId: string
      nuevaFecha: string
    }) => {
      await httpClient.post(`/api/clases/${claseId}/reprogramar`, {
        nuevaFecha,
      })
    },
    onSuccess: () => {
      toast.success('Clase reprogramada exitosamente')
      queryClient.invalidateQueries({ queryKey: studentClassesKeys.all })
      dispatch(setReprogramarClaseId(null))
    },
    onError: () => {
      toast.error('Error al reprogramar la clase')
    },
  })

  // ============================================
  // TRANSFORMED DATA
  // ============================================

  // Transform API data to ClaseAlumno format
  const allClases = useMemo(() => {
    if (!clasesQuery.data) return []
    return clasesQuery.data.map(transformToClaseAlumno)
  }, [clasesQuery.data])

  // Separate classes by time
  const { clasesHoy, proximasClases, clasesAnteriores } = useMemo(() => {
    return separateClasesByTime(allClases)
  }, [allClases])

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const fechaActual = getHoyISO()
  const diaSemanaActual = getDiaSemana(fechaActual)
  const fechaFormateada = formatearFecha(fechaActual, true)

  // ============================================
  // ACTION HANDLERS
  // ============================================

  const handleSetReprogramarClaseId = useCallback(
    (id: string | null) => {
      dispatch(setReprogramarClaseId(id))
    },
    [dispatch]
  )

  const handleSetSelectedClaseId = useCallback(
    (id: string | null) => {
      dispatch(setSelectedClaseId(id))
    },
    [dispatch]
  )

  const handleReprogramarClase = useCallback(
    async (claseId: string, nuevaFecha: string) => {
      return reprogramarMutation.mutateAsync({ claseId, nuevaFecha })
    },
    [reprogramarMutation]
  )

  const handleToggleClasesAnteriores = useCallback(() => {
    setShowClasesAnteriores((prev) => !prev)
  }, [])

  // ============================================
  // RETURN VALUE
  // ============================================

  return {
    // Data
    clasesHoy,
    proximasClases,
    clasesAnteriores,

    // Loading states
    isLoading: clasesQuery.isLoading,
    isReprogramando: reprogramarMutation.isPending,

    // Errors
    error: clasesQuery.error,

    // State
    selectedClaseId: studentState.selectedClaseId,
    reprogramarClaseId: studentState.reprogramarClaseId,
    showClasesAnteriores,

    // Actions
    setSelectedClaseId: handleSetSelectedClaseId,
    setReprogramarClaseId: handleSetReprogramarClaseId,
    reprogramarClase: handleReprogramarClase,
    toggleClasesAnteriores: handleToggleClasesAnteriores,

    // Computed
    fechaActual,
    diaSemanaActual,
    fechaFormateada,

    // Refetch
    refetch: clasesQuery.refetch,
  }
}
