// ============================================
// CLASS TYPES - CHETANGO ADMIN
// ============================================

// ============================================
// CATALOG TYPES (Lookups)
// ============================================

/**
 * GET /api/tipos-clase
 * Class type for dropdown selection
 */
export interface TipoClaseDTO {
  id: string // Guid
  nombre: string
}

/**
 * GET /api/profesores
 * Professor for dropdown selection
 */
export interface ProfesorDTO {
  idProfesor: string // Guid
  nombreCompleto: string
  tipoProfesor: 'Titular' | 'Monitor'
}

/**
 * GET /api/alumnos
 * Student for dropdown selection
 */
export interface AlumnoDTO {
  idAlumno: string // Guid
  nombreCompleto: string
  correo: string
}

// ============================================
// CLASS TYPES
// ============================================

/**
 * Class estado based on date comparison
 */
export type ClaseEstado = 'hoy' | 'programada' | 'completada' | 'cancelada'

/**
 * Class list item from GET /api/profesores/{idProfesor}/clases
 */
export interface ClaseListItemDTO {
  idClase: string // Guid
  fecha: string // DateTime ISO 8601
  horaInicio: string // TimeSpan "HH:mm:ss"
  horaFin: string // TimeSpan "HH:mm:ss"
  tipoClase: string // Nombre del tipo
  cupoMaximo: number
  totalAsistencias: number
}

/**
 * Monitor information for a class
 */
export interface MonitorClaseDTO {
  idProfesor: string // Guid
  nombreProfesor: string
}

/**
 * GET /api/clases/{id}
 * Detailed class information
 */
export interface ClaseDetalleDTO {
  idClase: string // Guid
  fecha: string // DateTime ISO 8601
  horaInicio: string // TimeSpan "HH:mm:ss"
  horaFin: string // TimeSpan "HH:mm:ss"
  tipoClase: string // Nombre del tipo
  idProfesorPrincipal: string // Guid
  nombreProfesor: string
  cupoMaximo: number
  observaciones: string | null
  totalAsistencias: number
  monitores: MonitorClaseDTO[]
}

// ============================================
// REQUEST TYPES
// ============================================

/**
 * POST /api/clases
 * Request body for creating a new class
 */
export interface CrearClaseRequest {
  idProfesorPrincipal: string // Guid
  idTipoClase: string // Guid
  fecha: string // DateTime ISO 8601 (solo fecha)
  horaInicio: string // TimeSpan "HH:mm:ss"
  horaFin: string // TimeSpan "HH:mm:ss"
  cupoMaximo: number
  observaciones?: string
}

/**
 * PUT /api/clases/{id}
 * Request body for updating an existing class
 */
export interface EditarClaseRequest {
  idTipoClase: string // Guid
  idProfesor: string // Guid
  fechaHoraInicio: string // DateTime ISO 8601 (fecha + hora)
  duracionMinutos: number
  cupoMaximo: number
  observaciones?: string
}

// ============================================
// RESPONSE TYPES
// ============================================

/**
 * POST /api/clases response
 */
export interface CrearClaseResponse {
  idClase: string // Guid
}

/**
 * Generic paginated response from API
 */
export interface PaginatedResponse<T> {
  items: T[]
  paginaActual: number
  totalPaginas: number
  tamanoPagina: number
  totalRegistros: number
  tienePaginaAnterior: boolean
  tienePaginaSiguiente: boolean
}

// ============================================
// QUERY PARAMS
// ============================================

/**
 * Query parameters for fetching classes
 */
export interface ClasesQueryParams {
  fechaDesde?: string // DateTime ISO 8601
  fechaHasta?: string // DateTime ISO 8601
  pagina?: number
  tamanoPagina?: number
}

// ============================================
// UI STATE TYPES
// ============================================

/**
 * Form data for creating/editing a class
 */
export interface ClaseFormData {
  fecha: string
  horaInicio: string
  horaFin: string
  idTipoClase: string
  idProfesorPrincipal: string
  monitores: string[] // Array of idProfesor
  cupoMaximo: number
  observaciones: string
}

/**
 * Filter state for classes list
 */
export interface ClassesFilters {
  searchTerm: string
  filterProfesor: string // 'todos' | idProfesor
  filterTipo: string // 'todos' | idTipoClase
  filterFecha: string // '' | YYYY-MM-DD
}

// ============================================
// TYPE GUARDS & VALIDATORS
// ============================================

/**
 * Type guard to validate TipoClaseDTO structure
 */
export function isTipoClaseDTO(obj: unknown): obj is TipoClaseDTO {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as TipoClaseDTO).id === 'string' &&
    typeof (obj as TipoClaseDTO).nombre === 'string'
  )
}

/**
 * Type guard to validate ProfesorDTO structure
 */
export function isProfesorDTO(obj: unknown): obj is ProfesorDTO {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as ProfesorDTO).idProfesor === 'string' &&
    typeof (obj as ProfesorDTO).nombreCompleto === 'string' &&
    ((obj as ProfesorDTO).tipoProfesor === 'Titular' ||
      (obj as ProfesorDTO).tipoProfesor === 'Monitor')
  )
}

/**
 * Parses and validates an array of TipoClaseDTO from API response
 */
export function parseTiposClaseResponse(data: unknown): TipoClaseDTO[] {
  if (!Array.isArray(data)) {
    throw new Error('Expected array of TipoClaseDTO')
  }
  return data.filter(isTipoClaseDTO)
}

/**
 * Parses and validates an array of ProfesorDTO from API response
 */
export function parseProfesoresResponse(data: unknown): ProfesorDTO[] {
  if (!Array.isArray(data)) {
    throw new Error('Expected array of ProfesorDTO')
  }
  return data.filter(isProfesorDTO)
}
