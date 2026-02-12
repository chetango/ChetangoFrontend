// ============================================
// EXCEL EXPORT UTILITIES - CHETANGO
// Generate Excel reports using xlsx
// ============================================

import { toLocalISOString } from '@/shared/utils/dateTimeHelper'
import * as XLSX from 'xlsx'
import type {
    AlumnosReporte,
    AsistenciasReporte,
    ClasesReporte,
    IngresosReporte,
    PaquetesReporte
} from '../types/reportTypes'

// ============================================
// HELPERS
// ============================================

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-CO', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  })
}

// ============================================
// STUDENTS REPORT
// ============================================

export function exportStudentsExcel(data: AlumnosReporte) {
  const wb = XLSX.utils.book_new()

  // Summary sheet
  const totalAlumnos = (data.totalActivos || 0) + (data.totalInactivos || 0)
  const summaryData = [
    ['REPORTE DE ALUMNOS'],
    ['Generado:', formatDateTime(toLocalISOString())],
    [],
    ['Métrica', 'Valor'],
    ['Total Alumnos', totalAlumnos],
    ['Alumnos Activos', data.totalActivos || 0],
    ['Alumnos Inactivos', data.totalInactivos || 0],
    ['Nuevos Este Mes', data.nuevosEsteMes || 0],
    ['Tasa de Retención', `${(data.tasaRetencion || 0).toFixed(2)}%`],
  ]
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Resumen')

  // Alumnos inactivos sheet
  if (data.alumnosInactivos && data.alumnosInactivos.length > 0) {
    const inactivosData = [
      ['Alumno', 'Correo', 'Última Asistencia', 'Días Inactivo'],
      ...data.alumnosInactivos.map(alumno => [
        alumno.nombreAlumno,
        alumno.correo,
        alumno.ultimaAsistencia ? formatDateTime(alumno.ultimaAsistencia) : 'N/A',
        alumno.diasInactivo,
      ])
    ]
    const inactivosSheet = XLSX.utils.aoa_to_sheet(inactivosData)
    XLSX.utils.book_append_sheet(wb, inactivosSheet, 'Alumnos Inactivos')
  }

  // Alumnos por vencer sheet
  if (data.alumnosPorVencer && data.alumnosPorVencer.length > 0) {
    const porVencerData = [
      ['Alumno', 'Correo', 'Fecha Vencimiento', 'Días Restantes'],
      ...data.alumnosPorVencer.map(alumno => [
        alumno.nombreAlumno,
        alumno.correo,
        formatDateTime(alumno.fechaVencimiento),
        alumno.diasRestantes,
      ])
    ]
    const porVencerSheet = XLSX.utils.aoa_to_sheet(porVencerData)
    XLSX.utils.book_append_sheet(wb, porVencerSheet, 'Paquetes por Vencer')
  }

  XLSX.writeFile(wb, 'reporte-alumnos.xlsx')
}

// ============================================
// CLASSES REPORT
// ============================================

export function exportClassesExcel(data: ClasesReporte) {
  const wb = XLSX.utils.book_new()

  // Summary sheet
  const summaryData = [
    ['REPORTE DE CLASES'],
    ['Generado:', formatDateTime(toLocalISOString())],
    [],
    ['Métrica', 'Valor'],
    ['Total Clases', data.totalClases || 0],
    ['Promedio Asistencia', (data.promedioAsistencia || 0).toFixed(1)],
    ['Ocupación Promedio', `${(data.ocupacionPromedio || 0).toFixed(1)}%`],
  ]
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Resumen')

  // Clases más populares sheet
  if (data.clasesMasPopulares && data.clasesMasPopulares.length > 0) {
    const popularesData = [
      ['Tipo de Clase', 'Total Clases', 'Promedio Asistencia', 'Ocupación %'],
      ...data.clasesMasPopulares.map(clase => [
        clase.nombreTipoClase,
        clase.totalClases,
        clase.promedioAsistencia.toFixed(1),
        clase.ocupacionPorcentaje.toFixed(1),
      ])
    ]
    const popularesSheet = XLSX.utils.aoa_to_sheet(popularesData)
    XLSX.utils.book_append_sheet(wb, popularesSheet, 'Clases Más Populares')
  }

  // Desglose por tipo sheet
  if (data.desgloseporTipo && data.desgloseporTipo.length > 0) {
    const desgloseData = [
      ['Tipo de Clase', 'Cantidad Clases', 'Promedio Asistencia'],
      ...data.desgloseporTipo.map(tipo => [
        tipo.nombreTipoClase,
        tipo.cantidadClases,
        tipo.promedioAsistencia.toFixed(1),
      ])
    ]
    const desgloseSheet = XLSX.utils.aoa_to_sheet(desgloseData)
    XLSX.utils.book_append_sheet(wb, desgloseSheet, 'Desglose por Tipo')
  }

  XLSX.writeFile(wb, 'reporte-clases.xlsx')
}

// ============================================
// INCOME REPORT
// ============================================

