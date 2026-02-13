// ============================================
// USE ADMIN CLASSES HOOK
// Main hook for admin classes page integration
// ============================================

import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { useQueries } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import {
    useCreateClaseMutation,
    useDeleteClaseMutation,
    useUpdateClaseMutation,
} from '../api/classMutations'
import {
    useClaseDetailQuery,
    useClasesByProfesorQuery,
    useProfesoresQuery,
    useTiposClaseQuery,
} from '../api/classQueries'
import {
    clearFilters,
    setFilterFecha,
    setFilterProfesor,
    setFilterTipo,
    setSearchTerm,
    setSelectedClaseId,
} from '../store/classesSlice'
import type {
    ClaseEstado,
    ClaseFormData,
    ClaseListItemDTO,
    ClasesQueryParams,
    CrearClaseRequest,
    EditarClaseRequest,
} from '../types/classTypes'
import {
    calcularDuracionMinutos,
    encontrarProfesorPrincipal,
    formatearFechaHoraISO,
    formatearHoraConSegundos,
} from '../utils/claseHelpers'

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Determines the estado of a class based on its date
 * Requirements: 3.5, 3.6
 */
export function getClaseEstado(fecha: string): ClaseEstado {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const hoyStr = hoy.toISOString().split('T')[0]
  const claseDate = fecha.split('T')[0]

  if (claseDate === hoyStr) return 'hoy'
  if (claseDate < hoyStr) return 'completada'
  return 'programada'
}

/**
 * Groups classes by date
 * Requirements: 3.4
 */
export function groupClasesByDate(
  clases: ClaseListItemDTO[]
): Record<string, ClaseListItemDTO[]> {
  const grouped: Record<string, ClaseListItemDTO[]> = {}

  clases.forEach((clase) => {
    const date = clase.fecha.split('T')[0]
    if (!grouped[date]) {
      grouped[date] = []
    }
    grouped[date].push(clase)
  })

  // Sort by time within each date
  Object.keys(grouped).forEach((date) => {
    grouped[date].sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))
  })

  return grouped
}

/**
 * Filters classes based on search term and filters
 * Requirements: 8.1, 8.2, 8.4
 */
export function filterClases(
  clases: ClaseListItemDTO[],
  searchTerm: string,
  filterTipo: string,
  filterFecha: string
): ClaseListItemDTO[] {
  return clases.filter((clase) => {
    const matchSearch =
      searchTerm === '' ||
      clase.tipoClase.toLowerCase().includes(searchTerm.toLowerCase())

    const matchTipo = filterTipo === 'todos' || clase.tipoClase === filterTipo

    const matchFecha = filterFecha === '' || clase.fecha.startsWith(filterFecha)

    return matchSearch && matchTipo && matchFecha
  })
}

/**
 * Calculates statistics from classes list
 * Requirements: 9.1, 9.2
 */
export function calculateStats(clases: ClaseListItemDTO[]): {
  clasesHoy: number
  clasesSemana: number
  clasesCanceladas: number
} {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const hoyStr = hoy.toISOString().split('T')[0]

  const enUnaSemana = new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000)

  const clasesHoy = clases.filter((c) => c.fecha.startsWith(hoyStr)).length

  const clasesSemana = clases.filter((c) => {
    const fecha = new Date(c.fecha)
    return fecha >= hoy && fecha <= enUnaSemana
  }).length

  // Note: canceladas would need to come from backend or be tracked separately
  const clasesCanceladas = 0 // Placeholder - backend doesn't provide this in list

  return { clasesHoy, clasesSemana, clasesCanceladas }
}


// ============================================
// MAIN HOOK
// ============================================

/**
 * Main hook for admin classes page
 * Integrates queries, mutations, and Redux state
 * Requirements: 3.4, 3.5, 3.6, 8.1, 8.5, 9.1, 9.2
 */
