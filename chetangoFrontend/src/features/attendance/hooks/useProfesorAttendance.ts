// ============================================
// USE PROFESOR ATTENDANCE HOOK - CHETANGO
// ============================================

import { showToast } from '@/design-system'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRegisterAttendanceMutation, useUpdateAttendanceMutation } from '../api/attendanceMutations'
import {
    useAsistenciasClaseQuery,
    useProfesorClasesQuery,
} from '../api/profesorQueries'
import type {
    AsistenciasClaseResponse,
    ClaseProfesor,
    ClaseProfesorItem,
    EstadoPaqueteProfesor,
    EstudianteProfesor,
    ProfesorAttendanceCounters,
} from '../types/profesorTypes'
import { findCurrentClass } from '../types/profesorTypes'

// ============================================
// DEBOUNCE UTILITY
// ============================================

/**
 * Creates a debounced version of a function
 * @param fn The function to debounce
 * @param delay The delay in milliseconds
 * @returns A debounced function
 */
function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      fn(...args)
      timeoutId = null
    }, delay)
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Gets current time in HH:mm:ss format
 */
export function getCurrentTimeString(): string {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
}

/**
 * Transforms ClaseProfesorItem from API to ClaseProfesor for UI
 */
function transformClaseItem(item: ClaseProfesorItem): ClaseProfesor {
  return {
    id: item.idClase,
    nombre: item.tipoClase, // Using tipoClase as nombre since API doesn't have a separate name
    horaInicio: item.horaInicio,
    horaFin: item.horaFin,
    tipoClase: item.tipoClase,
    totalAlumnos: item.totalAsistencias,
  }
}

/**
 * Maps package status from backend to frontend enum
 * Backend uses: 'Activo', 'Agotado', 'Congelado', 'SinPaquete'
 * Frontend uses: 'activo', 'agotado', 'sin_paquete', 'clase_prueba'
 */
function mapEstadoPaquete(estado?: string): EstadoPaqueteProfesor {
  if (!estado) return 'sin_paquete'
  
  const normalized = estado.toLowerCase()
  switch (normalized) {
    case 'activo':
      return 'activo'
    case 'agotado':
      return 'agotado'
    case 'congelado':
      return 'sin_paquete' // Treat frozen as no package for profesor view
    case 'sinpaquete':
    case 'sin_paquete':
      return 'sin_paquete'
    default:
      return 'sin_paquete'
  }
}

// ============================================
// HOOK RETURN TYPE
// ============================================

export interface UseProfesorAttendanceReturn {
  // Data
  clasesDelDia: ClaseProfesor[]
  claseActual: ClaseProfesor | null
  estudiantes: EstudianteProfesor[]
  selectedClassId: string | null
  currentTime: string

  // Loading states
  isLoadingClases: boolean
  isLoadingEstudiantes: boolean
  isUpdatingAttendance: Record<string, boolean>

  // Errors
  error: Error | null

  // Actions
  setSelectedClassId: (id: string | null) => void
  toggleAttendance: (estudianteId: string) => Promise<void>
  updateObservation: (estudianteId: string, observacion: string) => void

  // Computed counters
  counters: ProfesorAttendanceCounters
}

// ============================================
// HOOK IMPLEMENTATION
// ============================================

/**
 * Custom hook for managing profesor attendance functionality
 * - Fetches profesor's classes for a selected date
 * - Auto-detects current class based on time
 * - Manages attendance toggle and observations
 * - Calculates attendance counters
 *
 * Backend Integration:
 * - GET /api/profesores/{idProfesor}/clases - Fetch profesor's classes
 * - GET /api/clases/{idClase}/asistencias - Fetch attendance for a class
 * - POST /api/asistencias - Register new attendance
 * - PUT /api/asistencias/{id}/estado - Update existing attendance
 *
 * Requirements: 3.1, 3.2, 3.3, 3.5, 3.6, 3.7, 6.1
 * 
 * @param idProfesor - The profesor's ID from the user profile (GET /api/auth/me)
 * @param selectedDate - The date to fetch classes for (YYYY-MM-DD format)
 */
