// ============================================
// ATTENDANCE TYPES - CHETANGO ADMIN
// ============================================

// ============================================
// API RESPONSE TYPES
// ============================================

/**
 * GET /api/admin/asistencias/dias-con-clases
 * Response with date range and days that have classes
 */
export interface DateRangeResponse {
  hoy: string // YYYY-MM-DD
  desde: string // YYYY-MM-DD
  hasta: string // YYYY-MM-DD
  diasConClases: string[] // Array of YYYY-MM-DD
}

/**
 * GET /api/admin/asistencias/clases-del-dia
 * Response with classes for a specific date
 */
export interface ClassesByDateResponse {
  fecha: string // YYYY-MM-DD
  clases: ClassInfo[]
}

/**
 * Class information for dropdown display
 */
export interface ClassInfo {
  idClase: string // UUID
  nombre: string
  horaInicio: string // HH:mm:ss
  horaFin: string // HH:mm:ss
  profesorPrincipal: string
}

/**
 * GET /api/admin/asistencias/clase/{idClase}/resumen
 * Response with attendance summary for a class
 */
export interface AttendanceSummaryResponse {
  idClase: string
  fecha: string
  nombreClase: string
  profesorPrincipal: string
  alumnos: StudentAttendance[]
  presentes: number
  ausentes: number
  sinPaquete: number
}

// ============================================
// STUDENT & PACKAGE TYPES
// ============================================

/**
 * Student attendance record
 */
export interface StudentAttendance {
  idAlumno: string
  nombreCompleto: string
  documentoIdentidad: string
  avatarIniciales: string
  paquete: StudentPackage | null
  asistencia: AttendanceRecord
}

/**
 * Student package information
 */
export interface StudentPackage {
  estado: PackageState
  descripcion: string | null
  clasesTotales: number | null
  clasesUsadas: number | null
  clasesRestantes: number | null
}

/**
 * Package state enum
 */
export type PackageState = 'Activo' | 'Agotado' | 'Congelado' | 'SinPaquete'

/**
 * Attendance record for a student
 * Contains the attendance ID needed for updates
 */
export interface AttendanceRecord {
  idAsistencia: string | null // Null if no prior record exists
  estado: 'Presente' | 'Ausente'
  observacion: string | null
}

/**
 * @deprecated Use AttendanceRecord instead
 */
export type AttendanceStatus = AttendanceRecord

// ============================================
// MUTATION TYPES
// ============================================

/**
 * PUT /api/asistencias/{idAsistencia}/estado
 * Request body for updating an existing attendance record
 */
export interface UpdateAttendanceRequest {
  idAsistencia: string
  presente: boolean
  observacion?: string
}

/**
 * POST /api/asistencias
 * Request body for registering a new attendance record
 */
export interface RegisterAttendanceRequest {
  idClase: string
  idAlumno: string
  presente: boolean
  observacion?: string
}

// ============================================
// FRONTEND STATE TYPES
// ============================================

/**
 * Attendance UI state for Redux slice
 */
export interface AttendanceUIState {
  selectedDate: string
  selectedClassId: string | null
  searchTerm: string
  updatingStudents: Record<string, boolean> // studentId -> isUpdating
}

/**
 * Attendance statistics
 */
export interface AttendanceStats {
  presentes: number
  ausentes: number
  sinPaquete: number
}
