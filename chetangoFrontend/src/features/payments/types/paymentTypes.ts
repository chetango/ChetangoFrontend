// ============================================
// PAYMENT TYPES - CHETANGO ADMIN
// ============================================

// Re-export shared types from packages
export type {
  AlumnoDTO,
  TipoPaqueteDTO,
  EstadoPaquete,
  EstadoPaqueteId,
} from '@/features/packages/types/packageTypes'
export {
  ESTADO_PAQUETE_MAP,
  ESTADO_PAQUETE_COLORS,
} from '@/features/packages/types/packageTypes'

// ============================================
// METODO PAGO TYPES
// ============================================

/**
 * GET /api/pagos/metodos-pago
 * Payment method information
 */
export interface MetodoPagoDTO {
  idMetodoPago: string // Guid
  nombre: string
  descripcion: string
}

// Predefined payment method icons mapping
export const METODO_PAGO_ICONS: Record<string, string> = {
  Efectivo: 'dollar-sign',
  'Transferencia Bancaria': 'building-2',
  Nequi: 'smartphone',
  Daviplata: 'smartphone',
  'Tarjeta Débito': 'credit-card',
  'Tarjeta Crédito': 'credit-card',
}

// Quick access payment methods (shown as buttons)
export const METODOS_PAGO_RAPIDOS = [
  'Efectivo',
  'Transferencia Bancaria',
  'Nequi',
]

// ============================================
// ESTADISTICAS TYPES
// ============================================

/**
 * GET /api/pagos/estadisticas
 * Payment statistics response
 */
export interface EstadisticasPagosDTO {
  totalRecaudado: number
  cantidadPagos: number
  promedioMonto: number
  desgloseMetodosPago: DesgloseMétodoPagoDTO[]
}

export interface DesgloseMétodoPagoDTO {
  nombreMetodo: string
  totalRecaudado: number
  cantidadPagos: number
}


// ============================================
// PAGO LIST TYPES
// ============================================

/**
 * GET /api/alumnos/{idAlumno}/pagos - List item
 * GET /api/mis-pagos - List item
 */
export interface PagoListItemDTO {
  idPago: string // Guid
  fechaPago: string // DateTime ISO 8601
  montoTotal: number
  nombreMetodoPago: string
  nombreAlumno: string
  cantidadPaquetes: number
}

// ============================================
// PAGO DETAIL TYPES
// ============================================

/**
 * Package info within a payment detail
 */
export interface PaquetePagoDTO {
  idPaquete: string // Guid
  nombreTipoPaquete: string
  clasesDisponibles: number
  clasesUsadas: number
  clasesRestantes: number
  fechaVencimiento: string // DateTime ISO 8601
  estado: string
  valorPaquete: number
}

/**
 * GET /api/pagos/{id}
 * Detailed payment information
 */
export interface PagoDetalleDTO {
  idPago: string // Guid
  idAlumno: string // Guid
  nombreAlumno: string
  correoAlumno: string
  fechaPago: string // DateTime ISO 8601
  montoTotal: number
  idMetodoPago: string // Guid
  nombreMetodoPago: string
  nota: string | null
  fechaCreacion: string // DateTime ISO 8601
  paquetes: PaquetePagoDTO[]
}

// ============================================
// REQUEST TYPES
// ============================================

/**
 * Package to create within a payment
 */
export interface PaquetePagoRequest {
  idTipoPaquete: string // Guid
  valorPaquete?: number // Optional - if not provided, montoTotal is divided equally
}

/**
 * POST /api/pagos
 * Request body for creating a new payment
 */
export interface CrearPagoRequest {
  idAlumno: string // Guid
  fechaPago: string // DateTime ISO 8601
  montoTotal: number
  idMetodoPago: string // Guid
  nota?: string | null
  paquetes: PaquetePagoRequest[]
}

/**
 * PUT /api/pagos/{id}
 * Request body for updating an existing payment
 */
export interface EditarPagoRequest {
  montoTotal: number
  idMetodoPago: string // Guid
  nota?: string | null
}

// ============================================
// RESPONSE TYPES
// ============================================

/**
 * POST /api/pagos
 * Response after creating a payment
 */
export interface CrearPagoResponse {
  idPago: string // Guid
  idPaquetesCreados: string[] // Array of Guids
  montoTotal: number
}

/**
 * Generic paginated response wrapper
 */
export interface PaginatedResponse<T> {
  items: T[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
}

// ============================================
// QUERY PARAMS
// ============================================

/**
 * Query parameters for fetching payments
 */
export interface PagosQueryParams {
  fechaDesde?: string // DateTime ISO 8601
  fechaHasta?: string // DateTime ISO 8601
  idMetodoPago?: string // Guid
  pageNumber?: number
  pageSize?: number
}

/**
 * Query parameters for statistics
 */
export interface EstadisticasQueryParams {
  fechaDesde?: string // DateTime ISO 8601
  fechaHasta?: string // DateTime ISO 8601
}

// ============================================
// UI STATE TYPES
// ============================================

/**
 * Form data for creating payments
 */
export interface PagoFormData {
  idAlumno: string
  fechaPago: string
  idMetodoPago: string
  selectedPaquetes: SelectedPaquete[]
  montoTotal: number
  montoManual: boolean // true if admin overrode calculated amount
  referencia: string
  observaciones: string
}

/**
 * Selected package in the form
 */
export interface SelectedPaquete {
  idTipoPaquete: string
  nombre: string
  precio: number
  clasesDisponibles: number
}

/**
 * UI state for payments page
 */
export interface PaymentsUIState {
  searchTerm: string
  selectedAlumnoId: string | null
  activeTab: 'busqueda' | 'qr'
  isQRScannerActive: boolean
}

/**
 * Stats for the payments page
 */
export interface PaymentsStats {
  pagosDelMes: number
  totalRecaudado: number
  pagosHoy: number
}
