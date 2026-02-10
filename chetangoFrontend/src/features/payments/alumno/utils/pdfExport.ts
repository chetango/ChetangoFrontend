// ============================================
// PDF EXPORT UTILITY
// ============================================

import { toLocalDateString } from '@/shared/utils/dateTimeHelper'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { PagoDetalle } from '../types/payments.types'
import { formatearFechaCompleta, formatearMonto } from './paymentsUtils'

export const exportarPagoPDF = async (pago: PagoDetalle) => {
  const doc = new jsPDF()

  // Configuración de colores
  const primaryColor: [number, number, number] = [201, 52, 72] // #c93448
  // const darkBg: [number, number, number] = [26, 26, 46] // #1a1a2e
  // const lightText: [number, number, number] = [249, 250, 251] // #f9fafb

  // Header con logo y título
  doc.setFillColor(...primaryColor)
  doc.rect(0, 0, 210, 40, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('CHETANGO', 20, 20)

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('Academia de Tango', 20, 28)

  // Título del documento
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('Comprobante de Pago', 20, 55)

  // Información del pago
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  
  let yPos = 70

  // ID de Pago
  doc.setFont('helvetica', 'bold')
  doc.text('ID de Pago:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(pago.idPago, 60, yPos)
  yPos += 8

  // Fecha
  doc.setFont('helvetica', 'bold')
  doc.text('Fecha de Pago:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(formatearFechaCompleta(pago.fechaPago), 60, yPos)
  yPos += 8

  // Alumno
  doc.setFont('helvetica', 'bold')
  doc.text('Alumno:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(pago.nombreAlumno, 60, yPos)
  yPos += 8

  // Correo
  doc.setFont('helvetica', 'bold')
  doc.text('Correo:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(pago.correoAlumno, 60, yPos)
  yPos += 8

  // Teléfono
  if (pago.telefonoAlumno) {
    doc.setFont('helvetica', 'bold')
    doc.text('Teléfono:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(pago.telefonoAlumno, 60, yPos)
    yPos += 8
  }

  // Método de pago
  doc.setFont('helvetica', 'bold')
  doc.text('Método de Pago:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(pago.nombreMetodoPago, 60, yPos)
  yPos += 8

  // Referencia (si existe)
  if (pago.referenciaTransferencia) {
    doc.setFont('helvetica', 'bold')
    doc.text('Referencia:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(pago.referenciaTransferencia, 60, yPos)
    yPos += 8
  }

  // Estado
  doc.setFont('helvetica', 'bold')
  doc.text('Estado:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(pago.estadoPago, 60, yPos)
  yPos += 8

  // Monto total destacado
  yPos += 5
  doc.setFillColor(...primaryColor)
  doc.rect(20, yPos - 5, 170, 12, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('MONTO TOTAL:', 25, yPos + 3)
  doc.text(formatearMonto(pago.montoTotal), 150, yPos + 3)
  yPos += 20

  // Tabla de paquetes
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Paquetes Generados:', 20, yPos)
  yPos += 8

  const tableData = pago.paquetes.map((paquete) => [
    paquete.nombreTipoPaquete,
    `${paquete.clasesUsadas}/${paquete.clasesDisponibles}`,
    paquete.clasesRestantes.toString(),
    paquete.fechaVencimiento
      ? new Date(paquete.fechaVencimiento).toLocaleDateString('es-AR')
      : 'Sin vencimiento',
    formatearMonto(paquete.valorPaquete),
    paquete.estado,
  ])

  autoTable(doc, {
    startY: yPos,
    head: [['Tipo', 'Clases', 'Restantes', 'Vencimiento', 'Valor', 'Estado']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  })

  // Nota (si existe)
  if (pago.nota) {
    const finalY = (doc as any).lastAutoTable.finalY || yPos + 40
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Nota:', 20, finalY + 15)
    doc.setFont('helvetica', 'normal')
    const splitNota = doc.splitTextToSize(pago.nota, 170)
    doc.text(splitNota, 20, finalY + 22)
  }

  // Footer
  const pageHeight = doc.internal.pageSize.height
  doc.setFontSize(8)
  doc.setTextColor(128, 128, 128)
  doc.text(
    `Generado el ${new Date().toLocaleDateString('es-AR')} - Chetango Academia de Tango`,
    105,
    pageHeight - 10,
    { align: 'center' }
  )

  // Guardar PDF
  const fileName = `pago-${pago.idPago.substring(0, 8)}-${
    toLocalDateString(new Date(pago.fechaPago))
  }.pdf`
  doc.save(fileName)
}
