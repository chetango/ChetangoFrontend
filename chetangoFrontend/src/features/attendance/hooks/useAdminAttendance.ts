// ============================================
// USE ADMIN ATTENDANCE HOOK - CHETANGO ADMIN
// ============================================

import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { useCallback, useRef } from 'react'
import { useRegisterAttendanceMutation, useUpdateAttendanceMutation } from '../api/attendanceMutations'
import {
    useAttendanceSummaryQuery,
    useClassesByDateQuery,
    useDateRangeQuery,
} from '../api/attendanceQueries'
import {
    setSelectedClassId,
    setSelectedDate,
    setUpdatingStudent,
} from '../store/attendanceSlice'
import type {
    AttendanceSummaryResponse,
    ClassesByDateResponse,
    DateRangeResponse,
} from '../types/attendanceTypes'

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
// HOOK RETURN TYPE
// ============================================

export interface UseAdminAttendanceReturn {
  // Date Range
  dateRange: DateRangeResponse | undefined
  isLoadingDateRange: boolean
  dateRangeError: Error | null

  // Classes
  classes: ClassesByDateResponse | undefined
  isLoadingClasses: boolean
  classesError: Error | null

  // Attendance Summary
  attendanceSummary: AttendanceSummaryResponse | undefined
  isLoadingAttendance: boolean
  attendanceError: Error | null

  // State
  selectedDate: string
  selectedClassId: string | null

  // Actions
  setSelectedDate: (date: string) => void
  setSelectedClassId: (classId: string | null) => void
  toggleAttendance: (studentId: string, idPaquete: string | null) => Promise<void>
  updateObservation: (studentId: string, idPaquete: string | null, observation: string) => Promise<void>

  // Mutation states
  isUpdatingAttendance: Record<string, boolean>
}

// ============================================
// HOOK IMPLEMENTATION
// ============================================

/**
 * Custom hook for managing admin attendance correction functionality
 * Combines React Query queries, mutations, and Redux state
 *
 * Requirements: 1.1, 2.1, 2.3, 4.4, 5.2, 6.1, 7.1, 8.1, 8.2
 */
