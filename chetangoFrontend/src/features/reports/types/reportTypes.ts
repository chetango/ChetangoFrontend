// ============================================
// REPORTS TYPES - CHETANGO
// TypeScript interfaces for reports module
// ============================================

// ============================================
// REPORT TYPES
// ============================================

export type ReportType = 
  | 'alumnos' 
  | 'clases' 
  | 'asistencias' 
  | 'paquetes' 
  | 'ingresos'

export type DatePreset = 
  | 'today' 
  | 'week' 
  | 'month' 
  | 'quarter' 
  | 'year' 
  | 'custom'

export type ExportFormat = 'pdf' | 'excel'

// ============================================
// FILTER INTERFACES
// ============================================

export interface DateRangeFilter {
  preset: DatePreset
  fechaDesde?: string // ISO date
  fechaHasta?: string // ISO date
}

export interface ReportFilters extends DateRangeFilter {
  estado?: string
  idProfesor?: string
  idTipoClase?: string
  idAlumno?: string
}

// ============================================
// REPORT METADATA
// ============================================

export interface ReportMetadata {
  id: ReportType
  title: string
  description: string
  icon: string
  color: string
  available: boolean
}

// ============================================
// API REQUEST TYPES
// ============================================

export interface GetReporteAlumnosRequest {
  fechaInscripcionDesde?: string
  fechaInscripcionHasta?: string
  estado?: string
}

export interface GetReporteClasesRequest {
  fechaDesde: string
  fechaHasta: string
  idTipoClase?: string
  idProfesor?: string
}

export interface GetReporteAsistenciasRequest {
  fechaDesde: string
  fechaHasta: string
  idAlumno?: string
  idClase?: string
}

export interface GetReportePaquetesRequest {
  fechaDesde: string
  fechaHasta: string
  estado?: string
  idTipoPaquete?: string
}

