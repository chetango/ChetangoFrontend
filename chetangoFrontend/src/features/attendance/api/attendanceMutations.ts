// ============================================
// ATTENDANCE MUTATIONS - REACT QUERY HOOKS
// ============================================

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/httpClient'
import { showToast } from '@/design-system'
import { attendanceKeys } from './attendanceQueries'
import type {
  UpdateAttendanceRequest,
  RegisterAttendanceRequest,
  AttendanceSummaryResponse,
  StudentAttendance,
} from '../types/attendanceTypes'

// ============================================
// MUTATION TYPES
// ============================================

interface UpdateAttendanceParams {
  idClase: string
  idAlumno: string
  data: UpdateAttendanceRequest
}

interface MutationContext {
  previousData: AttendanceSummaryResponse | undefined
}

// ============================================
// MUTATION HOOKS
// ============================================

/**
 * Updates attendance for a student in a class
 * PUT /api/asistencias/{idAsistencia}/estado
 * Implements optimistic updates with rollback on error
 */
export function useUpdateAttendanceMutation() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, UpdateAttendanceParams, MutationContext>({
    mutationFn: async ({ data }: UpdateAttendanceParams) => {
      // Convert boolean presente to nuevoEstado (1=Presente, 2=Ausente)
      const nuevoEstado = data.presente ? 1 : 2
      
      await httpClient.put(
        `/api/asistencias/${data.idAsistencia}/estado`,
        {
          idAsistencia: data.idAsistencia,
          nuevoEstado: nuevoEstado,
          observacion: data.observacion || null,
        }
      )
    },

    onMutate: async ({ idClase }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: attendanceKeys.summary(idClase) })

      // Snapshot the previous value for rollback on error
      const previousData = queryClient.getQueryData<AttendanceSummaryResponse>(
        attendanceKeys.summary(idClase)
      )

      // NO optimistic update - let the backend response be the source of truth
      // This ensures package state changes (frozen->active, 11/12->12/12 agotado) are reflected correctly

      return { previousData }
    },

    onError: (_error, { idClase }, context) => {
      // Rollback to the previous value on error
      if (context?.previousData) {
        queryClient.setQueryData(
          attendanceKeys.summary(idClase),
          context.previousData
        )
      }
      showToast.error('Error al actualizar asistencia')
    },

    onSuccess: async (_data, { idClase, idAlumno, data }) => {
      console.log('=== MUTATION SUCCESS - BEFORE REFETCH ===')
      
      // Get the state BEFORE the update for comparison
      const previousData = queryClient.getQueryData<AttendanceSummaryResponse>(
        attendanceKeys.summary(idClase)
      )
      const previousStudent = previousData?.alumnos.find(
        (a: StudentAttendance) => a.idAlumno === idAlumno
      )
      
      console.log('Previous student state:', {
        nombre: previousStudent?.nombreCompleto,
        paqueteEstado: previousStudent?.paquete?.estado,
        clasesUsadas: previousStudent?.paquete?.clasesUsadas,
        clasesTotales: previousStudent?.paquete?.clasesTotales
      })
      
      const wasFrozen = previousStudent?.paquete?.estado === 'Congelado'

      // Force immediate refetch to get updated package states from backend
      await queryClient.invalidateQueries({ 
        queryKey: attendanceKeys.summary(idClase),
        refetchType: 'active'
      })

      // Wait a bit for the refetch to complete and UI to update
      await new Promise(resolve => setTimeout(resolve, 100))

      // Get updated data after refetch
      const updatedData = queryClient.getQueryData<AttendanceSummaryResponse>(
        attendanceKeys.summary(idClase)
      )
      const updatedStudent = updatedData?.alumnos.find(
        (a: StudentAttendance) => a.idAlumno === idAlumno
      )
      
      console.log('Updated student state:', {
        nombre: updatedStudent?.nombreCompleto,
        paqueteEstado: updatedStudent?.paquete?.estado,
        clasesUsadas: updatedStudent?.paquete?.clasesUsadas,
        clasesTotales: updatedStudent?.paquete?.clasesTotales
      })
      console.log('=== MUTATION SUCCESS - AFTER REFETCH ===')

      // Check if package was reactivated after refetch
      if (wasFrozen && data.presente) {
        // Show toast if package is now active
        if (updatedStudent?.paquete?.estado === 'Activo') {
          showToast.packageReactivated()
        }
      }
    },

    onSettled: () => {
      // onSuccess already handles the refetch
    },
  })
}

// ============================================
// REGISTER ATTENDANCE MUTATION TYPES
// ============================================

interface RegisterAttendanceParams {
  idClase: string
  idAlumno: string
  data: RegisterAttendanceRequest
}

interface RegisterMutationContext {
  previousData: AttendanceSummaryResponse | undefined
}

