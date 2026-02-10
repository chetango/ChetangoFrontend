// ============================================
// UTILIDADES DE FORMATEO - NÓMINA
// ============================================

/**
 * Formatea un número como moneda colombiana
 * @param amount - Monto a formatear
 * @returns String formateado como "$X.XXX.XXX"
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount)
}

/**
 * Formatea una fecha en formato local colombiano
 * @param date - Fecha en formato string o Date
 * @returns String formateado como "dd MMM yyyy"
 */
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Formatea el nombre de un mes desde su número
 * @param mes - Número del mes (1-12)
 * @returns Nombre del mes en español
 */
export const formatMonth = (mes: number): string => {
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
  return meses[mes - 1] || ''
}
