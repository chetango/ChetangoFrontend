// ============================================
// PDF EXPORT UTILITIES - CHETANGO
// Generate PDF reports using jsPDF
// ============================================

import { toLocalISOString } from '@/shared/utils/dateTimeHelper'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type {
    AlumnosReporte,
    AsistenciasReporte,
    ClasesReporte,
    IngresosReporte,
    PaquetesReporte
} from '../types/reportTypes'
import { formatCurrency } from './dateHelpers'

// ============================================
// TYPES
// ============================================

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

function addHeader(doc: jsPDF, title: string) {
  doc.setFontSize(20)
  doc.setTextColor(139, 92, 246) // Purple
  doc.text(title, 14, 22)
  
  doc.setFontSize(10)
  doc.setTextColor(107, 114, 128) // Gray
  doc.text(`Generado: ${formatDateTime(toLocalISOString())}`, 14, 30)
  
  doc.setDrawColor(139, 92, 246)
  doc.setLineWidth(0.5)
  doc.line(14, 33, 196, 33)
}

function addFooter(doc: jsPDF, pageNumber: number) {
  const pageHeight = doc.internal.pageSize.height
  doc.setFontSize(8)
  doc.setTextColor(156, 163, 175)
  doc.text(
    `Chetango - Página ${pageNumber}`,
    doc.internal.pageSize.width / 2,
    pageHeight - 10,
    { align: 'center' }
  )
}

// ============================================
// STUDENTS REPORT
// ============================================

