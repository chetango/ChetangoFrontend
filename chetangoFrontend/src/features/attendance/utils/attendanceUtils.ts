// ============================================
// ATTENDANCE UTILITIES - CHETANGO ADMIN
// ============================================

import type {
  StudentAttendance,
  AttendanceStats,
  DateRangeResponse,
  ClassesByDateResponse,
  AttendanceSummaryResponse,
  UpdateAttendanceRequest,
  RegisterAttendanceRequest,
} from '../types/attendanceTypes'

/**
 * Filters students by search term (name or document)
 * Case-insensitive matching for name, exact substring for document
 *
 * @param students - Array of student attendance records
 * @param searchTerm - Search term to filter by
 * @returns Filtered array of students
 */
export function filterStudentsBySearch(
  students: StudentAttendance[],
  searchTerm: string
): StudentAttendance[] {
  if (!searchTerm.trim()) {
    return students
  }

  const normalizedSearch = searchTerm.toLowerCase().trim()

  return students.filter((student) => {
    const nameMatch = student.nombreCompleto.toLowerCase().includes(normalizedSearch)
    const documentMatch = student.documentoIdentidad.includes(searchTerm.trim())
    return nameMatch || documentMatch
  })
}

/**
 * Calculates attendance statistics from student list
 *
 * @param students - Array of student attendance records
 * @returns Object with presentes, ausentes, and sinPaquete counts
 */
export function calculateAttendanceStats(students: StudentAttendance[]): AttendanceStats {
  let presentes = 0
  let ausentes = 0
  let sinPaquete = 0

  for (const student of students) {
    if (student.asistencia.estado === 'Presente') {
      presentes++
    } else {
      ausentes++
    }

    if (!student.paquete || student.paquete.estado === 'SinPaquete') {
      sinPaquete++
    }
  }

  return { presentes, ausentes, sinPaquete }
}


// ============================================
// API DATA TRANSFORMATION UTILITIES
// ============================================

/**
 * Validates and transforms DateRangeResponse from API
 * Ensures all required fields are present and dates are valid
 *
 * @param data - Raw API response data
 * @returns Validated DateRangeResponse
 * @throws Error if data is invalid
 */
export function transformDateRangeResponse(data: unknown): DateRangeResponse {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid DateRangeResponse: data must be an object')
  }

  const obj = data as Record<string, unknown>

  if (typeof obj.hoy !== 'string' || !isValidDateString(obj.hoy)) {
    throw new Error('Invalid DateRangeResponse: hoy must be a valid date string')
  }
  if (typeof obj.desde !== 'string' || !isValidDateString(obj.desde)) {
    throw new Error('Invalid DateRangeResponse: desde must be a valid date string')
  }
  if (typeof obj.hasta !== 'string' || !isValidDateString(obj.hasta)) {
    throw new Error('Invalid DateRangeResponse: hasta must be a valid date string')
  }
  if (!Array.isArray(obj.diasConClases)) {
    throw new Error('Invalid DateRangeResponse: diasConClases must be an array')
  }

  for (const dia of obj.diasConClases) {
    if (typeof dia !== 'string' || !isValidDateString(dia)) {
      throw new Error('Invalid DateRangeResponse: diasConClases must contain valid date strings')
    }
  }

  return {
    hoy: obj.hoy,
    desde: obj.desde,
    hasta: obj.hasta,
    diasConClases: obj.diasConClases as string[],
  }
}

/**
 * Validates and transforms ClassesByDateResponse from API
 *
 * @param data - Raw API response data
 * @returns Validated ClassesByDateResponse
 * @throws Error if data is invalid
 */
export function transformClassesByDateResponse(data: unknown): ClassesByDateResponse {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid ClassesByDateResponse: data must be an object')
  }

  const obj = data as Record<string, unknown>

  if (typeof obj.fecha !== 'string' || !isValidDateString(obj.fecha)) {
    throw new Error('Invalid ClassesByDateResponse: fecha must be a valid date string')
  }
  if (!Array.isArray(obj.clases)) {
    throw new Error('Invalid ClassesByDateResponse: clases must be an array')
  }

  return {
    fecha: obj.fecha,
    clases: obj.clases.map(transformClassInfo),
  }
}

