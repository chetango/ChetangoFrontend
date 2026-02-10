// ============================================
// ATTENDANCE MUTATIONS - REACT QUERY HOOKS
// ============================================

import { showToast } from '@/design-system'
import { httpClient } from '@/shared/api/httpClient'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type {
    AttendanceSummaryResponse,
    RegisterAttendanceRequest,
    StudentAttendance,
    UpdateAttendanceRequest,
} from '../types/attendanceTypes'
import { attendanceKeys } from './attendanceQueries'
import { profesorAttendanceKeys } from './profesorQueries'

// ============================================
// CONSTANTS
// ============================================

/**
 * Attendance type constants
 * 1=Normal, 2=Cortesía, 3=Prueba, 4=Recuperación
 */
const TIPO_ASISTENCIA = {
  NORMAL: 1,
  CORTESIA: 2,
  PRUEBA: 3,
  RECUPERACION: 4,
} as const

/**
 * Attendance state constants
 * 1=Presente, 2=Ausente, 3=Justificada
 */
const ESTADO_ASISTENCIA = {
  PRESENTE: 1,
  AUSENTE: 2,
  JUSTIFICADA: 3,
} as const

/**
 * Package state enum values (from backend)
 * 0=Activo, 1=Agotado, 2=Congelado, 3=SinPaquete
 */
const ESTADO_PAQUETE_ENUM = {
  ACTIVO: 0,
  AGOTADO: 1,
  CONGELADO: 2,
  SIN_PAQUETE: 3,
} as const

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

      // Invalidate both admin and profesor caches for cross-role synchronization
      await Promise.all([
        queryClient.invalidateQueries({ 
          queryKey: attendanceKeys.summary(idClase),
          refetchType: 'active'
        }),
        queryClient.invalidateQueries({
          queryKey: profesorAttendanceKeys.asistenciasClase(idClase),
          refetchType: 'active'
        })
      ])

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

      // Use the idPaquete from data if provided, otherwise use the one from cache
      const idPaqueteToUse = data.idPaquete || student.paquete?.idPaquete

      console.log('=== REGISTER ATTENDANCE MUTATION ===')
      console.log('idPaquete from data:', data.idPaquete)
      console.log('idPaquete from cache:', student.paquete?.idPaquete)
      console.log('idPaquete to use:', idPaqueteToUse)
      console.log('Package description:', student.paquete?.descripcion)
      console.log('====================================')

      // Verify we have a package ID
      if (!idPaqueteToUse) {
        throw new Error('No se especificó un paquete para usar')
      }

      // Convert boolean presente to idEstadoAsistencia
      const idEstadoAsistencia = data.presente ? ESTADO_ASISTENCIA.PRESENTE : ESTADO_ASISTENCIA.AUSENTE

      const response = await httpClient.post<string>('/api/asistencias', {
        idClase: data.idClase,
        idAlumno: data.idAlumno,
        idTipoAsistencia: TIPO_ASISTENCIA.NORMAL,
        idPaqueteUsado: idPaqueteToUse,
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

    onSuccess: async (newIdAsistencia, { idClase, idAlumno }) => {
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

      // Invalidate profesor cache for cross-role synchronization
      await queryClient.invalidateQueries({
        queryKey: profesorAttendanceKeys.asistenciasClase(idClase),
        refetchType: 'active'
      })

      // Show success toast (Requirement 3.6)
      showToast.attendanceMarked()
    },

    onSettled: (_data, _error, { idClase }) => {
      // Invalidate both admin and profesor caches to ensure fresh data
      queryClient.invalidateQueries({ queryKey: attendanceKeys.summary(idClase) })
      queryClient.invalidateQueries({ queryKey: profesorAttendanceKeys.asistenciasClase(idClase) })
    },
  })
}