export function useAdminClasses() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.classes)

  // ============================================
  // CATALOG QUERIES
  // ============================================

  const tiposClaseQuery = useTiposClaseQuery()
  const profesoresQuery = useProfesoresQuery()

  // ============================================
  // CLASSES QUERY STATE
  // ============================================

  // Selected profesor for fetching classes
  const [selectedProfesorId, setSelectedProfesorId] = useState<string>('')

  // Query params for pagination and date filtering
  const [queryParams, setQueryParams] = useState<ClasesQueryParams>({
    fechaDesde: '',
    fechaHasta: '',
    pagina: 1,
    tamanoPagina: 50,
  })

  // When "todos" is selected, query all professors in parallel
  const profesoresList = profesoresQuery.data || []
  const shouldQueryAll = filters.filterProfesor === 'todos'
  
  // Query individual profesor
  const singleProfesorQuery = useClasesByProfesorQuery(
    selectedProfesorId,
    queryParams,
    !!selectedProfesorId && !shouldQueryAll
  )

  // Query all profesores when "todos" is selected
  const allProfesoresQueries = useQueries({
    queries: shouldQueryAll ? profesoresList.map((prof) => ({
      queryKey: ['clases', prof.idProfesor, queryParams],
      queryFn: async () => {
        const { httpClient } = await import('@/shared/api/httpClient')
        const queryParamsObj = new URLSearchParams()
        if (queryParams.fechaDesde) queryParamsObj.append('fechaDesde', queryParams.fechaDesde)
        if (queryParams.fechaHasta) queryParamsObj.append('fechaHasta', queryParams.fechaHasta)
        if (queryParams.pagina) queryParamsObj.append('pageNumber', queryParams.pagina.toString())
        if (queryParams.tamanoPagina) queryParamsObj.append('pageSize', queryParams.tamanoPagina.toString())
        const queryString = queryParamsObj.toString()
        const url = `/api/profesores/${prof.idProfesor}/clases${queryString ? `?${queryString}` : ''}`
        const response = await httpClient.get(url)
        return response.data
      },
      enabled: shouldQueryAll,
    })) : [],
  })

  // Combine results from all queries
  const clasesQuery = useMemo(() => {
    if (shouldQueryAll) {
      const allData = allProfesoresQueries
        .filter(q => q.data)
        .flatMap(q => q.data?.items || [])
      
      return {
        data: { 
          items: allData, 
          totalItems: allData.length, 
          totalPages: 1,
          paginaActual: 1,
          totalPaginas: 1,
          totalRegistros: allData.length,
          tienePaginaAnterior: false,
          tienePaginaSiguiente: false,
        },
        isLoading: allProfesoresQueries.some(q => q.isLoading),
        error: allProfesoresQueries.find(q => q.error)?.error || null,
        refetch: () => allProfesoresQueries.forEach(q => q.refetch()),
      }
    }
    return singleProfesorQuery
  }, [shouldQueryAll, allProfesoresQueries, singleProfesorQuery])

  // ============================================
  // DETAIL QUERY
  // ============================================

  const [detailClaseId, setDetailClaseId] = useState<string | null>(null)
  const claseDetailQuery = useClaseDetailQuery(detailClaseId || '', !!detailClaseId)

  // ============================================
  // MUTATIONS
  // ============================================

  const createMutation = useCreateClaseMutation()
  const updateMutation = useUpdateClaseMutation()
  const deleteMutation = useDeleteClaseMutation()

  // ============================================
  // FILTERED AND GROUPED DATA
  // ============================================

  // Filter classes client-side based on Redux state
  const filteredClases = useMemo(() => {
    if (!clasesQuery.data?.items) return []

    return filterClases(
      clasesQuery.data.items,
      filters.searchTerm,
      filters.filterTipo,
      filters.filterFecha
    )
  }, [clasesQuery.data?.items, filters.searchTerm, filters.filterTipo, filters.filterFecha])

  // Group classes by date
  const clasesByDate = useMemo(() => {
    return groupClasesByDate(filteredClases)
  }, [filteredClases])

  // Sorted dates for rendering
  const sortedDates = useMemo(() => {
    return Object.keys(clasesByDate).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    )
  }, [clasesByDate])

  // Statistics
  const stats = useMemo(() => {
    return calculateStats(clasesQuery.data?.items || [])
  }, [clasesQuery.data?.items])

  // ============================================
  // ACTION HANDLERS
  // ============================================

  /**
   * Creates a new class
   * Requirements: 5.3
   * Usa el NUEVO formato de múltiples profesores con roles
   */
  const handleCreateClase = useCallback(
    async (formData: ClaseFormData) => {
      const request: CrearClaseRequest = {
        // NUEVO: Sistema de múltiples profesores con roles
        profesores: formData.profesores.map(p => ({
          idProfesor: p.idProfesor,
          rolEnClase: p.rolEnClase
        })),
        
        // Datos comunes
        idTipoClase: formData.idTipoClase,
        fecha: formatearFechaHoraISO(formData.fecha, '00:00'),
        horaInicio: formatearHoraConSegundos(formData.horaInicio),
        horaFin: formatearHoraConSegundos(formData.horaFin),
        cupoMaximo: formData.cupoMaximo,
        observaciones: formData.observaciones || undefined,
      }

      return createMutation.mutateAsync(request)
    },
    [createMutation]
  )

  /**
   * Updates an existing class
   * Requirements: 6.3
   */
  const handleUpdateClase = useCallback(
    async (idClase: string, formData: ClaseFormData) => {
      // Obtener el profesor principal del array
      const profesorPrincipal = encontrarProfesorPrincipal(formData.profesores)
      if (!profesorPrincipal) {
        throw new Error('No se encontró un profesor principal')
      }

      const request: EditarClaseRequest = {
        idTipoClase: formData.idTipoClase,
        idProfesor: profesorPrincipal.idProfesor,
        fechaHoraInicio: formatearFechaHoraISO(formData.fecha, formData.horaInicio),
        duracionMinutos: calcularDuracionMinutos(formData.horaInicio, formData.horaFin),
        cupoMaximo: formData.cupoMaximo,
        observaciones: formData.observaciones || undefined,
      }

      return updateMutation.mutateAsync({ idClase, data: request })
    },
    [updateMutation]
  )

  /**
   * Deletes/cancels a class
   * Requirements: 7.2
   */
  const handleDeleteClase = useCallback(
    async (idClase: string) => {
      return deleteMutation.mutateAsync(idClase)
    },
    [deleteMutation]
  )

  // ============================================
  // FILTER HANDLERS
  // ============================================

  const handleSetSearchTerm = useCallback(
    (term: string) => {
      dispatch(setSearchTerm(term))
    },
    [dispatch]
  )

  const handleSetFilterProfesor = useCallback(
    (id: string) => {
      dispatch(setFilterProfesor(id))
      setSelectedProfesorId(id === 'todos' ? '' : id)
    },
    [dispatch]
  )

  const handleSetFilterTipo = useCallback(
    (tipo: string) => {
      dispatch(setFilterTipo(tipo))
    },
    [dispatch]
  )

  const handleSetFilterFecha = useCallback(
    (fecha: string) => {
      dispatch(setFilterFecha(fecha))
    },
    [dispatch]
  )

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters())
  }, [dispatch])

  const handleSetSelectedClaseId = useCallback(
    (id: string | null) => {
      dispatch(setSelectedClaseId(id))
      setDetailClaseId(id)
    },
    [dispatch]
  )

  // ============================================
  // RETURN VALUE
  // ============================================

  return {
    // Catalogs
    tiposClase: tiposClaseQuery.data || [],
    profesores: profesoresQuery.data || [],
    isCatalogsLoading: tiposClaseQuery.isLoading || profesoresQuery.isLoading,
    catalogsError: tiposClaseQuery.error || profesoresQuery.error,

    // Classes
    clases: filteredClases,
    clasesByDate,
    sortedDates,
    isClasesLoading: clasesQuery.isLoading,
    clasesError: clasesQuery.error,
    pagination: clasesQuery.data
      ? {
          paginaActual: clasesQuery.data.paginaActual,
          totalPaginas: clasesQuery.data.totalPaginas,
          totalRegistros: clasesQuery.data.totalRegistros,
          tienePaginaAnterior: clasesQuery.data.tienePaginaAnterior,
          tienePaginaSiguiente: clasesQuery.data.tienePaginaSiguiente,
        }
      : null,

    // Detail
    claseDetail: claseDetailQuery.data,
    isDetailLoading: claseDetailQuery.isLoading,
    detailError: claseDetailQuery.error,
    setDetailClaseId: handleSetSelectedClaseId,

    // Filters (from Redux)
    filters,
    setSearchTerm: handleSetSearchTerm,
    setFilterProfesor: handleSetFilterProfesor,
    setFilterTipo: handleSetFilterTipo,
    setFilterFecha: handleSetFilterFecha,
    clearFilters: handleClearFilters,

    // Query params
    queryParams,
    setQueryParams,
    selectedProfesorId,
    setSelectedProfesorId,

    // Stats
    stats,
    getClaseEstado,

    // Mutations
    handleCreateClase,
    handleUpdateClase,
    handleDeleteClase,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Refetch
    refetchClases: clasesQuery.refetch,
    refetchCatalogs: () => {
      tiposClaseQuery.refetch()
      profesoresQuery.refetch()
    },
  }
}