/**
 * Transforms a single ClassInfo object
 */
function transformClassInfo(data: unknown): {
  idClase: string
  nombre: string
  horaInicio: string
  horaFin: string
  profesorPrincipal: string
} {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid ClassInfo: data must be an object')
  }

  const obj = data as Record<string, unknown>

  if (typeof obj.idClase !== 'string') {
    throw new Error('Invalid ClassInfo: idClase must be a string')
  }
  if (typeof obj.nombre !== 'string') {
    throw new Error('Invalid ClassInfo: nombre must be a string')
  }
  if (typeof obj.horaInicio !== 'string' || !isValidTimeString(obj.horaInicio)) {
    throw new Error('Invalid ClassInfo: horaInicio must be a valid time string')
  }
  if (typeof obj.horaFin !== 'string' || !isValidTimeString(obj.horaFin)) {
    throw new Error('Invalid ClassInfo: horaFin must be a valid time string')
  }
  if (typeof obj.profesorPrincipal !== 'string') {
    throw new Error('Invalid ClassInfo: profesorPrincipal must be a string')
  }

  return {
    idClase: obj.idClase,
    nombre: obj.nombre,
    horaInicio: obj.horaInicio,
    horaFin: obj.horaFin,
    profesorPrincipal: obj.profesorPrincipal,
  }
}

/**
 * Validates and transforms AttendanceSummaryResponse from API
 *
 * @param data - Raw API response data
 * @returns Validated AttendanceSummaryResponse
 * @throws Error if data is invalid
 */
export function transformAttendanceSummaryResponse(data: unknown): AttendanceSummaryResponse {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid AttendanceSummaryResponse: data must be an object')
  }

  const obj = data as Record<string, unknown>

  if (typeof obj.idClase !== 'string') {
    throw new Error('Invalid AttendanceSummaryResponse: idClase must be a string')
  }
  if (typeof obj.fecha !== 'string' || !isValidDateString(obj.fecha)) {
    throw new Error('Invalid AttendanceSummaryResponse: fecha must be a valid date string')
  }
  if (typeof obj.nombreClase !== 'string') {
    throw new Error('Invalid AttendanceSummaryResponse: nombreClase must be a string')
  }
  if (typeof obj.profesorPrincipal !== 'string') {
    throw new Error('Invalid AttendanceSummaryResponse: profesorPrincipal must be a string')
  }
  if (!Array.isArray(obj.alumnos)) {
    throw new Error('Invalid AttendanceSummaryResponse: alumnos must be an array')
  }
  if (typeof obj.presentes !== 'number') {
    throw new Error('Invalid AttendanceSummaryResponse: presentes must be a number')
  }
  if (typeof obj.ausentes !== 'number') {
    throw new Error('Invalid AttendanceSummaryResponse: ausentes must be a number')
  }
  if (typeof obj.sinPaquete !== 'number') {
    throw new Error('Invalid AttendanceSummaryResponse: sinPaquete must be a number')
  }

  return {
    idClase: obj.idClase,
    fecha: obj.fecha,
    nombreClase: obj.nombreClase,
    profesorPrincipal: obj.profesorPrincipal,
    alumnos: obj.alumnos.map(transformStudentAttendance),
    presentes: obj.presentes,
    ausentes: obj.ausentes,
    sinPaquete: obj.sinPaquete,
  }
}

/**
 * Transforms a single StudentAttendance object
 */
function transformStudentAttendance(data: unknown): StudentAttendance {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid StudentAttendance: data must be an object')
  }

  const obj = data as Record<string, unknown>

  if (typeof obj.idAlumno !== 'string') {
    throw new Error('Invalid StudentAttendance: idAlumno must be a string')
  }
  if (typeof obj.nombreCompleto !== 'string') {
    throw new Error('Invalid StudentAttendance: nombreCompleto must be a string')
  }
  if (typeof obj.documentoIdentidad !== 'string') {
    throw new Error('Invalid StudentAttendance: documentoIdentidad must be a string')
  }
  if (typeof obj.avatarIniciales !== 'string') {
    throw new Error('Invalid StudentAttendance: avatarIniciales must be a string')
  }

  return {
    idAlumno: obj.idAlumno,
    nombreCompleto: obj.nombreCompleto,
    documentoIdentidad: obj.documentoIdentidad,
    avatarIniciales: obj.avatarIniciales,
    paquete: obj.paquete ? transformStudentPackage(obj.paquete) : null,
    asistencia: transformAttendanceStatus(obj.asistencia),
  }
}

