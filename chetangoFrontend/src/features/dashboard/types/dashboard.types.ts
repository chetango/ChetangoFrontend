// ============================================
// DASHBOARD TYPES - Basados en DTOs del Backend
// ============================================

/**
 * Evento próximo de la academia (compartido entre alumno/profesor)
 */
export interface EventoProximo {
  idEvento: string
  titulo: string
  descripcion: string
  fecha: string // ISO date
  imagenUrl: string
  precio: number | null
  destacado: boolean
}

/**
 * Response principal del endpoint /api/reportes/dashboard
 */
export interface DashboardResponse {
  kpIs: DashboardKPIs
  graficaIngresos: ChartData | null
  graficaAsistencias: ChartData | null
  graficaPaquetes: ChartData | null
  graficaMetodosPago: ChartData | null
  resumenPeriodo: ResumenPeriodo | null
  ultimosPagos: UltimoPago[]
  alertas: Alerta[]
}

/**
 * KPIs principales del dashboard
 */
export interface DashboardKPIs {
  totalAlumnosActivos: number
  ingresosEsteMes: number
  clasesProximos7Dias: number
  paquetesActivos: number
  paquetesVencidos: number
  paquetesPorVencer: number
  paquetesVendidos: number
  asistenciasHoy: number
  asistenciasMes: number
  crecimientoIngresosMesAnterior?: number
  comparativaAsistenciasMesAnterior?: number
  comparativaAlumnosMesAnterior?: number
  comparativaPaquetesVendidosMesAnterior?: number
}

/**
 * Datos de gráfica compatible con Recharts
 */
export interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'area'
  labels: string[]
  datasets: ChartDataset[]
}

export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor?: string
  borderColor?: string
}

/**
 * Resumen del periodo con métricas de pagos
 */
export interface ResumenPeriodo {
  totalRecaudado: number
  promedioPorPago: number
  cantidadPagos: number
  tasaConversion: number
}

/**
 * Último pago registrado
 */
export interface UltimoPago {
  idPago: string
  nombreAlumno: string
  fecha: string
  monto: number
  metodoPago: string
  nombrePaquete: string
  estado: string
}

/**
 * Alerta del sistema
 */
export interface Alerta {
  tipo: TipoAlerta
  titulo: string
  descripcion: string
  fechaGeneracion: string
  prioridad: PrioridadAlerta
  datosAdicionales?: Record<string, unknown>
}

export const TipoAlerta = {
  PaquetePorVencer: 'PaquetePorVencer',
  AlumnoInactivo: 'AlumnoInactivo',
  ClaseBajaAsistencia: 'ClaseBajaAsistencia',
  PagosPendientes: 'PagosPendientes',
  ClasePocosCupos: 'ClasePocosCupos',
  PagoPendiente: 'PagoPendiente'
} as const

export type TipoAlerta = typeof TipoAlerta[keyof typeof TipoAlerta]

export const PrioridadAlerta = {
  Baja: 'Baja',
  Media: 'Media',
  Alta: 'Alta'
} as const

export type PrioridadAlerta = typeof PrioridadAlerta[keyof typeof PrioridadAlerta]

/**
 * KPI Individual para display
 */
export interface KPI {
  id: string
  title: string
  value: string | number
  change?: number
  comparison: string
  icon: any
  color: string
  bgColor: string
  glowColor: string
}

/**
 * Acción rápida
 */
export interface QuickAction {
  id: string
  title: string
  description: string
  icon: any
  color: string
  path: string
}

/**
 * Parámetros para query del dashboard
 */
export interface DashboardQueryParams {
  fechaDesde?: string
  fechaHasta?: string
  periodo?: string
}
