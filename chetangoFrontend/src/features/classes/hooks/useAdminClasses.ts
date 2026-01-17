// ============================================
// USE ADMIN CLASSES HOOK
// Main hook for admin classes page integration
// ============================================

import { useState, useMemo, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import {
  useTiposClaseQuery,
  useProfesoresQuery,
  useClasesByProfesorQuery,
  useClaseDetailQuery,
} from '../api/classQueries'
import {
  useCreateClaseMutation,
  useUpdateClaseMutation,
  useDeleteClaseMutation,
} from '../api/classMutations'
import {
  setSearchTerm,
  setFilterProfesor,
  setFilterTipo,
  setFilterFecha,
  setSelectedClaseId,
  clearFilters,
} from '../store/classesSlice'
import type {
  ClaseFormData,
  CrearClaseRequest,
  EditarClaseRequest,
  ClaseListItemDTO,
  ClaseEstado,
  ClasesQueryParams,
} from '../types/classTypes'

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

  // Classes query - only enabled when a profesor is selected
  const clasesQuery = useClasesByProfesorQuery(
    selectedProfesorId,
    queryParams,
    !!selectedProfesorId
  )

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
   */
  const handleCreateClase = useCallback(
    async (formData: ClaseFormData) => {
      const request: CrearClaseRequest = {
        idProfesorPrincipal: formData.idProfesorPrincipal,
        idTipoClase: formData.idTipoClase,
        fecha: formData.fecha + 'T00:00:00',
        horaInicio: formData.horaInicio + ':00',
        horaFin: formData.horaFin + ':00',
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
      // Calculate duration in minutes
      const [startHour, startMin] = formData.horaInicio.split(':').map(Number)
      const [endHour, endMin] = formData.horaFin.split(':').map(Number)
      const duracionMinutos = endHour * 60 + endMin - (startHour * 60 + startMin)

      const request: EditarClaseRequest = {
        idTipoClase: formData.idTipoClase,
        idProfesor: formData.idProfesorPrincipal,
        fechaHoraInicio: `${formData.fecha}T${formData.horaInicio}:00`,
        duracionMinutos,
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