/**
 * Transforms a StudentPackage object
 */
function transformStudentPackage(data: unknown): {
  estado: 'Activo' | 'Agotado' | 'Congelado' | 'SinPaquete'
  descripcion: string | null
  clasesTotales: number | null
  clasesUsadas: number | null
  clasesRestantes: number | null
} {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid StudentPackage: data must be an object')
  }

  const obj = data as Record<string, unknown>
  const validStates = ['Activo', 'Agotado', 'Congelado', 'SinPaquete']

  if (typeof obj.estado !== 'string' || !validStates.includes(obj.estado)) {
    throw new Error('Invalid StudentPackage: estado must be a valid PackageState')
  }

  return {
    estado: obj.estado as 'Activo' | 'Agotado' | 'Congelado' | 'SinPaquete',
    descripcion: typeof obj.descripcion === 'string' ? obj.descripcion : null,
    clasesTotales: typeof obj.clasesTotales === 'number' ? obj.clasesTotales : null,
    clasesUsadas: typeof obj.clasesUsadas === 'number' ? obj.clasesUsadas : null,
    clasesRestantes: typeof obj.clasesRestantes === 'number' ? obj.clasesRestantes : null,
  }
}

/**
 * Transforms an AttendanceRecord object (formerly AttendanceStatus)
 * Now includes idAsistencia for update operations
 */
function transformAttendanceStatus(data: unknown): {
  idAsistencia: string | null
  estado: 'Presente' | 'Ausente'
  observacion: string | null
} {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid AttendanceRecord: data must be an object')
  }

  const obj = data as Record<string, unknown>
  const validStates = ['Presente', 'Ausente']

  if (typeof obj.estado !== 'string' || !validStates.includes(obj.estado)) {
    throw new Error('Invalid AttendanceRecord: estado must be Presente or Ausente')
  }

  return {
    idAsistencia: typeof obj.idAsistencia === 'string' ? obj.idAsistencia : null,
    estado: obj.estado as 'Presente' | 'Ausente',
    observacion: typeof obj.observacion === 'string' ? obj.observacion : null,
  }
}

/**
 * Serializes UpdateAttendanceRequest to JSON-compatible object
 * Uses the new format with idAsistencia and presente (boolean)
 *
 * @param request - The update request
 * @returns JSON-serializable object matching API contract
 */
export function serializeUpdateAttendanceRequest(
  request: UpdateAttendanceRequest
): Record<string, unknown> {
  const result: Record<string, unknown> = {
    idAsistencia: request.idAsistencia,
    presente: request.presente,
  }

  if (request.observacion !== undefined) {
    result.observacion = request.observacion
  }

  return result
}

/**
 * Serializes RegisterAttendanceRequest to JSON-compatible object
 *
 * @param request - The register request
 * @returns JSON-serializable object matching API contract
 */
export function serializeRegisterAttendanceRequest(
  request: RegisterAttendanceRequest
): Record<string, unknown> {
  const result: Record<string, unknown> = {
    idClase: request.idClase,
    idAlumno: request.idAlumno,
    presente: request.presente,
  }

  if (request.observacion !== undefined) {
    result.observacion = request.observacion
  }

  return result
}

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Validates a date string in YYYY-MM-DD format
 */
function isValidDateString(str: string): boolean {
  const pattern = /^\d{4}-\d{2}-\d{2}$/
  if (!pattern.test(str)) {
    return false
  }

  const [year, month, day] = str.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  return (
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
  )
}

/**
 * Validates a time string in HH:mm:ss format
 */
function isValidTimeString(str: string): boolean {
  const pattern = /^\d{2}:\d{2}:\d{2}$/
  if (!pattern.test(str)) {
    return false
  }

  const [hours, minutes, seconds] = str.split(':').map(Number)
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59 && seconds >= 0 && seconds <= 59
}
