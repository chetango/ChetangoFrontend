// ============================================
// USE PROFESOR CLASSES HOOK
// Hook for profesor classes page integration
// Requirements: 3.2
// ============================================

import { useMemo, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { useAuth } from '@/features/auth'
import { useClasesByProfesorQuery, useClaseDetailQuery } from '../api/classQueries'
import {
  setFiltroAnterior,
  toggleClasesAnteriores,
  setResumenClaseId,
  setSelectedClaseId,
  selectProfesorState,
} from '../store/classesSlice'
import {
  esHoy,
  estaEnCurso,
  formatearFecha,
  getDiaSemana,
  getHoyISO,
} from '../utils/dateUtils'
import { separateClasesByTime, filterClasesAnteriores } from '../utils/filterUtils'
import type { ClaseListItemDTO, ClaseProfesor, FiltroAnterior } from '../types/classTypes'

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Transforms ClaseListItemDTO to ClaseProfesor format
 */
function transformToClaseProfesor(clase: ClaseListItemDTO): ClaseProfesor {
  const isHoy = esHoy(clase.fecha)
  const enCurso = isHoy && estaEnCurso(clase.horaInicio, clase.horaFin)

  let estado: ClaseProfesor['estado'] = 'programada'
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

  return {
    id: clase.idClase,
    fecha: clase.fecha,
    diaSemana: getDiaSemana(clase.fecha),
    horaInicio: clase.horaInicio,
    horaFin: clase.horaFin,
    nombre: clase.tipoClase,
    tipo: clase.tipoClase as ClaseProfesor['tipo'],
    estado,
    observaciones: '',
    capacidad: clase.cupoMaximo,
    inscriptos: clase.totalAsistencias,
    ubicacion: 'Estudio Principal', // Default location
    asistenciaReal: clase.totalAsistencias,
    porcentajeAsistencia:
      clase.cupoMaximo > 0
        ? Math.round((clase.totalAsistencias / clase.cupoMaximo) * 100)
        : 0,
  }
}

// ============================================
// MAIN HOOK
// ============================================

/**
 * Hook for profesor classes page
 * Fetches and manages profesor's classes
 * Requirements: 3.2
 */
export function useProfesorClasses() {
  const dispatch = useAppDispatch()
  const { session } = useAuth()
  const profesorState = useAppSelector(selectProfesorState)

  // Get profesor ID from session - fallback to empty string if not available
  const profesorId = (session.user as { profesorId?: string })?.profesorId || ''

  // ============================================
  // QUERIES
  // ============================================

  // Fetch all classes for the profesor
  const clasesQuery = useClasesByProfesorQuery(
    profesorId,
    {
      pagina: 1,
      tamanoPagina: 100, // Get all classes
    },
    !!profesorId
  )

  // Detail query for selected class
  const detailQuery = useClaseDetailQuery(
    profesorState.resumenClaseId || '',
    !!profesorState.resumenClaseId
  )

  // ============================================
  // TRANSFORMED DATA
  // ============================================

  // Transform API data to ClaseProfesor format
  const allClases = useMemo(() => {
    if (!clasesQuery.data?.items) return []
    return clasesQuery.data.items.map(transformToClaseProfesor)
  }, [clasesQuery.data?.items])

  // Separate classes by time
  const { clasesHoy, proximasClases, clasesAnteriores: allClasesAnteriores } = useMemo(() => {
    return separateClasesByTime(allClases)
  }, [allClases])

  // Filter historical classes based on selected filter
  const clasesAnteriores = useMemo(() => {
    return filterClasesAnteriores(allClasesAnteriores, profesorState.filtroAnterior)
  }, [allClasesAnteriores, profesorState.filtroAnterior])

  // Find current class (en curso)
  const claseEnCurso = useMemo(() => {
    return clasesHoy.find((c) => c.estado === 'en_curso') || null
  }, [clasesHoy])

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const fechaActual = getHoyISO()
  const diaSemanaActual = getDiaSemana(fechaActual)
  const fechaFormateada = formatearFecha(fechaActual, true)

  // ============================================
  // ACTION HANDLERS
  // ============================================

  const handleSetFiltroAnterior = useCallback(
    (filtro: FiltroAnterior) => {
      dispatch(setFiltroAnterior(filtro))
    },
    [dispatch]
  )

  const handleToggleClasesAnteriores = useCallback(() => {
    dispatch(toggleClasesAnteriores())
  }, [dispatch])

  const handleSetResumenClaseId = useCallback(
    (id: string | null) => {
      dispatch(setResumenClaseId(id))
    },
    [dispatch]
  )

  const handleSetSelectedClaseId = useCallback(
    (id: string | null) => {
      dispatch(setSelectedClaseId(id))
    },
    [dispatch]
  )

  // ============================================
  // RETURN VALUE
  // ============================================

  return {
    // Data
    clasesHoy,
    proximasClases,
    clasesAnteriores,
    claseEnCurso,
    claseDetail: detailQuery.data,

    // Loading states
    isLoading: clasesQuery.isLoading,
    isDetailLoading: detailQuery.isLoading,

    // Errors
    error: clasesQuery.error,
    detailError: detailQuery.error,

    // State
    filtroAnterior: profesorState.filtroAnterior,
    showClasesAnteriores: profesorState.showClasesAnteriores,
    resumenClaseId: profesorState.resumenClaseId,

    // Actions
    setFiltroAnterior: handleSetFiltroAnterior,
    toggleClasesAnteriores: handleToggleClasesAnteriores,
    setResumenClaseId: handleSetResumenClaseId,
    setSelectedClaseId: handleSetSelectedClaseId,

    // Computed
    fechaActual,
    diaSemanaActual,
    fechaFormateada,

    // Refetch
    refetch: clasesQuery.refetch,
  }
}
