// ============================================
// PAYMENTS TYPES - ALUMNO
// ============================================

export interface PagoResumen {
  idPago: string
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
}

export interface PagoDetalle {
  idPago: string
  idAlumno: string
  nombreAlumno: string
  correoAlumno: string
  telefonoAlumno?: string
  fotoUrlAlumno?: string
  fechaPago: string
  montoTotal: number
  idMetodoPago: string
  nombreMetodoPago: string
  referenciaTransferencia?: string
  nota?: string
  estadoPago: string
  urlComprobante?: string
  notasVerificacion?: string
  fechaVerificacion?: string
  usuarioVerificacion?: string
  fechaCreacion: string
  paquetes: PaqueteResumen[]
}

export interface PaqueteResumen {
  idPaquete: string
  nombreTipoPaquete: string
  clasesDisponibles: number
  clasesUsadas: number
  clasesRestantes: number
  fechaVencimiento?: string
  estado: string
  valorPaquete: number
}

export interface MetodoPago {
  idMetodoPago: string
  nombre: string
  descripcion?: string
}

export interface PaginatedPayments {
  items: PagoResumen[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export interface PaymentFilters {
  fechaDesde?: string
  fechaHasta?: string
  idMetodoPago?: string
  pageNumber: number
  pageSize: number
}

export interface PaymentStats {
  totalPagado: number
  cantidadPagos: number
  promedioMonto: number
}