export function exportStudentsPDF(data: AlumnosReporte) {
  const doc = new jsPDF()
  
  addHeader(doc, 'Reporte de Alumnos')
  
  // Summary metrics
  const totalAlumnos = (data.totalActivos || 0) + (data.totalInactivos || 0)
  let yPos = 40
  doc.setFontSize(12)
  doc.setTextColor(255, 255, 255)
  doc.setFillColor(30, 30, 30)
  doc.rect(14, yPos, 182, 30, 'F')
  
  doc.setFontSize(10)
  doc.setTextColor(200, 200, 200)
  doc.text('Total Alumnos:', 20, yPos + 10)
  doc.text('Activos:', 70, yPos + 10)
  doc.text('Inactivos:', 120, yPos + 10)
  doc.text('Nuevos (mes):', 160, yPos + 10)
  
  doc.setFontSize(14)
  doc.setTextColor(139, 92, 246)
  doc.text(totalAlumnos.toString(), 20, yPos + 20)
  doc.text((data.totalActivos || 0).toString(), 70, yPos + 20)
  doc.text((data.totalInactivos || 0).toString(), 120, yPos + 20)
  doc.text((data.nuevosEsteMes || 0).toString(), 160, yPos + 20)
  
  // Alumnos inactivos table
  yPos += 40
  if (data.alumnosInactivos && data.alumnosInactivos.length > 0) {
    doc.setFontSize(12)
    doc.setTextColor(239, 68, 68)
    doc.text('Alumnos Inactivos', 14, yPos)
    yPos += 5
    
    autoTable(doc, {
      startY: yPos,
      head: [['Alumno', 'Correo', 'Última Asistencia', 'Días Inactivo']],
      body: data.alumnosInactivos.map(alumno => [
        alumno.nombreAlumno,
        alumno.correo,
        alumno.ultimaAsistencia ? formatDateTime(alumno.ultimaAsistencia) : 'N/A',
        alumno.diasInactivo.toString(),
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [239, 68, 68],
        textColor: [255, 255, 255],
        fontSize: 9,
      },
      bodyStyles: {
        textColor: [200, 200, 200],
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [20, 20, 20],
      },
    })
    yPos = (doc as any).lastAutoTable.finalY + 10
  }
  
  // Alumnos por vencer table
  if (data.alumnosPorVencer && data.alumnosPorVencer.length > 0) {
    doc.setFontSize(12)
    doc.setTextColor(251, 191, 36)
    doc.text('Paquetes por Vencer', 14, yPos)
    yPos += 5
    
    autoTable(doc, {
      startY: yPos,
      head: [['Alumno', 'Correo', 'Fecha Vencimiento', 'Días Restantes']],
      body: data.alumnosPorVencer.map(alumno => [
        alumno.nombreAlumno,
        alumno.correo,
        formatDateTime(alumno.fechaVencimiento),
        alumno.diasRestantes.toString(),
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [251, 191, 36],
        textColor: [0, 0, 0],
        fontSize: 9,
      },
      bodyStyles: {
        textColor: [200, 200, 200],
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [20, 20, 20],
      },
    })
  }
  
  addFooter(doc, 1)
  doc.save('reporte-alumnos.pdf')
}

// ============================================
// CLASSES REPORT
// ============================================

export function exportClassesPDF(data: ClasesReporte) {
  const doc = new jsPDF()
  
  addHeader(doc, 'Reporte de Clases')
  
  // Summary metrics
  let yPos = 40
  doc.setFontSize(12)
  doc.setFillColor(30, 30, 30)
  doc.rect(14, yPos, 182, 30, 'F')
  
  doc.setFontSize(10)
  doc.setTextColor(200, 200, 200)
  doc.text('Total:', 20, yPos + 10)
  doc.text('Promedio Asistencia:', 70, yPos + 10)
  doc.text('Ocupación Promedio:', 130, yPos + 10)
  
  doc.setFontSize(14)
  doc.setTextColor(139, 92, 246)
  doc.text((data.totalClases || 0).toString(), 20, yPos + 20)
  doc.text(`${(data.promedioAsistencia || 0).toFixed(1)}`, 70, yPos + 20)
  doc.text(`${(data.ocupacionPromedio || 0).toFixed(1)}%`, 130, yPos + 20)
  
  // Clases más populares table
  yPos += 40
  if (data.clasesMasPopulares && data.clasesMasPopulares.length > 0) {
    doc.setFontSize(12)
    doc.setTextColor(139, 92, 246)
    doc.text('Clases Más Populares', 14, yPos)
    yPos += 5
    
    autoTable(doc, {
      startY: yPos,
      head: [['Tipo de Clase', 'Total Clases', 'Promedio Asistencia', 'Ocupación %']],
      body: data.clasesMasPopulares.map(clase => [
        clase.nombreTipoClase,
        clase.totalClases.toString(),
        clase.promedioAsistencia.toFixed(1),
        `${clase.ocupacionPorcentaje.toFixed(1)}%`,
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [139, 92, 246],
        textColor: [255, 255, 255],
        fontSize: 9,
      },
      bodyStyles: {
        textColor: [200, 200, 200],
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [20, 20, 20],
      },
    })
    yPos = (doc as any).lastAutoTable.finalY + 10
  }
  
  // Desglose por tipo table
  if (data.desgloseporTipo && data.desgloseporTipo.length > 0) {
    doc.setFontSize(12)
    doc.setTextColor(139, 92, 246)
    doc.text('Desglose por Tipo', 14, yPos)
    yPos += 5
    
    autoTable(doc, {
      startY: yPos,
      head: [['Tipo de Clase', 'Cantidad', 'Promedio Asistencia']],
      body: data.desgloseporTipo.map(tipo => [
        tipo.nombreTipoClase,
        tipo.cantidadClases.toString(),
        tipo.promedioAsistencia.toFixed(1),
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [139, 92, 246],
        textColor: [255, 255, 255],
        fontSize: 9,
      },
      bodyStyles: {
        textColor: [200, 200, 200],
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [20, 20, 20],
      },
    })
  }
  
  addFooter(doc, 1)
  doc.save('reporte-clases.pdf')
}

// ============================================
// INCOME REPORT
// ============================================

export function exportIncomePDF(data: IngresosReporte) {
  const doc = new jsPDF()
  
  addHeader(doc, 'Reporte de Ingresos')
  
  // Summary metrics
  let yPos = 40
  doc.setFillColor(30, 30, 30)
  doc.rect(14, yPos, 182, 30, 'F')
  
  doc.setFontSize(10)
  doc.setTextColor(200, 200, 200)
  doc.text('Total Recaudado:', 20, yPos + 10)
  doc.text('Cantidad:', 80, yPos + 10)
  doc.text('Promedio:', 140, yPos + 10)
  
  doc.setFontSize(14)
  doc.setTextColor(16, 185, 129) // Green
  doc.text(formatCurrency(data.totalRecaudado || 0), 20, yPos + 20)
  doc.text((data.cantidad || 0).toString(), 80, yPos + 20)
  doc.text(formatCurrency(data.promedio || 0), 140, yPos + 20)
  
  // Tendencia mensual table
  yPos += 40
  if (data.tendenciaMensual && data.tendenciaMensual.length > 0) {
    doc.setFontSize(12)
    doc.setTextColor(16, 185, 129)
    doc.text('Tendencia Mensual', 14, yPos)
    yPos += 5
    
    autoTable(doc, {
      startY: yPos,
      head: [['Mes', 'Total Ingresos', 'Cantidad Pagos']],
      body: data.tendenciaMensual.map(mes => [
        mes.mesNombre,
        formatCurrency(mes.totalIngresos),
        mes.cantidadPagos.toString(),
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [16, 185, 129],
        textColor: [255, 255, 255],
        fontSize: 9,
      },
      bodyStyles: {
        textColor: [200, 200, 200],
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [20, 20, 20],
      },
      columnStyles: {
        1: { halign: 'right', fontStyle: 'bold', textColor: [16, 185, 129] },
        2: { halign: 'right' },
      },
    })
    yPos = (doc as any).lastAutoTable.finalY + 10
  }
  
  // Desglose métodos de pago table
  if (data.desgloseMetodosPago && data.desgloseMetodosPago.length > 0) {
    doc.setFontSize(12)
    doc.setTextColor(16, 185, 129)
    doc.text('Desglose por Método de Pago', 14, yPos)
    yPos += 5
    
    autoTable(doc, {
      startY: yPos,
      head: [['Método', 'Total', 'Cantidad', '%']],
      body: data.desgloseMetodosPago.map(metodo => [
        metodo.metodoPago,
        formatCurrency(metodo.totalRecaudado),
        metodo.cantidadPagos.toString(),
        `${metodo.porcentajeDelTotal.toFixed(1)}%`,
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [16, 185, 129],
        textColor: [255, 255, 255],
        fontSize: 9,
      },
      bodyStyles: {
        textColor: [200, 200, 200],
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [20, 20, 20],
      },
      columnStyles: {
        1: { halign: 'right' },
        2: { halign: 'right' },
        3: { halign: 'right' },
      },
    })
  }
  
  addFooter(doc, 1)
  doc.save('reporte-ingresos.pdf')
}

// ============================================
// PACKAGES REPORT
// ============================================

export function exportPackagesPDF(data: PaquetesReporte) {
  const doc = new jsPDF()
  
  addHeader(doc, 'Reporte de Paquetes')
  
  // Summary metrics
  let yPos = 40
  doc.setFillColor(30, 30, 30)
  doc.rect(14, yPos, 182, 30, 'F')
  
  doc.setFontSize(10)
  doc.setTextColor(200, 200, 200)
  doc.text('Activos:', 20, yPos + 10)
  doc.text('Vencidos:', 70, yPos + 10)
  doc.text('Por Vencer:', 120, yPos + 10)
  doc.text('Agotados:', 170, yPos + 10)
  
  doc.setFontSize(14)
  doc.setTextColor(139, 92, 246)
  doc.text((data.totalActivos || 0).toString(), 20, yPos + 20)
  doc.text((data.totalVencidos || 0).toString(), 70, yPos + 20)
  doc.text((data.totalPorVencer || 0).toString(), 120, yPos + 20)
  doc.text((data.totalAgotados || 0).toString(), 170, yPos + 20)
  
  // Alertas por vencer table
  yPos += 40
  if (data.alertasPorVencer && data.alertasPorVencer.length > 0) {
    doc.setFontSize(12)
    doc.setTextColor(251, 191, 36)
    doc.text('Alertas - Paquetes por Vencer', 14, yPos)
    yPos += 5
    
    autoTable(doc, {
      startY: yPos,
      head: [['Alumno', 'Tipo Paquete', 'Vencimiento', 'Días', 'Clases']],
      body: data.alertasPorVencer.map(alerta => [
        alerta.nombreAlumno,
        alerta.nombreTipoPaquete,
        formatDateTime(alerta.fechaVencimiento),
        alerta.diasRestantes.toString(),
        alerta.clasesRestantes.toString(),
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [251, 191, 36],
        textColor: [0, 0, 0],
        fontSize: 9,
      },
      bodyStyles: {
        textColor: [200, 200, 200],
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [20, 20, 20],
      },
    })
    yPos = (doc as any).lastAutoTable.finalY + 10
  }
  
  // Desglose por estados table
  if (data.desgloseEstados && data.desgloseEstados.length > 0) {
    doc.setFontSize(12)
    doc.setTextColor(139, 92, 246)
    doc.text('Desglose por Estado', 14, yPos)
    yPos += 5
    
    autoTable(doc, {
      startY: yPos,
      head: [['Estado', 'Cantidad', 'Porcentaje']],
      body: data.desgloseEstados.map(estado => [
        estado.estado,
        estado.cantidad.toString(),
        `${estado.porcentajeDelTotal.toFixed(1)}%`,
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [139, 92, 246],
        textColor: [255, 255, 255],
        fontSize: 9,
      },
      bodyStyles: {
        textColor: [200, 200, 200],
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [20, 20, 20],
      },
      columnStyles: {
        1: { halign: 'right' },
        2: { halign: 'right' },
      },
    })
  }
  
  addFooter(doc, 1)
  doc.save('reporte-paquetes.pdf')
}

// ============================================
// ATTENDANCE REPORT
// ============================================

export function exportAttendancePDF(data: AsistenciasReporte) {
  const doc = new jsPDF()
  
  addHeader(doc, 'Reporte de Asistencias')
  
  // Summary metrics
  let yPos = 40
  doc.setFillColor(30, 30, 30)
  doc.rect(14, yPos, 182, 30, 'F')
  
  doc.setFontSize(10)
  doc.setTextColor(200, 200, 200)
  doc.text('Total:', 20, yPos + 10)
  doc.text('Presentes:', 70, yPos + 10)
  doc.text('Ausentes:', 120, yPos + 10)
  doc.text('Justificadas:', 160, yPos + 10)
  
  doc.setFontSize(14)
  doc.setTextColor(139, 92, 246)
  doc.text((data.totalAsistencias || 0).toString(), 20, yPos + 20)
  doc.text((data.presentes || 0).toString(), 70, yPos + 20)
  doc.text((data.ausentes || 0).toString(), 120, yPos + 20)
  doc.text((data.justificadas || 0).toString(), 160, yPos + 20)
  
  // Porcentaje de asistencia
  yPos += 35
  doc.setFontSize(10)
  doc.setTextColor(200, 200, 200)
  doc.text('Porcentaje de Asistencia:', 20, yPos)
  doc.setFontSize(16)
  doc.setTextColor(16, 185, 129)
  doc.text(`${(data.porcentajeAsistencia || 0).toFixed(1)}%`, 90, yPos)
  
  // Lista detallada table
  yPos += 10
  if (data.listaDetallada && data.listaDetallada.length > 0) {
    doc.setFontSize(12)
    doc.setTextColor(139, 92, 246)
    doc.text('Lista Detallada de Asistencias', 14, yPos)
    yPos += 5
    
    autoTable(doc, {
      startY: yPos,
      head: [['Fecha', 'Alumno', 'Clase', 'Estado', 'Profesor']],
      body: data.listaDetallada.map(asistencia => [
        formatDateTime(asistencia.fecha),
        asistencia.nombreAlumno,
        asistencia.nombreClase,
        asistencia.estado,
        asistencia.nombreProfesor || 'N/A',
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [139, 92, 246],
        textColor: [255, 255, 255],
        fontSize: 9,
      },
      bodyStyles: {
        textColor: [200, 200, 200],
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [20, 20, 20],
      },
    })
  }
  
  addFooter(doc, 1)
  doc.save('reporte-asistencias.pdf')
}