export function exportIncomeExcel(data: IngresosReporte) {
  const wb = XLSX.utils.book_new()

  // Summary sheet
  const summaryData = [
    ['REPORTE DE INGRESOS'],
    ['Generado:', formatDateTime(toLocalISOString())],
    [],
    ['Métrica', 'Valor'],
    ['Total Recaudado', data.totalRecaudado || 0],
    ['Cantidad de Pagos', data.cantidad || 0],
    ['Promedio por Pago', data.promedio || 0],
    ['Comparativa Mes Anterior', data.comparativaMesAnterior ? `${data.comparativaMesAnterior.toFixed(1)}%` : 'N/A'],
  ]
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Resumen')

  // Tendencia mensual sheet
  if (data.tendenciaMensual && data.tendenciaMensual.length > 0) {
    const tendenciaData = [
      ['Año', 'Mes', 'Mes Nombre', 'Total Ingresos', 'Cantidad Pagos'],
      ...data.tendenciaMensual.map(mes => [
        mes.año,
        mes.mes,
        mes.mesNombre,
        mes.totalIngresos,
        mes.cantidadPagos,
      ])
    ]
    const tendenciaSheet = XLSX.utils.aoa_to_sheet(tendenciaData)
    XLSX.utils.book_append_sheet(wb, tendenciaSheet, 'Tendencia Mensual')
  }

  // Desglose métodos de pago sheet
  if (data.desgloseMetodosPago && data.desgloseMetodosPago.length > 0) {
    const metodosData = [
      ['Método de Pago', 'Total Recaudado', 'Cantidad Pagos', 'Porcentaje del Total'],
      ...data.desgloseMetodosPago.map(metodo => [
        metodo.metodoPago,
        metodo.totalRecaudado,
        metodo.cantidadPagos,
        `${metodo.porcentajeDelTotal.toFixed(1)}%`,
      ])
    ]
    const metodosSheet = XLSX.utils.aoa_to_sheet(metodosData)
    XLSX.utils.book_append_sheet(wb, metodosSheet, 'Métodos de Pago')
  }

  XLSX.writeFile(wb, 'reporte-ingresos.xlsx')
}

// ============================================
// PACKAGES REPORT
// ============================================

export function exportPackagesExcel(data: PaquetesReporte) {
  const wb = XLSX.utils.book_new()

  // Summary sheet
  const summaryData = [
    ['REPORTE DE PAQUETES'],
    ['Generado:', formatDateTime(toLocalISOString())],
    [],
    ['Métrica', 'Valor'],
    ['Paquetes Activos', data.totalActivos || 0],
    ['Paquetes Vencidos', data.totalVencidos || 0],
    ['Paquetes por Vencer', data.totalPorVencer || 0],
    ['Paquetes Agotados', data.totalAgotados || 0],
  ]
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Resumen')

  // Alertas por vencer sheet
  if (data.alertasPorVencer && data.alertasPorVencer.length > 0) {
    const alertasData = [
      ['ID Paquete', 'Alumno', 'Correo', 'Tipo Paquete', 'Fecha Vencimiento', 'Días Restantes', 'Clases Restantes'],
      ...data.alertasPorVencer.map(alerta => [
        alerta.idPaquete,
        alerta.nombreAlumno,
        alerta.correoAlumno,
        alerta.nombreTipoPaquete,
        formatDateTime(alerta.fechaVencimiento),
        alerta.diasRestantes,
        alerta.clasesRestantes,
      ])
    ]
    const alertasSheet = XLSX.utils.aoa_to_sheet(alertasData)
    XLSX.utils.book_append_sheet(wb, alertasSheet, 'Alertas por Vencer')
  }

  // Desglose por estados sheet
  if (data.desgloseEstados && data.desgloseEstados.length > 0) {
    const estadosData = [
      ['Estado', 'Cantidad', 'Porcentaje del Total'],
      ...data.desgloseEstados.map(estado => [
        estado.estado,
        estado.cantidad,
        `${estado.porcentajeDelTotal.toFixed(1)}%`,
      ])
    ]
    const estadosSheet = XLSX.utils.aoa_to_sheet(estadosData)
    XLSX.utils.book_append_sheet(wb, estadosSheet, 'Desglose por Estados')
  }

  XLSX.writeFile(wb, 'reporte-paquetes.xlsx')
}

// ============================================
// ATTENDANCE REPORT
// ============================================

export function exportAttendanceExcel(data: AsistenciasReporte) {
  const wb = XLSX.utils.book_new()

  // Summary sheet
  const summaryData = [
    ['REPORTE DE ASISTENCIAS'],
    ['Generado:', formatDateTime(toLocalISOString())],
    [],
    ['Métrica', 'Valor'],
    ['Total Asistencias', data.totalAsistencias || 0],
    ['Presentes', data.presentes || 0],
    ['Ausentes', data.ausentes || 0],
    ['Justificadas', data.justificadas || 0],
    ['Porcentaje de Asistencia', `${(data.porcentajeAsistencia || 0).toFixed(2)}%`],
  ]
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Resumen')

  // Lista detallada sheet
  if (data.listaDetallada && data.listaDetallada.length > 0) {
    const detalladaData = [
      ['Fecha', 'Alumno', 'Clase', 'Estado', 'Profesor', 'Observaciones'],
      ...data.listaDetallada.map(asistencia => [
        formatDateTime(asistencia.fecha),
        asistencia.nombreAlumno,
        asistencia.nombreClase,
        asistencia.estado,
        asistencia.nombreProfesor || 'N/A',
        asistencia.observaciones || '',
      ])
    ]
    const detalladaSheet = XLSX.utils.aoa_to_sheet(detalladaData)
    XLSX.utils.book_append_sheet(wb, detalladaSheet, 'Lista Detallada')
  }

  XLSX.writeFile(wb, 'reporte-asistencias.xlsx')
}
