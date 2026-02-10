// ============================================
// PAYROLL TYPES - CHETANGO
// ============================================

export type PaymentState = 'Pendiente' | 'Aprobado' | 'Liquidado' | 'Pagado'
export type LiquidacionState = 'EnProceso' | 'Cerrada' | 'Pagada'

export interface ClaseProfesor {
  idClaseProfesor: string
  idClase: string
  fechaClase: string
  nombreClase: string
  tipoClase: string
  idProfesor: string
  nombreProfesor: string
  rolEnClase: string
  tarifaProgramada: number
  valorAdicional: number
  conceptoAdicional?: string
  totalPago: number
  estadoPago: PaymentState
  fechaAprobacion?: string
  fechaPago?: string
  nombreAprobador?: string
}

export interface ProfesorClase {
  idClaseProfesor?: string
  idProfesor: string
  nombreProfesor: string
  rolEnClase: string
  tarifaProgramada: number
  valorAdicional: number
  totalPago: number
  estadoPago: PaymentState
}

export interface ClaseRealizada {
  idClase: string
  fechaClase: string
  nombreClase: string
  tipoClase: string
  estado: string
  profesores: ProfesorClase[]
}

export interface LiquidacionMensual {
  idLiquidacion: string
  idProfesor: string
  nombreProfesor: string
  mes: number
  año: number
  totalClases: number
  totalHoras: number
  totalBase: number
  totalAdicionales: number
  totalPagar: number
  estado: LiquidacionState
  fechaCierre?: string
  fechaPago?: string
  observaciones?: string
  fechaCreacion: string
}

export interface LiquidacionDetalle extends LiquidacionMensual {
  clases: ClaseProfesor[]
}

export interface ResumenProfesor {
  idProfesor: string
  nombreProfesor: string
  clasesPendientes: number
  clasesAprobadas: number
  clasesLiquidadas: number
  clasesPagadas: number
  totalPendiente: number
  totalAprobado: number
  totalLiquidado: number
  totalPagado: number
}

// Request types
export interface AprobarPagoRequest {
  idClaseProfesor: string
  valorAdicional?: number
  conceptoAdicional?: string
}

export interface LiquidarMesRequest {
  idProfesor: string
  mes: number
  año: number
  observaciones?: string
}

export interface RegistrarPagoRequest {
  idLiquidacion: string
  fechaPago: string
  observaciones?: string
}
