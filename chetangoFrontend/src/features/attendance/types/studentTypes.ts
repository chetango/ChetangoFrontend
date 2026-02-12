// ============================================
// STUDENT ATTENDANCE TYPES - CHETANGO
// ============================================

// ============================================
// ATTENDANCE RECORD TYPES
// ============================================

/**
 * Attendance state for student view
 * Represents the status of a student's attendance at a class
 */
export type EstadoAsistencia = 'presente' | 'ausente' | 'reprogramada'

/**
 * Attendance type classification
 * Determines how the attendance impacts the package
 */
export type TipoAsistencia = 'normal' | 'clase_suelta' | 'cortesia' | 'prueba'

/**
 * Individual attendance record for student history view
 * Contains all information needed to display in the history list
 */
export interface AsistenciaRecord {
  id: string
  fecha: string // YYYY-MM-DD format
  clase: string // Class name
  estado: EstadoAsistencia
  tipo: TipoAsistencia
  descontada: boolean // Whether this attendance was deducted from package
  nota?: string // Optional observation/note
  horaInicio: string // HH:mm:ss format
  horaFin: string // HH:mm:ss format
}

// ============================================
// PACKAGE STATE TYPES
// ============================================

/**
 * Package state for student view
 * Represents the current status of the student's package
 */
export type EstadoPaqueteStudent = 'activo' | 'agotado' | 'congelado' | 'sin_paquete'

/**
 * Complete package information for student view
 * Contains all data needed to display package status and progress
 */
export interface EstadoPaquete {
  estado: EstadoPaqueteStudent
  clasesTotales: number
  clasesUsadas: number
  clasesRestantes: number
  nombrePaquete: string
  fechaVencimiento?: string // YYYY-MM-DD format, optional for sin_paquete
}

// ============================================
// API RESPONSE TYPES
// ============================================

/**
 * Response from GET /api/alumnos/{idAlumno}/asistencias
 * Raw attendance record from backend (matches AsistenciaDto.cs)
 */
export interface StudentAttendanceApiResponse {
  idAsistencia: string
  idClase: string
  fechaClase: string // DateTime ISO 8601
  horaInicio: string // "HH:mm" format
  horaFin: string // "HH:mm" format
  tipoClase: string // Class type name (e.g., "Tango")
  idAlumno: string
  nombreAlumno: string
  estadoAsistencia: string // "Presente" | "Ausente"
  idPaqueteUsado: string | null
  idTipoAsistencia: number
  tipoAsistencia: string // "Normal" | "Cortesía" | "Prueba" | "Recuperación"
  observacion: string | null
}

/**
 * Response from GET /api/alumnos/{idAlumno}/paquetes
 * Paginated list of student's packages
 */
export interface StudentPackagesApiResponse {
  items: StudentPackageItem[]
  pageNumber: number
  totalPages: number
  totalCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

/**
 * Individual package item from student's package list
 */
export interface StudentPackageItem {
  idPaquete: string
  nombreTipoPaquete: string
  clasesDisponibles: number
  clasesUsadas: number
  clasesRestantes: number
  fechaActivacion: string // DateTime ISO 8601
  fechaVencimiento: string // DateTime ISO 8601
  valorPaquete: number
  estado: 'Activo' | 'Vencido' | 'Congelado' | 'Agotado'
  estaVencido: boolean
  tieneClasesDisponibles: boolean
}

// ============================================
// FRONTEND STATE TYPES
// ============================================

/**
 * Student attendance UI state
 */
export interface StudentAttendanceState {
  asistencias: AsistenciaRecord[]
  estadoPaquete: EstadoPaquete | null
  selectedAsistenciaId: string | null
  isLoading: boolean
  isLoadingPaquete: boolean
  error: string | null
}

/**
 * Student attendance summary statistics
 */
export interface StudentAttendanceSummary {
  asistenciasEsteMes: number
  clasesRestantes: number
  progresoPercentage: number
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Transforms API attendance response to frontend AsistenciaRecord
 * @param apiResponse - Raw API response
 * @returns Transformed AsistenciaRecord
 */
export function transformApiToAsistenciaRecord(
  apiResponse: StudentAttendanceApiResponse
): AsistenciaRecord {
  // Extract date from fechaClase (DateTime ISO 8601)
  const fecha = apiResponse.fechaClase.split('T')[0]
  
  // Map estadoAsistencia to boolean
  const presente = apiResponse.estadoAsistencia.toLowerCase() === 'presente'
  
  // Map tipoAsistencia to frontend type
  const tipoMap: Record<string, TipoAsistencia> = {
    'Normal': 'normal',
    'Cortesía': 'cortesia',
    'Clase de Prueba': 'prueba',
    'Recuperación': 'normal',
  }
  const tipo = tipoMap[apiResponse.tipoAsistencia] ?? 'normal'
  
  // Descontada means it used a class from the package
  const descontada = presente && apiResponse.idPaqueteUsado !== null
  
  return {
    id: apiResponse.idAsistencia,
    fecha,
    clase: apiResponse.tipoClase, // Use tipoClase as class name
    estado: presente ? 'presente' : 'ausente',
    tipo,
    descontada,
    nota: apiResponse.observacion ?? undefined,
    horaInicio: apiResponse.horaInicio + ':00', // Convert "HH:mm" to "HH:mm:ss"
    horaFin: apiResponse.horaFin + ':00', // Convert "HH:mm" to "HH:mm:ss"
  }
}

/**
 * Transforms API package response to frontend EstadoPaquete
 * @param apiResponse - Raw API package item
 * @returns Transformed EstadoPaquete
 */
export function transformApiToEstadoPaquete(
  apiResponse: StudentPackageItem
): EstadoPaquete {
  const estadoMap: Record<string, EstadoPaqueteStudent> = {
    'Activo': 'activo',
    'Vencido': 'agotado', // Treat vencido as agotado for display
    'Congelado': 'congelado',
    'Agotado': 'agotado',
  }

  return {
    estado: estadoMap[apiResponse.estado] ?? 'sin_paquete',
    clasesTotales: apiResponse.clasesDisponibles,
    clasesUsadas: apiResponse.clasesUsadas,
    clasesRestantes: apiResponse.clasesRestantes,
    nombrePaquete: apiResponse.nombreTipoPaquete,
    fechaVencimiento: apiResponse.fechaVencimiento.split('T')[0],
  }
}

/**
 * Sorts attendance records by date in descending order (most recent first)
 * @param records - Array of attendance records
 * @returns Sorted array (new array, does not mutate input)
 */
export function sortAttendanceByDateDescending(
  records: AsistenciaRecord[]
): AsistenciaRecord[] {
  return [...records].sort((a, b) => {
    // Compare dates as strings (YYYY-MM-DD format sorts correctly)
    return b.fecha.localeCompare(a.fecha)
  })
}

/**
 * Calculates the number of attendances in the current month
 * @param records - Array of attendance records
 * @returns Count of attendances in current month
 */
export function countAttendancesThisMonth(records: AsistenciaRecord[]): number {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() // 0-indexed

  return records.filter((record) => {
    const [year, month] = record.fecha.split('-').map(Number)
    return year === currentYear && month - 1 === currentMonth
  }).length
}

/**
 * Calculates package progress percentage
 * @param clasesUsadas - Number of classes used
 * @param clasesTotales - Total number of classes in package
 * @returns Progress percentage (0-100), rounded to nearest integer
 */
export function calculateProgressPercentage(
  clasesUsadas: number,
  clasesTotales: number
): number {
  if (clasesTotales <= 0) return 0
  const percentage = (clasesUsadas / clasesTotales) * 100
  return Math.round(percentage)
}