/**
 * Registers a new attendance record for a student
 * POST /api/asistencias
 * Returns the new attendance ID on success (201 Created)
 * 
 * Requirements: 7.1, 7.2, 7.3
 */
export function useRegisterAttendanceMutation() {
  const queryClient = useQueryClient()

  return useMutation<string, Error, RegisterAttendanceParams, RegisterMutationContext>({
    mutationFn: async ({ idClase, idAlumno, data }: RegisterAttendanceParams): Promise<string> => {
      // Get the student's package from the cache
      const currentData = queryClient.getQueryData<AttendanceSummaryResponse>(
        attendanceKeys.summary(idClase)
      )
      const student = currentData?.alumnos.find((a: StudentAttendance) => a.idAlumno === idAlumno)
      
      if (!student) {
        throw new Error('Estudiante no encontrado')
      }

      // Get the package ID - we need to fetch the active package for this student
      // For now, we'll use a query to get the student's packages
      // TODO: This should be refactored to get the package ID from the attendance summary
      const packagesResponse = await httpClient.get<{ items: Array<{ idPaquete: string, estado: string }> }>(
        `/api/alumnos/${idAlumno}/paquetes`,
        { params: { pageNumber: 1, pageSize: 10 } }
      )
      
      const activePackage = packagesResponse.data.items.find(p => p.estado === 'Activo')
      
      if (!activePackage) {
        throw new Error('El alumno no tiene un paquete activo')
      }

      // Convert boolean presente to idEstadoAsistencia (1=Presente, 2=Ausente)
      const idEstadoAsistencia = data.presente ? 1 : 2

      const response = await httpClient.post<string>('/api/asistencias', {
        idClase: data.idClase,
        idAlumno: data.idAlumno,
        idPaqueteUsado: activePackage.idPaquete,
        idEstadoAsistencia: idEstadoAsistencia,
        observaciones: data.observacion || null,
      })
      // Returns the new attendance ID from 201 Created response
      return response.data
    },

    onMutate: async ({ idClase, idAlumno, data }) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: attendanceKeys.summary(idClase) })

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<AttendanceSummaryResponse>(
        attendanceKeys.summary(idClase)
      )

      // Optimistically update the cache
      if (previousData) {
        const newEstado = data.presente ? 'Presente' : 'Ausente'
        const updatedAlumnos = previousData.alumnos.map(
          (alumno: StudentAttendance) => {
            if (alumno.idAlumno === idAlumno) {
              return {
                ...alumno,
                asistencia: {
                  // Use a temporary ID until we get the real one from the server
                  idAsistencia: `temp-${Date.now()}`,
                  estado: newEstado as 'Presente' | 'Ausente',
                  observacion: data.observacion ?? null,
                },
              }
            }
            return alumno
          }
        )

        // Recalculate counters
        const presentes = updatedAlumnos.filter(
          (a: StudentAttendance) => a.asistencia.estado === 'Presente'
        ).length
        const ausentes = updatedAlumnos.filter(
          (a: StudentAttendance) => a.asistencia.estado === 'Ausente'
        ).length

        queryClient.setQueryData<AttendanceSummaryResponse>(
          attendanceKeys.summary(idClase),
          {
            ...previousData,
            alumnos: updatedAlumnos,
            presentes,
            ausentes,
          }
        )
      }

      return { previousData }
    },

    onError: (_error, { idClase }, context) => {
      // Rollback to the previous value on error
      if (context?.previousData) {
        queryClient.setQueryData(
          attendanceKeys.summary(idClase),
          context.previousData
        )
      }
      showToast.error('Error al registrar asistencia')
    },

    onSuccess: (newIdAsistencia, { idClase, idAlumno }) => {
      // Update the cache with the real attendance ID from the server
      const currentData = queryClient.getQueryData<AttendanceSummaryResponse>(
        attendanceKeys.summary(idClase)
      )

      if (currentData) {
        const updatedAlumnos = currentData.alumnos.map(
          (alumno: StudentAttendance) => {
            if (alumno.idAlumno === idAlumno) {
              return {
                ...alumno,
                asistencia: {
                  ...alumno.asistencia,
                  idAsistencia: newIdAsistencia,
                },
              }
            }
            return alumno
          }
        )

        queryClient.setQueryData<AttendanceSummaryResponse>(
          attendanceKeys.summary(idClase),
          {
            ...currentData,
            alumnos: updatedAlumnos,
          }
        )
      }

      // Show success toast (Requirement 3.6)
      showToast.attendanceMarked()
    },

    onSettled: (_data, _error, { idClase }) => {
      // Invalidate to refetch fresh data from server
      queryClient.invalidateQueries({ queryKey: attendanceKeys.summary(idClase) })
    },
  })
}
