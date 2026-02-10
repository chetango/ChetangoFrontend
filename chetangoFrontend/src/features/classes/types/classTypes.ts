// ============================================
// CLASS TYPES - CHETANGO
// ============================================

// ============================================
// CATALOG TYPES (Lookups)
// ============================================

/**
 * GET /api/tipos-clase
 * Tipo de clase para dropdown
 */
export interface TipoClaseDTO {
  id: string // Guid
  nombre: string
}

/**
 * GET /api/profesores
 * Profesor para dropdown (Admin only)
 */
export interface ProfesorDTO {
  idProfesor: string // Guid
  nombreCompleto: string
  tipoProfesor: 'Titular' | 'Monitor'
}

/**
 * GET /api/alumnos
 * Alumno para dropdown
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
  idProfesorPrincipal: string // Guid
  nombreProfesor: string
  cupoMaximo: number
  totalAsistencias: number
  estado: string // Programada, EnCurso, Completada, Cancelada
}

/**
 * Monitor information for a class
 * DEPRECATED: Usar ProfesorClaseDTO en su lugar
 */
export interface MonitorClaseDTO {
  idProfesor: string // Guid
  nombreProfesor: string
}

/**
 * Profesor con su rol en una clase
 * Sistema NUEVO para representar todos los profesores
 */
export interface ProfesorClaseDTO {
  idProfesor: string // Guid
  nombreProfesor: string
  rolEnClase: 'Principal' | 'Monitor'
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
  idProfesorPrincipal: string | null // DEPRECATED: Usar profesores en su lugar
  nombreProfesor: string // DEPRECATED: Usar profesores en su lugar
  cupoMaximo: number
  observaciones: string | null
  totalAsistencias: number
  monitores: MonitorClaseDTO[] // DEPRECATED: Usar profesores en su lugar
  profesores: ProfesorClaseDTO[] // NUEVO: Lista completa de profesores con roles
  estado: string // Programada, EnCurso, Completada, Cancelada
}

// ============================================
// REQUEST TYPES
// ============================================

/**
 * Profesor con rol para una clase
 * Sistema NUEVO: múltiples profesores con roles individuales
 */
export interface ProfesorClaseRequest {
  idProfesor: string // Guid
  rolEnClase: 'Principal' | 'Monitor'
}

/**
 * POST /api/clases
 * Request body for creating a new class
 * 
 * SISTEMA DUAL:
 * - NUEVO (recomendado): Usar campo "profesores" con roles
 * - ANTIGUO (deprecado): Usar "idProfesorPrincipal" + "idsMonitores"
 */
export interface CrearClaseRequest {
  // NUEVO: Sistema de múltiples profesores con roles
  profesores?: ProfesorClaseRequest[]
  
  // ANTIGUO: Sistema legacy (mantener para retrocompatibilidad)
  idProfesorPrincipal?: string // Guid
  idsMonitores?: string[] // Array de Guids de profesores monitores
  
  // Datos comunes
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
 * Usa el sistema NUEVO de múltiples profesores con roles
 */
export interface ClaseFormData {
  fecha: string
  horaInicio: string
  horaFin: string
  idTipoClase: string
  
  // NUEVO: Sistema de múltiples profesores con roles
  profesores: ProfesorClaseRequest[]
  
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

// ============================================
// PROFESOR VIEW TYPES
// ============================================

/**
 * Alert type for profesor classes
 */
export interface ClaseAlerta {
  tipo: 'cambio_horario' | 'cancelada' | 'baja_asistencia'
  mensaje: string
}

/**
 * Class type for profesor view
 * Extended with profesor-specific fields
 */
export interface ClaseProfesor {
  id: string
  fecha: string
  diaSemana: string
  horaInicio: string
  horaFin: string
  nombre: string
  tipo: 'Salón' | 'Escenario' | 'Privada' | string
  estado: 'programada' | 'en_curso' | 'finalizada' | 'cancelada'
  observaciones: string
  capacidad: number
  inscriptos: number
  ubicacion: string
  alerta?: ClaseAlerta
  asistenciaReal?: number
  porcentajeAsistencia?: number
}

// ============================================
// ALUMNO VIEW TYPES
// ============================================

/**
 * Class type for alumno view
 * Extended with student-specific fields
 */
export interface ClaseAlumno {
  id: string
  fecha: string
  diaSemana: string
  horaInicio: string
  horaFin: string
  nombre: string
  tipo: 'Salón' | 'Escenario' | 'Privada' | string
  profesor: string
  estado: 'programada' | 'en_curso' | 'finalizada' | 'reprogramada' | 'cancelada'
  ubicacion: string
  puedeReprogramar?: boolean
  horasParaReprogramar?: number
  minutosParaInicio?: number
  resultado?: 'asistida' | 'ausente' | 'reprogramada'
  descontada?: boolean
}

// ============================================
// BADGE COLOR MAPPINGS
// ============================================

/**
 * Badge variant type for estado display
 */
export type BadgeVariant = 'error' | 'info' | 'success' | 'none' | 'warning'

/**
 * Maps estado to badge variant for consistent styling
 * Requirements: 5.9
 */
export const ESTADO_BADGE_MAP: Record<string, BadgeVariant> = {
  hoy: 'error',
  en_curso: 'error',
  programada: 'info',
  completada: 'success',
  finalizada: 'success',
  cancelada: 'none',
  reprogramada: 'warning',
}

/**
 * Gets badge variant for a given estado
 */
export function getEstadoBadgeVariant(estado: string): BadgeVariant {
  return ESTADO_BADGE_MAP[estado] || 'info'
}

// ============================================
// FILTER TYPES FOR PROFESOR
// ============================================

/**
 * Filter options for profesor's historical classes
 */
export type FiltroAnterior = 'ultimos_7' | 'ultimos_30' | 'este_mes'

/**
 * Profesor classes filter state
 */
export interface ProfesorClassesFilters {
  filtroAnterior: FiltroAnterior
  showClasesAnteriores: boolean
}
