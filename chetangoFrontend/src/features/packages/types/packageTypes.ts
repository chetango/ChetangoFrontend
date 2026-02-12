// ============================================
// PACKAGE TYPES - CHETANGO ADMIN
// ============================================

// ============================================
// CATALOG TYPES (Lookups)
// ============================================

/**
 * GET /api/alumnos
 * Student information for dropdowns
 */
export interface AlumnoDTO {
  idAlumno: string // Guid
  idUsuario: string // Guid
  nombre: string
  correo: string
  numeroDocumento?: string
  telefono?: string
}

/**
 * GET /api/tipos-paquete
 * Package type information for dropdowns
 */
export interface TipoPaqueteDTO {
  idTipoPaquete: string // Guid
  nombre: string
  numeroClases: number
  diasVigencia: number
  precio: number
  descripcion?: string
  activo: boolean
}

// ============================================
// ESTADO PAQUETE TYPES
// ============================================

export type EstadoPaquete = 'Activo' | 'Vencido' | 'Congelado' | 'Agotado'
export type EstadoPaqueteId = 1 | 2 | 3 | 4

export const ESTADO_PAQUETE_MAP: Record<EstadoPaqueteId, EstadoPaquete> = {
  1: 'Activo',
  2: 'Vencido',
  3: 'Congelado',
  4: 'Agotado',
}

export const ESTADO_PAQUETE_COLORS: Record<EstadoPaquete, string> = {
  Activo: 'green',
  Vencido: 'gray',
  Congelado: 'blue',
  Agotado: 'orange',
}

// ============================================
// PACKAGE LIST TYPES
// ============================================

/**
 * Package list item for table display
 * GET /api/alumnos/{idAlumno}/paquetes
 */
export interface PaqueteListItemDTO {
  idPaquete: string // Guid
  idAlumno: string // Guid
  nombreAlumno: string
  documentoAlumno: string
  nombreTipoPaquete: string
  clasesDisponibles: number
  clasesUsadas: number
  clasesRestantes: number
  fechaActivacion: string // DateTime ISO 8601
  fechaVencimiento: string // DateTime ISO 8601
  valorPaquete: number
  idEstado: EstadoPaqueteId
  estado: EstadoPaquete
  estaVencido: boolean
  tieneClasesDisponibles: boolean
}

// ============================================
// PACKAGE DETAIL TYPES
// ============================================

/**
 * Freeze period information
 */
export interface CongelacionDTO {
  idCongelacion: string // Guid
  fechaInicio: string // DateTime ISO 8601
  fechaFin: string // DateTime ISO 8601
  diasCongelados: number
}

/**
 * Attendance history item for package detail
 */
export interface AsistenciaHistorialDTO {
  idAsistencia: string // Guid
  tipoClase: string
  fecha: string // DateTime ISO 8601
  horaInicio: string // TimeSpan "HH:mm:ss"
  horaFin: string // TimeSpan "HH:mm:ss"
  descontada: boolean
}

/**
 * Alumno en el mismo pago (para paquetes compartidos)
 */
export interface AlumnoPaqueteDTO {
  idAlumno: string // Guid
  nombreAlumno: string
}

/**
 * GET /api/paquetes/{id}
 * Detailed package information
 */
export interface PaqueteDetalleDTO {
  idPaquete: string // Guid
  idAlumno: string // Guid
  nombreAlumno: string
  idTipoPaquete: string // Guid
  nombreTipoPaquete: string
  clasesDisponibles: number
  clasesUsadas: number
  clasesRestantes: number
  fechaActivacion: string // DateTime ISO 8601
  fechaVencimiento: string // DateTime ISO 8601
  valorPaquete: number
  idEstado: EstadoPaqueteId
  estado: EstadoPaquete
  estaVencido: boolean
  tieneClasesDisponibles: boolean
  congelaciones: CongelacionDTO[]
  historialConsumo?: AsistenciaHistorialDTO[]
  alumnosDelPago?: AlumnoPaqueteDTO[] | null
}

// ============================================
// REQUEST TYPES
// ============================================

/**
 * POST /api/paquetes
 * Request body for creating a new package
 */
export interface CrearPaqueteRequest {
  idAlumno: string // Guid
  idTipoPaquete: string // Guid
  clasesDisponibles: number
  valorPaquete: number
  diasVigencia: number
  idPago?: string | null // Guid - optional
}

/**
 * PUT /api/paquetes/{id}
 * Request body for updating an existing package
 */
export interface EditarPaqueteRequest {
  idPaquete: string // Guid
  clasesDisponibles: number
  fechaVencimiento: string // DateTime ISO 8601
}

/**
 * POST /api/paquetes/{id}/congelar
 * Request body for freezing a package
 */
export interface CongelarPaqueteRequest {
  idPaquete: string // Guid
  fechaInicio: string // DateTime ISO 8601
  fechaFin: string // DateTime ISO 8601
  motivo?: string
}

// ============================================
// RESPONSE TYPES
// ============================================

/**
 * POST /api/paquetes
 * Response after creating a package
 */
export interface CrearPaqueteResponse {
  idPaquete: string // Guid
}

/**
 * Generic paginated response wrapper
 */
export interface PaginatedResponse<T> {
  items: T[]
  pageNumber: number
  totalPages: number
  totalCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

// ============================================
// QUERY PARAMS
// ============================================

/**
 * Query parameters for fetching packages
 */
export interface PaquetesQueryParams {
  soloActivos?: boolean
  estado?: EstadoPaqueteId
  fechaVencimientoDesde?: string
  fechaVencimientoHasta?: string
  pageNumber?: number
  pageSize?: number
}

// ============================================
// UI STATE TYPES
// ============================================

/**
 * Form data for creating/editing packages
 */
export interface PaqueteFormData {
  idAlumno: string
  idTipoPaquete: string
  fechaInicio: string
  fechaFin: string
  notasInternas: string
}

/**
 * Filter state for packages list
 */
export interface PackagesFilters {
  searchTerm: string
  filterEstado: string // 'todos' | EstadoPaquete
  filterTipoPaquete: string // 'todos' | idTipoPaquete
}

/**
 * Statistics for packages by estado
 */
export interface PackagesStats {
  total: number
  activos: number
  agotados: number
  congelados: number
  vencidos: number
}