export function useAdminAttendance(): UseAdminAttendanceReturn {
  const dispatch = useAppDispatch()

  // Redux state selectors
  const selectedDate = useAppSelector((state) => state.attendance.selectedDate)
  const selectedClassId = useAppSelector((state) => state.attendance.selectedClassId)
  const updatingStudents = useAppSelector((state) => state.attendance.updatingStudents)

  // React Query - Date Range (Requirement 1.1)
  const {
    data: dateRange,
    isLoading: isLoadingDateRange,
    error: dateRangeError,
  } = useDateRangeQuery()

  // React Query - Classes by Date (Requirement 2.1)
  const {
    data: classes,
    isLoading: isLoadingClasses,
    error: classesError,
  } = useClassesByDateQuery(selectedDate)

  // React Query - Attendance Summary (Requirement 2.3)
  const {
    data: attendanceSummary,
    isLoading: isLoadingAttendance,
    error: attendanceError,
  } = useAttendanceSummaryQuery(selectedClassId)

  // Mutations for updating and registering attendance
  const updateAttendanceMutation = useUpdateAttendanceMutation()
  const registerAttendanceMutation = useRegisterAttendanceMutation()

  // Ref to store debounced observation update functions per student
  const debouncedObservationUpdatesRef = useRef<Record<string, (obs: string) => void>>({})

  // Action: Set selected date (Requirement 1.4)
  const handleSetSelectedDate = useCallback(
    (date: string) => {
      dispatch(setSelectedDate(date))
    },
    [dispatch]
  )

  // Action: Set selected class (Requirement 2.3)
  const handleSetSelectedClassId = useCallback(
    (classId: string | null) => {
      dispatch(setSelectedClassId(classId))
    },
    [dispatch]
  )

  // Action: Toggle attendance status (Requirements 6.1, 7.1)
  // Uses useUpdateAttendanceMutation if idAsistencia exists
  // Uses useRegisterAttendanceMutation if idAsistencia is null
  const toggleAttendance = useCallback(
    async (studentId: string, idPaquete: string | null): Promise<void> => {
      if (!selectedClassId || !attendanceSummary) {
        return
      }

      // Find current student attendance
      const student = attendanceSummary.alumnos.find((a) => a.idAlumno === studentId)
      if (!student) {
        return
      }

      // Determine new state (toggle)
      const newPresente = student.asistencia.estado !== 'Presente'

      // DEBUG: Log toggle action
      console.log('=== TOGGLE ATTENDANCE ===')
      console.log('Student:', student.nombreCompleto)
      console.log('idPaquete:', idPaquete)
      console.log('Current estado:', student.asistencia.estado)
      console.log('idAsistencia:', student.asistencia.idAsistencia)
      console.log('New presente:', newPresente)
      console.log('Will use:', student.asistencia.idAsistencia ? 'UPDATE (PUT)' : 'REGISTER (POST)')
      console.log('========================')

      // Set updating state
      dispatch(setUpdatingStudent({ studentId, isUpdating: true }))

      try {
        // Check if student has an existing attendance record
        const idAsistencia = student.asistencia.idAsistencia

        if (idAsistencia) {
          // Use update mutation for existing records (Requirement 6.1)
          await updateAttendanceMutation.mutateAsync({
            idClase: selectedClassId,
            idAlumno: studentId,
            data: {
              idAsistencia,
              presente: newPresente,
              observacion: student.asistencia.observacion ?? undefined,
            },
          })
        } else {
          // Use register mutation for new records (Requirement 7.1)
          await registerAttendanceMutation.mutateAsync({
            idClase: selectedClassId,
            idAlumno: studentId,
            data: {
              idClase: selectedClassId,
              idAlumno: studentId,
              idPaquete: idPaquete ?? undefined,
              presente: newPresente,
              observacion: student.asistencia.observacion ?? undefined,
            },
          })
        }
      } finally {
        dispatch(setUpdatingStudent({ studentId, isUpdating: false }))
      }
    },
    [selectedClassId, attendanceSummary, dispatch, updateAttendanceMutation, registerAttendanceMutation]
  )

  // Internal function to perform the actual observation update
  const performObservationUpdate = useCallback(
    async (studentId: string, idPaquete: string | null, observation: string): Promise<void> => {
      if (!selectedClassId || !attendanceSummary) {
        return
      }

      // Find current student attendance
      const student = attendanceSummary.alumnos.find((a) => a.idAlumno === studentId)
      if (!student) {
        return
      }

      // Set updating state
      dispatch(setUpdatingStudent({ studentId, isUpdating: true }))

      try {
        const idAsistencia = student.asistencia.idAsistencia

        if (idAsistencia) {
          // Use update mutation for existing records (Requirement 8.1)
          await updateAttendanceMutation.mutateAsync({
            idClase: selectedClassId,
            idAlumno: studentId,
            data: {
              idAsistencia,
              presente: student.asistencia.estado === 'Presente',
              observacion: observation || undefined,
            },
          })
        } else {
          // Use register mutation for new records
          await registerAttendanceMutation.mutateAsync({
            idClase: selectedClassId,
            idAlumno: studentId,
            data: {
              idClase: selectedClassId,
              idAlumno: studentId,
              idPaquete: idPaquete ?? undefined,
              presente: student.asistencia.estado === 'Presente',
              observacion: observation || undefined,
            },
          })
        }
      } finally {
        dispatch(setUpdatingStudent({ studentId, isUpdating: false }))
      }
    },
    [selectedClassId, attendanceSummary, dispatch, updateAttendanceMutation, registerAttendanceMutation]
  )

  // Action: Update observation with 500ms debounce (Requirements 8.1, 8.2)
  const updateObservation = useCallback(
    async (studentId: string, idPaquete: string | null, observation: string): Promise<void> => {
      // Get or create debounced function for this student
      const debounceKey = `${studentId}-${idPaquete}`
      if (!debouncedObservationUpdatesRef.current[debounceKey]) {
        debouncedObservationUpdatesRef.current[debounceKey] = debounce(
          (obs: string) => {
            performObservationUpdate(studentId, idPaquete, obs)
          },
          500
        )
      }

      // Call the debounced function
      debouncedObservationUpdatesRef.current[debounceKey](observation)
    },
    [performObservationUpdate]
  )

  return {
    // Date Range
    dateRange,
    isLoadingDateRange,
    dateRangeError: dateRangeError as Error | null,

    // Classes
    classes,
    isLoadingClasses,
    classesError: classesError as Error | null,

    // Attendance Summary
    attendanceSummary,
    isLoadingAttendance,
    attendanceError: attendanceError as Error | null,

    // State
    selectedDate,
    selectedClassId,

    // Actions
    setSelectedDate: handleSetSelectedDate,
    setSelectedClassId: handleSetSelectedClassId,
    toggleAttendance,
    updateObservation,

    // Mutation states
    isUpdatingAttendance: updatingStudents,
  }
}
