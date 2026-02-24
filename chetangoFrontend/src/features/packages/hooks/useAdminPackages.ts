// ============================================
// USE ADMIN PACKAGES HOOK - CHETANGO ADMIN
// ============================================

import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { useCallback, useMemo, useState } from 'react'
import {
    useCongelarPaqueteMutation,
    useCreatePaqueteMutation,
    useDescongelarPaqueteMutation,
} from '../api/packageMutations'
import {
    useAllPaquetesQuery,
    useAlumnosQuery,
    usePaqueteDetailQuery,
    useTiposPaqueteQuery,
} from '../api/packageQueries'
import {
    clearFilters,
    setFilterEstado,
    setFilterTipoPaquete,
    setSearchTerm,
} from '../store/packagesSlice'
import type {
    CongelarPaqueteRequest,
    CrearPaqueteRequest,
    PackagesStats,
    PaqueteFormData,
    PaqueteListItemDTO,
} from '../types/packageTypes'

// ============================================
// HELPER FUNCTIONS (exported for testing)
// ============================================

/**
 * Get initials from a name string
 * Property 24: Initials Generation
 * - First letter of first word + first letter of second word (uppercase)
 * - Or first two letters of single word (uppercase) if only one word
 * Requirements: 3.5
 */
export function getInitials(nombre: string): string {
  const trimmed = nombre.trim()
  if (!trimmed) return '??'

  const parts = trimmed.split(/\s+/).filter(Boolean)

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }

  // Single word: take first two letters
  return parts[0].substring(0, 2).toUpperCase()
}

/**
 * Calculate consumption percentage
 * Property 7: Consumption Percentage Calculation
 * - If clasesDisponibles > 0: Math.round((clasesUsadas / clasesDisponibles) * 100)
 * - If clasesDisponibles === 0: return 0
 * Requirements: 3.7
 */
export function getConsumoPercentage(clasesUsadas: number, clasesDisponibles: number): number {
  if (clasesDisponibles === 0) return 0
  return Math.round((clasesUsadas / clasesDisponibles) * 100)
}

/**
 * Calculate stats from a list of packages
 * Property 5: Stats Calculation Accuracy
 * Requirements: 3.2, 3.3
 */
export function calculateStats(paquetes: PaqueteListItemDTO[]): PackagesStats {
  return {
    total: paquetes.length,
    activos: paquetes.filter((p) => p.estado === 'Activo').length,
    agotados: paquetes.filter((p) => p.estado === 'Agotado').length,
    congelados: paquetes.filter((p) => p.estado === 'Congelado').length,
    vencidos: paquetes.filter((p) => p.estado === 'Vencido').length,
  }
}

/**
 * Filter packages by search term (nombre or documento)
 * Property 9: Search Filter Behavior
 * Requirements: 4.1
 */
export function filterBySearch(
  paquetes: PaqueteListItemDTO[],
  searchTerm: string
): PaqueteListItemDTO[] {
  if (!searchTerm.trim()) return paquetes

  const lowerSearch = searchTerm.toLowerCase()
  return paquetes.filter(
    (p) =>
      p.nombreAlumno.toLowerCase().includes(lowerSearch) ||
      p.documentoAlumno.toLowerCase().includes(lowerSearch)
  )
}

/**
 * Filter packages by estado
 * Property 10: Estado Filter Behavior
 * Requirements: 4.2
 */
export function filterByEstado(
  paquetes: PaqueteListItemDTO[],
  filterEstado: string
): PaqueteListItemDTO[] {
  if (filterEstado === 'todos') return paquetes
  return paquetes.filter((p) => p.estado === filterEstado)
}

/**
 * Filter packages by tipo paquete
 * Property 11: TipoPaquete Filter Behavior
 * Requirements: 4.3
 */
export function filterByTipoPaquete(
  paquetes: PaqueteListItemDTO[],
  filterTipoPaquete: string
): PaqueteListItemDTO[] {
  if (filterTipoPaquete === 'todos') return paquetes
  return paquetes.filter((p) => p.nombreTipoPaquete === filterTipoPaquete)
}

/**
 * Apply all filters to packages list
 * Property 12: Filtered Stats Accuracy
 * Requirements: 4.1, 4.2, 4.3, 4.7
 */