export interface GetReporteIngresosRequest {
  fechaDesde: string
  fechaHasta: string
  metodoPago?: string
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface AlumnoReporteItem {
  idAlumno: string
  nombreCompleto: string
  email: string
  telefono?: string
  fechaInscripcion: string
  estado: string
  totalClasesAsistidas: number
  paqueteActivo?: string
  ultimaAsistencia?: string
}

export interface ReporteAlumnosDTO {
  totalAlumnos: number
  alumnosActivos: number
  alumnosInactivos: number
  nuevosMesActual: number
  tasaRetencion: number
  alumnos: AlumnoReporteItem[]
  distribucionPorEstado: Array<{ estado: string; cantidad: number }>
}

export interface ClaseReporteItem {
  idClase: string
  fecha: string
  tipoClase: string
  profesorNombre: string
  horaInicio: string
  horaFin: string
  estado: string
  asistencias: number
  cupoMaximo: number
  ocupacion: number
}

export interface ReporteClasesDTO {
  totalClases: number
  clasesProgramadas: number
  clasesCompletadas: number
  clasesCanceladas: number
  ocupacionPromedio: number
  clases: ClaseReporteItem[]
  distribucionPorTipo: Array<{ tipo: string; cantidad: number }>
  distribucionPorProfesor: Array<{ profesor: string; cantidad: number }>
}

export interface AsistenciaReporteItem {
  idAsistencia: string
  fecha: string
  alumnoNombre: string
  claseNombre: string
  tipoAsistencia: string
  observaciones?: string
}

export interface ReporteAsistenciasDTO {
  totalAsistencias: number
  presentes: number
  ausentes: number
  tardanzas: number
  tasaAsistencia: number
  asistencias: AsistenciaReporteItem[]
  tendenciaSemanal: Array<{ semana: string; asistencias: number }>
}

export interface PaqueteReporteItem {
  idPaquete: string
  alumnoNombre: string
  tipoPaquete: string
  fechaCompra: string
  clasesTotales: number
  clasesUsadas: number
  clasesRestantes: number
  estado: string
  montoTotal: number
}

export interface ReportePaquetesDTO {
  totalPaquetes: number
  paquetesActivos: number
  paquetesVencidos: number
  paquetesAgotados: number
  ingresosTotales: number
  paquetes: PaqueteReporteItem[]
  distribucionPorTipo: Array<{ tipo: string; cantidad: number }>
}

export interface ReporteIngresosDTO {
  ingresosTotales: number
  ingresosMesActual: number
  ingresosMesAnterior: number
  variacionMensual: number
  ingresosPorMetodo: Array<{ metodo: string; monto: number }>
  ingresosPorMes: Array<{ mes: string; monto: number }>
  ingresosPorTipoPaquete: Array<{ tipo: string; monto: number }>
}

// ============================================
// EXTENDED REPORT TYPES (For Detailed Views)
// Estos tipos coinciden EXACTAMENTE con los DTOs del backend
// ============================================

export interface ChartDatasetDTO {
  label: string
  data: number[]
  backgroundColor?: string
  borderColor?: string
}

export interface ChartDataDTO {
  type: string
  labels: string[]
  datasets: ChartDatasetDTO[]
}

export interface AlumnoInactivoDTO {
  idAlumno: string
  nombreAlumno: string
  correo: string
  ultimaAsistencia?: string
  diasInactivo: number
}

export interface AlumnoPorVencerDTO {
  idAlumno: string
  nombreAlumno: string
  correo: string
  fechaVencimiento: string
  diasRestantes: number
}

export interface AlumnosReporte {
  totalActivos: number
  totalInactivos: number
  nuevosEsteMes: number
  tasaRetencion: number
  alumnosInactivos: AlumnoInactivoDTO[]
  alumnosPorVencer: AlumnoPorVencerDTO[]
  graficaAlumnosPorMes?: ChartDataDTO
}

export interface ClasePopularDTO {
  nombreTipoClase: string
  totalClases: number
  promedioAsistencia: number
  ocupacionPorcentaje: number
}

export interface ClasesPorTipoDTO {
  nombreTipoClase: string
  cantidadClases: number
  promedioAsistencia: number
}

export interface ClasesReporte {
  totalClases: number
  promedioAsistencia: number
  ocupacionPromedio: number
  clasesMasPopulares: ClasePopularDTO[]
  graficaAsistenciaPorDia?: ChartDataDTO
  desgloseporTipo: ClasesPorTipoDTO[]
}

export interface TendenciaMensualDTO {
  año: number
  mes: number
  mesNombre: string
  totalIngresos: number
  cantidadPagos: number
}

export interface DesglosePagoDTO {
  metodoPago: string
  totalRecaudado: number
  cantidadPagos: number
  porcentajeDelTotal: number
}

export interface IngresosReporte {
  totalRecaudado: number
  cantidad: number
  promedio: number
  comparativaMesAnterior?: number
  tendenciaMensual: TendenciaMensualDTO[]
  graficaIngresosMensuales?: ChartDataDTO
  desgloseMetodosPago: DesglosePagoDTO[]
}

export interface PaqueteAlertaDTO {
  idPaquete: string
  nombreAlumno: string
  correoAlumno: string
  nombreTipoPaquete: string
  fechaVencimiento: string
  diasRestantes: number
  clasesRestantes: number
}

export interface PaquetesPorEstadoDTO {
  estado: string
  cantidad: number
  porcentajeDelTotal: number
}

export interface PaquetesReporte {
  totalActivos: number
  totalVencidos: number
  totalPorVencer: number
  totalAgotados: number
  alertasPorVencer: PaqueteAlertaDTO[]
  desgloseEstados: PaquetesPorEstadoDTO[]
  graficaPaquetesPorTipo?: ChartDataDTO
}

export interface AsistenciaDetalleDTO {
  fecha: string
  nombreAlumno: string
  nombreClase: string
  estado: string
  observaciones?: string
  nombreProfesor?: string
}

export interface AsistenciasReporte {
  totalAsistencias: number
  presentes: number
  ausentes: number
  justificadas: number
  porcentajeAsistencia: number
  listaDetallada: AsistenciaDetalleDTO[]
  graficaAsistenciasPorDia?: ChartDataDTO
}

// ============================================
// UI STATE TYPES
// ============================================

export interface ReportModalState {
  isOpen: boolean
  reportType: ReportType | null
  filters: ReportFilters
}
