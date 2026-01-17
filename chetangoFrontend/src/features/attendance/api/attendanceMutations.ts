// ============================================
// ATTENDANCE MUTATIONS - REACT QUERY HOOKS
// ============================================

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/httpClient'
import { toast } from 'sonner'
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
      await httpClient.put(
        `/api/asistencias/${data.idAsistencia}/estado`,
        {
          idAsistencia: data.idAsistencia,
          presente: data.presente,
          observacion: data.observacion,
        }
      )
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
                  ...alumno.asistencia,
                  estado: newEstado as 'Presente' | 'Ausente',
                  observacion: data.observacion ?? alumno.asistencia.observacion,
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
      toast.error('Error al actualizar asistencia')
    },

    onSuccess: (_data, { idClase, idAlumno, data }) => {
      // Check if the student had a frozen package that was reactivated
      const currentData = queryClient.getQueryData<AttendanceSummaryResponse>(
        attendanceKeys.summary(idClase)
      )
      const student = currentData?.alumnos.find(
        (a: StudentAttendance) => a.idAlumno === idAlumno
      )

      if (
        student?.paquete?.estado === 'Congelado' &&
        data.presente
      ) {
        toast.success('Paquete reactivado automáticamente')
      }
    },

    onSettled: (_data, _error, { idClase }) => {
      // Invalidate to refetch fresh data from server
      queryClient.invalidateQueries({ queryKey: attendanceKeys.summary(idClase) })
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
    mutationFn: async ({ data }: RegisterAttendanceParams): Promise<string> => {
      const response = await httpClient.post<string>('/api/asistencias', {
        idClase: data.idClase,
        idAlumno: data.idAlumno,
        presente: data.presente,
        observacion: data.observacion,
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
      toast.error('Error al registrar asistencia')
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

      toast.success('Asistencia registrada correctamente')
    },

    onSettled: (_data, _error, { idClase }) => {
      // Invalidate to refetch fresh data from server
      queryClient.invalidateQueries({ queryKey: attendanceKeys.summary(idClase) })
    },
  })
}