export function applyAllFilters(
  paquetes: PaqueteListItemDTO[],
  searchTerm: string,
  filterEstado: string,
  filterTipoPaquete: string
): PaqueteListItemDTO[] {
  let result = paquetes

  result = filterBySearch(result, searchTerm)
  result = filterByEstado(result, filterEstado)
  result = filterByTipoPaquete(result, filterTipoPaquete)

  return result
}


// ============================================
// RENEWAL STATE TYPE
// ============================================

/**
 * State for package renewal flow
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */
export interface RenewalState {
  isRenewing: boolean
  preselectedAlumnoId: string | null
  preselectedTipoPaqueteId: string | null
}

// ============================================
// MAIN HOOK
// ============================================

/**
 * Custom hook for admin packages management
 * Integrates queries, mutations, filtering, and stats calculation
 * Requirements: 3.2, 3.3, 3.5, 4.1, 4.2, 4.3, 4.7, 7.1, 7.2, 7.3, 7.4, 7.5
 */
export function useAdminPackages() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.packages)

  // ============================================
  // CATALOG QUERIES
  // ============================================

  const alumnosQuery = useAlumnosQuery()
  const tiposPaqueteQuery = useTiposPaqueteQuery()

  // ============================================
  // RENEWAL STATE
  // Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
  // ============================================

  const [renewalState, setRenewalState] = useState<RenewalState>({
    isRenewing: false,
    preselectedAlumnoId: null,
    preselectedTipoPaqueteId: null,
  })

  // ============================================
  // PACKAGES STATE - OPTIMIZED SINGLE QUERY
  // ============================================

  // Fetch ALL packages in a single optimized query instead of N+1 queries
  // This replaces the previous approach of fetching packages for each alumno individually
  const allPaquetesQuery = useAllPaquetesQuery(1000) // Fetch up to 1000 packages

  // Detail query for modal
  const [detailPaqueteId, setDetailPaqueteId] = useState<string | null>(null)
  const paqueteDetailQuery = usePaqueteDetailQuery(detailPaqueteId || '', !!detailPaqueteId)

  // ============================================
  // MUTATIONS
  // ============================================

  const createMutation = useCreatePaqueteMutation()
  const congelarMutation = useCongelarPaqueteMutation()
  const descongelarMutation = useDescongelarPaqueteMutation()

  // ============================================
  // FILTERED PACKAGES (client-side filtering)
  // Property 12: Filtered Stats Accuracy
  // ============================================

  const filteredPaquetes = useMemo(() => {
    const allPaquetes = allPaquetesQuery.data?.items || []
    return applyAllFilters(
      allPaquetes,
      filters.searchTerm,
      filters.filterEstado,
      filters.filterTipoPaquete
    )
  }, [allPaquetesQuery.data?.items, filters.searchTerm, filters.filterEstado, filters.filterTipoPaquete])

  // ============================================
  // STATS CALCULATION
  // Property 5: Stats Calculation Accuracy
  // ============================================

  const stats = useMemo((): PackagesStats => {
    return calculateStats(filteredPaquetes)
  }, [filteredPaquetes])

  // ============================================
  // ACTION HANDLERS
  // ============================================

  /**
   * Create a new package
   * Requirements: 5.4
   */
  const handleCreatePaquete = useCallback(
    async (formData: PaqueteFormData) => {
      const tipoPaquete = tiposPaqueteQuery.data?.find((t) => t.idTipoPaquete === formData.idTipoPaquete)
      if (!tipoPaquete) {
        throw new Error('Tipo de paquete no encontrado')
      }

      const request: CrearPaqueteRequest = {
        idAlumno: formData.idAlumno,
        idTipoPaquete: formData.idTipoPaquete,
        clasesDisponibles: tipoPaquete.numeroClases,
        valorPaquete: tipoPaquete.precio,
        diasVigencia: tipoPaquete.diasVigencia,
      }

      const result = await createMutation.mutateAsync(request)

      // Refetch packages after creation
      await allPaquetesQuery.refetch()

      return result
    },
    [createMutation, tiposPaqueteQuery.data, allPaquetesQuery]
  )

  /**
   * Freeze a package
   * Requirements: 8.3
   */
  const handleCongelarPaquete = useCallback(
    async (idPaquete: string, fechaInicio: string, fechaFin: string, motivo?: string) => {
      const data: CongelarPaqueteRequest = {
        idPaquete,
        fechaInicio,
        fechaFin,
        motivo,
      }

      await congelarMutation.mutateAsync({ idPaquete, data })

      // Refetch packages after freezing
      await allPaquetesQuery.refetch()
    },
    [congelarMutation, allPaquetesQuery]
  )

  /**
   * Unfreeze a package
   * Requirements: 9.3
   */
  const handleDescongelarPaquete = useCallback(
    async (idPaquete: string, idCongelacion: string) => {
      await descongelarMutation.mutateAsync({ idPaquete, idCongelacion })

      // Refetch packages after unfreezing
      await allPaquetesQuery.refetch()
    },
    [descongelarMutation, allPaquetesQuery]
  )

  // ============================================
  // RENEWAL ACTIONS
  // Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
  // ============================================

  /**
   * Start renewal flow - opens CreatePackageModal with pre-filled data
   * Requirements: 7.1, 7.2, 7.3
   */
  const handleStartRenewal = useCallback(
    (idAlumno: string, idTipoPaquete: string) => {
      setRenewalState({
        isRenewing: true,
        preselectedAlumnoId: idAlumno,
        preselectedTipoPaqueteId: idTipoPaquete,
      })
      // Close the detail modal when starting renewal
      setDetailPaqueteId(null)
    },
    []
  )

  /**
   * Cancel renewal flow - closes CreatePackageModal and clears preselected data
   * Requirements: 7.4
   */
  const handleCancelRenewal = useCallback(() => {
    setRenewalState({
      isRenewing: false,
      preselectedAlumnoId: null,
      preselectedTipoPaqueteId: null,
    })
  }, [])

  /**
   * Complete renewal flow - called after successful package creation
   * Requirements: 7.5
   */
  const handleCompleteRenewal = useCallback(() => {
    setRenewalState({
      isRenewing: false,
      preselectedAlumnoId: null,
      preselectedTipoPaqueteId: null,
    })
  }, [])

  // ============================================
  // FILTER ACTIONS
  // ============================================

  const handleSetSearchTerm = useCallback(
    (term: string) => {
      dispatch(setSearchTerm(term))
    },
    [dispatch]
  )

  const handleSetFilterEstado = useCallback(
    (estado: string) => {
      dispatch(setFilterEstado(estado))
    },
    [dispatch]
  )

  const handleSetFilterTipoPaquete = useCallback(
    (tipo: string) => {
      dispatch(setFilterTipoPaquete(tipo))
    },
    [dispatch]
  )

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters())
  }, [dispatch])

  // ============================================
  // RETURN VALUE
  // ============================================

  return {
    // Catalogs
    alumnos: alumnosQuery.data || [],
    tiposPaquete: tiposPaqueteQuery.data || [],
    isCatalogsLoading: alumnosQuery.isLoading || tiposPaqueteQuery.isLoading,
    catalogsError: alumnosQuery.error || tiposPaqueteQuery.error,

    // Packages
    paquetes: filteredPaquetes,
    allPaquetes: allPaquetesQuery.data?.items || [],
    isPaquetesLoading: allPaquetesQuery.isLoading || alumnosQuery.isLoading,
    paquetesError: allPaquetesQuery.error,

    // Detail
    paqueteDetail: paqueteDetailQuery.data,
    isDetailLoading: paqueteDetailQuery.isLoading,
    detailError: paqueteDetailQuery.error,
    setDetailPaqueteId,

    // Filters
    filters,
    setSearchTerm: handleSetSearchTerm,
    setFilterEstado: handleSetFilterEstado,
    setFilterTipoPaquete: handleSetFilterTipoPaquete,
    clearFilters: handleClearFilters,

    // Stats
    stats,

    // Helpers (exposed for use in components)
    getInitials,
    getConsumoPercentage,

    // Mutations
    handleCreatePaquete,
    handleCongelarPaquete,
    handleDescongelarPaquete,
    isCreating: createMutation.isPending,
    isCongelando: congelarMutation.isPending,
    isDescongelando: descongelarMutation.isPending,

    // Renewal - Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
    renewalState,
    handleStartRenewal,
    handleCancelRenewal,
    handleCompleteRenewal,

    // Refetch
    refetchPaquetes: allPaquetesQuery.refetch,
  }
}
