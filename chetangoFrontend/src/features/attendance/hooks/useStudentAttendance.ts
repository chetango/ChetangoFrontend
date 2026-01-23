// ============================================
// USE STUDENT ATTENDANCE HOOK - CHETANGO
// ============================================

import { useState, useMemo, useCallback } from 'react'
import {
  useStudentAsistenciasQuery,
  useStudentPaqueteActivoQuery,
} from '../api/studentQueries'
import {
  countAttendancesThisMonth,
  calculateProgressPercentage,
} from '../types/studentTypes'
import type {
  AsistenciaRecord,
  EstadoPaquete,
  StudentAttendanceSummary,
} from '../types/studentTypes'

// ============================================
// HOOK RETURN TYPE
// ============================================

export interface UseStudentAttendanceReturn {
  // Data
  asistencias: AsistenciaRecord[]
  estadoPaquete: EstadoPaquete | null
  selectedAsistencia: AsistenciaRecord | null

  // Loading states
  isLoading: boolean
  isLoadingPaquete: boolean

  // Errors
  error: Error | null
  paqueteError: Error | null

  // Computed summary
  summary: StudentAttendanceSummary

  // Actions
  selectAsistencia: (asistencia: AsistenciaRecord | null) => void
  openDetailModal: (asistenciaId: string) => void
  closeDetailModal: () => void

  // Modal state
  isDetailModalOpen: boolean
}

// ============================================
// HOOK IMPLEMENTATION
// ============================================

/**
 * Custom hook for managing student attendance functionality
 * - Fetches student's attendance history
 * - Fetches active package status
 * - Calculates monthly attendance count
 * - Calculates package progress percentage
 * - Manages detail modal state
 *
 * Backend Integration:
 * - GET /api/alumnos/{idAlumno}/asistencias - Fetch attendance history
 * - GET /api/alumnos/{idAlumno}/paquetes - Fetch package status
 *
 * Requirements: 4.1, 4.2, 4.3, 6.1
 * 
 * @param idAlumno - The student's ID from the user profile (GET /api/auth/me)
 */
export function useStudentAttendance(idAlumno: string | null): UseStudentAttendanceReturn {
  // ============================================
  // LOCAL STATE
  // ============================================

  const [selectedAsistencia, setSelectedAsistencia] = useState<AsistenciaRecord | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // ============================================
  // QUERIES
  // ============================================

  // Fetch student's attendance history (Requirement 4.1)
  const {
    data: asistencias = [],
    isLoading: isLoadingAsistencias,
    error: asistenciasError,
  } = useStudentAsistenciasQuery(idAlumno)

  // Fetch active package status (Requirement 4.2)
  const {
    data: estadoPaquete,
    isLoading: isLoadingPaquete,
    error: paqueteError,
  } = useStudentPaqueteActivoQuery(idAlumno)

  // ============================================
  // COMPUTED VALUES
  // ============================================

  // Calculate summary statistics (Requirements 4.2, 4.3)
  const summary: StudentAttendanceSummary = useMemo(() => {
    // Count attendances this month (only 'presente' status)
    const asistenciasEsteMes = countAttendancesThisMonth(
      asistencias.filter((a) => a.estado === 'presente')
    )

    // Get remaining classes from package
    const clasesRestantes = estadoPaquete?.clasesRestantes ?? 0

    // Calculate progress percentage
    const progresoPercentage = estadoPaquete
      ? calculateProgressPercentage(estadoPaquete.clasesUsadas, estadoPaquete.clasesTotales)
      : 0

    return {
      asistenciasEsteMes,
      clasesRestantes,
      progresoPercentage,
    }
  }, [asistencias, estadoPaquete])

  // ============================================
  // ACTIONS
  // ============================================

  // Select an attendance record
  const selectAsistencia = useCallback((asistencia: AsistenciaRecord | null) => {
    setSelectedAsistencia(asistencia)
    if (asistencia) {
      setIsDetailModalOpen(true)
    }
  }, [])

  // Open detail modal for a specific attendance
  const openDetailModal = useCallback(
    (asistenciaId: string) => {
      const asistencia = asistencias.find((a) => a.id === asistenciaId)
      if (asistencia) {
        setSelectedAsistencia(asistencia)
        setIsDetailModalOpen(true)
      }
    },
    [asistencias]
  )

  // Close detail modal
  const closeDetailModal = useCallback(() => {
    setIsDetailModalOpen(false)
    // Delay clearing selected asistencia for smooth animation
    setTimeout(() => {
      setSelectedAsistencia(null)
    }, 200)
  }, [])

  // ============================================
  // RETURN
  // ============================================

  return {
    // Data
    asistencias,
    estadoPaquete: estadoPaquete ?? null,
    selectedAsistencia,

    // Loading states
    isLoading: isLoadingAsistencias,
    isLoadingPaquete,

    // Errors
    error: asistenciasError as Error | null,
    paqueteError: paqueteError as Error | null,

    // Computed
    summary,

    // Actions
    selectAsistencia,
    openDetailModal,
    closeDetailModal,

    // Modal state
    isDetailModalOpen,
  }
}
