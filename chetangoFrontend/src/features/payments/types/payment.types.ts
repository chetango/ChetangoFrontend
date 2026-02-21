// ============================================
// PAYMENT TYPES - CHETANGO
// ============================================

export type PaymentStatus = 'pendiente_verificacion' | 'verificado' | 'rechazado'

export type Sede = 1 | 2 // 1 = Medellín, 2 = Manizales

export interface PaymentMethod {
  idMetodoPago: string
  nombre: string
  descripcion: string | null
}

export interface PackageType {
  idTipoPaquete: string
  nombre: string
  numeroClases: number
  precio: number
  diasVigencia: number
  descripcion?: string
  activo: boolean
}

export interface Payment {
  idPago: string
  idAlumno: string
  fechaPago: string
  montoTotal: number
  nombreMetodoPago: string
  nombreAlumno: string
  estadoPago: string
  urlComprobante?: string
  referenciaTransferencia?: string
  notasVerificacion?: string
  fechaVerificacion?: string
  usuarioVerificacion?: string
  cantidadPaquetes: number
  sede: Sede
  sedeNombre: string
}

export interface PaymentPackage {
  idPaquete: string
  nombreTipoPaquete: string
  clasesDisponibles: number
  valorPaquete: number
}

export interface PaymentDetail extends Payment {
  fechaModificacion?: string
  usuarioModificacion?: string
  historialCambios?: PaymentChange[]
}

export interface PaymentChange {
  fecha: string
  usuario: string
  accion: string
  detalle: string
}

export interface PackageWithoutPayment {
  idPaquete: string
  nombreTipoPaquete: string
  clasesDisponibles: number
  clasesUsadas: number
  valorPaquete: number
  fechaActivacion: string
  fechaVencimiento: string
  estado: string
}

export interface RegisterPaymentRequest {
  idAlumno?: string | null // Opcional: solo para pagos de un único alumno
  fechaPago: string
  montoTotal: number
  idMetodoPago: string
  referencia?: string
  comprobanteUrl?: string
  nota?: string
  paquetes: {
    idAlumno: string // Cada paquete tiene su alumno
    idTipoPaquete: string
    clasesDisponibles: number
    valorPaquete: number
    diasVigencia: number
  }[]
  idsPaquetesExistentes?: string[]
}

export interface VerifyPaymentRequest {
  idPago: string
  accion: 'aprobar' | 'rechazar'
  nota?: string
  notificarAlumno: boolean
}

export interface UpdatePaymentRequest {
  idPago: string
  fechaPago: string
  montoTotal: number
  idMetodoPago: string
  referencia?: string
  nota?: string
}

export interface PaymentStats {
  totalIngresos: number
  totalPagosHoy: number
  totalPendientesVerificacion: number
  totalVerificadosHoy: number
  ingresosMesActual: number
  comparacionMesAnterior: number
}

export interface PaymentFilters {
  idAlumno?: string
  metodoPago?: string
  estado?: PaymentStatus
  fechaDesde?: string
  fechaHasta?: string
  page?: number
  pageSize?: number
}

export interface PaginatedPayments {
  pagos: Payment[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}
