// ============================================
// PROFESOR ATTENDANCE TYPES - CHETANGO
// ============================================

// ============================================
// STUDENT TYPES FOR PROFESOR VIEW
// ============================================

/**
 * Package status for profesor view
 * Simplified states for quick visual identification
 */
export type EstadoPaqueteProfesor = 'activo' | 'agotado' | 'sin_paquete' | 'clase_prueba'

/**
 * Student information for profesor attendance view
 * Contains all fields needed to display and manage attendance
 */
export interface EstudianteProfesor {
  id: string
  nombre: string
  documento: string
  asistencia: boolean
  observacion: string
  estadoPaquete: EstadoPaqueteProfesor
  idAsistencia: string | null // Null if no prior attendance record exists
}

// ============================================
// CLASS TYPES FOR PROFESOR VIEW
// ============================================

/**
 * Class information for profesor's daily view
 * Includes time range for "En curso" detection
 */
export interface ClaseProfesor {
  id: string
  nombre: string
  horaInicio: string // HH:mm:ss format
  horaFin: string // HH:mm:ss format
  tipoClase: string
  totalAlumnos: number
}

// ============================================
// API RESPONSE TYPES
// ============================================

/**
 * Response from GET /api/profesores/{idProfesor}/clases
 * Paginated list of profesor's classes
 */
export interface ClasesProfesorResponse {
  items: ClaseProfesorItem[]
  paginaActual: number
  totalPaginas: number
  tamanoPagina: number
  totalRegistros: number
  tienePaginaAnterior: boolean
  tienePaginaSiguiente: boolean
}

/**
 * Individual class item from profesor's class list
 */
export interface ClaseProfesorItem {
  idClase: string
  fecha: string // DateTime ISO 8601
  horaInicio: string // HH:mm:ss
  horaFin: string // HH:mm:ss
  tipoClase: string
  cupoMaximo: number
  totalAsistencias: number
}

/**
 * Response from GET /api/admin/asistencias/clase/{idClase}/resumen (shared with admin)
 * Complete attendance summary with package information
 */
export interface AsistenciasClaseResponse {
  idAsistencia: string | null
  idAlumno: string
  nombreAlumno: string
  presente: boolean
  observacion: string | null
  estadoPaquete?: string | number // 'Activo' | 'Agotado' | 'Congelado' | 'SinPaquete' or 0-3
  clasesRestantes?: number | null
}

// ============================================
// FRONTEND STATE TYPES
// ============================================

/**
 * Profesor attendance UI state
 */
export interface ProfesorAttendanceState {
  selectedClassId: string | null
  estudiantes: EstudianteProfesor[]
  isLoadingClases: boolean
  isLoadingEstudiantes: boolean
  isUpdatingAttendance: boolean
  error: string | null
}

/**
 * Attendance counters for profesor view
 */
export interface ProfesorAttendanceCounters {
  presentes: number
  ausentes: number
  alertas: number // sin_paquete + clase_prueba
}

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Time range for current class detection
 */
export interface TimeRange {
  horaInicio: string // HH:mm:ss
  horaFin: string // HH:mm:ss
}

/**
 * Determines if a class is currently in progress
 * @param currentTime - Current time in HH:mm:ss format
 * @param timeRange - Class time range
 * @returns true if currentTime is within the time range
 */
export function isClassInProgress(currentTime: string, timeRange: TimeRange): boolean {
  return currentTime >= timeRange.horaInicio && currentTime <= timeRange.horaFin
}

/**
 * Finds the current class from a list of classes
 * @param clases - List of classes
 * @param currentTime - Current time in HH:mm:ss format
 * @returns The class that is currently in progress, or null if none
 */
export function findCurrentClass(clases: ClaseProfesor[], currentTime: string): ClaseProfesor | null {
  return clases.find((clase) => isClassInProgress(currentTime, clase)) ?? null
}