export function useProfesorAttendance(
  idProfesor: string | null,
  selectedDate: string
): UseProfesorAttendanceReturn {
  // ============================================
  // LOCAL STATE
  // ============================================
  
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState<string>(getCurrentTimeString())
  const [updatingStudents, setUpdatingStudents] = useState<Record<string, boolean>>({})
  
  // Local state for estudiantes with optimistic updates
  const [localEstudiantes, setLocalEstudiantes] = useState<EstudianteProfesor[]>([])

  // Ref to store debounced observation update functions per student
  const debouncedObservationUpdatesRef = useRef<Record<string, (obs: string) => void>>({})

  // ============================================
  // QUERIES
  // ============================================

  // Fetch profesor's classes for selected date (Requirement 3.1)
  const {
    data: clasesData,
    isLoading: isLoadingClases,
    error: clasesError,
  } = useProfesorClasesQuery(idProfesor, selectedDate, selectedDate)

  // Fetch attendance for selected class (Requirement 3.3)
  const {
    data: asistenciasData,
    isLoading: isLoadingEstudiantes,
    error: asistenciasError,
  } = useAsistenciasClaseQuery(selectedClassId)

  // ============================================
  // MUTATIONS
  // ============================================

  const updateAttendanceMutation = useUpdateAttendanceMutation()
  const registerAttendanceMutation = useRegisterAttendanceMutation()

  // ============================================
  // DERIVED DATA
  // ============================================

  // Transform API classes to UI format
  const clasesDelDia: ClaseProfesor[] = useMemo(() => {
    if (!clasesData?.items) return []
    return clasesData.items.map(transformClaseItem)
  }, [clasesData])

  // Find current class based on time (Requirement 3.2)
  const claseActual = useMemo(() => {
    return findCurrentClass(clasesDelDia, currentTime)
  }, [clasesDelDia, currentTime])

  // ============================================
  // EFFECTS
  // ============================================

  // Update current time every minute for "En curso" detection
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTimeString())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  // Auto-select current class or first class when classes load (Requirement 3.2)
  useEffect(() => {
    if (clasesDelDia.length > 0 && !selectedClassId) {
      // Try to select current class first
      if (claseActual) {
        setSelectedClassId(claseActual.id)
      } else {
        // Otherwise select first class
        setSelectedClassId(clasesDelDia[0].id)
      }
    }
  }, [clasesDelDia, selectedClassId, claseActual])

  // Transform asistencias data to estudiantes format when data loads
  useEffect(() => {
    if (asistenciasData) {
      const estudiantes: EstudianteProfesor[] = asistenciasData.map(
        (asistencia: AsistenciasClaseResponse) => ({
          id: asistencia.idAlumno,
          nombre: asistencia.nombreAlumno,
          documento: '', // API doesn't provide documento in this endpoint
          asistencia: asistencia.presente,
          observacion: asistencia.observacion || '',
          estadoPaquete: mapEstadoPaquete(
            typeof asistencia.estadoPaquete === 'number' 
              ? ['Activo', 'Agotado', 'Congelado', 'SinPaquete'][asistencia.estadoPaquete]
              : asistencia.estadoPaquete
          ),
          idAsistencia: asistencia.idAsistencia || null,
          idPaquete: asistencia.idPaquete || null, // Include package ID for attendance registration
        })
      )
      setLocalEstudiantes(estudiantes)
    } else {
      setLocalEstudiantes([])
    }
  }, [asistenciasData])

  // ============================================
  // COMPUTED COUNTERS (Requirement 3.7)
  // ============================================

  const counters: ProfesorAttendanceCounters = useMemo(() => {
    const presentes = localEstudiantes.filter((e) => e.asistencia).length
    const ausentes = localEstudiantes.filter((e) => !e.asistencia).length
    const alertas = localEstudiantes.filter(
      (e) => e.estadoPaquete === 'sin_paquete' || e.estadoPaquete === 'clase_prueba'
    ).length

    return { presentes, ausentes, alertas }
  }, [localEstudiantes])

  // ============================================
  // ACTIONS
  // ============================================

  // Set updating state for a student
  const setStudentUpdating = useCallback((studentId: string, isUpdating: boolean) => {
    setUpdatingStudents((prev) => {
      if (isUpdating) {
        return { ...prev, [studentId]: true }
      } else {
        const { [studentId]: _, ...rest } = prev
        return rest
      }
    })
  }, [])

  // Toggle attendance (Requirement 3.5)
  const toggleAttendance = useCallback(
    async (estudianteId: string): Promise<void> => {
      if (!selectedClassId) return

      // Find current student
      const student = localEstudiantes.find((e) => e.id === estudianteId)
      if (!student) return

      const newPresente = !student.asistencia

      // Optimistic update
      setLocalEstudiantes((prev) =>
        prev.map((e) =>
          e.id === estudianteId ? { ...e, asistencia: newPresente } : e
        )
      )

      setStudentUpdating(estudianteId, true)

      try {
        if (student.idAsistencia) {
          // Update existing attendance record
          await updateAttendanceMutation.mutateAsync({
            idClase: selectedClassId,
            idAlumno: estudianteId,
            data: {
              idAsistencia: student.idAsistencia,
              presente: newPresente,
              observacion: student.observacion || undefined,
            },
          })
        } else {
          // Register new attendance record
          // Use the student's package ID if available (already in local state)
          const newIdAsistencia = await registerAttendanceMutation.mutateAsync({
            idClase: selectedClassId,
            idAlumno: estudianteId,
            data: {
              idClase: selectedClassId,
              idAlumno: estudianteId,
              presente: newPresente,
              observacion: student.observacion || undefined,
              idPaquete: student.idPaquete ?? undefined,
            },
          })

          // Update local state with new idAsistencia
          setLocalEstudiantes((prev) =>
            prev.map((e) =>
              e.id === estudianteId ? { ...e, idAsistencia: newIdAsistencia } : e
            )
          )
        }

        // Show success toast (Requirement 3.6)
        if (newPresente) {
          showToast.attendanceMarked()
        }
      } catch {
        // Revert optimistic update on error
        setLocalEstudiantes((prev) =>
          prev.map((e) =>
            e.id === estudianteId ? { ...e, asistencia: !newPresente } : e
          )
        )
        showToast.error('Error al actualizar asistencia')
      } finally {
        setStudentUpdating(estudianteId, false)
      }
    },
    [
      selectedClassId,
      localEstudiantes,
      updateAttendanceMutation,
      registerAttendanceMutation,
      setStudentUpdating,
    ]
  )

  // Internal function to perform the actual observation update
  const performObservationUpdate = useCallback(
    async (estudianteId: string, observacion: string): Promise<void> => {
      if (!selectedClassId) return

      const student = localEstudiantes.find((e) => e.id === estudianteId)
      if (!student) return

      setStudentUpdating(estudianteId, true)

      try {
        if (student.idAsistencia) {
          await updateAttendanceMutation.mutateAsync({
            idClase: selectedClassId,
            idAlumno: estudianteId,
            data: {
              idAsistencia: student.idAsistencia,
              presente: student.asistencia,
              observacion: observacion || undefined,
            },
          })
        } else {
          // Register new attendance with observation
          // Use the student's package ID if available (already in local state)
          const newIdAsistencia = await registerAttendanceMutation.mutateAsync({
            idClase: selectedClassId,
            idAlumno: estudianteId,
            data: {
              idClase: selectedClassId,
              idAlumno: estudianteId,
              presente: student.asistencia,
              observacion: observacion || undefined,
              idPaquete: student.idPaquete ?? undefined,
            },
          })

          // Update local state with new idAsistencia
          setLocalEstudiantes((prev) =>
            prev.map((e) =>
              e.id === estudianteId ? { ...e, idAsistencia: newIdAsistencia } : e
            )
          )
        }
      } catch {
        showToast.error('Error al guardar observación')
      } finally {
        setStudentUpdating(estudianteId, false)
      }
    },
    [
      selectedClassId,
      localEstudiantes,
      updateAttendanceMutation,
      registerAttendanceMutation,
      setStudentUpdating,
    ]
  )

  // Update observation with debounce (500ms)
  const updateObservation = useCallback(
    (estudianteId: string, observacion: string): void => {
      // Update local state immediately for responsive UI
      setLocalEstudiantes((prev) =>
        prev.map((e) =>
          e.id === estudianteId ? { ...e, observacion } : e
        )
      )

      // Get or create debounced function for this student
      if (!debouncedObservationUpdatesRef.current[estudianteId]) {
        debouncedObservationUpdatesRef.current[estudianteId] = debounce(
          (obs: string) => {
            performObservationUpdate(estudianteId, obs)
          },
          500
        )
      }

      // Call the debounced function
      debouncedObservationUpdatesRef.current[estudianteId](observacion)
    },
    [performObservationUpdate]
  )

  // Handle class selection change
  const handleSetSelectedClassId = useCallback((id: string | null) => {
    setSelectedClassId(id)
    // Clear local estudiantes when changing class
    setLocalEstudiantes([])
    // Clear debounced functions
    debouncedObservationUpdatesRef.current = {}
  }, [])

  // ============================================
  // RETURN
  // ============================================

  return {
    // Data
    clasesDelDia,
    claseActual,
    estudiantes: localEstudiantes,
    selectedClassId,
    currentTime,

    // Loading states
    isLoadingClases,
    isLoadingEstudiantes,
    isUpdatingAttendance: updatingStudents,

    // Errors
    error: (clasesError || asistenciasError) as Error | null,

    // Actions
    setSelectedClassId: handleSetSelectedClassId,
    toggleAttendance,
    updateObservation,

    // Computed
    counters,
  }
}
