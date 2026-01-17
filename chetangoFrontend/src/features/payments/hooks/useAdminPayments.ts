// ============================================
// USE ADMIN PAYMENTS HOOK - CHETANGO ADMIN
// ============================================

import { useState, useMemo, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import {
  useMetodosPagoQuery,
  useEstadisticasQuery,
  useAlumnosForPaymentsQuery,
  useTiposPaqueteForPaymentsQuery,
  usePagosByAlumnoQuery,
  usePagoDetailQuery,
} from '../api/paymentQueries'
import {
  useCreatePagoMutation,
  useUpdatePagoMutation,
} from '../api/paymentMutations'
import {
  setSearchTerm,
  setSelectedAlumno,
  setActiveTab,
  clearSelection,
} from '../store/paymentsSlice'
import type {
  PagoFormData,
  SelectedPaquete,
  CrearPagoRequest,
  PaymentsStats,
  AlumnoDTO,
  PagoDetalleDTO,
  TipoPaqueteDTO,
} from '../types/paymentTypes'

// ============================================
// REPEAT LAST PAYMENT TYPES
// ============================================

/**
 * Data structure for pre-filling the payment form
 * Used when repeating the last payment
 * Requirements: 8.2, 8.3, 8.4, 8.5
 */
export interface RepeatPaymentData {
  idMetodoPago: string
  selectedPaquetes: SelectedPaquete[]
  montoTotal: number
}

// ============================================
// HELPER FUNCTIONS (exported for testing)
// ============================================

/**
 * Get initials from a name string
 * Property 5: Initials Generation
 * - First letter of first word + first letter of second word (uppercase)
 * - Or first two letters of single word (uppercase) if only one word
 * Requirements: 4.5
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
 * Format currency in Colombian Pesos (COP)
 * Property 9: Currency Formatting
 * - Format: "$ {amount}" with thousand separators using periods
 * - Example: 300000 → "$ 300.000"
 * Requirements: 6.6
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Calculate total from selected packages
 * Property 8: MontoTotal Calculation
 * - Sum of all selected paquetes' precio values
 * - Returns 0 if no paquetes are selected
 * Requirements: 5.8, 6.1, 6.2
 */
export function calculateTotal(paquetes: SelectedPaquete[]): number {
  return paquetes.reduce((sum, p) => sum + p.precio, 0)
}

/**
 * Filter alumnos by search term (nombre or documento)
 * Property 3: Search Filter Behavior
 * - Filters by nombreCompleto or documentoIdentidad (case-insensitive)
 * Requirements: 4.3
 */
export function filterAlumnosBySearch(
  alumnos: AlumnoDTO[],
  searchTerm: string
): AlumnoDTO[] {
  if (!searchTerm.trim()) return alumnos

  const lowerSearch = searchTerm.toLowerCase()
  return alumnos.filter(
    (a) =>
      a.nombreCompleto.toLowerCase().includes(lowerSearch) ||
      a.documentoIdentidad.toLowerCase().includes(lowerSearch)
  )
}

// ============================================
// MAIN HOOK
// ============================================

/**
 * Custom hook for admin payments management
 * Integrates queries, mutations, filtering, and stats calculation
 * Requirements: 3.2, 4.3, 4.5, 5.8, 6.6, 7.1
 */
export function useAdminPayments() {
  const dispatch = useAppDispatch()
  const uiState = useAppSelector((state) => state.payments)

  // ============================================
  // DATE RANGE FOR STATISTICS (current month)
  // Requirements: 3.1, 3.2
  // ============================================

  const currentMonthRange = useMemo(() => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return {
      fechaDesde: firstDay.toISOString(),
      fechaHasta: lastDay.toISOString(),
    }
  }, [])

  // ============================================
  // CATALOG QUERIES
  // Requirements: 2.1, 2.3, 2.5
  // ============================================

  const metodosPagoQuery = useMetodosPagoQuery()
  const estadisticasQuery = useEstadisticasQuery(currentMonthRange)
  const alumnosQuery = useAlumnosForPaymentsQuery()
  const tiposPaqueteQuery = useTiposPaqueteForPaymentsQuery()

  // ============================================
  // PAYMENTS FOR SELECTED ALUMNO
  // Requirements: 11.1
  // ============================================

  const pagosAlumnoQuery = usePagosByAlumnoQuery(
    uiState.selectedAlumnoId || '',
    { pageSize: 10 },
    !!uiState.selectedAlumnoId
  )

  // ============================================
  // DETAIL QUERY FOR MODAL
  // Requirements: 9.1
  // ============================================

  const [detailPagoId, setDetailPagoId] = useState<string | null>(null)
  const pagoDetailQuery = usePagoDetailQuery(detailPagoId || '', !!detailPagoId)

  // ============================================
  // MUTATIONS
  // Requirements: 7.3, 10.4
  // ============================================

  const createMutation = useCreatePagoMutation()
  const updateMutation = useUpdatePagoMutation()

  // ============================================
  // LAST PAYMENT DETAIL FOR REPEAT FUNCTIONALITY
  // Requirements: 8.2, 8.3, 8.4, 8.5
  // ============================================

  const [lastPaymentId, setLastPaymentId] = useState<string | null>(null)
  const lastPaymentDetailQuery = usePagoDetailQuery(lastPaymentId || '', !!lastPaymentId)


  // ============================================
  // FILTERED ALUMNOS (client-side filtering)
  // Property 3: Search Filter Behavior
  // Requirements: 4.3
  // ============================================

  const filteredAlumnos = useMemo(() => {
    return filterAlumnosBySearch(alumnosQuery.data || [], uiState.searchTerm)
  }, [alumnosQuery.data, uiState.searchTerm])

  // ============================================
  // SELECTED ALUMNO DETAILS
  // Requirements: 4.5
  // ============================================

  const selectedAlumno = useMemo(() => {
    if (!uiState.selectedAlumnoId || !alumnosQuery.data) return null
    return alumnosQuery.data.find((a) => a.idAlumno === uiState.selectedAlumnoId) || null
  }, [uiState.selectedAlumnoId, alumnosQuery.data])

  // ============================================
  // STATS CALCULATION
  // Requirements: 3.2, 3.3, 3.4
  // ============================================

  const stats = useMemo((): PaymentsStats => {
    const data = estadisticasQuery.data
    return {
      pagosDelMes: data?.cantidadPagos || 0,
      totalRecaudado: data?.totalRecaudado || 0,
      pagosHoy: 0, // Would need separate query or calculation from today's date
    }
  }, [estadisticasQuery.data])

  // ============================================
  // ACTION HANDLERS
  // ============================================

  /**
   * Handle payment creation
   * Requirements: 7.1, 7.3
   */
  const handleCreatePago = useCallback(
    async (formData: PagoFormData) => {
      const request: CrearPagoRequest = {
        idAlumno: formData.idAlumno,
        fechaPago: formData.fechaPago,
        montoTotal: formData.montoTotal,
        idMetodoPago: formData.idMetodoPago,
        nota: formData.observaciones || null,
        paquetes: formData.selectedPaquetes.map((p) => ({
          idTipoPaquete: p.idTipoPaquete,
          // Only include valorPaquete if manual amount was set
          ...(formData.montoManual
            ? { valorPaquete: formData.montoTotal / formData.selectedPaquetes.length }
            : {}),
        })),
      }

      return createMutation.mutateAsync(request)
    },
    [createMutation]
  )

  /**
   * Handle QR scan result
   * Requirements: 4.9
   */
  const handleQRScan = useCallback(
    (idAlumno: string) => {
      const alumno = alumnosQuery.data?.find((a) => a.idAlumno === idAlumno)
      if (alumno) {
        dispatch(setSelectedAlumno(idAlumno))
        dispatch(setActiveTab('busqueda'))
      }
    },
    [alumnosQuery.data, dispatch]
  )

  // ============================================
  // FILTER ACTIONS
  // ============================================

  const handleSetSearchTerm = useCallback(
    (term: string) => {
      dispatch(setSearchTerm(term))
    },
    [dispatch]
  )

  const handleSetSelectedAlumno = useCallback(
    (id: string | null) => {
      dispatch(setSelectedAlumno(id))
    },
    [dispatch]
  )

  const handleSetActiveTab = useCallback(
    (tab: 'busqueda' | 'qr') => {
      dispatch(setActiveTab(tab))
    },
    [dispatch]
  )

  const handleClearSelection = useCallback(() => {
    dispatch(clearSelection())
  }, [dispatch])

  // ============================================
  // REPEAT LAST PAYMENT LOGIC
  // Requirements: 8.2, 8.3, 8.4, 8.5
  // ============================================

  /**
   * Get the last payment for the selected alumno
   * Returns the first item from ultimosPagos (most recent)
   * Requirements: 8.2
   */
  const lastPayment = useMemo(() => {
    if (!pagosAlumnoQuery.data?.items?.length) return null
    return pagosAlumnoQuery.data.items[0]
  }, [pagosAlumnoQuery.data])

  /**
   * Convert payment detail to form pre-fill data
   * Maps paquetes from payment to SelectedPaquete format
   * Requirements: 8.3, 8.4
   */
  const convertPaymentDetailToFormData = useCallback(
    (pagoDetail: PagoDetalleDTO, tiposPaquete: TipoPaqueteDTO[]): RepeatPaymentData | null => {
      if (!pagoDetail || !tiposPaquete.length) return null

      // Map paquetes from payment detail to SelectedPaquete format
      // We need to find matching tipos de paquete by name
      const selectedPaquetes: SelectedPaquete[] = pagoDetail.paquetes
        .map((paquete) => {
          // Find the tipo de paquete that matches this package
          const tipoPaquete = tiposPaquete.find(
            (tipo) => tipo.nombre === paquete.nombreTipoPaquete
          )
          if (!tipoPaquete) return null

          return {
            idTipoPaquete: tipoPaquete.id,
            nombre: tipoPaquete.nombre,
            precio: tipoPaquete.precio,
            clasesDisponibles: tipoPaquete.clasesDisponibles,
          }
        })
        .filter((p): p is SelectedPaquete => p !== null)

      return {
        idMetodoPago: pagoDetail.idMetodoPago,
        selectedPaquetes,
        montoTotal: pagoDetail.montoTotal,
      }
    },
    []
  )

  /**
   * Get repeat payment data if available
   * Returns the pre-fill data when last payment detail is loaded
   * Requirements: 8.3, 8.4
   */
  const repeatPaymentData = useMemo((): RepeatPaymentData | null => {
    if (!lastPaymentDetailQuery.data || !tiposPaqueteQuery.data?.length) {
      return null
    }
    return convertPaymentDetailToFormData(
      lastPaymentDetailQuery.data,
      tiposPaqueteQuery.data
    )
  }, [lastPaymentDetailQuery.data, tiposPaqueteQuery.data, convertPaymentDetailToFormData])

  /**
   * Handle repeat last payment button click
   * Triggers fetching of last payment detail
   * Requirements: 8.2
   */
  const handleRepeatLastPayment = useCallback(() => {
    if (lastPayment) {
      setLastPaymentId(lastPayment.idPago)
    }
  }, [lastPayment])

  /**
   * Clear repeat payment state
   * Called after form is pre-filled or when selection changes
   */
  const clearRepeatPaymentState = useCallback(() => {
    setLastPaymentId(null)
  }, [])


  // ============================================
  // RETURN VALUE
  // ============================================

  return {
    // UI State
    uiState,
    setSearchTerm: handleSetSearchTerm,
    setSelectedAlumno: handleSetSelectedAlumno,
    setActiveTab: handleSetActiveTab,
    clearSelection: handleClearSelection,

    // Catalogs
    metodosPago: metodosPagoQuery.data || [],
    tiposPaquete: tiposPaqueteQuery.data || [],
    alumnos: alumnosQuery.data || [],
    filteredAlumnos,
    selectedAlumno,
    isCatalogsLoading:
      metodosPagoQuery.isLoading ||
      tiposPaqueteQuery.isLoading ||
      alumnosQuery.isLoading,
    catalogsError:
      metodosPagoQuery.error ||
      tiposPaqueteQuery.error ||
      alumnosQuery.error,

    // Stats
    stats,
    isStatsLoading: estadisticasQuery.isLoading,
    statsError: estadisticasQuery.error,

    // Payments for selected alumno
    ultimosPagos: pagosAlumnoQuery.data?.items || [],
    isPagosLoading: pagosAlumnoQuery.isLoading,
    pagosError: pagosAlumnoQuery.error,

    // Detail
    pagoDetail: pagoDetailQuery.data,
    isDetailLoading: pagoDetailQuery.isLoading,
    detailError: pagoDetailQuery.error,
    setDetailPagoId,

    // Repeat Last Payment (Requirements: 8.2, 8.3, 8.4, 8.5)
    lastPayment,
    repeatPaymentData,
    isRepeatPaymentLoading: lastPaymentDetailQuery.isLoading,
    handleRepeatLastPayment,
    clearRepeatPaymentState,

    // Helpers (exposed for use in components)
    getInitials,
    formatCurrency,
    calculateTotal,

    // Mutations
    handleCreatePago,
    handleQRScan,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    updateMutation,

    // Refetch
    refetchStats: estadisticasQuery.refetch,
    refetchPagos: pagosAlumnoQuery.refetch,
  }
}
